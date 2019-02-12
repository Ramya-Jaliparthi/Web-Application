import { Injectable } from '@angular/core';
import { AuthHttp } from '../../../shared/services/authHttp.service';
import {
  FadFacilityProfileRequestModelInterface,
  FadFacilityResponseModelInterface
} from '../modals/interfaces/fad-facility-profile-details.interface';
import { Observable } from 'rxjs/Observable';
import { HttpParams } from '@angular/common/http';
import { FadConstants } from '../constants/fad.constants';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FadFacilityProfileService {

  public facilityProfile: any;
  constructor(private http: AuthHttp) { }

  getFadGetprofessionalprofileDetails(request: FadFacilityProfileRequestModelInterface)
    : Observable<FadFacilityResponseModelInterface> {

    let params = new HttpParams();

    // tslint:disable-next-line:forin
    for (const key in request) {
      params = params.append(key.toString(), request[key]);
    }

    return this.http.encryptPost(FadConstants.urls.facilityProfile, request, '', '', false).map(response => {
      return response;
    });
  }
}
