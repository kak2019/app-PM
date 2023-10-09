import { IRequestListItem } from "../../model";

export enum RequestStatus {
  Idle,
  Loading,
  Failed,
}
/* Partlist
 PART_LIST: [

    { PartID: "1", PartDescription: "PALLET OF WOOD, TYPE L" },
    { PartID: "2", PartDescription: "PALLET OF WOOD, TYPE K" },
    { PartID: "5", PartDescription: "PALLET OF WOOD, TYPE F" },
    { PartID: "6", PartDescription: "PALLET OF WOOD, TYPE G" },
    { PartID: "9", PartDescription: "PALLET OF WOOD, TYPE H" },
    { PartID: "21", PartDescription: "FRAME OF WOOD, TYPE L" },
    { PartID: "22", PartDescription: "FRAME OF WOOD, TYPE K" },
    { PartID: "25", PartDescription: "FRAME OF WOOD, TYPE F" },
    { PartID: "26", PartDescription: "FRAME OF WOOD, TYPE G" },
    { PartID: "29", PartDescription: "FRAME OF WOOD, TYPE H" },
    { PartID: "61", PartDescription: "SPACER OF WOOD FIBRE, L INNER" },
    { PartID: "62", PartDescription: "SPACER OF WOOD FIBRE, K INNER" },
    { PartID: "65", PartDescription: "SPACER OF WOOD FIBRE, F INNER" },
    { PartID: "66", PartDescription: "SPACER OF WOOD FIBRE, G INNER" },
    { PartID: "69", PartDescription: "SPACER OF WOOD FIBRE, H INNER" },
    { PartID: "71", PartDescription: "LID OF PLYWOOD, TYPE L" },
    { PartID: "72", PartDescription: "LID OF PLYWOOD, TYPE K" },
    { PartID: "75", PartDescription: "LID OF PLYWOOD, TYPE F" },
    { PartID: "76", PartDescription: "LID OF PLYWOOD, TYPE G" },
    { PartID: "79", PartDescription: "LID OF PLYWOOD, TYPE H" },
    { PartID: "81", PartDescription: "SPACER OF PLASTIC, L INNER" },
    { PartID: "82", PartDescription: "SPACER OF PLASTIC, K INNER" },
    { PartID: "116", PartDescription: "FIXING SPACER OF PLASTIC" },
    { PartID: "460", PartDescription: "BOX OF PLASTIC (ESD)" },
    { PartID: "461", PartDescription: "LID OF PLASTIC (ESD)" },
    { PartID: "500", PartDescription: "BOX OF PLASTIC" },
    { PartID: "501", PartDescription: "LID OF PLASTIC" },
    { PartID: "701", PartDescription: "PALLET OF WOOD" },
    { PartID: "702", PartDescription: "FRAME OF WOOD" },
    { PartID: "706", PartDescription: "LID OF PLYWOOD" },
    { PartID: "724", PartDescription: "PALLET OF WOOD" },
    { PartID: "725", PartDescription: "FRAME OF WOOD" },
    { PartID: "726", PartDescription: "LID OF PLYWOOD  ( 2 PARTS )" },
    { PartID: "750", PartDescription: "BOX OF PLASTIC" },
    { PartID: "751", PartDescription: "LID OF PLASTIC" },
    { PartID: "780", PartDescription: "BOX OF PLASTIC" },
    { PartID: "781", PartDescription: "LID OF PLASTIC" },
    { PartID: "840", PartDescription: "BOX OF PLASTIC" },
    { PartID: "841", PartDescription: "LID OF PLASTIC FOR EMB 840" }
  ],*/
