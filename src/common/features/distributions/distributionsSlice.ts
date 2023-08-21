import { IDistributionListItem } from "../../model";

export enum DistributionStatus {
    Idle,
    Loading,
    Failed
}

export const DISTRIBUTIONCONST = Object.freeze({
    LIST_NAME: "Received Distributions",
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
        { PartID: "750", PartDescription: "BOX OF PLASTIC" },
        { PartID: "751", PartDescription: "LID OF PLASTIC" },
        { PartID: "780", PartDescription: "BOX OF PLASTIC" },
        { PartID: "781", PartDescription: "LID OF PLASTIC" },
        { PartID: "840", PartDescription: "BOX OF PLASTIC" },
        { PartID: "841", PartDescription: "LID OF PLASTIC FOR EMB 840" },
        { PartID: "81", PartDescription: "SPACER OF PLASTIC, L INNER" },
        { PartID: "82", PartDescription: "SPACER OF PLASTIC, K INNER" },
        { PartID: "116", PartDescription: "FIXING SPACER OF PLASTIC" }
    ],
    STATUS_OPTIONS: [
        { key: "In Transit", text: "In Transit" },
        { key: "Cancelled", text: "Cancelled" }
    ]
});

export interface IDistributionState {
    item: IDistributionListItem;
    items: IDistributionListItem[];
    itemId: string;
    sender: string;
    listId: string;
    statue: DistributionStatus;
    message: string;
}
export const initialState: IDistributionState = {
    item: {} as IDistributionListItem,
    items: [],
    itemId: "-1",
    sender: "",
    listId: "",
    statue: DistributionStatus.Idle,
    message: ""
}