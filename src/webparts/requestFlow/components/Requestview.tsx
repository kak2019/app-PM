import * as React from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { Label } from '@fluentui/react/lib/Label';
import { Dropdown, IDropdownStyles, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import {
  DatePicker,
  IDatePickerStyles,
  addDays
} from '@fluentui/react';
import { useConst } from '@fluentui/react-hooks';
import { DetailsList, DetailsListLayoutMode, SelectionMode, IColumn } from '@fluentui/react/lib/DetailsList';
import { TextField } from 'office-ui-fabric-react';
import { REQUESTSCONST } from '../../../common/features/requests';
import { useEntities } from '../../../common/hooks';
import { useContext, useEffect } from "react";
import AppContext from '../../../common/AppContext';

import "@pnp/sp/items/get-all";
import { spfi } from "@pnp/sp";
import { getSP } from '../../../common/pnpjsConfig'
import { addRequest } from './requestUtil/request';
import { IWebEnsureUserResult } from '@pnp/sp/site-users/types';
// Dialog
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { useId, useBoolean } from '@fluentui/react-hooks';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
// interface IPartJson {
//   [ID:number]: {
//     "PartID": string,
//     "PartDescription": string,
//     "Count"?: string

//   }

// }
interface Iitem {
  "PartID": string,
  "PartDescription": string,
  "Count"?: string,
}
interface IMappingOBJ {
  "Requester": { "Name": string },
  "Terminal": [{ "Name": string, "ID": string }]
}
export default function RequestView(): JSX.Element {
  const [buttonvisible, setbuttonVisible ] = React.useState<boolean>(true)
  const [dialogContentProps,setdialogContentProps] = React.useState( {
    type: DialogType.normal,
    title: 'Part Info',
    closeButtonAriaLabel: 'Close',
    subText: 'Below parts would be included:',
  })
  const today = useConst(new Date(Date.now()));
  const minDate = useConst(addDays(today, 10));
  const datePickerStyles: Partial<IDatePickerStyles> = { root: { width: 400 } };
  const [hinterrormessage, sethinterrormessage] = React.useState<string>(null);
  const [dialogvisible, setdialogvisible] = React.useState<boolean>(false)
  const [DateValue, setDateValue] = React.useState<Date>(minDate);
  // Dialog
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const [isDraggable] = useBoolean(false);

  const dialogStyles = { main: { maxWidth: 800 } };
  const labelId: string = useId('dialogLabel');
  const subTextId: string = useId('subTextLabel');
  const modalProps = React.useMemo(
    () => ({
      titleAriaId: labelId,
      subtitleAriaId: subTextId,
      isBlocking: false,
      styles: dialogStyles,

    }),
    [isDraggable, labelId, subTextId],
  );
  
  const dialogContentProps1 = {
    type: DialogType.normal,
    title: 'Error Message',
    closeButtonAriaLabel: 'Close',
    subText: '',
  };
  const sp = spfi(getSP());
  const MappingterminalArray: string[] = []
  const ctx = useContext(AppContext);
  const userEmail = ctx.context._pageContext._user.email;
  const [
    ,
    ,
    fetchMyEntity,
    ,
    myEntity,
    ,
    ,
  ] = useEntities();
  const [dialogitems, setdialogitems] = React.useState<Iitem[]>([])
  const [allItems, setAllItems] = React.useState<Iitem[]>(REQUESTSCONST.PART_LIST)
  const [items, setitems] = React.useState<Iitem[]>(REQUESTSCONST.PART_LIST)
  const [itemsValuekey, setitemsValuekey] = React.useState<string>()
  const [options, setOptions] = React.useState<IDropdownOption[]>([])
  const [address, setAddress] = React.useState<string>('')
  //const items1:Iitem[] = [{"PartID":"123","PartDescription":"456" ,"Count":"11"},{"Emballage Number":"254","Emballage Type":"456" ,"Count":"11"}]

  const _getKey = (item: IColumn, index?: number): string => {
    return item.key;
  }
  const _onChangeText = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string): void => {
    setitems(
      text ? allItems.filter(i => i.PartID.toLowerCase().indexOf(text) > -1) : allItems,
    );
  };
  const onChangeSecondTextFieldValue = React.useCallback(
    (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string, i?: number) => {
      if (!newValue || newValue.length <= 5) {
        allItems[i].Count = newValue || ''
        setAllItems([...allItems])
      }
    },
    [],
  );


  const columns: IColumn[] = [
    {
      key: 'column1',
      name: 'Emballage Number',
      ariaLabel: 'Column operations for File type, Press to sort on File type',
      //iconName: 'Page',
      isIconOnly: false,
      fieldName: 'name',
      minWidth: 201,
      maxWidth: 201,
      //onColumnClick: this._onColumnClick,
      onRender: (item: Iitem) => (
        <Text>{item.PartID}</Text>
      ),
    },
    {
      key: 'column2',
      name: 'Emballage Type',
      ariaLabel: 'Column operations for File type, Press to sort on File type',
      //iconName: 'Page',
      isIconOnly: false,
      fieldName: 'name',
      minWidth: 201,
      maxWidth: 201,
      //onColumnClick: this._onColumnClick,
      onRender: (item: Iitem) => (
        <Text>{item.PartDescription}</Text>
      ),
    }, {
      key: 'column3',
      name: 'Count',
      ariaLabel: 'Column operations for File type, Press to sort on File type',
      //iconName: 'Page',
      isIconOnly: false,
      fieldName: 'name',
      minWidth: 201,
      maxWidth: 201,
      //onColumnClick: this._onColumnClick,
      onRender: (item: Iitem, i: number) => (
        <TextField key={item.PartID} value={item.Count} onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => onChangeSecondTextFieldValue(event, newValue, i)} />
      ),
    }]
  const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 400 },
  };
  // Get Mapping Relationship according Own Terminal ID
  const getMapping = (myterminalID: string): void => {


    sp.web.lists.getByTitle("Request Mapping").items.select("Requester/Name", "Terminal/Name", "Terminal/ID").filter(`Requester/Title eq ${myterminalID}`).
      expand("Terminal,Requester").getAll().then((reponse: IMappingOBJ[]) => {
        console.log("terminal", reponse)
        const ops = []
        for (let i = 0; i < reponse.length; i++) {
          MappingterminalArray.push(reponse[i].Requester.Name)
          ops.push({ "text": reponse[i].Terminal[0].Name, "key": reponse[i].Terminal[0].ID })
        }

        setOptions([...ops])
      }).catch(err => {
        console.log(err)
      })
    // console.log(MappingterminalArray,items)
  }
  const getTargetAddress = (taregetID: string): void => {
    // 变量拼起来 空格会导致搜索不到
    //const temp_Address = sp.web.lists.getByTitle("Entities").items.select("Title","Country","Address").filter(`Name eq ${(taregetID)}`).getAll();
    sp.web.lists.getByTitle("Entities").items.select("Name", "Country", "Address").filter("Name eq '" + taregetID + "'").getAll().then(temp_Address => {
      setAddress(temp_Address[0].Name + ' ' + temp_Address[0].Country + ' ' + temp_Address[0].Address)
      console.log(temp_Address)
    }).catch(err => {
      console.log(err)
    })
  }
  const [selectedItem, setSelectedItem] = React.useState<IDropdownOption>();

  const onChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    setSelectedItem(item);
    console.log("key", item.key.toString())
    getTargetAddress(item.text.toString())
    setitemsValuekey(item.key.toString())
    // getMapping(myEntity?.Title)
  };
  React.useEffect(() => {
    fetchMyEntity();
    if (myEntity?.Type !== undefined) {
      console.log("E", myEntity)
      getMapping(myEntity?.Title)
    }
    //getTargetAddress("1")
  }, [])
  useEffect(() => {
    if (myEntity?.Type !== undefined) {
      console.log("E", myEntity)
      getMapping(myEntity?.Title)
    }
  }, [myEntity]);
  const filterPartInfo = (): void => {
    const list = allItems.filter(i => i.Count !== undefined && i.Count !== "")
    console.log(list)
    setdialogitems(list)
    console.log("dialogitems", dialogitems, dialogitems.length)

  }
  // useEffect(()=>{
  //   const templist = []
  //   for(let i=0;i<dialogitems.length;i++){
  //     if(dialogitems[i].Count!==""){
  //       templist.push(dialogitems[i])
  //     }
  //     setdialogitems(templist)
  //   }
  // },[dialogitems])
  useEffect(() => {
    filterPartInfo()
  }, [allItems])
  const submitFunction = async (): Promise<void> => {
    const resultRequestor: IWebEnsureUserResult = await sp.web.ensureUser("i:0#.f|membership|" + userEmail);
    const jsonData: { [key: string]: object } = {};
    const templist = []
    for (let i = 0; i < dialogitems.length; i++) {

      //templist.push({key:i.toString(),value:dialogitems[i]})  
      templist[i] = dialogitems[i];
      jsonData[i + 1] = dialogitems[i];
    }
    // dialogitems.forEach((element, index) => {
    //   //let obj :IPartJson= {}
    //   //templist.push(obj[ID]=JSON.stringify(element))

    // });
    console.log("temp", jsonData)
    const request = {
      RequestorId: resultRequestor.data.Id,
      // Notice Lookup column
      RequesterIdId: myEntity?.ID,
      TerminalIdId: itemsValuekey,
      Date_x0020_Needed: DateValue,
      PartJSON: JSON.stringify(jsonData),
      Delivery_x0020_Address: address
    }
    ////console.log("result",result.)
    let promiss 
    addRequest({ request }).then(promises=>{console.log("promiss",promises,typeof(promises));promiss=promises}).catch(err=>console.log("err",err));
   console.log("typeof promises==='string'",typeof promiss==="string")
   if(typeof promiss!=="string"){
   setdialogContentProps((dialogContentProps)=>({...dialogContentProps,title: "Submission Successful",subText:"The page will automatically jump after five seconds"}))
   setbuttonVisible(false)
   setTimeout(function(){document.location.href=`${ctx.context._pageContext._web.absoluteUrl}/sitepages/Home.aspx`},5000)
  }else{
    setdialogContentProps((dialogContentProps)=>({...dialogContentProps,title: "Submission Failure"}))
  }
  
  //  a.then((response) => {
    
  //     //const returnUrl = window.location.href
  //     setdialogContentProps((dialogContentProps)=>({...dialogContentProps,title: "Submission Successful"}))
  //     //document.location.href = returnUrl.slice(0, returnUrl.indexOf("SitePage")) + "SitePages/Home.aspx"
  //     //document.location.href=`${ctx.context._pageContext._web.absoluteUrl}/sitepages/Home.aspx`;
  //   }).catch((error) => {console.log(error);
  //     setdialogContentProps((dialogContentProps)=>({...dialogContentProps,title: "Submission Failure"}))})
    
  }

  const stackClass = {
    marginTop: '10px'
  }
  const validateRequest = (): void => {
    const templist = [];
    let flag = true;
    setdialogvisible(false)
    for (let i = 0; i < dialogitems.length; i++) {
      if (/^\d+$/.test(dialogitems[i].Count) && dialogitems[i].Count !== "") {
        templist.push(dialogitems[i])
      }
      setdialogitems(templist)
    }
    sethinterrormessage(null);
    // console.log("listtemp1",templist)

    for (let i = 0; i < dialogitems.length; i++) {
      // console.log("会执行吗", !(/^\d+$/.test(dialogitems[i].Count)))
      if (!(/^\d+$/.test(dialogitems[i].Count)) && dialogitems[i].Count !== "") {
        sethinterrormessage("Please checked for non-numeric values in the part count")
        flag = false
        toggleHideDialog();
        break;

      }


    }
    console.log("error", hinterrormessage)
    console.log("flag", flag)
    //console.log("listtemp",templist)
    if (flag) {
      if (selectedItem === null || selectedItem === undefined) {
        sethinterrormessage("Please check if Terminal is selected");
        setdialogvisible(false)
        toggleHideDialog();
        return
      } else if (dialogitems.length === 0) {
        sethinterrormessage("Please fill in at least one part of the information");
        setdialogvisible(false)
        toggleHideDialog();
        return
      } else {
        sethinterrormessage(null);
        setdialogvisible(true)
        toggleHideDialog();
      }
    }


  }
  return (
    <section>

      <Stack verticalAlign="center" horizontal>
        <Label style={{ textAlign: 'left', width: 200 }} >Request By: </Label>{" "} <Text style={{ fontFamily: '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif' }}>{myEntity?.Name}</Text>
        {/* <TextField disabled defaultValue="I am disabled" style={{ width: 100 }} /> */}
      </Stack>
      <Stack horizontal verticalAlign="center" style={stackClass}>
        <Label style={{ textAlign: 'left', width: 200 }}>Terminal: </Label>
        <Dropdown
          placeholder="Select an option"
          //label="Basic uncontrolled example"
          options={options}
          styles={dropdownStyles}
          onChange={onChange}
          selectedKey={selectedItem ? selectedItem.key : undefined}
        />

      </Stack>
      <Stack horizontal verticalAlign="center" style={stackClass}>
        <Label style={{ textAlign: 'left', width: 200 }}>Date Needed: </Label>
        <DatePicker
          styles={datePickerStyles}
          placeholder="Select a date..."
          ariaLabel="Select a date"
          minDate={minDate}
          value={minDate}
          onSelectDate={(date) => {
            console.log(date)
            setDateValue(date);
          }}
        //maxDate={maxDate}
        // allowTextInput
        />
      </Stack>
      <Stack horizontal verticalAlign="center" style={stackClass}>
        <Label style={{ textAlign: 'left', width: 200 }}>Delivery Address: </Label> <Text style={{ fontFamily: '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif' }}>{address}</Text>
      </Stack>
      <hr />
      <Stack horizontal verticalAlign="center" style={stackClass}>
        <Label style={{ textAlign: 'left', width: 200 }}>Filter by Emballage Number:</Label><TextField style={{ width: 400, height: 25 }} onChange={_onChangeText} />    {/* //label="Filter by Emballage Number:" */}
      </Stack>
      <DetailsList
        items={items}// [{"Emballage Number":"123","Emballage Type":"456" ,"Count":"11"},]
        //compact={isCompactMode}
        columns={columns}
        selectionMode={SelectionMode.none}
        getKey={_getKey}
        setKey="PartID"
        layoutMode={DetailsListLayoutMode.justified}
        isHeaderVisible={true}
        onShouldVirtualize={() => false}
      //onItemInvoked={this._onItemInvoked}
      />
      <Stack horizontal style={{ float: 'right', marginRight: 10 }}>
        <PrimaryButton secondaryText="Opens the Sample Dialog" onClick={validateRequest} text="Next Step" style={{ marginRight: 10 }} />
        <DefaultButton onClick={() => {
          //const returnUrl = window.location.href;
          //`${ctx.context._pageContext._web.absoluteUrl}/sitepages/GI.aspx`;
          //document.location.href = returnUrl.slice(0, returnUrl.indexOf("SitePage")) + "SitePage/Home.aspx"
          document.location.href=`${ctx.context._pageContext._web.absoluteUrl}/sitepages/Home.aspx`;
        }} text="Cancel" />
      </Stack>
      {dialogvisible ?
        <Dialog
          hidden={hideDialog}
          onDismiss={toggleHideDialog}
          dialogContentProps={dialogContentProps}
          modalProps={modalProps}
        >{

            dialogitems.map((item: Iitem) =>
              <div key={item.PartID}>
                <ul>{item.PartID}{","} {item.PartDescription}{","} {item.Count}</ul>
              </div>
            )
          }


          <DialogFooter>
            <PrimaryButton onClick={submitFunction} text="Submit"  style={{display:buttonvisible?'block':'none'}}/>
            <DefaultButton onClick={toggleHideDialog} text="Cancel" style={{display:buttonvisible?'block':'none'}}/>
          </DialogFooter>
        </Dialog>
        : <Dialog
          dialogContentProps={dialogContentProps1}
          modalProps={modalProps}
          hidden={hideDialog}
          onDismiss={toggleHideDialog}>
          <div>
            {hinterrormessage}
          </div>
        </Dialog>
      }
    </section>
  )

}


