export interface IDistributionListItem {
    ID?: string;
    Title?: string;
    DistributionNumber?: string;
    Sender?: string;
    Sender_x003a__x0020_Name?: string;
    Receiver?: string;
    Receiver_x003a__x0020_Name?: string;
    ReceivedByDate: Date;
    PartNumber?: string;
    PartDescription?: string;
    Quantity?: number;
    DeliveryLocationAndCountry?: string;
    Status?: string;
    StatusUpdatedBy?: string;
    ConfirmationFromReceiver?: boolean;
    Field1?: string;
    Field2?: string;
}

export interface IDistributionFlowTrackerError {
    ConfirmationFromReceiver?: string;
    Field1?: string;
    Field2?: string;
}