import { ClaimStatusType, ClaimSummarySortOrderType, ClaimsUserType } from './types/claims.types';
import {
    ClaimFiltersMetadataInterface, ClaimsSummaryResponseModelInterface,
    ClaimSummaryMetadataInterface, ClaimMemberRecordInterface,
    ClaimsSummaryRequestModelInterface
} from './interfaces/claims-summary-data-model.interface';
import {
    PlanMeta, DateMeta, MemberTypeMeta,
    ClaimStatusMeta, VisitTypeMeta, ProviderMeta
} from './claims-generics.model';
import { MyBlueGeneralAPIRequestModel } from '../../../shared/models/generic-app.model';

export class ClaimsSummaryRequestModel extends MyBlueGeneralAPIRequestModel implements ClaimsSummaryRequestModelInterface {
    summaryMetaData: ClaimSummaryMetadata;
    filtersMetadata: ClaimFiltersMetadata;
    scrollIndicator: string;
}

export class ClaimsSummaryResponseModel implements ClaimsSummaryResponseModelInterface {
    summaryMetaData: ClaimSummaryMetadata;
    filtersMetaData: ClaimFiltersMetadata;
    memberRecord: ClaimMemberRecord[];
    result?: number;
    displaymessage?: string;
}

export class ClaimSummaryMetadata implements ClaimSummaryMetadataInterface {
    totalRecordCount: number; //  example: 100
    hasMoreRecords: boolean; //  example: true Enum: [ true, false ]
    recordStartIndex: number; // example: 0
    recordEndIndex: number; //  example: 50
    sortOrder: ClaimSummarySortOrderType; //  example: Oldest First Enum: [ Most Recent, Oldest First ]
    constructor() {

    }
}

export class ClaimFiltersMetadata implements ClaimFiltersMetadataInterface {
    planMetaData: PlanMeta;
    dateMetaData: DateMeta;
    memberTypeMetaData: MemberTypeMeta;
    providerMetaData: ProviderMeta;
    visitTypeMetaData: VisitTypeMeta;
    claimStatusMetaData: ClaimStatusMeta;
}

export class ClaimMemberRecord implements ClaimMemberRecordInterface {
    recordKey: string;
    membershipId: string; // example: 1234561223456
    memberName: string; // example: John Smith
    userType: ClaimsUserType; // example: Commercial Enum: [ MedEx, Medicare, Commercial ]
    providerName: string; // example: CVS
    claimId: string; // example: 1234567890000
    claimStatus: ClaimStatusType; // example: Denied Enum: [ Completed, Denied, Pending ]
    amountCovered: string; // example: 100
    amountOwed: string; // example: 100
    dateOfService: string; // example: 08/09/2018
    firstDateOfService: string; // example: 08/09/2018
    lastDateOfService: string; // example: 08/09/2018
    visitType: string; // example: CVS
    planName: string; // example: Plan 1
    DependentId?: number;
}

