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
import { DetailsList, DetailsListLayoutMode, Selection, SelectionMode, IColumn } from '@fluentui/react/lib/DetailsList';
import { TextField } from 'office-ui-fabric-react';
import {REQUESTSCONST} from '../../../../src/common/features/requests'
interface Iitem{
    "PartID":string,
    "PartDescription":string,
    "Count"? : string,
}
export default function RequestView(): JSX.Element {
    const [items,setitems]  = React.useState<Iitem[]>(REQUESTSCONST.PART_LIST)
    const [itemsValue,setitemsValue] = React.useState<string>()
    //const items1:Iitem[] = [{"PartID":"123","PartDescription":"456" ,"Count":"11"},{"Emballage Number":"254","Emballage Type":"456" ,"Count":"11"}]
    
    const _getKey=(item: IColumn, index?: number): string =>{
        return item.key;
      }
      const _onChangeText = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string): void => {
        setitems(
           text ? items?.filter(i => i.PartID.toLowerCase().indexOf(text) > -1) : REQUESTSCONST.PART_LIST,
        );
      };
      const onChangeSecondTextFieldValue = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
          if (!newValue || newValue.length <= 5) {
            setitemsValue(newValue || '');
          }
        },
        [],
      );
    
    const today = useConst(new Date(Date.now()));
    const minDate = useConst(addDays(today, 10));
    const datePickerStyles: Partial<IDatePickerStyles> = { root: { maxWidth: 300 } };
    const options: IDropdownOption[] = [
        { key: 'fruitsHeader', text: 'Fruits' }]
       
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
              },{
                key: 'column3',
                name: 'Count',
                ariaLabel: 'Column operations for File type, Press to sort on File type',
                //iconName: 'Page',
                isIconOnly: false,
                fieldName: 'name',
                minWidth: 201,
                maxWidth: 201,
                //onColumnClick: this._onColumnClick,
                onRender: (item: Iitem) => (
                  <TextField defaultValue={item.Count} onChange={onChangeSecondTextFieldValue}/>
                ),
              }]
    const dropdownStyles: Partial<IDropdownStyles> = {
        dropdown: { width: 300 },
    };
   
    return (
        <section>
            看到就是成功
            <Stack horizontal>
                <Label >Request By: </Label>{" "} <Text variant={'large'}>{"aaa"}</Text>
                {/* <TextField disabled defaultValue="I am disabled" style={{ width: 100 }} /> */}
            </Stack>
            <Stack horizontal>
                <Label>Terminal: </Label>
                <Dropdown
                    placeholder="Select an option"
                    //label="Basic uncontrolled example"
                    options={options}
                    styles={dropdownStyles}
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
                //maxDate={maxDate}
                // allowTextInput
                />
            </Stack>
            <Stack horizontal>
                <Label>Delivery Address: </Label> <Text variant={'large'}>{"request-flow-web-part.js"}</Text>
            </Stack>
            
            <Stack horizontal>
            <Label>Filter by Emballage Number:</Label><TextField  onChange={_onChangeText} />    {/* //label="Filter by Emballage Number:" */}
            </Stack>
            <DetailsList
            items={items}// [{"Emballage Number":"123","Emballage Type":"456" ,"Count":"11"},]
            //compact={isCompactMode}
            columns={columns}
            selectionMode={SelectionMode.none}
            getKey={_getKey}
            setKey="none"
            layoutMode={DetailsListLayoutMode.justified}
            isHeaderVisible={true}
            onShouldVirtualize={ () => false }
            //onItemInvoked={this._onItemInvoked}
          />
          
        </section>
    )

}