export const REQUESTSCONST = Object.freeze({
  LIST_NAME: "Incoming Bundle List",
  PART_LIST: [
    { PartID: "1", PartDescription: "PALLET OF WOOD, TYPE L" },
    { PartID: "21", PartDescription: "FRAME OF WOOD, TYPE L" },
    { PartID: "61", PartDescription: "SPACER OF WOOD FIBRE, L INNER" },
    { PartID: "71", PartDescription: "LID OF PLYWOOD, TYPE L" },
    { PartID: "2", PartDescription: "PALLET OF WOOD, TYPE K" },
    { PartID: "22", PartDescription: "FRAME OF WOOD, TYPE K" },
    { PartID: "62", PartDescription: "SPACER OF WOOD FIBRE, K INNER" },
    { PartID: "72", PartDescription: "LID OF PLYWOOD, TYPE K" },
    { PartID: "5", PartDescription: "PALLET OF WOOD, TYPE F" },
    { PartID: "25", PartDescription: "FRAME OF WOOD, TYPE F" },
    { PartID: "65", PartDescription: "SPACER OF WOOD FIBRE, F INNER" },
    { PartID: "75", PartDescription: "LID OF PLYWOOD, TYPE F" },
    { PartID: "6", PartDescription: "PALLET OF WOOD, TYPE G" },
    { PartID: "26", PartDescription: "FRAME OF WOOD, TYPE G" },
    { PartID: "66", PartDescription: "SPACER OF WOOD FIBRE, G INNER" },
    { PartID: "76", PartDescription: "LID OF PLYWOOD, TYPE G" },
    { PartID: "9", PartDescription: "PALLET OF WOOD, TYPE H" },
    { PartID: "29", PartDescription: "FRAME OF WOOD, TYPE H" },
    { PartID: "69", PartDescription: "SPACER OF WOOD FIBRE, H INNER" },
    { PartID: "79", PartDescription: "LID OF PLYWOOD, TYPE H" },
    { PartID: "701", PartDescription: "PALLET OF WOOD" },
    { PartID: "702", PartDescription: "FRAME OF WOOD" },
    { PartID: "706", PartDescription: "LID OF PLYWOOD" },
    { PartID: "724", PartDescription: "PALLET OF WOOD" },
    { PartID: "725", PartDescription: "FRAME OF WOOD" },
    { PartID: "726", PartDescription: "LID OF PLYWOOD  ( 2 PARTS )" },
    { PartID: "460", PartDescription: "BOX OF PLASTIC (ESD)" },
    { PartID: "461", PartDescription: "LID OF PLASTIC (ESD)" },
    { PartID: "500", PartDescription: "BOX OF PLASTIC" },
    { PartID: "501", PartDescription: "LID OF PLASTIC" },

    // { PartID: "780", PartDescription: "BOX OF PLASTIC" },
    // { PartID: "781", PartDescription: "LID OF PLASTIC" },
    { PartID: "20780", PartDescription: "KIT of BOX OF PLASTIC" },
    // { PartID: "840", PartDescription: "BOX OF PLASTIC" },
    // { PartID: "841", PartDescription: "LID OF PLASTIC FOR EMB 840" },
    { PartID: "20840", PartDescription: "KIT of BOX OF PLASTIC" },
    { PartID: "81", PartDescription: "SPACER OF PLASTIC, L INNER" },
    { PartID: "82", PartDescription: "SPACER OF PLASTIC, K INNER" },
    // { PartID: "116", PartDescription: "FIXING SPACER OF PLASTIC" },
    //{ PartID: "750", PartDescription: "BOX OF PLASTIC" },
    //{ PartID: "751", PartDescription: "LID OF PLASTIC" },
    { PartID: "20750", PartDescription: "KIT of BOX OF PLASTIC" },
  ],
  STATUS_OPTIONS: [
    { key: "Req Received", text: "Req Received" },
    { key: "Req Accepted", text: "Req Accepted" },
    { key: "Req Rejected", text: "Req Rejected" },
    // { key: "Req On HOLD", text: "Req On HOLD" },   //Andy requests to delete status Req on HOLD and Req Approved. No need for this
    // { key: "Req Approved", text: "Req Approved" },
    { key: "GI / In Transit", text: "GI / In Transit" },
    { key: "Completed", text: "Completed", disabled: true },
  ],
  FULLORPARTIAL_OPTIONS: [
    { key: "Full Filled", text: "Full Filled" },
    { key: "Partial Filled", text: "Partial Filled" },
  ],
});

export interface IRequestState {
  item: IRequestListItem;
  items: IRequestListItem[];
  itemId: string;
  terminalId: string;
  listId: string;
  statue: RequestStatus;
  message: string;
}
export const initialState: IRequestState = {
  item: {} as IRequestListItem,
  items: [],
  itemId: "-1",
  terminalId: "",
  listId: "",
  statue: RequestStatus.Idle,
  message: "",
};
