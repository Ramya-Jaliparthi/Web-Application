import { GetMemberPlanInformationInterface, GetMemPlanDependentsRequestInterface } from './interfaces/get-member-plan-info-model.inteface';

export class GetMemberPlanInformation implements GetMemberPlanInformationInterface {
    fullName: string; // example: DAKOTA GARRITY  Member Full Name
    suffix: string; // example: 00  Member Suffix
    genderCode: string; // example: F  Member Gender Code
    DOB: string; // ($date)  example: 1990-07-17  Member Date of birth
    plans: GetMemberPlanDetails[];
}


export class GetMemberPlanDetails {
    planName: string; // example: HMO BLUE NEW ENGLAND ENHANCED VALUE  Active Plan Name
    groupNumber: string; // example: 004014984  Group the plan name belongs to
    hasDependents: boolean; // example: true  Member Plan has any dependents
    tieredNetworkIndicator: boolean; // example: false  Determines Tiered Network Display Rules met
}

export class GetMemPlanDependentsRequest implements GetMemPlanDependentsRequestInterface {
    useridin: string;
}


