import { GeneralErrorInterface } from '../../../../shared/models/interfaces/generic-app-models.interface';
import { FilterListItemInterface, FilterCheckboxItemInterface } from './fad-search-filter.interface';

export interface GetSearchByProfessionalRequestModelInterface {
    geoLocation: string;
    limit: number;
    page: number;
    radius: number;
    networkId: number;
    searchSpecialtyId: number;
    name: string;

    getGeoLocation(): string;
    setGeoLocation(geoLocation: string): GetSearchByProfessionalRequestModelInterface;

    getLimit(): number;
    setLimit(limit: number): GetSearchByProfessionalRequestModelInterface;

    getPage(): number;
    setPage(page: number): GetSearchByProfessionalRequestModelInterface;

    getRadius(): number;
    setRadius(radius: number): GetSearchByProfessionalRequestModelInterface;

    getNetworkId(): number;
    setNetworkId(networkId: number): GetSearchByProfessionalRequestModelInterface;

    getSearchSpecialtyId(): number;
    setSearchSpecialtyId(searchSpecialtyId: number): GetSearchByProfessionalRequestModelInterface;

    getName(): string;
    setName(name: string): GetSearchByProfessionalRequestModelInterface;
}

export interface GetSearchByProfessionalResponseModelInterface extends GeneralErrorInterface {
    totalCount:number;
    professionals: FadProfessionalInterface[];
    facets: FacetsListInterface;
}

export interface FadProfessionalInterface {

    doctorName: string; // This is the city/state of the location

    specialty: string; // This is the name of the city
    locations: FadLocationDetailsInterface[];
    reviews: FadReviewsListInterface;
}


export interface FadLocationDetailsInterface {

    id: number; //    This is the location
    name: string; //     This is the location name
    address: string; //     This is the address info
    phone: string; //     This is the phone info
}

export interface FadReviewsListInterface {
    overallRating: number; //     This is the city/state of the location
    percentRecommended: number; //     This is the percentRecommended
    totalRatings: number; //     This is the totalRatings
}

export interface FacetsListInterface {
    treatedTypeCodes: FilterListItemInterface[];
    overallRating: FilterListItemInterface[];
    acceptingNewPatients: FilterCheckboxItemInterface;
    fieldSpecialtyIds: FilterListItemInterface[];
    grpHospitalAffiliationIds: FilterListItemInterface[];
    isChoicePcp: FilterListItemInterface[];
    isPcp: FilterCheckboxItemInterface;
    locationGeo: FilterListItemInterface[];
    professionalGender: FilterListItemInterface[];
    professionalLanguages: FilterListItemInterface[];
    techSavvy: FilterCheckboxItemInterface;
    treatmentMethodsTypeCodes: FilterListItemInterface[];
    disordersTreatedTypeCodes: FilterListItemInterface[];
    inNetwork: FilterCheckboxItemInterface;
}
