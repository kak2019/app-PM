import * as React from "react";
import { useEntities } from "../../../common/hooks";
import AppContext from "../../../common/AppContext";
//import { useControlledState } from "office-ui-fabric-react/lib/Foundation";
import { useConst } from '@fluentui/react-hooks';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { Label } from '@fluentui/react/lib/Label';
import { DefaultButton, DetailsListLayoutMode, IDetailsListStyles, PrimaryButton, TextField } from 'office-ui-fabric-react';
import { REQUESTSCONST } from '../../../common/features/requests';
import { useContext, useEffect, useState } from "react";
import { DetailsList, IColumn, SelectionMode, } from '@fluentui/react/lib/DetailsList';
import { getSP } from "../../../common/pnpjsConfig";
import { spfi } from "@pnp/sp";
import { Dropdown, IDropdownOption, IDropdownStyles } from "office-ui-fabric-react/lib/Dropdown";

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import { DatePicker, addDays, IDatePickerStyles } from "@fluentui/react";
import { addRequest } from "./distributionFlowUtil/distributionFlow";
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { useId, useBoolean } from '@fluentui/react-hooks';
import styles from './DistributionFlow.module.scss';
import Submiticon from '../assets/submit';
import Erroricon from '../assets/error';

interface Iitem {
    "PartID": string,
    "PartDescription": string,
    "PartQty"?: string,
    "Errormessage"?: string
}
interface IDistributionMapping {
    "PMSender": { "Name": string },
    "PMReceiver": [{ "Name": string, "ID": string }],
    "PMReceiverType": string

}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<F extends (...args: any[]) => any>(fn: F, delay: number): (...funcArgs: Parameters<F>) => void {
    let timer: number | undefined;
    return (...args: Parameters<F>) => {
        if (timer) {
            clearTimeout(timer);
        }
        timer =window.setTimeout(() => {
            fn(...args);
        }, delay);
    };
  }

