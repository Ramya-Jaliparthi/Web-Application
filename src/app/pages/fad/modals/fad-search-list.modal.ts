import {
    FadSearchListComponentOutputModelInterface,
    FadSearchListComponentInputModelInterface,
    FadFacilityListComponentInputModelInterface,
    FadFacilityListComponentOutputModelInterface
} from './interfaces/fad-search-list.interface';
import { GetSearchByProfessionalResponseModelInterface } from './interfaces/getSearchByProfessional-models.interface';
import { GetSearchByFacilityResponseModelInterface } from './interfaces/getSearchByFacility-models.interface';
// import { FadVitalsProfessionalsSearchResponseModelInterface } from './interfaces/fad-vitals-collection.interface';

export class FadSearchListComponentInputModel implements FadSearchListComponentInputModelInterface {
    public searchResults: GetSearchByProfessionalResponseModelInterface;
}

export class FadSearchListComponentOutputModel implements FadSearchListComponentOutputModelInterface {

}


export class FadFacilityListComponentInputModel implements FadFacilityListComponentInputModelInterface {
    public facilityResults: GetSearchByFacilityResponseModelInterface;
}

export class FadFacilityListComponentOutputModel implements FadFacilityListComponentOutputModelInterface {

}
