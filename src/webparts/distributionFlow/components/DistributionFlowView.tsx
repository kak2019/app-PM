import * as React from "react";
import { useEntities } from "../../../common/hooks";
import AppContext from "../../../common/AppContext";
//import { useControlledState } from "office-ui-fabric-react/lib/Foundation";
import { useConst } from '@fluentui/react-hooks';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { Label } from '@fluentui/react/lib/Label';
import { DefaultButton, DetailsListLayoutMode, PrimaryButton, TextField } from 'office-ui-fabric-react';
import { REQUESTSCONST } from '../../../common/features/requests';
import { useContext, useEffect, useState } from "react";
import { DetailsList, IColumn, SelectionMode } from '@fluentui/react/lib/DetailsList';
import { getSP } from "../../../common/pnpjsConfig";
import { spfi } from "@pnp/sp";
import { Dropdown, IDropdownOption, IDropdownStyles } from "office-ui-fabric-react/lib/Dropdown";

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import { DatePicker, addDays, IDatePickerStyles } from "office-ui-fabric-react";
import { addRequest } from "./distributionFlowUtil/distributionFlow";
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { useId, useBoolean } from '@fluentui/react-hooks';
interface Iitem {
    "PartID": string,
    "PartDescription": string,
    "PartQty"?: string
}
interface IDistributionMapping {
    "PMSender": { "Name": string },
    "PMReceiver": [{ "Name": string, "ID": string }],
    "PMReceiverType": string

}

