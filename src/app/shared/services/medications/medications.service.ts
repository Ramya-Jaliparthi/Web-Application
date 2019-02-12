import {DatePipe} from '@angular/common';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AuthService, ConstantsService} from '../../shared.module';
import {
  RecentRxResponseModelInterface,
  RecentRxRequestModelInterface
} from '../../../pages/medications/models/interfaces/recent-rx-model.interface';
import {RecentRxRequestModel, RecentRxResponseModel} from '../../../pages/medications/models/recent-rx.model';
import {
  GetMemBasicInfoResponseModelInterface,
  GetMemBasicInfoRequestModelInterface
} from '../../../pages/medications/models/interfaces/get-member-basic-info-model.interface';
import {GetMemBasicInfoRequestModel, GetMemBasicInfoResponseModel} from '../../../pages/medications/models/get-member-basic-info.model';
import {DependentRecentRxResponseModelInterface} from '../../../pages/medications/models/interfaces/dependant-recent-rx-model.interface';
import {AuthHttp} from '../authHttp.service';

@Injectable()
export class MedicationsService {

  constructor(private http: AuthHttp,
              private constants: ConstantsService,
              private authService: AuthService,
              private datePipe: DatePipe) {
  }

  getBasicMemInfo(): GetMemBasicInfoResponseModelInterface {
    return this.authService.basicMemInfo;
  }

  setBasicMemInfo(basicMemInfo: GetMemBasicInfoResponseModelInterface): MedicationsService {
 	    this.authService.basicMemInfo = basicMemInfo;
    return this;
  }


  getMemBasicInfo(): Observable<GetMemBasicInfoResponseModelInterface> {
    if (this.authService.basicMemInfo) {
      return Observable.of(this.authService.basicMemInfo);
    }
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

  getMedications(): Observable<RecentRxResponseModelInterface> {

    const request: RecentRxRequestModelInterface = new RecentRxRequestModel();
    request.useridin = this.authService.useridin;

    return this.http.encryptPost(this.constants.medicationsUrl, request).map(response => {
      if (response.result < 0) {
        return new RecentRxResponseModel();
      } else {
        return <RecentRxResponseModel>response;
      }
    });
  }
}
