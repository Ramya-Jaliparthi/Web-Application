import { ChangePCPResponseModelInterface, ChangePCPRequestModelInterface } from './interfaces/change-pcp-request-model-interface';
// import { Inflate } from 'zlib';

export class ChangePCPRequestModel implements ChangePCPRequestModelInterface {
    useridin: string; // pattern: ^[\w-]+@([\w-]+\.)+[\w-]+$|^\d{10}$  example: foo@gmail.com email id or phone number or alpha-numeric id
    groupNumber: string;  // example: 004014984 Group the plan name belongs to
    suffix: string; // example: 02 Member Suffix
    genderCode: string; // example: M Gender Code
    DOB: string; // ($date) example: 1980-01-01 Member Birth Date
    effectiveDate: string; // ($date) example: 1980-01-01 PCP Effective Date
    tieredNetworkIndicator: boolean; // example: false Determines Tiered Network Display Rules met
    providerNumber: string; // example: 70010000J09193 PCP Identifier
    providerId: string; // example: TIR Provider ID Enum: Array [ 2 ]
    establishedPatientIndicator: boolean; // example: false Is current patient of the provider
    changeReasonIndicator: string; // example: I Reason for the change code
    isTIR: boolean;
    isTRB: boolean;
    isNEHP: boolean;
    currentProviderNumber: string;
    currentProviderName: string;
}

export class ChangePCPResponseModel implements ChangePCPResponseModelInterface {
    result: number; // Enum: Array [ 12 ]
    errormessage: string; // example:
    displaymessage: string; // example:
}
