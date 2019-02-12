import {
    GetSearchByProfessionalResponseModelInterface,
    FadProfessionalInterface,
    FadLocationDetailsInterface,
    FadReviewsListInterface,
    GetSearchByProfessionalRequestModelInterface, 
    FacetsListInterface
} from './interfaces/getSearchByProfessional-models.interface';
import { GeneralError } from '../../../shared/models/generic-app.model';
import { FilterListItem, FilterCheckboxItem } from './fad-search-filter.modal';

export class GetSearchByProfessionalRequestModel implements GetSearchByProfessionalRequestModelInterface {
    geoLocation: string;
    limit: number;
    page: number;
    radius: number;
    networkId: number;
    searchSpecialtyId: number;
    name: string;

    getGeoLocation(): string {
        return this.geoLocation;
    }

    setGeoLocation(geoLocation: string): GetSearchByProfessionalRequestModel {
        this.geoLocation = geoLocation;
        return this;
    }

    getLimit(): number {
        return this.limit;
    }

    setLimit(limit: number): GetSearchByProfessionalRequestModel {
        this.limit = limit;
        return this;
    }

    getPage(): number {
        return this.page;
    }

    setPage(page: number): GetSearchByProfessionalRequestModel {
        this.page = page;
        return this;
    }

    getRadius(): number {
        return this.radius;
    }

    setRadius(radius: number): GetSearchByProfessionalRequestModel {
        this.radius = radius;
        return this;
    }

    getNetworkId(): number {
        return this.networkId;
    }

    setNetworkId(networkId: number): GetSearchByProfessionalRequestModel {
        this.networkId = networkId;
        return this;
    }

    getSearchSpecialtyId(): number {
        return this.searchSpecialtyId;
    }

    setSearchSpecialtyId(searchSpecialtyId: number): GetSearchByProfessionalRequestModel {
        this.searchSpecialtyId = searchSpecialtyId;
        return this;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): GetSearchByProfessionalRequestModel {
        this.name = name;
        return this;
    }
}

export class GetSearchByProfessionalResponseModel extends GeneralError implements GetSearchByProfessionalResponseModelInterface {
    totalCount: number;
    professionals: FadProfessional[];
    facets: FacetsList
}

export class FadProfessional implements FadProfessionalInterface {
    doctorName: string; // This is the city/state of the location

    specialty: string; // This is the name of the city
    locations: FadLocationDetails[];
    reviews: FadReviewsList;
}


export class FadLocationDetails implements FadLocationDetailsInterface {
    id: number; //    This is the location
    name: string; //     This is the location name
    address: string; //     This is the address info
    phone: string; //     This is the phone info
}

export class FadReviewsList implements FadReviewsListInterface {
    overallRating: number; //     This is the city/state of the location
    percentRecommended: number; //     This is the percentRecommended
    totalRatings: number; //     This is the totalRatings
}

export class FacetsList implements FacetsListInterface {
    treatedTypeCodes: FilterListItem[];
    overallRating: FilterListItem[];
    acceptingNewPatients: FilterCheckboxItem;
    fieldSpecialtyIds: FilterListItem[];
    grpHospitalAffiliationIds: FilterListItem[];
    isChoicePcp: FilterListItem[];
    isPcp: FilterCheckboxItem;
    locationGeo: FilterListItem[];
    professionalGender: FilterListItem[];
    professionalLanguages: FilterListItem[];
    techSavvy: FilterCheckboxItem;
    treatmentMethodsTypeCodes: FilterListItem[];
    disordersTreatedTypeCodes: FilterListItem[];
    inNetwork: FilterCheckboxItem;
//
}
