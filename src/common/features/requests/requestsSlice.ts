import { IRequestListItem } from "../../model";

export enum RequestStatus {
  Idle,
  Loading,
  Failed,
}
export const REQUESTSCONST = Object.freeze({
  LIST_NAME: "Request List",
  PART_LIST: [
    { PartID: "1", PartDescription: "wooden pallet" },
    { PartID: "2", PartDescription: "wooden pallet" },
    { PartID: "5", PartDescription: "wooden pallet" },
    { PartID: "6", PartDescription: "wooden pallet" },
    { PartID: "9", PartDescription: "wooden pallet" },
    { PartID: "21", PartDescription: "wooden frame" },
    { PartID: "22", PartDescription: "wooden frame" },
    { PartID: "25", PartDescription: "wooden frame" },
    { PartID: "26", PartDescription: "wooden frame" },
    { PartID: "29", PartDescription: "wooden frame" },
    { PartID: "31", PartDescription: "spacer Plywood" },
    { PartID: "41", PartDescription: "spacer Plywood" },
    { PartID: "45", PartDescription: "spacer Plywood" },
    { PartID: "61", PartDescription: "spacer board" },
    { PartID: "62", PartDescription: "spacer board" },
    { PartID: "65", PartDescription: "spacer board" },
    { PartID: "66", PartDescription: "spacer board" },
    { PartID: "69", PartDescription: "spacer board" },
    { PartID: "71", PartDescription: "Lid-wood" },
    { PartID: "72", PartDescription: "Lid-wood" },
    { PartID: "75", PartDescription: "Lid-wood" },
    { PartID: "76", PartDescription: "Lid-wood" },
    { PartID: "79", PartDescription: "Lid-wood" },
    { PartID: "81", PartDescription: "spacer-plastic" },
    { PartID: "82", PartDescription: "spacer-plastic" },
    { PartID: "91", PartDescription: "Lid-plastic" },
    { PartID: "92", PartDescription: "Lid-plastic" },
    { PartID: "119", PartDescription: "spacer-Board/Foam" },
    { PartID: "236", PartDescription: "Lid-wood" },
    { PartID: "358", PartDescription: "batten-wood" },
    { PartID: "402", PartDescription: "wooden pallet" },
    { PartID: "416", PartDescription: "Insert-Plastic" },
    { PartID: "419", PartDescription: "combitainer" },
    { PartID: "575", PartDescription: "batten-wood" },
    { PartID: "576", PartDescription: "batten-wood" },
    { PartID: "595", PartDescription: "batten-wood" },
    { PartID: "595", PartDescription: "batten-wood" },
    { PartID: "670", PartDescription: "Lid-wood" },
    { PartID: "701", PartDescription: "wooden pallet" },
    { PartID: "702", PartDescription: "wooden frame" },
    { PartID: "706", PartDescription: "Lid-wood" },
    { PartID: "724", PartDescription: "wooden pallet" },
    { PartID: "725", PartDescription: "wooden frame" },
    { PartID: "726", PartDescription: "wooden Lid" },
    { PartID: "750", PartDescription: "Box-plastic" },
    { PartID: "780", PartDescription: "Box-plastic" },
    { PartID: "814", PartDescription: "combitainer" },
    { PartID: "836", PartDescription: "pallet-steel" },
    { PartID: "840", PartDescription: "Box-plastic" },
    { PartID: "116", PartDescription: "FIXING SPACER OF PLASTIC" },
    { PartID: "1463", PartDescription: "batten-wood" },
    { PartID: "1645", PartDescription: "batten-wood" },
    { PartID: "1646", PartDescription: "batten-wood" },
    { PartID: "1654", PartDescription: "batten-wood" },
  ],
  STATUS_OPTIONS:[
    {key:"Req Received",text:"Req Received"},
    {key:"Req Accepted",text:"Req Accepted"},
    {key:"Req Rejected",text:"Req Rejected"},
    {key:"Req On HOLD",text:"Req On HOLD"},
    {key:"Req Approved",text:"Req Approved"},
    {key:"GI / In Transit",text:"GI / In Transit"},
    {key:"Completed",text:"Completed"},
  ],
  FULLORPARTIAL_OPTIONS:[
    {key:"Full Filled",text:"Full Filled"},
    {key:"Partial Filled",text:"Partial Filled"},
  ]
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
