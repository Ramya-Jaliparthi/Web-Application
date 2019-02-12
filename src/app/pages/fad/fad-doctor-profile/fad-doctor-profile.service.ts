import { Injectable } from '@angular/core';
import { FadProfessionalInterface } from '../modals/interfaces/getSearchByProfessional-models.interface';
import {
  GetSearchByProviderRequestModelInterface,
  GetSearchByProviderResponseModelInterface
} from '../modals/interfaces/getSearchByProvider-models.interface';
import { Observable } from 'rxjs/Observable';
import { HttpParams, HttpClient } from '@angular/common/http';
import { FadConstants } from '../constants/fad.constants';
import { AuthHttp } from '../../../shared/services/authHttp.service';
import {
  FadDoctorProfileRequestModelInterface,
  FadProfessionalResponseModelInterface,
  FadDoctorRatingsRequestModelInterface,
  FadDoctorRatingsResponseModelInterface
} from '../modals/interfaces/fad-doctor-profile-details.interface';
import { FadDoctorRatingsResponseModel } from '../modals/fad-doctor-profile-details.model';

@Injectable()
export class FadDoctorProfileService {

  public doctorProfile: any;
  constructor(private http: AuthHttp, private simphttp: HttpClient) { }

  getFadGetprofessionalprofileDetails(request: FadDoctorProfileRequestModelInterface)
    : Observable<FadProfessionalResponseModelInterface> {

    let params = new HttpParams();

    // tslint:disable-next-line:forin
    for (const key in request) {
      params = params.append(key.toString(), request[key]);
    }

    return this.http.encryptPost(FadConstants.urls.professionalprofile,
      request, '', '', false).map(response => {
        return response;
      });
  }

  getProfessionalratings(request: FadDoctorRatingsRequestModelInterface): Observable<FadDoctorRatingsResponseModelInterface> {
    let params = new HttpParams();

    // tslint:disable-next-line:forin
    for (const key in request) {
      params = params.append(key.toString(), request[key]);
    }

    // return this.http.encryptPost(FadConstants.urls.professionalprofile,
    // request, '', '', false).map(response => {
    //   return response;
    // });

    // temp files
    return this.simphttp.get(FadConstants.jsonurls.fadGetprofessionalratings).map(res => {
      return <FadDoctorRatingsResponseModel>res;
    });
  }
}
