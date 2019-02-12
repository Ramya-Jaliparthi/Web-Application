import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthHttp } from '../../../shared/services/authHttp.service';
import { GlobalService } from '../../../shared/services/global.service';
import { ConstantsService } from '../../../shared/shared.module';
import { RxDetailsRequestModelInterface, RxDetailsResponseModelInterface } from '../models/interfaces/rx-details-model.interface';
import { RxDetailsResponseModel } from '../models/rx-details.model';
import { AlertService } from '../../../shared/services/alert.service';
import { AlertType } from '../../../shared/alerts/alertType.model';

@Injectable()
export class MyMedicationDetailsService {

  private myMedicationDetailsRequest: RxDetailsRequestModelInterface = null;
  private isDependentUser: boolean = false;
  private dependentMemberInfo: string = '';

  constructor(private http: AuthHttp,
    private constants: ConstantsService,
    private alertService: AlertService,
    private globalService: GlobalService) { }

  public setCurrentUserInfo(isDependentUser, dependentMemberInfo): MyMedicationDetailsService {
    this.isDependentUser = isDependentUser;
    this.dependentMemberInfo = dependentMemberInfo;
    return this;
  }

  public getCurrentUserInfo() {
    return { 'isDependentUser': this.isDependentUser, 'dependentMemberInfo': this.dependentMemberInfo };
  }

  public setMyMedicationDetailsRequest(myMedicationDetailsRequest: RxDetailsRequestModelInterface): MyMedicationDetailsService {
    this.myMedicationDetailsRequest = myMedicationDetailsRequest;
    return this;
  }

  public getMyMedicationDetailsRequest(): RxDetailsRequestModelInterface {
    return this.myMedicationDetailsRequest;
  }

  public getMedicationDetails(): Observable<RxDetailsResponseModelInterface> {
    sessionStorage.setItem('medicationDetailRequest', JSON.stringify(this.myMedicationDetailsRequest));
    sessionStorage.setItem('medicationDependentMemberInfo', JSON.stringify(this.dependentMemberInfo));
    const url = this.myMedicationDetailsRequest && this.myMedicationDetailsRequest.dependentId ?
      this.constants.depMedicationsDetailsUrl : this.constants.medicationsDetailsUrl;
    console.log('Dependent Medications Request', url, this.myMedicationDetailsRequest);
    return this.http.encryptPost(url, this.myMedicationDetailsRequest).map(response => {
      if (response.result < 0) {
        this.alertService.setAlert('', response['displaymessage'], AlertType.Failure);
        return null;
      } else {
        return <RxDetailsResponseModel>response;
      }
    });
  }

}
