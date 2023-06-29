import { createAsyncThunk } from "@reduxjs/toolkit";
import { FeatureKey } from "../../featureKey";
import { spfi } from "@pnp/sp";
import { getSP } from "../../pnpjsConfig";
import { IEntitiesListItem } from "../../model";
import { ENTITIESCONST, EntitiesType } from './entitiesSlice';

// Thunk function
export const fetchMyEntityAction = createAsyncThunk(
  `${FeatureKey.ENTITIES}/fetchMyEntity`,
  async () => {
    try {
      const sp = spfi(getSP());
      const result: IEntitiesListItem = await sp.web.lists
        .getByTitle(ENTITIESCONST.LIST_NAME)
        .renderListDataAsStream({
          ViewXml: `<View>
                    <Query>
                        <Where>
                            <Eq>
                                <FieldRef Name="Users"/>
                                <Value Type="Integer">
                                    <UserID />
                                </Value>
                            </Eq>
                        </Where>
                    </Query>
                    <ViewFields>
                        <FieldRef Name="Title"></FieldRef>
                        <FieldRef Name="Name"></FieldRef>
                        <FieldRef Name="Type"></FieldRef>
                        <FieldRef Name="Address"></FieldRef>
                        <FieldRef Name="Country"></FieldRef>
                        <FieldRef Name="Users"></FieldRef>
                    </ViewFields>
                    <RowLimit>1</RowLimit>
                </View>`,
        })
        .then(
          (response) =>
            ({
              ID: response.Row[0].ID,
              Title: response.Row[0].Title,
              Name: response.Row[0].Name,
              Type: response.Row[0].Type,
              Address: response.Row[0].Address,
              Country: response.Row[0].Country,
              Users: JSON.stringify(response.Row[0].Users),
            } as IEntitiesListItem)
        );
      return result;
    } catch (err) {
      console.log(err);
      return Promise.reject("Error when fetch my entity.");
    }
  }
);
export const fetchEntitiesByTypeAction = createAsyncThunk(
  `${FeatureKey.ENTITIES}/fetchEntitiesByType`,
  async (arg: { type: EntitiesType }) => {
    try {
      const sp = spfi(getSP());
      const result: IEntitiesListItem[] = await sp.web.lists
        .getByTitle(ENTITIESCONST.LIST_NAME)
        .renderListDataAsStream({
          ViewXml: `<View>
          <Query>
              <Where>
                  <Eq>
                      <FieldRef Name="Type"/>
                      <Value Type="Text">${arg.type}</Value>
                  </Eq>
              </Where>
          </Query>
          <ViewFields>
            <FieldRef Name="Title"></FieldRef>
            <FieldRef Name="Name"></FieldRef>
            <FieldRef Name="Type"></FieldRef>
            <FieldRef Name="Address"></FieldRef>
            <FieldRef Name="Country"></FieldRef>    
            <FieldRef Name="Users"></FieldRef>
          </ViewFields>
      </View>`,
        })
        .then((response) =>
          response.Row.map(
            (item) =>
              ({
                ID: item.ID,
                Title: item.Title,
                Name: item.Name,
                Type: item.Type,
                Address: item.Address,
                Country: item.Country,
                Users: JSON.stringify(item.Users),
              } as IEntitiesListItem)
          )
        );
      return result;
    } catch (err) {
      console.log(err);
      return Promise.reject("Error when fetch all entities by type.");
    }
  }
);
