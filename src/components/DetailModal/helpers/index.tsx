export interface DataDelivery {
    cif: string;
    home_address: string;
    home_phone: string;
    mobile_phone: string;
    office_phone: string;
    owner_name: string;
    work_address: string;
}

export interface ApiResponse {
    [index: number]: DataDelivery;
}
