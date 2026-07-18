export type VeroFilingPeriod = {
    FilingPeriod: string;
    Status: string;
};

export type VeroFileReturnResponse = {
    UniqueIdentifier?: string;
    AcceptedTimestamp?: string;
    ErrorText?: string;
};

export type VeroGetReturnResponse = {
    Status?: string;
    SubmittedDate?: string;
    VATOnDomesticSales?: {
        HighVATRate?: number;
        MediumVATRate?: number;
        LowVATRate?: number;
    };
    DeductibleTax?: {
        DeductibleVAT?: number;
    };
    TaxPayableOrNegativeTaxThatQualifiesForRefund?: number;
};
