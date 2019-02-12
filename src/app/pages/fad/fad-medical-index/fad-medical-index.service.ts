import { Injectable } from '@angular/core';
import { FadMedicalIndexRequestModal } from '../modals/fad-medical-index.modal';
import { BcbsmaHttpService } from '../../../shared/services/bcbsma-http.service';
// import { FadVitalsSpecialitiesSearchResponseModelInterface } from '../modals/interfaces/fad-vitals-collection.interface';
import { Observable } from 'rxjs/Observable';
import { FadConstants } from '../constants/fad.constants';
import { FadMedicalIndexParamType } from '../modals/types/fad.types';
import {
  GetSearchBySpecialityResponseModelInterface,
  GetSearchBySpecialityRequestModelInterface
} from '../modals/interfaces/getSearchBySpeciality-models.interface';
import { AuthHttp } from '../../../shared/services/authHttp.service';
import { GetSearchBySpecialityRequestModel } from '../modals/getSearchBySpeciality.model';
import { AuthService } from '../../../shared/shared.module';
@Injectable()
export class FadMedicalIndexService {

  constructor(private bcbsmaHttpService: BcbsmaHttpService, private http: AuthHttp, private authService: AuthService) { }

  public fetchMedicalIndex(request: FadMedicalIndexRequestModal): Observable<GetSearchBySpecialityResponseModelInterface> {

    if (request.type === FadMedicalIndexParamType.procedures) {
      const url = FadConstants.jsonurls.fadVitalsSpecialitiesUrl;
      return this.bcbsmaHttpService.get(url);
    } else if (request.type === FadMedicalIndexParamType.specialities) {
      const specialitySearchReq: GetSearchBySpecialityRequestModelInterface = new GetSearchBySpecialityRequestModel();
      specialitySearchReq.setUserId(this.authService.useridin).setNetworkId(FadConstants.defaults.networkId + '');

      return this.http.encryptPost(FadConstants.urls.fadVitalsSpecialitiesUrl,
        specialitySearchReq).map(response => {
          return response;
        });
    }

  }

}
