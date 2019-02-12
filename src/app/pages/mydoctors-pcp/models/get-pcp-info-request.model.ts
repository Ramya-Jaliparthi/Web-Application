import { GetPCPInfoRequestModelInterface, GetPCPInfoResponseModellInterface } from './interfaces/get-pcp-info-request-model-interface';

export class GetPCPInfoRequestModel implements GetPCPInfoRequestModelInterface {
    useridin: string; // pattern: ^[\w-]+@([\w-]+\.)+[\w-]+$|^\d{10}$ example: foo@gmail.com email id or phone number or alpha-numeric id
    groupNumber: string; // example: 004014984 Group the plan name belongs to
    suffix: string; // example: 02  Member Suffix
    tieredNetworkIndicator: boolean; // example: false  Determines Tiered Network Display Rules met
}

export class GetPCPInfoResponseModel implements GetPCPInfoResponseModellInterface {
    providerName: string; // example: WINNY J OU MD Provider Name
    providerNumber: string; // example: 70010000J01155 Provider Number
    effectiveDate: string; // ($date) example: 1980-01-01 PCP Effective Date
    providerId: string; // example: TIR Provider ID num:
    par: string;
}
