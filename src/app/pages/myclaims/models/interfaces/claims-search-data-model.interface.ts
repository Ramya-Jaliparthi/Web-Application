import {
    PlanMetaInterface,
    DateMetaInterface,
    MemberTypeMetaInterface,
    ProviderMetaInterface,
    VisitTypeMetaInterface,
    ClaimStatusMetaInterface
} from './claims-generic-models.interface';
import { MyBlueGeneralAPIRequestModelInterface } from '../../../../shared/models/interfaces/generic-app-models.interface';

export interface ClaimsSearchRequestModelInterface extends MyBlueGeneralAPIRequestModelInterface {
    searchText: string;
    filtersMetadata: ClaimFiltersMetadataInterface;
}

export interface ClaimsSearchResponseModelInterface {
    searchResponseList: ClaimSearchResponseInterface[];
}

export interface ClaimFiltersMetadataInterface {
    planMetaData: PlanMetaInterface;
    dateMetaData: DateMetaInterface;
    memberTypeMetaData: MemberTypeMetaInterface;
    providerMetaData: ProviderMetaInterface;
    visitTypeMetaData: VisitTypeMetaInterface;
    claimStatusMetaData: ClaimStatusMetaInterface;
}

export interface ClaimSearchResponseInterface {
    key: string;
    name: string;
}
