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
interface IPartJson {
  [ID:number]: {
    "PartID": string,
    "PartDescription": string,
    "Count"?: string

  }

}
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
  const [DateValue, setDateValue] = React.useState<Date>();
  // Dialog
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const [isDraggable, { toggle: toggleIsDraggable }] = useBoolean(false);

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
  const dialogContentProps = {
    type: DialogType.normal,
    title: 'Part Info',
    closeButtonAriaLabel: 'Close',
    subText: 'Below parts would be included:',
  };
  const sp = spfi(getSP());
  const MappingterminalArray: string[] = []
  const ctx = useContext(AppContext);
  const userEmail = ctx.context._pageContext._user.email;
  const [
    isFetching,
    type,
    fetchMyEntity,
    fetchEntitiesByType,
    myEntity,
    entities,
    errorMessage,
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

  const today = useConst(new Date(Date.now()));
  const minDate = useConst(addDays(today, 10));
  const datePickerStyles: Partial<IDatePickerStyles> = { root: { maxWidth: 300 } };
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
    dropdown: { width: 300 },
  };
  // Get Mapping Relationship according Own Terminal ID
  const getMapping = (myterminalID: string): void => {


    const items = sp.web.lists.getByTitle("Request Mapping").items.select("Requester/Name", "Terminal/Name", "Terminal/ID").filter(`Requester/Title eq ${myterminalID}`).
      expand("Terminal,Requester").getAll().then((reponse: IMappingOBJ[]) => {
        console.log("terminal", reponse)
        const ops = []
        for (let i = 0; i < reponse.length; i++) {
          MappingterminalArray.push(reponse[i].Requester.Name)
          ops.push({ "text": reponse[i].Terminal[0].Name, "key": reponse[i].Terminal[0].ID })
        }

        setOptions([...ops])
      });
    // console.log(MappingterminalArray,items)
  }
  const getTargetAddress = (taregetID: string) => {
    // 变量拼起来 空格会导致搜索不到
    //const temp_Address = sp.web.lists.getByTitle("Entities").items.select("Title","Country","Address").filter(`Name eq ${(taregetID)}`).getAll();
    sp.web.lists.getByTitle("Entities").items.select("Title", "Country", "Address").filter("Name eq '" + taregetID + "'").getAll().then(temp_Address => {
      setAddress(temp_Address[0].Title + ' ' + temp_Address[0].Country + ' ' + temp_Address[0].Address)
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
    //getTargetAddress("1")
  }, [])
  useEffect(() => {
    if (myEntity?.Type !== undefined) {
      console.log("E", myEntity)
      getMapping(myEntity?.Title)
    }
  }, [myEntity]);
  const filterPartInfo = (): void => {
    const list = allItems.filter(i => i.Count !== undefined)
    console.log(list)
    setdialogitems(list)
    console.log("dialogitems", dialogitems, dialogitems.length)

  }

  useEffect(() => {
    filterPartInfo()
  }, [allItems])
  const submitFunction = async (): Promise<void> => {
    const resultRequestor: IWebEnsureUserResult = await sp.web.ensureUser("i:0#.f|membership|" + userEmail);
    const jsonData:{ [key: string]: object } = {};
    const templist= []
    for(let i=0;i<dialogitems.length;i++){
    
      //templist.push({key:i.toString(),value:dialogitems[i]})  
      templist[i] =dialogitems[i] ;
      jsonData[i+1] = dialogitems[i];
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
      PartJSON: JSON.stringify(jsonData)
    }
    addRequest({ request }).catch((error) => console.log(error))

  }
  return (
    <section>

      <Stack horizontal>
        <Label >Request By: </Label>{" "} <Text variant={'large'}>{myEntity?.Title}</Text>
        {/* <TextField disabled defaultValue="I am disabled" style={{ width: 100 }} /> */}
      </Stack>
      <Stack horizontal>
        <Label>Terminal: </Label>
        <Dropdown
          placeholder="Select an option"
          //label="Basic uncontrolled example"
          options={options}
          styles={dropdownStyles}
          onChange={onChange}
          selectedKey={selectedItem ? selectedItem.key : undefined}
        />

      </Stack>
      <Stack horizontal>
        <Label>Date Needed: </Label>
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
      <Stack horizontal>
        <Label>Delivery Address: </Label> <Text variant={'large'}>{address}</Text>
      </Stack>

      <Stack horizontal>
        <Label>Filter by Emballage Number:</Label><TextField onChange={_onChangeText} />    {/* //label="Filter by Emballage Number:" */}
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
      <DefaultButton secondaryText="Opens the Sample Dialog" onClick={toggleHideDialog} text="Next step" />
      <Dialog
        hidden={hideDialog}
        onDismiss={toggleHideDialog}
        dialogContentProps={dialogContentProps}
        modalProps={modalProps}
      >{

          dialogitems.map((item: Iitem) =>
            <div>
              <ul>{item.PartID} {item.PartDescription} {item.Count}</ul>
            </div>
          )
        }


        <DialogFooter>
          <PrimaryButton onClick={submitFunction} text="Submit" />
          <DefaultButton onClick={toggleHideDialog} text="Cancel" />
        </DialogFooter>
      </Dialog>

    </section>
  )

}


