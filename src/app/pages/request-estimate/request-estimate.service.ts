import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../shared/services/auth.service';
import {
  GetMemBasicInfoRequestModelInterface,
  GetMemBasicInfoResponseModelInterface
} from '../medications/models/interfaces/get-member-basic-info-model.interface';
import {
  GetMemBasicInfoRequestModel,
  GetMemBasicInfoResponseModel
} from '../medications/models/get-member-basic-info.model';
import { ConstantsService } from '../../shared/services/constants.service';
import { AuthHttp } from '../../shared/services/authHttp.service';
import {
  GetRecentVisitsRequestModelInterface,
  GetRecentVisitsResponseModelInterface
} from '../mydoctors-pcp/models/interfaces/get-recent-visits-models.interface';
import { MyDoctorsGenericRequestModel, VisitsResponse } from '../mydoctors-pcp/models/my-doctor-module-common.model';
import { GetRequestEstimateDetailsRequestModel } from './models/get-request-estimate-details.model';
import {
  GetRequestEstimateDetailsResponseModelInterface,
  GetRequestEstimateDetailsRequestModelInterface
} from './models/interfaces/get-request-estimate-details-models.interface';
import {
  SubmitRequestEstimateDetailsRequestModelInterface,
  SubmitRequestEstimateDetailsResponseModelInterface
} from './models/interfaces/submit-request-estimate-details-models.inteface';
import { SubmitRequestEstimateDetailsRequestModel } from './models/submit-request-estimate-details.model';
import {
  GetDependentRecentVisitsRequestModelInterface,
  GetDependentRecentVisitsResponseModelInterface
} from '../mydoctors-pcp/models/interfaces/get-dependent-recent-visits-model.interface';

@Injectable()
export class RequestEstimateService {

  constructor(private authService: AuthService,
    private http: AuthHttp,
    private constants: ConstantsService) {
  }

  getMemBasicInfo(): Observable<GetMemBasicInfoResponseModelInterface> {
    if (this.authService.basicMemInfo) {
      return Observable.of(this.authService.basicMemInfo);
    }
    console.log('getMemBasicInfo');
    const request: GetMemBasicInfoRequestModelInterface = new GetMemBasicInfoRequestModel();
    request.useridin = this.authService.useridin;

    return this.http.encryptPost(this.constants.getMemBasicInfoUrl, request).map(response => {
      if (response.result < 0) {
        return new GetMemBasicInfoResponseModel();
      } else {
        const basicInfo = new GetMemBasicInfoResponseModel();
        basicInfo.rxSummary = response.getMemBasicInfoResponse;
        this.authService.basicMemInfo = basicInfo;
        return <GetMemBasicInfoResponseModel>basicInfo;
      }
    });
  }

  getRecentVisits(): Observable<GetRecentVisitsResponseModelInterface> {
    console.log('getRecentVisits');
    const request: GetRecentVisitsRequestModelInterface = new MyDoctorsGenericRequestModel();
    request.useridin = this.authService.useridin;

    // return this.http
    //   .post(this.constants.getRecentVisitsUrl, request)
    //   .map(response => {
    //     return <GetRecentVisitsResponseModelInterface>response;
    //   });
    return this.http.encryptPost(this.constants.myDoctorListUrl, request).map(response => {
      return <GetRecentVisitsResponseModelInterface>response;
    });
  }

  getDependentRecentVisits(dependentsData): Observable<GetDependentRecentVisitsResponseModelInterface> {
    console.log('getDependentRecentVisits', dependentsData);
    const request: GetDependentRecentVisitsRequestModelInterface = new MyDoctorsGenericRequestModel();
    request.useridin = this.authService.useridin;
    request.dependentId = dependentsData.dependent ? dependentsData.dependent.depId : '';
    return this.http.encryptPost(this.constants.myDepDoctorListUrl, request).map(response => {
      return <GetDependentRecentVisitsResponseModelInterface>response;
    });
  }

  getRequestEstimate(): Observable<GetRequestEstimateDetailsResponseModelInterface> {
    console.log('getRequestEstimate');
    const request: GetRequestEstimateDetailsRequestModelInterface = new GetRequestEstimateDetailsRequestModel();
    request.useridin = this.authService.useridin;

    return this.http.encryptPost(this.constants.getRequestEstimateUrl, request).map(response => {
      return <GetRequestEstimateDetailsResponseModelInterface>response;
    });

  }

  submitrequestestimatedetails(request: SubmitRequestEstimateDetailsRequestModelInterface):
    Observable<SubmitRequestEstimateDetailsResponseModelInterface> {
    console.log('submitrequestestimatedetails');
    // const request: SubmitRequestEstimateDetailsRequestModelInterface = new SubmitRequestEstimateDetailsRequestModel();
    // request.useridin = this.authService.useridin;
    return this.http.encryptPost(this.constants.submitrequestestimatedetailsUrl, request).map(response => {
      return <SubmitRequestEstimateDetailsResponseModelInterface>response;
    });
  }
}
