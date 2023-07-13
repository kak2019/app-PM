import * as React from "react";
import { useEntities } from "../../../common/hooks";
import AppContext from "../../../common/AppContext";
//import { useControlledState } from "office-ui-fabric-react/lib/Foundation";
import { useConst } from '@fluentui/react-hooks';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { Label } from '@fluentui/react/lib/Label';
import { TextField } from 'office-ui-fabric-react';
import { REQUESTSCONST } from '../../../common/features/requests';
import { useContext, useEffect, useState } from "react";
import { DetailsList,  IColumn } from '@fluentui/react/lib/DetailsList';
import { getSP } from "../../../common/pnpjsConfig";
import { spfi } from "@pnp/sp";
import { Dropdown, IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import { DatePicker, addDays } from "office-ui-fabric-react";
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
    const today = useConst(new Date(Date.now()));
    const minDate = useConst(addDays(today, 0));
    const ctx = useContext(AppContext);
    const [DateValue, setDateValue] = React.useState<Date>(minDate);
    //const CurrentUserEmail = ctx.context._pageContext._user.email;
    const [selectedReceiverType, setSelectedReceiverType] = React.useState<IDropdownOption>();
    const [selectedReceiverName, setSelectedReceiverName] = React.useState<IDropdownOption>();
    const sp = spfi(getSP());
    const MappingterminalArray: string[] = []
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


    interface Iops {
        "text": string,
        "key": string
    }
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
        sp.web.lists.getByTitle("Entities").items.select("Name", "Country", "Address").filter("Name eq '" + targetID + "'").getAll().then(temp_Address => {
            setAddress(temp_Address[0].Name + ' ' + temp_Address[0].Country + ' ' + temp_Address[0].Address)
            console.log(temp_Address)

        }).catch(err => {
            console.log(err)
        })
    }

    const receiverNameonChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        setSelectedReceiverName(item);

        console.log("key", item.key.toString())

        getTargetAddress(item.text.toString())


    }

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
            onRender: (item: Iitem) => (
                <TextField key={item.PartID} value={item.PartQty}></TextField>
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

const filterPartList = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string) : void =>{
    setItems(
        newValue ? allItems.filter(i => (i.PartID.toLowerCase().indexOf(newValue) > -1) || (i.PartDescription.toLowerCase().indexOf(newValue.toLowerCase()) > -1)) : allItems,
    );
};
    return (
        <section>
            <Stack verticalAlign="center" horizontal>
                <Label> Request By:</Label>
                <Label> {myEntity?.Name}</Label>
            </Stack>
            <Stack><Label> Receiver:</Label>
                <Dropdown options={receiverTypeOptions}
                    placeholder="Select type"
                    onChange={onChange}
                    selectedKey={selectedReceiverType ? selectedReceiverType.key : undefined}

                />
                <Dropdown
                    options={options}
                    placeholder="Select type"
                    onChange={receiverNameonChange}

                />
            </Stack>
            <Stack>
                <Label>
                    Date Needed:
                </Label>
                <DatePicker
                    placeholder="Select date"
                    minDate={minDate}
                    value={minDate}
                    onSelectDate={(date) => {
                        console.log(date)
                        setDateValue(date);
                    }}
                />
            </Stack>
            <Stack>
                <Label>
                    Delevery Address:
                </Label>
                <Label>
                    {address}
                </Label>
            </Stack>
            <Stack  >
                <Label style={{ textAlign: 'left', width: 200 }}>Filter by Emballage Number:</Label><TextField 
                onChange={filterPartList}
                />
            </Stack>

            <DetailsList items={items} columns={columns}
            />


        </section>
    )
}
