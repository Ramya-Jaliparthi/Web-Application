import {
    FadAmenitiesInterface, FadReviewsListInterface,
    FadAwardsInterface, FadIdentifiersInterface,
    FadFacilityResponseModelInterface,
    FadFacilityProfileRequestModelInterface,
    FadGeolocationDetailInterface,
    FadAdditionalInformationInterface,
    FadQualityListInterface,
    LocationListInterface,
    FadRatingsListInterface,
    FadAnswerListInterface,
    FadQuestionAnswerListInterface
} from './interfaces/fad-facility-profile-details.interface';

export class FadFacilityProfileRequestModel implements FadFacilityProfileRequestModelInterface {
    geoLocation: string;
    locationId: number;
    facilityId: number;
    networkId: number;

    getGeoLocation(): string {
        return this.geoLocation;
    }
    setGeoLocation(geoLocation: string): FadFacilityProfileRequestModelInterface {
        this.geoLocation = geoLocation;
        return this;
    }

    getLocationId(): number {
        return this.locationId;
    }

    setLocationId(locationId: number): FadFacilityProfileRequestModelInterface {
        this.locationId = locationId;
        return this;
    }

    getfacilityId(): number {
        return this.facilityId;
    }
    setfacilityId(facilityId: number): FadFacilityProfileRequestModelInterface {
        this.facilityId = facilityId;
        return this;
    }

    getNetworkId(): number {
        return this.networkId;
    }
    setNetworkId(networkId: number): FadFacilityProfileRequestModelInterface {
        this.networkId = networkId;
        return this;
    }

}

export class FadFacilityResponseModel implements FadFacilityResponseModelInterface {
    result: number;
    errormessage: string;
    displaymessage: string;
    facilityName: string;
    location: LocationListModel[];
}
export class LocationListModel implements LocationListInterface {
    specialty: string;
    facilityId: number;
    address: string;
    phone: number;
    geoLocation: FadGeolocationDetailModel[];
    amenities: FadAmenitiesModel[];
    awards: FadAwardsInterface[];
    additionalInformation: FadAdditionalInformationModel[];
    identifiers: FadIdentifiersModel[];
    ratings: FadRatingsListModel[];
    quality: FadQualityListModel[];
    reviews: FadReviewsListInterface;
}

export class FadGeolocationDetailModel implements FadGeolocationDetailInterface {
    latitude: number;
    longitude: number;
}

export class FadAdditionalInformationModel implements FadAdditionalInformationInterface {
    typeCode: string;
    value: string;
}

export class FadQualityListModel implements FadQualityListInterface {
    name: string;
    score: number;
}

export class FadAmenitiesModel implements FadAmenitiesInterface {
    type: string;
}

export class FadIdentifiersModel implements FadIdentifiersInterface {
    typeCode: string;
    value: string;
}

export class FadAwardsModel implements FadAwardsInterface {
    name: string;
    typeCode: string;
}

export class FadRatingsListModel implements FadRatingsListInterface {
    overallRating: number;
    percentRecommended: number;
    totalRatings: number;
}

export class FadReviewsList implements FadReviewsListInterface {
    name: string;
    questionAnswer: FadQuestionAnswerListModel[];
}

export class FadQuestionAnswerListModel implements FadQuestionAnswerListInterface {
    question: string;
    answers: FadAnswerListModel[];
}

export class FadAnswerListModel implements FadAnswerListInterface {
    answer: string;
    answerPercent: string;
}
