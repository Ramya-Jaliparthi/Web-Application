import { ClaimStatusType } from '../types/claims.types';

export interface PlanMetaInterface {
    allPlansRequired: boolean; // example: true Enum: [ true, false ]
    planMetaList: PlanSearchListInterface[];
}

export interface PlanSearchListInterface {
    planName: string; // example: Plan 1
    planCount: number; // example: 5
    selected?: boolean;
    disabled?: boolean;
}

export interface DateMetaInterface {
    allDatesRequired: boolean; // example: true Enum: Array [ 2 ]
    dateMetaList: DateSearchListInterface[];
    customDateRange: CustomDateRangeMetaInterface;
}

export interface DateSearchListInterface {
    dateRange: string; // example: Last 30 days
    dateCount: number; // example: 4
    checked?: boolean;
}

export interface CustomDateRangeMetaInterface {
    startDate: string; // example: 08/07/2018
    endDate: string; // example: 08/09/2018
    customDateCount: number; // example: 3
}

export interface MemberTypeMetaInterface {
    allmembersRequired: boolean; // example: true Enum: [ true, false ]
    memberTypeMetaList: MemberTypeSearchListInterface[];
}

export interface MemberTypeSearchListInterface {
    memberName: string; // example: Member 1
    memberCount: number; //  example: 2
    selected?: boolean;
    disabled?: boolean;
}

export interface ProviderMetaInterface {
    allProvidersRequired: boolean; // example: true Enum:[ true, false ]
    providerMetaList: ProviderSearchListInterface[];
}

export interface ProviderSearchListInterface {
    providerName: string; // example: Provider 1
    providerCount: number; // example: 5
    selected?: boolean;
    disabled?: boolean;
}

export interface VisitTypeMetaInterface {
    allVisitTypesRequired: boolean; // example: true, Enum: Array [ 2 ]
    visitTypeMetaList: VisitTypeSearchListInterface[];
}

export interface VisitTypeSearchListInterface {
    visitType: string; // example: Visit Type 1
    visitTypeCount: number;
    selected?: boolean;
    disabled?: boolean;
}

export interface ClaimStatusMetaInterface {
    allStatusesRequired: boolean; // example: true or false
    claimStatusMetaList: ClaimStatusSearchListInterface[];
}

export interface ClaimStatusSearchListInterface {
    status: ClaimStatusType; // 'Completed' | 'Denied' | 'Pending'
    statusCount: number; // example: 3
    selected?: boolean;
    disabled?: boolean;
}

export interface SuccessResponseInterface {
    result: number; // example: 0
}


