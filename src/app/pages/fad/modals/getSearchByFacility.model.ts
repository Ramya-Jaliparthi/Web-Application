

import {
    GetSearchByFacilityRequestModelInterface,
    GetSearchByFacilityResponseModelInterface,
    FacetsFacilityListInterface
} from './interfaces/getSearchByFacility-models.interface';
import { GetSearchByProfessionalRequestModel, FadLocationDetails, FadReviewsList } from './getSearchByProfessional.model';
import { GeneralError } from '../../../shared/models/generic-app.model';
import { FilterListItem, FilterCheckboxItem } from './fad-search-filter.modal';

// tslint:disable-next-line:no-empty-interface
export class GetSearchByFacilityRequestModel extends GetSearchByProfessionalRequestModel
    implements GetSearchByFacilityRequestModelInterface {

}

export class GetSearchByFacilityResponseModel extends GeneralError implements GetSearchByFacilityResponseModelInterface {
    totalCount: number;
    facilities: FadFacility[];
    facets: FacetsFacilityList;
}

export interface FadFacility {

    id: string;
    type: string;
    facilityName: string;
    specialty: string; // This is the name of the city
    locations: FadLocationDetails[];
    reviews: FadReviewsList;
}

export class FacetsFacilityList implements FacetsFacilityListInterface {
    overallRating: FilterListItem[];
    fieldSpecialtyIds: FilterListItem[];
    locationGeo: FilterListItem[];
    inNetwork: FilterCheckboxItem;
    bdcTypeCodes: FilterListItem[];
    awardTypeCodes: FilterListItem[];
    cqms: FilterListItem[];
}