export default function DistributionFlowView(): JSX.Element {


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
    const dialogStyles = { main: { maxWidth: 450 } };
    const labelId: string = useId('dialogLabel');
    const subTextId: string = useId('subTextLabel');
    const modalProps = React.useMemo(
        () => ({
            titleAriaId: labelId,
            subtitleAriaId: subTextId,
            isBlocking: false,
            styles: dialogStyles,

        }),
        [labelId, subTextId],
    );
    const [dialogContent, setDialogContent] = React.useState({
        type: DialogType.normal,
        title: 'Please confirm',
        closeButtonAriaLabel: 'Close',
        subText: 'confirmation of the request content',
    });
    const [dialogButtonVisible, setDialogButtonVisible] = React.useState<boolean>(true);
    const [dialogVisible, setDialogVisible] = React.useState<boolean>(false);
    const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);


    interface Iops {
        "text": string,
        "key": string
    }
    //styles
    const dropdownStyles: Partial<IDropdownStyles> = {
        dropdown: { width: 200 },
    };
    const datepickerStyles: Partial<IDatePickerStyles> = {
        root: { width: 400 }
    };
    const stackClass = {
        marginTop: '10px'
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
            name: 'Part Qty',
            isIconOnly: false,
            fieldName: 'name',
            minWidth: 200,
            maxWidth: 200,
            onRender: (item: Iitem, i: number) => (
                <TextField key={item.PartID} value={item.PartQty} onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => onChangePartQty(event, newValue, item.PartID)} />
            )
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
    const filterPartInfo = (): void => {
        const list = allItems.filter(i => i.PartQty !== undefined && i.PartQty !== "")
        console.log(list)
        setdialogitems(list)
        console.log("dialogitems", dialogitems, dialogitems.length)

    }

    useEffect(() => {
        filterPartInfo()
    }, [allItems])


    const submitFunction = async (): Promise<void> => {

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
            setDialogContent((dialogContent) => ({ ...dialogContent, title: "Submit successfully", subText: "The request will be listed in some minutes." }))
            setDialogButtonVisible(false)
        } else {
            setDialogContent((dialogContent) => ({ ...dialogContent, title: "Submit Failuer" }))
        }



    };

    const validateRequest = (): void => {
        const templist = [];
        let flag = true;
        setDialogVisible(false)
        for (let i = 0; i < dialogitems.length; i++) {
            if (/^\d+$/.test(dialogitems[i].PartQty) && dialogitems[i].PartQty !== "") {
                templist.push(dialogitems[i])
            }
            setdialogitems(templist)
        }
        sethinterrormessage(null);
        // console.log("listtemp1",templist)

        for (let i = 0; i < dialogitems.length; i++) {
            // console.log("会执行吗", !(/^\d+$/.test(dialogitems[i].Count)))
            if (!(/^\d+$/.test(dialogitems[i].PartQty)) && dialogitems[i].PartQty !== "") {
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
            if (selectedReceiverType === null || selectedReceiverType === undefined) {
                sethinterrormessage("Please check if Receiver is selected");
                setDialogVisible(false)
                toggleHideDialog();
                return
            } else if (dialogitems.length === 0) {
                sethinterrormessage("Please fill in at least one part of the information");
                setDialogVisible(false)
                toggleHideDialog();
                return
            } else {
                sethinterrormessage(null);
                setDialogVisible(true)
                toggleHideDialog();
            }
        }
    }

    return (
        <section>
            <Stack verticalAlign="center" horizontal>
                <Label style={{ textAlign: 'left', width: 200 }}> Request By:</Label>
                <Label style={{ fontFamily: '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif' }}> {myEntity?.Name}</Label>
            </Stack>
            <Stack verticalAlign="center" horizontal style={stackClass}>
                <Label style={{ textAlign: 'left', width: 200 }}> Receiver:</Label>
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

                />
            </Stack>
            <Stack verticalAlign="center" horizontal style={stackClass}>
                <Label style={{ textAlign: 'left', width: 200 }}>
                    Date Needed:
                </Label>
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
                <Label style={{ textAlign: 'left', width: 200 }}>
                    Delevery Address:
                </Label>
                <Label>
                    {address}
                </Label>
            </Stack>
            <Stack verticalAlign="center" horizontal style={stackClass}>
                <Label style={{ textAlign: 'left', width: 200 }}>Filter by Emballage Number:</Label>
                <TextField style={{ width: 400, height: 25 }} onChange={filterPartList} />
            </Stack>

            <DetailsList
                items={items}
                columns={columns}
                selectionMode={SelectionMode.none}
                layoutMode={DetailsListLayoutMode.justified}
                isHeaderVisible={true}
                onShouldVirtualize={() => false} />

            <Stack horizontal style={{ float: 'right', marginRight: 10 }}>
                <PrimaryButton secondaryText="Opens the Sample Dialog" onClick={validateRequest} text="Submit" style={{ marginRight: 10 }} />
                <DefaultButton onClick={() => {
                    //const returnUrl = window.location.href;
                    //`${ctx.context._pageContext._web.absoluteUrl}/sitepages/GI.aspx`;
                    //document.location.href = returnUrl.slice(0, returnUrl.indexOf("SitePage")) + "SitePage/Home.aspx"
                    document.location.href = `${ctx.context._pageContext._web.absoluteUrl}/sitepages/Home.aspx`;
                }} text="Cancel" />
            </Stack>
            {dialogVisible ?
                <Dialog
                    hidden={hideDialog}
                    onDismiss={() => { document.location.href = `${ctx.context._pageContext._web.absoluteUrl}/sitepages/Home.aspx` }}
                    dialogContentProps={dialogContent}
                    modalProps={modalProps}>
                    {dialogButtonVisible && dialogitems.map((item: Iitem) =>
                        <div key={item.PartID}>
                            <ul style={{ paddingInlineStart: 0 }}>{item.PartID}{","} {item.PartDescription}{","} {item.PartQty}</ul>
                        </div>
                    )}
                    <DialogFooter>
                        <DefaultButton onClick={() => { document.location.href = `${ctx.context._pageContext._web.absoluteUrl}/sitepages/Home.aspx` }} text="OK" style={{ display: !dialogButtonVisible ? 'block' : 'none' }} />
                        <PrimaryButton onClick={submitFunction} text="Yes" style={{ display: dialogButtonVisible ? 'block' : 'none' }} />
                        <DefaultButton onClick={toggleHideDialog} text="Cancel" style={{ display: dialogButtonVisible ? 'block' : 'none' }} />
                    </DialogFooter>
                </Dialog>
                : <Dialog
                    dialogContentProps={dialogContent}
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
