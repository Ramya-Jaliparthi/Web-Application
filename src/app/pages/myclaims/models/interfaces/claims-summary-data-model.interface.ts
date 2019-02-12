import { ClaimsUserType, ClaimStatusType, ClaimSummarySortOrderType } from '../types/claims.types';
import {
    ClaimStatusMetaInterface, ProviderMetaInterface, MemberTypeMetaInterface,
    DateMetaInterface, PlanMetaInterface, VisitTypeMetaInterface
} from './claims-generic-models.interface';
import { MyBlueGeneralAPIRequestModelInterface } from '../../../../shared/models/interfaces/generic-app-models.interface';

export interface ClaimsSummaryRequestModelInterface extends MyBlueGeneralAPIRequestModelInterface {
    summaryMetaData: ClaimSummaryMetadataInterface;
    filtersMetadata: ClaimFiltersMetadataInterface;
    scrollIndicator: string;
}

export interface ClaimsSummaryResponseModelInterface {
    summaryMetaData: ClaimSummaryMetadataInterface;
    filtersMetaData: ClaimFiltersMetadataInterface;
    memberRecord: ClaimMemberRecordInterface[];
    result?: number;
    displaymessage?: string;
}

export interface ClaimSummaryMetadataInterface {
    totalRecordCount: number; //  example: 100
    hasMoreRecords: boolean; //  example: true Enum: [ true, false ]
    recordStartIndex: number; // example: 0
    recordEndIndex: number; //  example: 50
    sortOrder: ClaimSummarySortOrderType; //  example: Oldest First Enum: [ Most Recent, Oldest First ]
}

export interface ClaimFiltersMetadataInterface {
    planMetaData: PlanMetaInterface;
    dateMetaData: DateMetaInterface;
    memberTypeMetaData: MemberTypeMetaInterface;
    providerMetaData: ProviderMetaInterface;
    visitTypeMetaData: VisitTypeMetaInterface;
    claimStatusMetaData: ClaimStatusMetaInterface;
}

export interface ClaimMemberRecordInterface {
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


