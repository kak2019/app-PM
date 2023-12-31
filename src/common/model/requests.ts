export interface IRequestListItem {
  ID?: string;
  Title?: string;
  RequestNumber?: string;
  RequesterId?: string;
  RequesterId_x003a_Name?: string;
  Requestor?: string;
  TerminalId?: string;
  TerminalId_x003a_Name?: string;
  PartID?: string;
  PartDescription?: string;
  Quantity?: number;
  DateNeeded?: Date; //not DateNeeded. UTC
  DeliveryLocationAndCountry?: string;
  HowMuchCanBeFullfilled?: number;
  Status?: string;
  FullOrPartialFilled?: string;
  StatusUpdateBy?: string;
  QtySent?: number;
  DateByWhenItWillReach?: Date; //not DateByWhenItWillReach. UTC
  ConfirmationFromSupplier?: boolean; //1 0
  Field1?: string;
  Field2?: string;
  Remarks?: string;
  Created?: Date;
  BundleID?:string;
  BundleDescription?:string;
}

export interface IRequestGIError {
  HowMuchCanBeFullfilled?: string;
  Status?: string;
  FullOrPartialFilled?: string;
  QtySent?: string;
  DateByWhenItWillReach?: string;
  ConfirmationFromSupplier?: string;
  Field1?: string;
  Field2?: string;
  Remarks?: string;
}
