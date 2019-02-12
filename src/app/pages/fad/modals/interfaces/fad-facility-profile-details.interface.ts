import { GeneralError } from '../../../../shared/models/generic-app.model';

export interface FadFacilityProfileRequestModelInterface {
    geoLocation: string;
    locationId: number;
    facilityId: number;
    networkId: number;

    getGeoLocation(): string;
    setGeoLocation(geoLocation: string): FadFacilityProfileRequestModelInterface;

    getLocationId(): number;
    setLocationId(locationId: number): FadFacilityProfileRequestModelInterface;

    getfacilityId(): number;
    setfacilityId(facilityId: number): FadFacilityProfileRequestModelInterface;

    getNetworkId(): number;
    setNetworkId(networkId: number): FadFacilityProfileRequestModelInterface;

}

export interface FadFacilityResponseModelInterface extends GeneralError {
    facilityName: string; // This is the city/state of the location
    location: LocationListInterface[];
}

export interface LocationListInterface {
    specialty: string;
    facilityId: number;
    address: string;
    phone: number;
    geoLocation: FadGeolocationDetailInterface[];
    amenities: FadAmenitiesInterface[];
    awards: FadAwardsInterface[];
    identifiers: FadIdentifiersInterface[];
    ratings: FadRatingsListInterface[];
    quality: FadQualityListInterface[];
    additionalInformation: FadAdditionalInformationInterface[];
    reviews: FadReviewsListInterface;
}

export interface FadRatingsListInterface {
    overallRating: number; //     This is the city/state of the location
    percentRecommended: number; //     This is the percentRecommended
    totalRatings: number; //     This is the totalRatings
}

export interface FadAmenitiesInterface {
    type: string;
}

export interface FadIdentifiersInterface {
    typeCode: string;
    value: string;
}

export interface FadAdditionalInformationInterface {
    typeCode: string;
    value: string;
}

export interface FadAwardsInterface {
    name: string;
    typeCode: string;
}

export interface FadQualityListInterface {
    name: string;
    score: number;
}

export interface FadGeolocationDetailInterface {
    latitude: number;
    longitude: number;
}

export interface FadReviewsListInterface {
    name: string;
    questionAnswer: FadQuestionAnswerListInterface[];
}

export interface FadQuestionAnswerListInterface {
    question: string;
    answers: FadAnswerListInterface[];
}

export interface FadAnswerListInterface {
    answer: string;
    answerPercent: string;
}
