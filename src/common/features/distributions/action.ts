import { IDistributionListItem } from "../../model";
import { spfi } from "@pnp/sp";
import { getSP } from "../../pnpjsConfig";
import { DISTRIBUTIONCONST } from "./distributionsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { FeatureKey } from "../../featureKey";

const fetchById = async (arg: { Id: number }): Promise<IDistributionListItem> => {
    const sp = spfi(getSP());
    try {
        const item = await sp.web.lists.getByTitle(DISTRIBUTIONCONST.LIST_NAME).renderListDataAsStream({
            ViewXml: `<View>
                      <Query>
                        <Where>
                          <Eq>
                            <FieldRef Name="ID"/>
                            <Value Type="Text">${arg.Id}</Value>
                          </Eq>
                        </Where>
                      </Query>
                      <ViewFields>
                        <FieldRef Name="Title"/>
                        <FieldRef Name="DistributionNumber"/>
                        <FieldRef Name="Sender"/>
                        <FieldRef Name="Sender_x003a__x0020_Name"/>
                        <FieldRef Name="Receiver"/>
                        <FieldRef Name="Receiver_x003a__x0020_Name"/>
                        <FieldRef Name="PartNumber"/>
                        <FieldRef Name="PartDescription"/>
                        <FieldRef Name="Quantity"/>
                        <FieldRef Name="ReceivedByDate"/>
                        <FieldRef Name="DeliveryLocationAndCountry"/>
                        <FieldRef Name="Status"/>
                        <FieldRef Name="StatusUpdatedBy"/>
                        <FieldRef Name="ConfirmationFromReceiver"/>
                        <FieldRef Name="Field1"/>
                        <FieldRef Name="Field2"/>
                      </ViewFields>
                      <RowLimit>1</RowLimit>
                    </View>`
        }).then((response) => {
            if (response.Row.length > 0) {
                return {
                    ID: response.Row[0].ID,
                    Title: response.Row[0].Title,
                    DistributionNumber: response.Row[0].DistributionNumber,
                    Sender: JSON.stringify(response.Row[0].Sender),
                    Sender_x003a__x0020_Name: response.Row[0].Sender_x0031_x0020_Name,
                    Receiver: JSON.stringify(response.Row[0].Receiver),
                    Receiver_x003a__x0020_Name: response.Row[0].Receiver_x003a__x0020_Name,
                    PartNumber: response.Row[0].PartNumber,
                    PartDescription: response.Row[0].PartDescription,
                    Quantity: response.Row[0].Quantity,
                    ReceivedByDate: response.Row[0].ReceivedByDate,
                    DeliveryLocationAndCountry: response.Row[0].DeliveryLocationAndCountry,
                    Status: response.Row[0].Status,
                    StatusUpdatedBy: JSON.stringify(response.Row[0].StatusUpdatedBy),
                    ConfirmationFromReceiver: response.Row[0].ConfirmationFromReceiver === "Yes",
                    Field1: response.Row[0].Field1,
                    Field2: response.Row[0].Field2
                } as IDistributionListItem;
            }
        }).catch((e) => {
            console.log(e);
            return null;
        });
        return item;
    } catch (err) {
        console.log(err);
        return Promise.reject("Error when fetch request by Id");
    }
};
const fetchBySender = async (arg: {
    Sender: string;
}): Promise<IDistributionListItem[]> => {
    const sp = spfi(getSP());
    try {
        const result = await sp.web.lists
            .getByTitle(DISTRIBUTIONCONST.LIST_NAME)
            .renderListDataAsStream({
                ViewXml: `<View>
	                        <Query>
		                        <Where>
			                        <Eq>
				                        <FieldRef Name="Sender"/>
				                        <Value Type="Text">${arg.Sender}</Value>
			                        </Eq>
		                        </Where>
	                        </Query>
	                        <ViewFields>
		                        <FieldRef Name="Title"/>
		                        <FieldRef Name="DistributionNumber"/>
		                        <FieldRef Name="Sender"/>
		                        <FieldRef Name="Sender_x003a__x0020_Name"/>
		                        <FieldRef Name="Receiver"/>
		                        <FieldRef Name="Receiver_x003a__x0020_Name"/>
		                        <FieldRef Name="PartNumber"/>
		                        <FieldRef Name="PartDescription"/>
		                        <FieldRef Name="Quantity"/>
		                        <FieldRef Name="ReceivedByDate"/>
		                        <FieldRef Name="DeliveryLocationAndCountry"/>
		                        <FieldRef Name="Status"/>
		                        <FieldRef Name="StatusUpdatedBy"/>
		                        <FieldRef Name="ConfirmationFromReceiver"/>
		                        <FieldRef Name="Field1"/>
		                        <FieldRef Name="Field2"/>
	                        </ViewFields>
	                        <RowLimit>5000</RowLimit>
                        </View>`
            })
            .then((response) => {
                if (response.Row.length > 0) {
                    return response.Row.map(
                        (item) =>
                        ({
                            ID: item.ID,
                            Title: item.Title,
                            DistributionNumber: item.DistributionNumber,
                            Sender: JSON.stringify(item.Sender),
                            Sender_x003a__x0020_Name: item.Sender_x003a__x0020_Name,
                            Receiver: JSON.stringify(item.Receiver),
                            Receiver_x003a__x0020_Name: item.Receiver_x003a__x0020_Name,
                            PartNumber: item.PartNumber,
                            PartDescription: item.PartDescription,
                            Quantity: item.Quantity,
                            ReceivedByDate: item.ReceivedByDate,
                            DeliveryLocationAndCountry: item.DeliveryLocationAndCountry,
                            Status: item.Status,
                            StatusUpdatedBy: JSON.stringify(item.StatusUpdatedBy),
                            ConfirmationFromReceiver: item.ConfirmationFromReceiver === "Yes",
                            Field1: item.Field1,
                            Field2: item.Field2
                        } as IDistributionListItem)
                    );
                }
            }).catch((e) => {
                console.log(e);
                return null;
            });
        return result;
    } catch (err) {
        console.log(err);
        return Promise.reject("Error when fetch request by Sender")
    }
};
const fetchListId = async (): Promise<string> => {
    const sp = spfi(getSP());
    try {
        const r = await sp.web.lists
            .getByTitle(DISTRIBUTIONCONST.LIST_NAME)
            .select("Id")();

        return r.Id;
    } catch (err) {
        console.log(err);
        return Promise.reject("Error when fetch Distribution list id")
    }
};
const editDistribution = async (arg: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    distribution: any;
}): Promise<IDistributionListItem> => {
    const { distribution } = arg;
    const sp = spfi(getSP());
    try {
        const list = sp.web.lists.getByTitle(DISTRIBUTIONCONST.LIST_NAME);
        await list.items.getById(+distribution.ID).update(distribution);
        const result = await fetchById({ Id: +distribution.ID });
        return result;
    } catch (err) {
        console.log(err);
        return Promise.reject("Error when edit distribution");
    }
};
const addDistribution = async (arg: {
    distribution: IDistributionListItem;
}): Promise<IDistributionListItem> => {
    const { distribution } = arg;
    let StatusUpdatedById = "";
    if (distribution.StatusUpdatedBy?.length > 0) {
        try {
            StatusUpdatedById = JSON.parse(distribution.StatusUpdatedBy)[0].id;
        } catch (e) {
            console.log(e);
        }
    }
    const distributionForAdd = {
        ...distribution,
        StatusUpdatedById
    };
    delete distributionForAdd.StatusUpdatedBy;
    if (distributionForAdd.StatusUpdatedById === "")
        delete distributionForAdd.StatusUpdatedById;

    const sp = spfi(getSP());
    try {
        const list = sp.web.lists.getByTitle(DISTRIBUTIONCONST.LIST_NAME);
        const distributionNew: IDistributionListItem = await list.items.add(distributionForAdd)
            .then((r) => r.data as IDistributionListItem)
            .catch((e) => {
                console.log(e);
                return null;
            });
        if (distributionNew !== undefined && distributionNew !== null) {
            const titleStr = "PM Request - " + ("000000" + distributionNew.ID).slice(-6);
            const result2 = await editDistribution({
                distribution: { ID: distributionNew.ID, Title: titleStr }
            });

            return result2;
        }
        throw new Error("Payload Error");
    } catch (err) {
        console.log(err);
        return Promise.reject("Error when add request");
    }
};

//Thunk function
export const fetchByIdAction = createAsyncThunk(
    `${FeatureKey.DISTRIBUTIONS}/fetchById`,
    fetchById
);
export const fetchBySenderAction = createAsyncThunk(
    `${FeatureKey.DISTRIBUTIONS}/fetchBySender`,
    fetchBySender
);
export const fetchDistributionListIdAction = createAsyncThunk(
    `${FeatureKey.DISTRIBUTIONS}/fetchListId`,
    fetchListId
);
export const editDistributionAction = createAsyncThunk(
    `${FeatureKey.DISTRIBUTIONS}/editDistribution`,
    editDistribution
);
export const addDistributionAction = createAsyncThunk(
    `${FeatureKey.DISTRIBUTIONS}/addDistribution`,
    addDistribution
);