export default function DistributionFlowView(): JSX.Element {

    const columnstyle = {
        root: {
            color: "white",
            backgroundColor: 'rgb(0, 130, 155)',
            '&:hover': {
                backgroundColor: 'rgb(0, 130, 155)',
                color: "white",
            },
            '&:active': {
                backgroundColor: 'rgb(0, 130, 155)',
                color: "white",
            }
        }
    }
    const [receiver, setReceiver] = useState([]);
    const [selectedReceiverID, setSelectedReceiverID] = React.useState<string>();
    const today = useConst(new Date(Date.now()));
    const minDate = useConst(addDays(today, 0));
    const ctx = useContext(AppContext);
    const [DateValue, setDateValue] = React.useState<Date>(minDate);
    //const CurrentUserEmail = ctx.context._pageContext._user.email;
    const [selectedReceiverType, setSelectedReceiverType] = React.useState<IDropdownOption>();
    const [selectedReceiverName, setSelectedReceiverName] = React.useState<IDropdownOption>();
    const [hinterrormessage, sethinterrormessage] = React.useState<string>(null);

    const sp = spfi(getSP());
    const MappingterminalArray: string[] = []
    //const userEmail = ctx.context._pageContext._user.email;
    const [
        ,
        ,
        fetchMyEntity,
        ,
        myEntity,
        ,
        ,
    ] = useEntities();
    const [options, setOptions] = React.useState<IDropdownOption[]>([])
    //const [receiver, setReceiver] = React.useState<IDropdownOption[]>([])
    const [receiverTypeOptions, setReceiverTypeOptions] = React.useState<IDropdownOption[]>([])
    const tentativeOption: IDistributionMapping[] = []
    const [address, setAddress] = React.useState<string>('')
    const [items, setItems] = React.useState<Iitem[]>(REQUESTSCONST.PART_LIST)
    const [allItems, setallItems] = React.useState<Iitem[]>(REQUESTSCONST.PART_LIST)
    const [dialogitems, setdialogitems] = React.useState<Iitem[]>([])
    //Dialog
    const dialogStyles = {
        main: {
            selectors: {
                '@media (min-width: 0px)': {
                    //height: 220,
                    maxHeight: 500,
                    maxWidth: 650,
                    minwidth: 362,
                    width: 400,
                }
            },
            textAlign: 'center',
        }
    };
    //main: { maxWidth: 1200 } };
    const labelId: string = useId('dialogLabel');
    const subTextId: string = useId('subTextLabel');
    const [isDraggable] = useBoolean(false);
    const modalProps = React.useMemo(
        () => ({
            titleAriaId: labelId,
            subtitleAriaId: subTextId,
            isBlocking: true,
            styles: dialogStyles,

        }),
        [isDraggable, labelId, subTextId],
    );
    const tempdialogStyles = {
        main: {
            selectors: {
                '@media (min-width: 0px)': {
                    //height: 220,"
                    maxHeight: '100vh',
                    maxWidth: 650,
                    minwidth: 362,
                    width: 600,


                }
            },
            textAlign: 'center',
            //title: <><Icon iconName="upload"/></>

        },


        //main: { maxWidth: 1200 }
    };// main: { maxWidth: 800 }
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
    const [dialogContent, setDialogContent] = React.useState({
        type: DialogType.normal,
        title: 'Error',
        closeButtonAriaLabel: 'Close',
        subText: '',

    });
    const [dialogButtonVisible, setDialogButtonVisible] = React.useState<boolean>(true);
    const [dialogVisible, setDialogVisible] = React.useState<boolean>(false);
    const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
    // const _getKey = (item: IColumn, index?: number): string => {
    //     return item.key;
    //   }

    interface Iops {
        "text": string,
        "key": string
    }
    //styles
    const dropdownStyles: Partial<IDropdownStyles> = {
        root: { width: 200 },
    };
    const datepickerStyles: Partial<IDatePickerStyles> = {
        root: { width: 400 }
    };
    
    //name is undefined, if response is not a array, set it as array and return.
    const getMapping = (myterminalID: string): void => {
        sp.web.lists.getByTitle("Distribution Mapping").items.select("PMSender/Name", "PMReceiver/Name", "PMReceiver/ID", "PMReceiverType/Type").filter(`PMSender/Title eq ${myterminalID}`).expand("PMSender,PMReceiver").getAll().then((response1) => {


            const typeops: Iops[] = []
            const receiver: IDistributionMapping[] = []

            console.log("sender", response1)


            for (let i = 0; i < response1.length; i++) {
                if (!Array.isArray(response1[i].PMReceiver)) {
                    const response2: IDistributionMapping = {
                        "PMSender": response1[i].PMSender, "PMReceiver": [response1[i].PMReceiver],
                        "PMReceiverType": response1[i].PMReceiverType
                    }
                    receiver.push(response2)
                    tentativeOption.push(response2)

                }

            }

            for (let i = 0; i < receiver.length; i++) {

                MappingterminalArray.push(receiver[i].PMSender.Name)

                typeops.push({ "text": receiver[i].PMReceiverType, "key": receiver[i].PMReceiverType })

                //ops.push({ "text": response[i].PMReceiver[0].Name, "key": response[i].PMReceiver[0].ID})

            }
            //setOptions([...ops])

            const filterType = typeops.filter((item: Iops, index: number) => {
                return index === typeops.findIndex((o: Iops) => o.text === item.text && o.key === item.key)
            })


            setReceiverTypeOptions([...filterType])
            //console.log("responseMap",response)
            setReceiver(receiver)//将receiver整体返回

        }).catch(err => {
            console.log(err)
        })



    }


    const onChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        setSelectedReceiverType(item);
        const ops = []
        console.log("key", item.key.toString())
        console.log("responseMap2", receiver) //为什么在这里没有值

        for (let i = 0; i < receiver.length; i++) {
            if (item.key === receiver[i].PMReceiverType) {
                ops.push({ "text": receiver[i].PMReceiver[0].Name, "key": receiver[i].PMReceiver[0].ID })
                console.log("ops", ops)
                setOptions([...ops]) //设置receiver name的选项
                //ops.push({ "text": options[i].PMReceiver[0].Name, "key": options[i].PMReceiver[0].ID})
            }
        }


    };
    const getTargetAddress = (targetID: string): void => {
        sp.web.lists.getByTitle("Entities").items.select("Name", "Country", "Address", "ID").filter("Name eq '" + targetID + "'").getAll().then(temp_Address => {
            setAddress(temp_Address[0].Name + ' ' + temp_Address[0].Country + ' ' + temp_Address[0].Address)
            console.log(temp_Address)
            setSelectedReceiverID(temp_Address[0].ID)
            console.log("temp_Address[0].ID", temp_Address[0].ID)

        }).catch(err => {
            console.log(err)
        })
    }
    const receiverNameonChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        setSelectedReceiverName(item);

        console.log("key", item.key.toString())

        getTargetAddress(item.text.toString())
        console.log("setSelectedReceiverName", selectedReceiverName)


    }
    const filterPartList = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string): void => {
        setItems(
            newValue ? allItems.filter(i => (i.PartID.toLowerCase().indexOf(newValue) > -1) || (i.PartDescription.toLowerCase().indexOf(newValue.toLowerCase()) > -1)) : allItems,
        );
    };
    const onChangePartQty = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string, id?: string) => {

            allItems.forEach((val: Iitem) => {
                if (val.PartID === id) {
                    val.PartQty = newValue
                    if (!(/^\d+$/.test(newValue)) && newValue !== "") {//set errormessage as a property of item
                        val.Errormessage = "Only integer is allowed"
                    } else {
                        val.Errormessage = ""
                    }
                }
            })
            setallItems([...allItems])

        },
        [],
    );

    const columns: IColumn[] = [
        {
            key: 'column1',
            name: 'Part ID',
            isIconOnly: false,
            fieldName: 'name',
            minWidth: 61,
            maxWidth: 61,
            styles: columnstyle,
            onRender: (item: Iitem) => (
                <Text>{item.PartID}</Text>
            ),
        },
        {
            key: 'column2',
            name: 'Part Description',
            isIconOnly: false,
            fieldName: 'name',
            minWidth: 221,
            maxWidth: 221,
            styles: columnstyle,
            onRender: (item: Iitem) => (
                <Text>{item.PartDescription}</Text>
                // console.log(item.PartDescription)
            )
        },
        {
            key: 'column3',
            name: 'Part Quantity',
            isIconOnly: false,
            fieldName: 'name',
            minWidth: 141,
            maxWidth: 141,
            styles: columnstyle,
            onRender: (item: Iitem, i: number) => (
                <TextField errorMessage={item.Errormessage} key={item.PartID} value={item.PartQty} onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => onChangePartQty(event, newValue, item.PartID)} />
            )
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
            styles: columnstyle,
            //onColumnClick: this._onColumnClick,
            // onRender: (item: Iitem) => (
            //   <Text>{item.PartDescription}</Text>
            // ),
        }
    ];

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

    //selected part list in dialog
    const filterPartInfo = (): void => {
        const list = allItems.filter(i => i.PartQty !== undefined && i.PartQty !== "")
        console.log(list)
        setdialogitems(list)
        console.log("dialogitems", dialogitems, dialogitems.length)

    }

    useEffect(() => {
        filterPartInfo()
    }, [allItems])

    const dialogcolumns: IColumn[] = [
        {
            key: 'column1',
            name: 'Part ID',
            isIconOnly: false,
            fieldName: 'name',
            minWidth: 80,
            maxWidth: 80,
            onRender: (item: Iitem) => (
                <Text>{item.PartID}</Text>
            ),
        },
        {
            key: 'column2',
            name: 'Part Description',
            isIconOnly: false,
            fieldName: 'name',
            minWidth: 260,
            maxWidth: 260,
            onRender: (item: Iitem) => (
                <Text>{item.PartDescription}</Text>
                // console.log(item.PartDescription)
            )
        },
        {
            key: 'column3',
            name: 'Part Quantity',
            isIconOnly: false,
            fieldName: 'name',
            minWidth: 200,
            maxWidth: 200,
            onRender: (item: Iitem, i: number) => (
                //<TextField errorMessage={item.Errormessage} key={item.PartID} value={item.PartQty} onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => onChangePartQty(event, newValue, item.PartID)} />
                <Text>{item.PartQty}</Text>
            )
        }
    ];
    //set style for dialoglists
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
                    minWidth: 400
                },
            },
        },

    };
    const [submiting, setSubmiting] = React.useState<boolean>(false)
    const submitFunction = async (): Promise<void> => {
        if(submiting) return
        setSubmiting(true)
        //const resultRequestor: IWebEnsureUserResult = await sp.web.ensureUser("i:0#.f|membership|" + userEmail);
        const jsonData: { [key: string]: object } = {};
        const templist = [];
        for (let i = 0; i < dialogitems.length; i++) {
            templist[i] = dialogitems[i];
            jsonData[i + 1] = dialogitems[i];
        }
        console.log("temp", jsonData)
        console.log("selectedReceiverID", selectedReceiverID)
        console.log("myEntity?.ID", myEntity?.ID)
        const request = {
            SenderId: myEntity?.ID,
            ReceivedByDate: DateValue,
            ReceiverId: selectedReceiverID,
            PartJSON: JSON.stringify(jsonData),
            DeliveryLocationandCountry: address

        }
        let promiss
        addRequest({ request }).then(promises => { console.log("promiss", promises, typeof (promises)); promiss = promises }).catch(err => console.log("err", err));
        console.log("typeof promises==='string'", typeof promiss === "string")
        if (typeof promiss !== "string") {
            setDialogContent((dialogContent) => ({ ...dialogContent, title: "", subText: "" }))
            setDialogButtonVisible(false)
        } else {
            setDialogContent((dialogContent) => ({ ...dialogContent, title: "Submit Failuer" }))
        }



    };
    const debouncedSubmitFunction = debounce(submitFunction, 1000); 

    const validateRequest = (): void => {
        const templist = [];
        let flag = true;
        setDialogVisible(false)

        sethinterrormessage(null);
        //console.log("listtemp1",templist)

        for (let i = 0; i < dialogitems.length; i++) {
            // console.log("会执行吗", !(/^\d+$/.test(dialogitems[i].Count)))
            if (!(/^\d+$/.test(dialogitems[i].PartQty)) && dialogitems[i].PartQty !== "") {
                sethinterrormessage("Only integer is allowed in Quantity field.")
                flag = false
                toggleHideDialog();
                break;


            }
        }
        //put setdialogitems after the validation of quantity. 
        if (flag) {
            for (let i = 0; i < dialogitems.length; i++) {
                if (/^\d+$/.test(dialogitems[i].PartQty) && dialogitems[i].PartQty !== "") {
                    templist.push(dialogitems[i])
                }
                setdialogitems(templist)
            }
        }
        setDialogContent((dialogContent) => ({ ...dialogContent, title: "", subText: '', }))
        // console.log("error", hinterrormessage)
        // console.log("flag", flag)
        // console.log("itemlength", dialogitems.length)
        //console.log("listtemp",templist)
        if (flag) {
            if (selectedReceiverType === null || selectedReceiverType === undefined || selectedReceiverName === null || selectedReceiverName === undefined) {
                sethinterrormessage("Please select Receiver.");
                setDialogVisible(false)
                toggleHideDialog();
                return
            } else if (dialogitems.length === 0) {
                sethinterrormessage("Please fill in at least one part quantity.");
                setDialogVisible(false)
                toggleHideDialog();
                return
            } else {
                sethinterrormessage(null);
                setDialogVisible(true)
                toggleHideDialog();
                setDialogContent((dialogContent) => ({ ...dialogContent, title: "Confirmation", subText: `The following ${dialogitems.length} part will be included:` }))
            }
        }

    };
    const stackClass = {
        marginTop: '10px'
    };

    return (
        <section>
            <Stack verticalAlign="center" horizontal style={{ backgroundColor: "rgba(0, 130, 155, 1)", height: 42 }}>
                <Label style={{ textAlign: 'left', width: 200, color: 'white', marginLeft: 8 ,fontSize:18}}> Outgoing</Label>
                {/* <Label style={{ fontFamily: '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif', color: 'white' }}> {myEntity?.Name}</Label> */}
            </Stack>
            <Stack verticalAlign="center" horizontal  style={{marginTop:5}}>
                <Label style={{ textAlign: 'left', width: 200, marginLeft: 8 }}> Request By:</Label>
                <Label style={{ fontFamily: '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif' }}> {myEntity?.Name}</Label>
            </Stack>
            <Stack verticalAlign="center" horizontal style={stackClass}>
                <Label style={{ textAlign: 'left', width: 200, marginLeft: 8 }}> Receiver:</Label>
                <Dropdown options={receiverTypeOptions}
                    placeholder="Select "
                    onChange={onChange}
                    styles={dropdownStyles}
                    selectedKey={selectedReceiverType ? selectedReceiverType.key : undefined}

                />
                <Dropdown
                    options={options}
                    styles={dropdownStyles}
                    placeholder="Select "
                    onChange={receiverNameonChange}
                    selectedKey={selectedReceiverName ? selectedReceiverName.key : undefined}
                />
            </Stack>
            <Stack verticalAlign="center" horizontal style={stackClass}>
                <Label style={{ textAlign: 'left', width: 200, marginLeft: 8 }}>
                    Date:</Label>
                <DatePicker
                    placeholder="Select date"
                    minDate={minDate}
                    value={minDate}
                    styles={datepickerStyles}
                    onSelectDate={(date) => {
                        console.log(date)
                        setDateValue(date);
                    }}
                />
            </Stack>
            <Stack verticalAlign="center" horizontal style={stackClass}>
                <Label style={{ textAlign: 'left', width: 200, marginLeft: 8 }}>
                    Address:
                </Label>
                <Label>
                    {address}
                </Label>
            </Stack>
            <hr />
            <Stack verticalAlign="center" horizontal style={stackClass}>
                <Label style={{ textAlign: 'left', width: 200, marginLeft: 8 }}>Filter: </Label>
                <TextField styles={{root: { width: 400 }}} style={{height: 25}} onChange={filterPartList} />
            </Stack>

            <DetailsList
                items={items}
                columns={columns}
                selectionMode={SelectionMode.none}
                //getKey={_getKey}
                setKey="PartID"
                layoutMode={DetailsListLayoutMode.justified}
                isHeaderVisible={true}
                onShouldVirtualize={() => false} />

            <Stack horizontal style={{ float: 'right', marginRight: 10, marginLeft: 8 }}>
                <DefaultButton onClick={() => {
                    //const returnUrl = window.location.href;
                    //`${ctx.context._pageContext._web.absoluteUrl}/sitepages/GI.aspx`;
                    //document.location.href = returnUrl.slice(0, returnUrl.indexOf("SitePage")) + "SitePage/Home.aspx"
                    document.location.href = `${ctx.context._pageContext._web.absoluteUrl}/sitepages/Home.aspx`;
                }} text="Cancel" className={styles.cancelbutton} />
                <PrimaryButton secondaryText="Opens the Sample Dialog" onClick={validateRequest} text="Submit" className={styles.submitbutton} />
                {/* //className={styles.submitbutton} */}
            </Stack>
            {dialogVisible ?
                <Dialog
                    hidden={hideDialog}
                    onDismiss={() => {
                        if (dialogButtonVisible) { toggleHideDialog() } else { document.location.href = `${ctx.context._pageContext._web.absoluteUrl}/sitepages/Home.aspx` }
                    }}
                    //{toggleHideDialog} //{() => { document.location.href = `${ctx.context._pageContext._web.absoluteUrl}/sitepages/Home.aspx` }}//modalProps
                    dialogContentProps={dialogContent}
                    modalProps={dialogmodalProps}
                >
                    {dialogButtonVisible ? <DetailsList
                        items={dialogitems}
                        columns={dialogcolumns}
                        selectionMode={SelectionMode.none}
                        layoutMode={DetailsListLayoutMode.justified}
                        isHeaderVisible={true}
                        onShouldVirtualize={() => false}
                        styles={gridStyles}
                    /> : (
                        <div style={{ height: '100px' }}>
                            <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                                <div style={{ marginRight: '10px', display: 'flex', alignItems: 'center' }}>
                                    <Submiticon />
                                </div>
                                Submitted!
                            </p>
                            <p style={{ fontSize: '14px', textAlign: 'center' }}>Submitted successfully! The request will be listed in some minutes.</p>
                        </div>
                    )


                    }
                    <DialogFooter styles={!dialogButtonVisible ? { actionsRight: { justifyContent: 'center' } } : {}}>
                        <DefaultButton onClick={() => { document.location.href = `${ctx.context._pageContext._web.absoluteUrl}/sitepages/Home.aspx` }} text="OK" style={{ display: !dialogButtonVisible ? 'block' : 'none' }} className={styles.dialogyesbutton} />
                        <DefaultButton onClick={toggleHideDialog} text="Cancel" style={{ display: dialogButtonVisible ? 'block' : 'none' }} className={styles.dialogcancelbutton} />
                        <PrimaryButton onClick={debouncedSubmitFunction} text="Yes" style={{ display: dialogButtonVisible ? 'block' : 'none' }} className={styles.dialogyesbutton} />
                    </DialogFooter>
                </Dialog>
                : <Dialog
                    dialogContentProps={dialogContent}
                    modalProps={modalProps}
                    hidden={hideDialog}
                    onDismiss={toggleHideDialog}>
                    {/* <div>
                        {hinterrormessage}
                    </div> */}
                    <div style={{ height: '100px' }}>
                        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                            <div style={{ marginRight: '10px', display: 'flex', alignItems: 'center' }}>
                                <Erroricon />
                            </div>
                            Error
                        </p>
                        <p style={{ fontSize: '14px', textAlign: 'center' }}>{hinterrormessage}</p>
                    </div>
                    <DialogFooter styles={{actionsRight: {justifyContent: 'center'}}}>
                        <PrimaryButton onClick={toggleHideDialog} text='OK' className={styles.dialogyesbutton} />
                    </DialogFooter>
                </Dialog>

            }
        </section>
    )
}
