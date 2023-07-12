import { spfi } from "@pnp/sp";
import { IRequestListItem } from "../../model";
import { getSP } from "../../pnpjsConfig";
import { REQUESTSCONST } from "./requestsSlice";
import { FeatureKey } from "../../featureKey";
import { createAsyncThunk } from "@reduxjs/toolkit";

const fetchById = async (arg: { Id: number }): Promise<IRequestListItem> => {
  const sp = spfi(getSP());
  try {
    const item = await sp.web.lists
      .getByTitle(REQUESTSCONST.LIST_NAME)
      .renderListDataAsStream({
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
                        <FieldRef Name="RequestNumber"/>
                        <FieldRef Name="RequesterId"/>
                        <FieldRef Name="RequesterId_x003a_Name"/>
                        <FieldRef Name="Requestor"/>
                        <FieldRef Name="TerminalId"/>
                        <FieldRef Name="TerminalId_x003a_Name"/>
                        <FieldRef Name="PartID"/>
                        <FieldRef Name="PartDescription"/>
                        <FieldRef Name="Quantity"/>
                        <FieldRef Name="DateNeeded"/>
                        <FieldRef Name="DeliveryLocationAndCountry"/>
                        <FieldRef Name="HowMuchCanBeFullfilled"/>
                        <FieldRef Name="Status"/>
                        <FieldRef Name="FullOrPartialFilled"/>
                        <FieldRef Name="StatusUpdateBy"/>
                        <FieldRef Name="QtySent"/>
                        <FieldRef Name="DateByWhenItWillReach"/>
                        <FieldRef Name="ConfirmationFromSupplier"/>
                        <FieldRef Name="Field1"/>
                        <FieldRef Name="Field2"/>
                      </ViewFields>
                      <RowLimit>1</RowLimit>
                    </View>`,
      })
      .then((response) => {
        if (response.Row.length > 0) {
          return {
            ID: response.Row[0].ID,
            Title: response.Row[0].Title,
            RequestNumber: response.Row[0].RequestNumber,
            RequesterId: JSON.stringify(response.Row[0].RequesterId),
            RequesterId_x003a_Name: response.Row[0].RequesterId_x003a_Name,
            Requestor: JSON.stringify(response.Row[0].Requestor),
            TerminalId: JSON.stringify(response.Row[0].TerminalId),
            TerminalId_x003a_Name: response.Row[0].TerminalId_x003a_Name,
            PartID: response.Row[0].PartID,
            PartDescription: response.Row[0].PartDescription,
            Quantity: response.Row[0].Quantity,
            DateNeeded: response.Row[0].DateNeeded,
            DeliveryLocationAndCountry:
              response.Row[0].DeliveryLocationAndCountry,
            HowMuchCanBeFullfilled: response.Row[0].HowMuchCanBeFullfilled,
            Status: response.Row[0].Status,
            FullOrPartialFilled: response.Row[0].FullOrPartialFilled,
            StatusUpdateBy: JSON.stringify(response.Row[0].StatusUpdateBy),
            QtySent: response.Row[0].QtySent,
            DateByWhenItWillReach: response.Row[0].DateByWhenItWillReach,
            ConfirmationFromSupplier: response.Row[0].ConfirmationFromSupplier==="Yes",
            Field1: response.Row[0].Field1,
            Field2: response.Row[0].Field2,
          } as IRequestListItem;
        }
      })
    return item;
  } catch (err) {
    console.log(err);
    return Promise.reject("Error when fetch request by Id");
  }
};
const fetchByTerminalId = async (arg: {
  TerminalId: string;
}): Promise<IRequestListItem[]> => {
  const sp = spfi(getSP());
  try {
    const result = await sp.web.lists
      .getByTitle(REQUESTSCONST.LIST_NAME)
      .renderListDataAsStream({
        ViewXml: `<View>
                        <Query>
                          <Where>
                            <Eq>
                              <FieldRef Name="TerminalId"/>
                              <Value Type="Text">${arg.TerminalId}</Value>
                            </Eq>
                          </Where>
                        </Query>
                        <ViewFields>
                          <FieldRef Name="Title"/>
                          <FieldRef Name="RequestNumber"/>
                          <FieldRef Name="RequesterId"/>
                          <FieldRef Name="RequesterId_x003a_Name"/>
                          <FieldRef Name="Requestor"/>
                          <FieldRef Name="TerminalId"/>
                          <FieldRef Name="TerminalId_x003a_Name"/>
                          <FieldRef Name="PartID"/>
                          <FieldRef Name="PartDescription"/>
                          <FieldRef Name="Quantity"/>
                          <FieldRef Name="DateNeeded"/>
                          <FieldRef Name="DeliveryLocationAndCountry"/>
                          <FieldRef Name="HowMuchCanBeFullfilled"/>
                          <FieldRef Name="Status"/>
                          <FieldRef Name="FullOrPartialFilled"/>
                          <FieldRef Name="StatusUpdateBy"/>
                          <FieldRef Name="QtySent"/>
                          <FieldRef Name="DateByWhenItWillReach"/>
                          <FieldRef Name="ConfirmationFromSupplier"/>
                          <FieldRef Name="Field1"/>
                          <FieldRef Name="Field2"/>
                        </ViewFields>
                        <RowLimit>5000</RowLimit>
                      </View>`,
      })
      .then((response) => {
        if (response.Row.length > 0) {
          return response.Row.map(
            (item) =>
              ({
                ID: item.ID,
                Title: item.Title,
                RequestNumber: item.RequestNumber,
                RequesterId: JSON.stringify(item.RequesterId),
                RequesterId_x003a_Name: item.RequesterId_x003a_Name,
                Requestor: JSON.stringify(item.Requestor),
                TerminalId: JSON.stringify(item.TerminalId),
                TerminalId_x003a_Name: item.TerminalId_x003a_Name,
                PartID: item.PartID,
                PartDescription: item.PartDescription,
                Quantity: item.Quantity,
                DateNeeded: item.DateNeeded,
                DeliveryLocationAndCountry: item.DeliveryLocationAndCountry,
                HowMuchCanBeFullfilled: item.HowMuchCanBeFullfilled,
                Status: item.Status,
                FullOrPartialFilled: item.FullOrPartialFilled,
                StatusUpdateBy: JSON.stringify(item.StatusUpdateBy),
                QtySent: item.QtySent,
                DateByWhenItWillReach: item.DateByWhenItWillReach,
                ConfirmationFromSupplier: item.ConfirmationFromSupplier==="Yes",
                Field1: item.Field1,
                Field2: item.Field2,
              } as IRequestListItem)
          );
        }
      })
    return result;
  } catch (err) {
    console.log(err);
    return Promise.reject("Error when fetch request by TermialId");
  }
};
const fetchListId = async (): Promise<string> => {
  const sp = spfi(getSP());
  try {
    const r = await sp.web.lists
      .getByTitle(REQUESTSCONST.LIST_NAME)
      .select("Id")();

    return r.Id;
  } catch (err) {
    console.log(err);
    return Promise.reject("Error when fetch request list id");
  }
};
const editRequest = async (arg: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request: any;
}): Promise<IRequestListItem> => {
  const { request } = arg;
  const sp = spfi(getSP());
  try {
    const list = sp.web.lists.getByTitle(REQUESTSCONST.LIST_NAME);
    await list.items.getById(+request.ID).update(request);
    const result = await fetchById({ Id: +request.ID });
    return result;
  } catch (err) {
    console.log(err);
    return Promise.reject("Error when edit request");
  }
};
const addRequest = async (arg: {
  request: IRequestListItem;
}): Promise<IRequestListItem> => {
  const { request } = arg;
  let RequestorId = "";
  let StatusUpdateById = "";

  if (request.Requestor?.length > 0) {
    try {
      RequestorId = JSON.parse(request.Requestor)[0].id;
    } catch (e) {
      console.log(e);
    }
  }
  if (request.StatusUpdateBy?.length > 0) {
    try {
      StatusUpdateById = JSON.parse(request.StatusUpdateBy)[0].id;
    } catch (e) {
      console.log(e);
    }
  }

  const requestForAdd = {
    ...request,
    RequestorId,
    StatusUpdateById,
  };
  delete requestForAdd.Requestor;
  delete requestForAdd.StatusUpdateBy;
  if (requestForAdd.RequestorId === "") delete requestForAdd.RequestorId;
  if (requestForAdd.StatusUpdateById === "")
    delete requestForAdd.StatusUpdateById;

  const sp = spfi(getSP());
  try {
    const list = sp.web.lists.getByTitle(REQUESTSCONST.LIST_NAME);
    const requestNew: IRequestListItem = await list.items
      .add(requestForAdd)
      .then((r) => r.data as IRequestListItem)
      .catch((e) => {
        console.log(e);
        return null;
      });
    if (requestNew !== undefined && requestNew !== null) {
      const titleStr = "PM Request - " + ("000000" + requestNew.ID).slice(-6);
      const result2 = await editRequest({
        request: { ID: requestNew.ID, Title: titleStr },
      });

      return result2;
    }
    throw new Error("Payload Error");
  } catch (err) {
    console.log(err);
    return Promise.reject("Error when add request");
  }
};

// Thunk function
export const fetchByIdAction = createAsyncThunk(
  `${FeatureKey.REQUESTS}/fetchById`,
  fetchById
);
export const fetchByTermialIdAction = createAsyncThunk(
  `${FeatureKey.REQUESTS}/fetchByTerminalId`,
  fetchByTerminalId
);

export const fetchRequestListIdAction = createAsyncThunk(
  `${FeatureKey.REQUESTS}/fetchListId`,
  fetchListId
);

export const addRequestAction = createAsyncThunk(
  `${FeatureKey.REQUESTS}/add`,
  addRequest
);

export const editRequestAction = createAsyncThunk(
  `${FeatureKey.REQUESTS}/edit`,
  editRequest
);
