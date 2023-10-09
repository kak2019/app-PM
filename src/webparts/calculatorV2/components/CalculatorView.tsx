import * as React from 'react';
import { DetailsList, DetailsListLayoutMode, SelectionMode, IColumn } from '@fluentui/react/lib/DetailsList';
import { BUNDLECONST } from '../assets/bundlesSlice';
import { Dropdown, IDropdownStyles, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { TextField } from '@fluentui/react/lib/TextField'
import { PrimaryButton } from '@fluentui/react/lib/Button'
import { Stack } from '@fluentui/react/lib/Stack';
import { Label } from '@fluentui/react/lib/Label';
import { IDetailsListStyles } from 'office-ui-fabric-react';
import styles from './CalculatorV2.module.scss'
import { Dialog, DialogType} from '@fluentui/react/lib/Dialog';
import OptionDetailSVG from '../assets/bundleQuestion'
import { useId, useBoolean } from '@fluentui/react-hooks';

import "@pnp/sp/items/get-all";
import { spfi } from "@pnp/sp";
import { getSP } from '../../../common/pnpjsConfig'

//item : { 'Material': '10001', 'MaterialDescription': 'Bundle of PALLET OF WOOD, TYPE L', 'Component': { 'PALLET OF WOOD, TYPE L': 10 } },
interface Iitem {
  "Material": string,
  "MaterialDescription": string,
  "Count"?: string,
  "Component": ComponentType[],
}

interface ComponentType {
  PartID: number,
  Name: string,
  Count: number,
}

interface InventoryListItem {
    PartID: number,
    Name: string,
    Count: number,
    Quantity?: number,
    StockOnhand?: number
    Difference?: number
  }
interface InventoryItem{
    Qtyonhand:string,
    ID:string
  }



export default function CaculateBundleView({row}: {row?: {PartID: string, Quantity: string ,TerminalId_x003a_Name: string }}): JSX.Element {
  const [items, setitems] = React.useState<Iitem[]>(BUNDLECONST.MATERIAL_LIST)
  const [list, setList] = React.useState<ComponentType[]>([])
  const [count, setCount] = React.useState<string>(row.Quantity||"1")
  const [curMaterial, setCurMaterial] = React.useState<Iitem>()
  const [hideDialog, setHideDialog] = React.useState<boolean>(true)
  const [isDraggable] = useBoolean(false);
  const [selectedKey, setSelectedKey] = React.useState<string>(row.PartID||'')
  const _getKey = (item: IColumn, index?: number): string => {
    return item.key;
  }
  React.useEffect(() => {
    setitems(BUNDLECONST.MATERIAL_LIST)
  }, [])
  const sp = spfi(getSP());

  const getTargetInventoryValue = (partId: number): Promise<InventoryItem> => {
    
    // 变量拼起来 空格会导致搜索不到
    //const temp_Address = sp.web.lists.getByTitle("Entities").items.select("Title","Country","Address").filter(`Name eq ${(taregetID)}`).getAll();
    console.log("1",row.PartID)
    try{
    const item =  sp.web.lists.getByTitle("Inventory Management").renderListDataAsStream({
        ViewXml: `<View>
                      <Query>
                        <Where>
                        <And>
                          <Eq>
                            <FieldRef Name="PartNumber"/>
                            <Value Type="Text">${partId}</Value>
                          </Eq>
                          <Eq>
                          <FieldRef Name="Entity_x003a__x0020_Name"/>
                          <Value Type="Text">${row.TerminalId_x003a_Name}</Value>
                        </Eq>
                        </And>
                        </Where>
                      </Query>
                      <ViewFields>
                        <FieldRef Name="QtyonHand"/>
                        <FieldRef Name="ID"/>
                      </ViewFields>
                      <RowLimit>1</RowLimit>
                    </View>`,
      })
      .then((response) => {
        console.log("res",response)
        if (response.Row.length > 0) {
          return {
            Qtyonhand: response.Row[0].QtyonHand,
            ID: response.Row[0].ID,
            
          } as InventoryItem;
        } else return {} as InventoryItem;
      });
      //console.log(,"item")
    return item;
  } catch (err) {
    console.log(err);
    return Promise.reject("Error when fetch request by Id");
  }
};
  
  React.useEffect(() => {
    const item = BUNDLECONST.MATERIAL_LIST.find(val => val.Material === row.PartID)
    const arr: InventoryListItem[] = item.Component.slice(0)
      arr.forEach(async (val, i) => {
        await getTargetInventoryValue(val.PartID).then((value)=>{
          const Qtyonhand = Number(value.Qtyonhand.replace(',', ''))
          val.StockOnhand = Qtyonhand
          val.Count = Number(row.Quantity)
          val.Difference = Qtyonhand - Number(row.Quantity)
        });
        if(i === arr.length - 1) {
          setList(arr);
        }
      })
      
    
  }, [row])
  const colomnstyle = {
    root: {
      color: "black",
      backgroundColor: '#E9E9E9',
      '&:hover': {
        backgroundColor: '#E9E9E9',
        color: "black",
      },
      '&:active': {
        backgroundColor: '#E9E9E9',
        color: "black",
      }
    }
  }
  const columns: IColumn[] = [
    {
      key: 'column1',
      name: 'ID',
      ariaLabel: 'Column operations for File type, Press to sort on File type',
      isIconOnly: false,
      fieldName: 'PartID',
      minWidth: 35 ,
      maxWidth: 61,
      styles: colomnstyle
      // onRender: (item: Iitem) => (
      //   <Text>{item.Material}</Text>
      // ),
    },
    {
      key: 'column2',
      name: 'Description',
      ariaLabel: 'Column operations for File type, Press to sort on File type',
      //iconName: 'Page',
      isIconOnly: false,
      fieldName: 'Name',
      minWidth: 185,
      maxWidth: 221,
      styles: colomnstyle
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
      styles: colomnstyle
      //onColumnClick: this._onColumnClick,
      // onRender: (item: Iitem, i: number) => (
      //  <Text> {item.Component[0].PartID}</Text>
      // ),
    }, {
        key: 'column4',
        name: 'StockOnhand',
        ariaLabel: 'Column operations for File type, Press to sort on File type',
        //iconName: 'Page',
        isIconOnly: false,
        fieldName: 'StockOnhand',
        minWidth: 141,
        maxWidth: 141,
        styles: colomnstyle
        //onColumnClick: this._onColumnClick,
        // onRender: (item: Iitem, i: number) => (
        //  <Text> {item.Component[0].PartID}</Text>
        // ),
      },
      {
        key: 'column5',
        name: 'Difference',
        ariaLabel: 'Column operations for File type, Press to sort on File type',
        //iconName: 'Page',
        isIconOnly: false,
        fieldName: 'Difference',
        minWidth: 141,
        maxWidth: 141,
        styles: colomnstyle
        //onColumnClick: this._onColumnClick,
        // onRender: (item: Iitem, i: number) => (
        //  <Text> {item.Component[0].PartID}</Text>
        // ),
      },
    {
      key: 'column6',
      name: '',
      ariaLabel: 'Column operations for File type, Press to sort on File type',
      //iconName: 'Page',
      isIconOnly: false,
      fieldName: '',
      minWidth: 20,
      maxWidth: 20,
      styles: colomnstyle
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
    dropdown: { width: 150 },
    callout: { maxHeight: "20px", overflowY: 'auto' },
    root: {
      marginRight: 10
    }
  };

  const tempdialogStyles = {
    main: {
      selectors: {
        '@media (min-width: 0px)': {
          //height: 500,
          maxHeight:"60vh",
          minHeight:300,
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
  const stackClass = {
    marginTop: '10px'
  }

  const handleCountChange = (e: React.FormEvent, val: string): void => {
    //setCount(val)
    if ((/^\d+$/.test(val)) || val === "") {
      setCount(val)
    }
  }
  const handleGoClick = (): void => {
    setList(curMaterial.Component.slice(0).map((val) => ({
      ...val,
      Count: Number(count) * val.Count
    })))
  }
  const handleDrodownChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number): void => {
    setCount("1");
    const material = {
      ...BUNDLECONST.MATERIAL_LIST[index]
    }
    setCurMaterial(material)
    setList(material.Component.slice(0).map((val) => ({
      ...val,
      //Count: Number(count) * val.Count
      Count: Number("1") * val.Count
    })))
    setSelectedKey(material.Material)
  }
  const toggleHideDialog = () :void => {
    setHideDialog(!hideDialog)
  }
  const showOptionList = ():void => {
    toggleHideDialog()

  }
  const onItemInvoked = (material: Iitem) :void => {
    setCount("1");
    setCurMaterial(material)
    setList(material.Component.slice(0).map((val) => ({
      ...val,
      //Count: Number(count) * val.Count
      Count: Number("1") * val.Count
    })))
    setSelectedKey(material.Material)
    setHideDialog(true)
  }
  //  React.useEffect(()=>{
  //     if(curMaterial !== undefined){
  //     //handleGoClick()
  // }
  //  },[count]) 
  const gridStyles: Partial<IDetailsListStyles> = {
    root: {
      overflowY: 'auto',
      overflowX: 'hidden',
      selectors: {
        '& [role=grid]': {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          height: '60vh',
          minWidth: 400,
        },
      },
    },

  };
  const partgridStyles: Partial<IDetailsListStyles> = {
    root: {
      overflowY: 'auto',
      overflowX: 'hidden',
      selectors: {
        '& [role=grid]': {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          heighteight: '500',
          minHeight:"30vh",
          minWidth: 400,
          maxWidth: '80vh',
        },
      },
      marginTop: '10px',
      borderRadius: '10px'
    },
    headerWrapper: {
      marginTop: '16px'
    },


  };


  return (
    <section className={styles.caculatorbody}>

      <Label className={styles.caculatortitle} >Calculator</Label>
      <Label styles={{ root: { padding: '0 10px' } }}>
        <Stack horizontal verticalAlign="center" style={stackClass}>
        {/* <Label style={{ width: 100, marginLeft: 32 }}>Material: </Label> */}
          <Label style={{ width: 80, marginLeft: 10 }}>Material: </Label>
          <Dropdown
            placeholder="Select an option"
            options={options}
            styles={dropdownStyles}
            onChange={handleDrodownChange}
            selectedKey={selectedKey}
          />
          <div style={{ cursor: 'pointer' }} onClick={showOptionList}>
            <OptionDetailSVG />
          </div>
        </Stack>

        <div style={{ marginLeft: '90px' }}>{curMaterial && curMaterial.MaterialDescription}</div>
        <Stack horizontal verticalAlign="center" style={stackClass}>
        {/* <Label style={{ width: 100, marginLeft: 32 }}>Quantity: </Label> */}
          <Label style={{ width: 80, marginLeft: 10 }}>Quantity: </Label>
          <TextField
            value={count}
            onChange={handleCountChange}
            styles={{ root: { width: 150 } }}

          />
          <PrimaryButton text="GO" styles={{ root: { marginLeft: 10, backgroundColor: "rgba(0, 130, 155, 1)", borderRadius: '5px',minWidth:40 } }} className={styles.gobutton} onClick={handleGoClick} />
        </Stack>
        
        {list?.length > 0 && <hr style={{ color: "rgb(0, 130, 155)" }} />}
        {list?.length > 0&&<Label  style={{  marginLeft: 10  ,fontWeight:600}}>Components:</Label>}
        {list?.length > 0 && <DetailsList
          items={list}// [{"Emballage Number":"123","Emballage Type":"456" ,"Count":"11"},]
          //compact={isCompactMode}
          columns={columns}
          selectionMode={SelectionMode.none}
          getKey={_getKey}
          setKey="PartID"
          layoutMode={DetailsListLayoutMode.justified}
          isHeaderVisible={true}
          onShouldVirtualize={() => false}
          styles={partgridStyles}
        //onItemInvoked={this._onItemInvoked}
        />}
        <div style={{ display: "none" }}>
          <hr style={{ color: "rgb(0, 130, 155)" }} />
          <DetailsList
            items={items}
            //compact={isCompactMode}
            columns={materialColumns}
            selectionMode={SelectionMode.none}
            getKey={_getKey}
            setKey="Material"
            layoutMode={DetailsListLayoutMode.justified}
            isHeaderVisible={true}
            onShouldVirtualize={() => false}
            styles={gridStyles}
          //onItemInvoked={this._onItemInvoked}
          />
        </div>
      </Label>
      <Dialog
        hidden={hideDialog}
        onDismiss={toggleHideDialog}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Material',
          closeButtonAriaLabel: 'Close',
          styles: {
            subText: {
              marginBottom: '0 0 10px',
              
            }
           
          }
        }}
        modalProps={dialogmodalProps}
      >
        <DetailsList
          items={items}
          //compact={isCompactMode}
          columns={materialColumns}
          selectionMode={SelectionMode.none}
          getKey={_getKey}
          setKey="Material"
          layoutMode={DetailsListLayoutMode.justified}
          isHeaderVisible={true}
          onShouldVirtualize={() => false}
          styles={gridStyles}
          onItemInvoked={onItemInvoked}
        //onItemInvoked={this._onItemInvoked}
        />
      </Dialog>
      <Label/>
    </section>
  )





}