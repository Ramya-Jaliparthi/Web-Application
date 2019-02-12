export interface GetMemberPlanInformationInterface {
    fullName: string; // example: DAKOTA GARRITY  Member Full Name
    suffix: string; // example: 00  Member Suffix
    genderCode: string; // example: F  Member Gender Code
    DOB: string; // ($date)  example: 1990-07-17  Member Date of birth
    plans: GetMemberPlanDetailsInterface[];
}


export interface GetMemberPlanDetailsInterface {
    planName: string; // example: HMO BLUE NEW ENGLAND ENHANCED VALUE  Active Plan Name
    groupNumber: string; // example: 004014984  Group the plan name belongs to
    hasDependents: boolean; // example: true  Member Plan has any dependents
    tieredNetworkIndicator: boolean; // example: false  Determines Tiered Network Display Rules met
}

export interface GetMemPlanDependentsRequestInterface {
    useridin: string;
}


