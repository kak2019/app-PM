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
import { IDetailsColumnStyles, IDetailsListStyles, TextField } from 'office-ui-fabric-react';
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
import styles from './RequestFlow.module.scss';
import  Viewhistory from '../assets/submit';
import Erroricon from '../assets/error'

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
  "ErrorMessage"?: string,
}
interface IMappingOBJ {
  "Requester": { "Name": string },
  "Terminal": [{ "Name": string, "ID": string }]
}
export default function RequestView(): JSX.Element {
  const colomnstyle = {
    root: {
    color:"white",
    backgroundColor: 'rgb(0, 130, 155)',
    '&:hover': {
      backgroundColor: 'rgb(0, 130, 155)',
      color:"white",
    },
    '&:active': {
      backgroundColor: 'rgb(0, 130, 155)',
      color:"white",
    }
  }}
  const gridStyles: Partial<IDetailsListStyles> = {
    root: {
      overflowY: 'auto',
      overflowX: 'hidden',
      selectors: {
        '& [role=grid]': {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          maxHeight: '57vh',
          minWidth: 400,
        },
      },
    },

  };
  const [buttonvisible, setbuttonVisible] = React.useState<boolean>(true)
  const [dialogContentProps, setdialogContentProps] = React.useState({
    type: DialogType.normal,
    title: 'Confirmation',
    closeButtonAriaLabel: 'Close',
    subText: 'The following parts will be included:',    
    styles: {
      subText: {
        marginBottom: '0 0 10px'
      }
    }
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

  const dialogStyles = {
    main: {
      selectors: {
        '@media (min-width: 0px)': {
          //height: 220,
          maxHeight: 900,
          maxWidth: 550,
          minwidth: 362,
          width: 300,
        }
      },
      textAlign: 'center',
    }
    //main: { maxWidth: 1200 }
  };// main: { maxWidth: 800 }
  const tempdialogStyles = {
    main: {
      selectors: {
        '@media (min-width: 0px)': {
          //height: 500,
          maxHeight: '100vh',
          maxWidth: 650,
          minwidth: 362,
          width: 600,
        }
      },
      textAlign: 'center',
    }
    //main: { maxWidth: 1200 }
  };// main: { maxWidth: 800 }
  const labelId: string = useId('dialogLabel');
  const subTextId: string = useId('subTextLabel');
  const modalProps = React.useMemo(
    () => ({

      titleAriaId: labelId,
      subtitleAriaId: subTextId,
      isBlocking: true,
      styles: dialogStyles,

    }),
    [isDraggable, labelId, subTextId],
  );
  const dialogmodalProps = React.useMemo(
    () => ({

      titleAriaId: labelId,
      subtitleAriaId: subTextId,
      isBlocking: true,
      styles: tempdialogStyles,
      //className:styles.dialogSubText
      //styles: {main:{margin:0}},


    }),
    [isDraggable, labelId, subTextId],
  );

  const dialogContentProps1 = {
    type: DialogType.normal,
    title: ' ',//"Error"
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
      text ? allItems.filter(i => (i.PartID.toLowerCase().indexOf(text) > -1 || i.PartDescription.toLowerCase().indexOf(text.toLocaleLowerCase()) > -1)) : allItems,
    );
  };
  const onChangeSecondTextFieldValue = React.useCallback(
    (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string, id?: string) => {
      allItems.forEach((val: Iitem) => {
        if (val.PartID === id) {
          val.Count = newValue || ''
          if ((/^\d+$/.test(newValue)) || newValue === "") {
            val.ErrorMessage = ""
          } else { val.ErrorMessage = "Only integer is allowed" }
        }
      })
      setAllItems([...allItems])
    },
    [],
  );
  const headerStyle: Partial<IDetailsColumnStyles> = {
    cellName: {
      color:"black",
      fontSize:"12px",
      
      //红的好使, 字体大小不好使
    }
  }

  const dialogcolumns: IColumn[] = [
    {
      key: 'column1',
      name: 'Part ID',
      ariaLabel: 'Column operations for File type, Press to sort on File type',
      //iconName: 'Page',
      isIconOnly: false,
      fieldName: 'name',
      minWidth: 45,
      maxWidth: 45,
      styles:headerStyle,
      //onColumnClick: this._onColumnClick,
      headerClassName:styles.temp,
      onRender: (item: Iitem) => (
        <Text style={{fontSize:12}}>{item.PartID}</Text>
      ),
    },
    {
      key: 'column2',
      name: 'Part Description',
      ariaLabel: 'Column operations for File type, Press to sort on File type',
      //iconName: 'Page',
      isIconOnly: false,
      fieldName: 'name',
      minWidth: 251,
      maxWidth: 251,
      styles:headerStyle,
      //onColumnClick: this._onColumnClick,
      onRender: (item: Iitem) => (
        <Text style={{fontSize:12}}>{item.PartDescription}</Text>
      ),
    }, {
      key: 'column3',
      name: 'Quantity',
      ariaLabel: 'Column operations for File type, Press to sort on File type',
      //iconName: 'Page',
      isIconOnly: false,
      fieldName: 'name',
      minWidth: 71,
      maxWidth: 71,
      styles:headerStyle,
      //onColumnClick: this._onColumnClick,
      onRender: (item: Iitem, i: number) => (
        //<TextField key={item.PartID} value={item.Count} errorMessage={item.ErrorMessage} onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => onChangeSecondTextFieldValue(event, newValue, item.PartID)} />
        <Text style={{fontSize:12}}>{item.Count}</Text>
      ),
    }]
   
  const columns: IColumn[] = [
    {
      key: 'column1',
      name: 'Part ID',
      ariaLabel: 'Column operations for File type, Press to sort on File type',
      //iconName: 'Page',
      isIconOnly: false,
      fieldName: 'name',
      minWidth: 61,
      maxWidth: 61,
      styles:colomnstyle,
      //onColumnClick: this._onColumnClick,
      onRender: (item: Iitem) => (
        <Text>{item.PartID}</Text>
      ),
    },
    {
      key: 'column2',
      name: 'Part Description',
      ariaLabel: 'Column operations for File type, Press to sort on File type',
      //iconName: 'Page',
      isIconOnly: false,
      fieldName: 'name',
      minWidth: 221,
      maxWidth: 221,
      styles:colomnstyle,
      //onColumnClick: this._onColumnClick,
      onRender: (item: Iitem) => (
        <Text>{item.PartDescription}</Text>
      ),
    }, {
      key: 'column3',
      name: 'Quantity',
      ariaLabel: 'Column operations for File type, Press to sort on File type',
      //iconName: 'Page',
      isIconOnly: false,
      fieldName: 'name',
      minWidth: 141,
      maxWidth: 141,
      styles:colomnstyle,
      //onColumnClick: this._onColumnClick,
      onRender: (item: Iitem, i: number) => (
        <TextField key={item.PartID} value={item.Count} errorMessage={item.ErrorMessage} onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => onChangeSecondTextFieldValue(event, newValue, item.PartID)} />
      ),
    },
    {
      key: 'column4',
      name: '',
      ariaLabel: 'Column operations for File type, Press to sort on File type',
      //iconName: 'Page',
      isIconOnly: false,
      fieldName: 'name',
      minWidth: 20,
      maxWidth: 20,
      styles:colomnstyle,
      //onColumnClick: this._onColumnClick,
      // onRender: (item: Iitem) => (
      //   <Text>{item.PartDescription}</Text>
      // ),
    }
  ]
  const dropdownStyles: Partial<IDropdownStyles> = {
    root: { width: 400 } 
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

  useEffect(() => {
    filterPartInfo();
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
    addRequest({ request }).then(promises => { console.log("promiss", promises, typeof (promises)); promiss = promises }).catch(err => console.log("err", err));
    console.log("typeof promises==='string'", typeof promiss === "string")
    if (typeof promiss !== "string") {
      setdialogContentProps((dialogContentProps) => ({ ...dialogContentProps, title: "", subText: "" }))
      setbuttonVisible(false)

    } else {
      setdialogContentProps((dialogContentProps) => ({ ...dialogContentProps, title: "Submission Failure" }))
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
    
    sethinterrormessage(null);
    // console.log("listtemp1",templist)

    for (let i = 0; i < dialogitems.length; i++) {
    // 这个正则 是为了校验输入是不是纯数字
      if (!(/^\d+$/.test(dialogitems[i].Count)) && dialogitems[i].Count !== "") {
        sethinterrormessage("Only integer is allowed in Quantity field.")
        flag = false
        toggleHideDialog();
        break;
        
      }
      
  }
  if(flag){
    for (let i = 0; i < dialogitems.length; i++) {
      if (/^\d+$/.test(dialogitems[i].Count) && dialogitems[i].Count !== "") {
        templist.push(dialogitems[i])
      }
      setdialogitems(templist)
    }
    
  }
    console.log("error", hinterrormessage)
    console.log("flag", flag)
    //console.log("listtemp",templist)
    if (flag ) {
      if (selectedItem === null || selectedItem === undefined) {
        sethinterrormessage("Please select Terminal.");
        setdialogvisible(false)
        toggleHideDialog();
        return
      } else if (dialogitems.length === 0) {
        sethinterrormessage("Please fill in at least one part quantity.");
        setdialogvisible(false)
        toggleHideDialog();
        return
      } else {
        sethinterrormessage(null);
        setdialogvisible(true)
        toggleHideDialog();
        setdialogContentProps((dialogContentProps)=>({...dialogContentProps,subText : `The following ${dialogitems.length} ${dialogitems.length===1?"part":"parts"} will be included:`}))
      }
    }


  }
  return (
    <section>

      <Stack verticalAlign="center" horizontal style={{backgroundColor:"rgba(0, 130, 155, 1)",height:42}}>
        <Label style={{ textAlign: 'left', width: 200 ,color:'white', marginLeft:8}} >Request By: </Label>{" "} <Text style={{ fontFamily: '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',color:'white' } }>{myEntity?.Name}</Text>
        {/* <TextField disabled defaultValue="I am disabled" style={{ width: 100 }} /> */}
      </Stack>
      <Stack horizontal verticalAlign="center" style={stackClass}>
        <Label style={{ textAlign: 'left', width: 200 ,marginLeft:8}}>Terminal: </Label>
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
        <Label style={{ textAlign: 'left', width: 200 ,marginLeft:8}}>Date: </Label>
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
        <Label style={{ textAlign: 'left', width: 200 ,marginLeft:8}}>Address: </Label> <Text style={{ fontFamily: '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif' }}>{address}</Text>
      </Stack>
      <hr />
      <Stack horizontal verticalAlign="center" style={stackClass}>
        <Label style={{ textAlign: 'left', width: 200 ,marginLeft:8}}>Filter:</Label><TextField styles={{root: { width: 400 }}} style={{height: 25}} onChange={_onChangeText} />    {/* //label="Filter by Emballage Number:" */}
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
        
        <DefaultButton onClick={() => {
          //const returnUrl = window.location.href;
          //`${ctx.context._pageContext._web.absoluteUrl}/sitepages/GI.aspx`;
          //document.location.href = returnUrl.slice(0, returnUrl.indexOf("SitePage")) + "SitePage/Home.aspx"
          document.location.href = `${ctx.context._pageContext._web.absoluteUrl}/sitepages/Home.aspx`;
        }} text="Cancel" className={styles.cancelbutton} />
        <PrimaryButton secondaryText="Opens the Sample Dialog" onClick={validateRequest} text="Submit"  className={styles.submitbutton}/>
      </Stack>

      {dialogvisible ?
        <Dialog
          hidden={hideDialog}
          onDismiss={() => {
            if (!buttonvisible) { document.location.href = `${ctx.context._pageContext._web.absoluteUrl}/sitepages/Home.aspx` } else { toggleHideDialog() }
          }}
          dialogContentProps={dialogContentProps}
          modalProps={dialogmodalProps}
          
        > {
          buttonvisible ? <DetailsList
              items={dialogitems}// [{"Emballage Number":"123","Emballage Type":"456" ,"Count":"11"},]
              //compact={isCompactMode}
              columns={dialogcolumns}
              selectionMode={SelectionMode.none}
              getKey={_getKey}
              setKey="PartID"
              layoutMode={DetailsListLayoutMode.justified}
              isHeaderVisible={true}
              onShouldVirtualize={() => false}
              styles={gridStyles}
            //onItemInvoked={this._onItemInvoked}
            />: (
              <div style={{height: '100px'}}>
                <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold'}}>
                  <div style={{marginRight: '10px', display: 'flex', alignItems: 'center'}}>
                    <Viewhistory />
                  </div>
                  Submitted!
                </p>
                <p style={{fontSize: '14px', textAlign: 'center'}}>Submitted successfully! The request will be listed in some minutes.</p>
              </div>
            )
  

            // buttonvisible && dialogitems.map((item: Iitem) =>
            //   <div key={item.PartID}>
            //     <ul style={{ paddingInlineStart: 0 }}>{item.PartID}{","} {item.PartDescription}{","} {item.Count}</ul>
            //   </div>
            // )

         } 

          <DialogFooter styles={!buttonvisible ? {actionsRight: {justifyContent: 'center'}} : {}}>
          <PrimaryButton onClick={() => { document.location.href = `${ctx.context._pageContext._web.absoluteUrl}/sitepages/Home.aspx` }} text="OK" style={{ display: !buttonvisible ? 'block' : 'none' }} className={styles.dialogyesbutton}/>
          <DefaultButton onClick={toggleHideDialog} text="Cancel" style={{ display: buttonvisible ? 'block' : 'none' }} />
          <PrimaryButton onClick={submitFunction} text="Yes" style={{ display: buttonvisible ? 'block' : 'none' }} className={styles.dialogyesbutton}/>
        </DialogFooter>
        </Dialog>

        : <Dialog
          dialogContentProps={dialogContentProps1}
          modalProps={modalProps}
          hidden={hideDialog}
          onDismiss={toggleHideDialog}>
          {/* <div>
            {hinterrormessage}
          </div> */}
          
              <div style={{height: '100px'}}>
                <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold'}}>
                  <div style={{marginRight: '10px', display: 'flex', alignItems: 'center'}}>
                    <Erroricon />
                  </div>
                  Error
                </p>
                <p style={{fontSize: '14px', textAlign: 'center'}}>{hinterrormessage}</p>
              </div>
            
          <DialogFooter styles={{actionsRight: {justifyContent: 'center'}}}>
            <PrimaryButton onClick={toggleHideDialog} text='OK' className={styles.dialogyesbutton}/>
          </DialogFooter>
        </Dialog>

      }

    </section>
  )

}


