import * as React from 'react';
import { DetailsList, DetailsListLayoutMode, SelectionMode, IColumn } from '@fluentui/react/lib/DetailsList';
import {BUNDLECONST} from '../assets/bundlesSlice';
import { Dropdown,  IDropdownStyles, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { TextField } from '@fluentui/react/lib/TextField'
import { PrimaryButton } from '@fluentui/react/lib/Button'
import { Stack } from '@fluentui/react/lib/Stack';
import { Label } from '@fluentui/react/lib/Label';





//item : { 'Material': '10001', 'MaterialDescription': 'Bundle of PALLET OF WOOD, TYPE L', 'Component': { 'PALLET OF WOOD, TYPE L': 10 } },
interface Iitem {
    "Material": string,
    "MaterialDescription": string,
    "Count"?: string,
    "Component": ComponentType[],
  }

  interface ComponentType {
    PartID:number,
    Name:string,
    Count:number
  }




 
export default function CaculateView(): JSX.Element {
    const [items, setitems] = React.useState<Iitem[]>(BUNDLECONST.MATERIAL_LIST)
    const [list, setList] = React.useState<ComponentType[]>([])
    const [count, setCount] = React.useState<string>("1")
    const [curMaterial, setCurMaterial] = React.useState<Iitem>()
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
          fieldName: 'PartID',
          minWidth: 61,
          maxWidth: 61,
          // onRender: (item: Iitem) => (
          //   <Text>{item.Material}</Text>
          // ),
        },
        {
          key: 'column2',
          name: 'Part Description',
          ariaLabel: 'Column operations for File type, Press to sort on File type',
          //iconName: 'Page',
          isIconOnly: false,
          fieldName: 'Name',
          minWidth: 221,
          maxWidth: 221,
          // onRender: (item: Iitem) => (
          //   <Text>{item.MaterialDescription}</Text>
          // ),
        }, {
          key: 'column3',
          name: 'Quantity',
          ariaLabel: 'Column operations for File type, Press to sort on File type',
          //iconName: 'Page',
          isIconOnly: false,
          fieldName: 'Count',
          minWidth: 141,
          maxWidth: 141,
          //onColumnClick: this._onColumnClick,
          // onRender: (item: Iitem, i: number) => (
          //  <Text> {item.Component[0].PartID}</Text>
          // ),
        },
        {
          key: 'column4',
          name: '',
          ariaLabel: 'Column operations for File type, Press to sort on File type',
          //iconName: 'Page',
          isIconOnly: false,
          fieldName: '',
          minWidth: 20,
          maxWidth: 20,
        }
      ]

      const materialColumns = [
        {
          key: 'column1',
          name: 'Material',
          ariaLabel: 'Column operations for File type, Press to sort on File type',
          //iconName: 'Page',
          isIconOnly: false,
          fieldName: 'Material',
          minWidth: 120,
          maxWidth: 240
        },
        {
          key: 'column2',
          name: 'Description',
          ariaLabel: 'Column operations for File type, Press to sort on File type',
          //iconName: 'Page',
          isIconOnly: false,
          fieldName: 'MaterialDescription',
          minWidth: 240,
          maxWidth: 480,
        }
      ]

      const options: IDropdownOption[] = BUNDLECONST.MATERIAL_LIST.map(val => (
        {
          key: val.Material,
          text: val.Material
        }
      ))
      const dropdownStyles: Partial<IDropdownStyles> = {
        dropdown: { width: 300 },
      };

      const stackClass = {
        marginTop: '10px'
      }

      const handleCountChange = (e: React.FormEvent, val: string):void => {
        setCount(val)
      }

      const handleDrodownChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number):void => {
        const material = {
          ...BUNDLECONST.MATERIAL_LIST[index]
        }
        setCurMaterial(material)
        setList(material.Component.slice(0).map((val) => ({
          ...val,
          Count: Number(count) * val.Count
        })))
      }

      const handleGoClick = ():void => {
        setList(curMaterial.Component.slice(0).map((val) => ({
          ...val,
          Count: Number(count) * val.Count
        })))
      }

return(
    <section>
    
    <Stack horizontal verticalAlign="center" style={stackClass}>
        <Label style={{ width: 100 ,marginLeft:8 }}>Material: </Label>
        <Dropdown
          placeholder="Select an option"
          options={options}
          styles={dropdownStyles}
          onChange={handleDrodownChange}
        />
    </Stack>
    
    <div style={{marginLeft: '108px'}}>{curMaterial && curMaterial.MaterialDescription}</div>
    <Stack horizontal verticalAlign="center" style={stackClass}>
        <Label style={{ width: 100 ,marginLeft:8 }}>Quantity: </Label>
        <TextField
          value={count}
          onChange={handleCountChange}
          styles={{root: { width: 300 }}}
        />
        <PrimaryButton text="GO" styles={{root: {marginLeft: 10}}} onClick={handleGoClick} />
    </Stack>

    <DetailsList
        items={list}// [{"Emballage Number":"123","Emballage Type":"456" ,"Count":"11"},]
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
    <DetailsList
        items={items}// [{"Emballage Number":"123","Emballage Type":"456" ,"Count":"11"},]
        //compact={isCompactMode}
        columns={materialColumns}
        selectionMode={SelectionMode.none}
        getKey={_getKey}
        setKey="Material"
        layoutMode={DetailsListLayoutMode.justified}
        isHeaderVisible={true}
        onShouldVirtualize={() => false}
        
      //onItemInvoked={this._onItemInvoked}
      />
      </section>
)





}