import { IEntitiesListItem } from "../../model";

export enum EntitiesStatus {
    Idle,
    Loading,
    Failed,
}

export type EntitiesType ="Supplier" | "Terminal" | "Factory" | "KD_Factory" | "EX_WH";

export const ENTITIESCONST = Object.freeze({
    LIST_NAME: "Entities",
});

export interface IEntitiesState {
    status: EntitiesStatus;
    message: string;
    type: EntitiesType | undefined;
    items: IEntitiesListItem[];
    myentity:IEntitiesListItem;
    groups:string[];
}

export const initialState: IEntitiesState = {
    status: EntitiesStatus.Idle,
    message:"",
    type:undefined,
    items:[],
    myentity:null,
    groups:[]
}