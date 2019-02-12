import {
    // FadVitalsAutoCompleteSearchRequestModelInterface,
    FadZipCodeSearchResponseModelInterface,
    FadPlanSearchResponseModelInterface,
    FadVitalsSearchHistoryResponseModelInterface,
    FVSHRSearchHistoryInterface,
    // FadVitalsZipCodeSearchRequestModelInterface,
    DoctorProfileSearchRequestModelInterface,
    FacilityProfileSearchRequestModelInterface,
    FADPlanSearchRequestModelInterface,
    FadVitalsZipCodeSearchRequestModelInterface,
    // FadSearchRequestByProfessionalModelInterface
} from './interfaces/fad-vitals-collection.interface';

// export class FadVitalsAutoCompleteSearchRequestModel implements FadVitalsAutoCompleteSearchRequestModelInterface {
//     public searchparam: string;
//     public geo_location: string; // "lattitude,longitude"
//     public limit: number;
//     public network_id: number;
//     public accountId: number;
// }

export class FadZipCodeSearchResponseModel implements FadZipCodeSearchResponseModelInterface {
    public cities: FZCSRCity[];
}

export class FadPlanSearchResponseModel implements FadPlanSearchResponseModelInterface {
    public plans: FPSRPlan[];
}

export class FZCSRCity {
    public name: string = '';
    public city: string = '';
    public county: string = '';
    public state: string = '';
    public state_code: string = '';
    public score: number = 0;
    public zip: string = '';
    public geo: string = '';
    public lat: string = '';
    public lng: string = '';
    public place_id: string = '';

    public getName(): string {
        return this.name;
    }

    public setName(name: string): FZCSRCity {
        this.name = name;
        return this;
    }
    public getCity(): string {
        return this.city;
    }

    public setCity(city: string): FZCSRCity {
        this.city = city;
        return this;
    }
    public getCounty(): string {
        return this.county;
    }

    public setCounty(county: string): FZCSRCity {
        this.county = county;
        return this;
    }
    public getState(): string {
        return this.state;
    }

    public setState(state: string): FZCSRCity {
        this.state = state;
        return this;
    }
    public getState_code(): string {
        return this.state_code;
    }

    public setState_code(state_code: string): FZCSRCity {
        this.state_code = state_code;
        return this;
    }
    public getScore(): number {
        return this.score;
    }

    public setScore(score: number): FZCSRCity {
        this.score = score;
        return this;
    }
    public getZip(): string {
        return this.zip;
    }

    public setZip(zip: string): FZCSRCity {
        this.zip = zip;
        return this;
    }
    public getGeo(): string {
        return this.geo;
    }

    public setGeo(geo: string): FZCSRCity {
        this.geo = geo;
        return this;
    }
    public getLat(): string {
        return this.lat;
    }

    public setLat(lat: string): FZCSRCity {
        this.lat = lat;
        return this;
    }
    public getLng(): string {
        return this.lng;
    }

    public setLng(lng: string): FZCSRCity {
        this.lng = lng;
        return this;
    }
    public getPlace_id(): string {
        return this.place_id;
    }

    public setPlace_id(place_id: string): FZCSRCity {
        this.place_id = place_id;
        return this;
    }



}

export class FPSRPlan {
    public id: number;
    public name: string;
}

export class FadVitalsSearchHistoryResponseModel implements FadVitalsSearchHistoryResponseModelInterface {
    searchHistory: FVSHRSearchHistory[];
}

export class FVSHRSearchHistory implements FVSHRSearchHistoryInterface {
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

export class FadVitalsZipCodeSearchRequestModel implements FadVitalsZipCodeSearchRequestModelInterface {
    public place: string;
    public page: number;
    public limit: number;
}

export class DoctorProfileSearchRequestModel implements DoctorProfileSearchRequestModelInterface {
    public professionalid: string;
    public geo_location: string; // "lattitude,longitude"
    public network_id: string;
    public userid: string;
}

export class FacilityProfileSearchRequestModel implements FacilityProfileSearchRequestModelInterface {
    public facility: string;
    public geolocation: string; // "lattitude,longitude"
    public network_id: string;
    public location_id: string;
}

export class FADPlanSearchRequestModel implements FADPlanSearchRequestModelInterface {
    public uid: string;
}

// export class FadSearchRequestByProfessionalModel implements FadSearchRequestByProfessionalModelInterface {
//     public geoLocation: string; // "lattitude,longitude"
//     public limit: number;
//     public page: number;
//     public radius: number;
//     public networkId: number;
//     public searchSpecialtyId: number;
//     public name: string;
// }
