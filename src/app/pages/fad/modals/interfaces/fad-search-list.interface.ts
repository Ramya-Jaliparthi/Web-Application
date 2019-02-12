import { GetSearchByProfessionalResponseModelInterface } from './getSearchByProfessional-models.interface';
import { GetSearchByFacilityResponseModelInterface } from './getSearchByFacility-models.interface';
// tslint:disable-next-line:no-empty-interface
export interface FadSearchListComponentOutputModelInterface {

}

export interface FadSearchListComponentInputModelInterface {
    searchResults: GetSearchByProfessionalResponseModelInterface;
}

// tslint:disable-next-line:no-empty-interface
export interface FadFacilityListComponentOutputModelInterface {

}

export interface FadFacilityListComponentInputModelInterface {
    facilityResults: GetSearchByFacilityResponseModelInterface;
}

