import {
    ClaimsSearchResponseModelInterface,
    ClaimsSearchRequestModelInterface,
    ClaimFiltersMetadataInterface,
    ClaimSearchResponseInterface
} from './interfaces/claims-search-data-model.interface';
import {
    PlanMeta, DateMeta, MemberTypeMeta,
    VisitTypeMeta, ClaimStatusMeta, ProviderMeta
} from './claims-generics.model';
import { MyBlueGeneralAPIRequestModel } from '../../../shared/models/generic-app.model';


export class ClaimsSearchRequestModel extends MyBlueGeneralAPIRequestModel implements ClaimsSearchRequestModelInterface {
    searchText: string;
    filtersMetadata: ClaimFiltersMetadata;
}

export class ClaimsSearchResponseModel implements ClaimsSearchResponseModelInterface {
    searchResponseList: ClaimSearchResponse[];
}

export class ClaimFiltersMetadata implements ClaimFiltersMetadataInterface {
    planMetaData: PlanMeta;
    dateMetaData: DateMeta;
    memberTypeMetaData: MemberTypeMeta;
    providerMetaData: ProviderMeta;
    visitTypeMetaData: VisitTypeMeta;
    claimStatusMetaData: ClaimStatusMeta;
}

export class ClaimSearchResponse implements ClaimSearchResponseInterface {
    key: string;
    name: string;
}
