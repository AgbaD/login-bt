export interface InvoiceSettingDto {
    Layout: string;
    BusinessName: string;
    Terms: string;
    Logo?: File;
    BankName: string;
    AccountNumber: string;
    AccountName: string;
    FontStyle: string;
    FontColor: string;
    BackgroundColor: string;
}

export interface Layout {
    Id: string;
    Name: string;
    Version: string;
    Content: string;
}
