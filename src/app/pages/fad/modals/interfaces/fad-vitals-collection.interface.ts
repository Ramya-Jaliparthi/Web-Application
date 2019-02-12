// import { FVACSRMeta, FVACSRSearchResultEntity, FVACSRProcedureEntity } from '../fad-vitals-auto-complete-search-response.model';
// import { FVSSRSpecialityEntity } from '../fad-vitals-specilities-search-response.model';
import { FZCSRCity, FPSRPlan } from '../fad-vitals-collection.model';
import { FVPSRProvider, FVPSRMeta } from '../fad-vitals-providers-summary-response.model';
// import { GetSearchBySpecialityResponseSearchSpecialtiesInfoInterface } from './getSearchBySpeciality-models.interface';

// export interface FadVitalsAutoCompleteSearchRequestModelInterface {
//     searchparam: string;
//     geo_location: string; // 'lattitude,longitude'
//     limit: number;
//     network_id: number;
//     accountId: number;
// }

// export interface FadVitalsAutoCompleteSearchResponseModelInterface {
//     _meta: FVACSRMeta;
//     telehealth: any;
//     pharmacy: any;
//     professionals: FVACSRSearchResultEntity[];
//     facilities: FVACSRSearchResultEntity[];
//     search_specialties: GetSearchBySpecialityResponseSearchSpecialtiesInfoInterface[]; // FVSSRSpecialityEntity[];
//     procedures: FVACSRProcedureEntity[];
// }

export interface FadZipCodeSearchResponseModelInterface {
    cities: FZCSRCity[];
}

export interface FadPlanSearchResponseModelInterface {
    plans: FPSRPlan[];
}

// export interface FadVitalsProfessionalsSearchResponseModelInterface {
//     _meta: FVProSRMeta;
//     professionals: FVProSRProfessionalInSearchEntity[];
//     disclaimers: any[];
//     cash_reward_reference_number: any;
// }


// export interface FadVitalsFacilitiesSearchResponseModelInterface {
//     _meta: FVProSRMeta;
//     facilities: FVProSRProfessionalInSearchEntity;
//     disclaimers: any[];
//     cash_reward_reference_number: any;
// }

export interface FadVitalsProvidersSummaryResponseModelInterface {
    _meta: FVPSRMeta;
    provides: FVPSRProvider[];
}

// export interface FadVitalsSpecialitiesSearchResponseModelInterface {
//     search_specialties: FVSSRSpecialityEntity[];
// }

export interface FadVitalsSearchHistoryResponseModelInterface {
    searchHistory: FVSHRSearchHistoryInterface[];
}

export interface FVSHRSearchHistoryInterface {
    planId: number;
    searchKeyword: string;
    zipcode: string;
    planName: string;
    userId: string;
    city: string;
    state: string;
    dependant: string;
    date: string;
}

export interface FadVitalsZipCodeSearchRequestModelInterface {
    place: string;
    page: number;
    limit: number;
}

export interface DoctorProfileSearchRequestModelInterface {
    professionalid: string;
    geo_location: string; // 'lattitude,longitude'
    network_id: string;
    userid: string;
}

export interface FacilityProfileSearchRequestModelInterface {
    facility: string;
    geolocation: string; // 'lattitude,longitude'
    network_id: string;
    location_id: string;
}

export interface FADPlanSearchRequestModelInterface {
    uid: string;
}

// export interface FadSearchRequestByProfessionalModelInterface {
//     geoLocation: string;
//     limit: number;
//     page: number;
//     radius: number;
//     networkId: number;
//     searchSpecialtyId: number;
//     name: string;
// }
