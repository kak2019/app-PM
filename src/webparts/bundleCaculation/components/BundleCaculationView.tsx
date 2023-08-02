import * as React from 'react';
import { DetailsList, DetailsListLayoutMode, SelectionMode, IColumn } from '@fluentui/react/lib/DetailsList';
import {BUNDLECONST} from '../assets/bundlesSlice';
import { Text } from '@fluentui/react/lib/Text';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from '@fluentui/react/lib/Dropdown';





//item : { 'Material': '10001', 'MaterialDescription': 'Bundle of PALLET OF WOOD, TYPE L', 'Component': { 'PALLET OF WOOD, TYPE L': 10 } },
interface Iitem {
    "Material": string,
    "MaterialDescription": string,
    "Count"?: string,
    "Component": {Name:string,Count:number},
  }





 
export default function CaculateView(): JSX.Element {
    const [items, setitems] = React.useState<Iitem[]>(BUNDLECONST.MATERIAL_LIST)
    const _getKey = (item: IColumn, index?: number): string => {
        return item.key;
      }
React.useEffect(()=>{
    setitems(BUNDLECONST.MATERIAL_LIST)
},[])
    const columns: IColumn[] = [
        {
          key: 'column1',
          name: 'Part ID',
          ariaLabel: 'Column operations for File type, Press to sort on File type',
          isIconOnly: false,
          fieldName: 'name',
          minWidth: 61,
          maxWidth: 61,
          onRender: (item: Iitem) => (
            <Text>{item.Material}</Text>
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
          onRender: (item: Iitem) => (
            <Text>{item.MaterialDescription}</Text>
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
          //onColumnClick: this._onColumnClick,
          onRender: (item: Iitem, i: number) => (
           <Text> {item.Count}</Text>
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
        }
      ]
      const options: IDropdownOption[] = [
        { key: 'fruitsHeader', text: 'Fruits', itemType: DropdownMenuItemType.Header },
        { key: 'apple', text: 'Apple' },
        { key: 'banana', text: 'Banana' },
        { key: 'orange', text: 'Orange', disabled: true },
        { key: 'grape', text: 'Grape' },
        { key: 'divider_1', text: '-', itemType: DropdownMenuItemType.Divider },
        { key: 'vegetablesHeader', text: 'Vegetables', itemType: DropdownMenuItemType.Header },
        { key: 'broccoli', text: 'Broccoli' },
        { key: 'carrot', text: 'Carrot' },
        { key: 'lettuce', text: 'Lettuce' },
      ];
      const dropdownStyles: Partial<IDropdownStyles> = {
        dropdown: { width: 300 },
      };
return(
    <section>
    <div>看见就是成功</div>
    <Dropdown
        placeholder="Select an option"
        label="Basic uncontrolled example"
        options={options}
        styles={dropdownStyles}
      />
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
      </section>
)





}