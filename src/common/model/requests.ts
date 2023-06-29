
export interface IRequestListItem {
    ID?:string;
    Title?:string;
    RequestNumber?:string;
    RequesterId?:string;
    RequesterId_x003a_Name?:string;
    Requestor?:string;
    TerminalId?:string;
    TerminalId_x003a_Name?:string;
    PartID?:string;
    PartDescription?:string;
    Quantity?:number;
    DateNeeded?:Date; //not DateNeeded. UTC 
    DeliveryLocationAndCountry?:string;
    HowMuchCanBeFullfilled?:number;    
    Status?:string;
    FullOrPartialFilled?:string;
    StatusUpdateBy?:string;
    QtySent?:number;
    DateByWhenItWillReach?:Date; //not DateByWhenItWillReach. UTC
    ConfirmationFromSupplier?:string; //Yes No
    Field1?:string;
    Field2?:string;
}

