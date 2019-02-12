import { GeneralErrorInterface } from '../../../../shared/models/interfaces/generic-app-models.interface';
import {
    GetSearchByProfessionalRequestModelInterface,
    FadLocationDetailsInterface,
    FadReviewsListInterface
} from './getSearchByProfessional-models.interface';
import { FilterListItemInterface, FilterRadioItemInterface, FilterCheckboxItemInterface } from './fad-search-filter.interface';


// tslint:disable-next-line:no-empty-interface
export interface GetSearchByFacilityRequestModelInterface extends GetSearchByProfessionalRequestModelInterface {

}

export interface GetSearchByFacilityResponseModelInterface extends GeneralErrorInterface {
    totalCount: number;
    facilities: FadFacilityInterface[];
    facets: FacetsFacilityListInterface;
}

export interface FadFacilityInterface {

    id: string;
    type: string;
    facilityName: string;
    specialty: string; // This is the name of the city
    locations: FadLocationDetailsInterface[];
    reviews: FadReviewsListInterface;
}

export interface FacetsFacilityListInterface {
    overallRating: FilterListItemInterface[];
    fieldSpecialtyIds: FilterListItemInterface[];
    locationGeo: FilterListItemInterface[];
    inNetwork: FilterCheckboxItemInterface;
    bdcTypeCodes: FilterListItemInterface[];
    awardTypeCodes: FilterListItemInterface[];
    cqms: FilterListItemInterface[];
}



