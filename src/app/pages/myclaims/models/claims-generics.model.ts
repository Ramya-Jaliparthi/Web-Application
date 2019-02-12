import {
    PlanMetaInterface,
    PlanSearchListInterface,
    DateMetaInterface,
    DateSearchListInterface,
    CustomDateRangeMetaInterface,
    MemberTypeMetaInterface,
    MemberTypeSearchListInterface,
    ClaimStatusSearchListInterface,
    ClaimStatusMetaInterface,
    VisitTypeSearchListInterface,
    VisitTypeMetaInterface,
    ProviderSearchListInterface,
    ProviderMetaInterface,
    SuccessResponseInterface
} from './interfaces/claims-generic-models.interface';
import { ClaimStatusType } from './types/claims.types';

export class PlanMeta implements PlanMetaInterface {
    allPlansRequired: boolean; // example: true Enum: [ true, false ]
    planMetaList: PlanSearchList[];
}

export class PlanSearchList implements PlanSearchListInterface {
    planName: string; // example: Plan 1
    planCount: number; // example: 5
    selected?: boolean;
    disabled?: boolean;
}

export class DateMeta implements DateMetaInterface {
    allDatesRequired: boolean; // example: true Enum: Array [ 2 ]
    dateMetaList: DateSearchList[];
    customDateRange: CustomDateRangeMeta;
}

export class DateSearchList implements DateSearchListInterface {
    dateRange: string; // example: Last 30 days
    dateCount: number; // example: 4
    checked?: boolean;
}

export class CustomDateRangeMeta implements CustomDateRangeMetaInterface {
    startDate: string; // example: 08/07/2018
    endDate: string; // example: 08/09/2018
    customDateCount: number; // example: 3
}

export class MemberTypeMeta implements MemberTypeMetaInterface {
    allmembersRequired: boolean; // example: true Enum: [ true, false ]
    memberTypeMetaList: MemberTypeSearchList[];
}

export class MemberTypeSearchList implements MemberTypeSearchListInterface {
    memberName: string; // example: Member 1
    memberCount: number; //  example: 2
    selected?: boolean = false;
    disabled?: boolean = false;
}

export class ProviderMeta implements ProviderMetaInterface {
    allProvidersRequired: boolean; // example: true Enum:[ true, false ]
    providerMetaList: ProviderSearchList[];
}

export class ProviderSearchList implements ProviderSearchListInterface {
    providerName: string; // example: Provider 1
    providerCount: number; // example: 5
    selected?: boolean = false;
    disabled?: boolean = false;
}

export class VisitTypeMeta implements VisitTypeMetaInterface {
    allVisitTypesRequired: boolean; // example: true, Enum: Array [ 2 ]
    visitTypeMetaList: VisitTypeSearchList[];
}

export class VisitTypeSearchList implements VisitTypeSearchListInterface {
    visitType: string; // example: Visit Type 1
    visitTypeCount: number;
    selected?: boolean = false;
    disabled?: boolean = false;
}

export class ClaimStatusMeta implements ClaimStatusMetaInterface {
    allStatusesRequired: boolean; //   example: true or false
    claimStatusMetaList: ClaimStatusSearchList[];
}

export class ClaimStatusSearchList implements ClaimStatusSearchListInterface {
    status: ClaimStatusType; // 'Completed' | 'Denied' | 'Pending'
    statusCount: number; // example: 3
    selected?: boolean = false;
    disabled?: boolean = false;
}

export class SuccessResponse implements SuccessResponseInterface {
    result: number; // example: 0
}


