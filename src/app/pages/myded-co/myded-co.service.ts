import { Injectable } from '@angular/core';
import { AuthHttp } from '../../shared/services/authHttp.service';
import { ConstantsService, AuthService } from '../../shared/shared.module';
import { DependantsService } from '../../shared/services/dependant.service';
import { Observable } from 'rxjs/Observable';
import { DependentsResponseModelInterface } from '../myclaims/models/interfaces/dependants-model.interface';
import {
  GetFamilyDeductiblesResponseInterface,
  GetFamilyDeductiblesRequestInterface
} from './models/interfaces/getFamilyDeductibles-model.interface';
import { GetFamilyDeductiblesRequest } from './models/getFamilyDeductibles.model';
import { BcbsmaerrorHandlerService } from '../../shared/services/bcbsmaerror-handler.service';
import { BcbsmaConstants } from '../../shared/constants/bcbsma.constants';
import { MyDedCoConstants } from './myded-co.constants';
import { FilterSelectionItemInterface } from '../../shared/components/filter/filter-model.interface';
import {
  GetIndDeductiblesRequestInterface,
  GetIndDeductiblesResponseInterface
} from './models/interfaces/getIndDeductibles-model.interface';
import { GetIndDeductiblesRequest } from './models/getIndDeductibles.model';

@Injectable()
export class MyDedCoService {

  constructor(
    private http: AuthHttp,
    private constants: ConstantsService,
    public dependantsService: DependantsService,
    public authService: AuthService,
    private bcbsmaErrorHandler: BcbsmaerrorHandlerService) {
  }

  getDeductiblesAndCoinsuranceInfo(): Observable<GetFamilyDeductiblesResponseInterface> {

    const request: GetFamilyDeductiblesRequestInterface = new GetFamilyDeductiblesRequest();
    request.useridin = this.authService.useridin;

    return this.http.encryptPost(this.constants.getfamilydeductiblesUrl, request).map(response => {
      const familyDeductiblesResponse: GetFamilyDeductiblesResponseInterface = <GetFamilyDeductiblesResponseInterface>response;
      console.log('GetFamilyDeductiblesResponse', familyDeductiblesResponse);
      return familyDeductiblesResponse;
    });
  }


  getIndividualDeductiblesAndCoinsuranceInfo(selectedMember: FilterSelectionItemInterface): Observable<GetIndDeductiblesResponseInterface> {
    const getIndDeductiblesRequest: GetIndDeductiblesRequest = new GetIndDeductiblesRequest();

    getIndDeductiblesRequest.member.setSubscriberNo(selectedMember.selectedOption.subscriberNo)
      .setMemberSuffix(selectedMember.selectedOption.memSuffix === '' ?
        selectedMember.selectedOption.loggedinUserSuffix : selectedMember.selectedOption.memSuffix)
      .setCoverageType(selectedMember.selectedOption.coverageType)
      .setUseridin(this.authService.useridin);

    return this.http.encryptPost(this.constants.getindividualdeductiblesUrl, getIndDeductiblesRequest)
      .map((individualDeductiblesResponse) => {
        if (individualDeductiblesResponse) {
          console.log('GetIndividualDeductiblesAndCoinsuranceResponse', individualDeductiblesResponse);
          if (individualDeductiblesResponse.result && individualDeductiblesResponse.result < 0) {
            this.bcbsmaErrorHandler.logError(individualDeductiblesResponse.errormessage, BcbsmaConstants.modules.myDedCoModule
              , MyDedCoConstants.service.myDedCoService, MyDedCoConstants.methods.getIndividualDeductiblesAndCoinsuranceInfo);
            return null;
          }

          return <GetIndDeductiblesResponseInterface>individualDeductiblesResponse;
        } else {
          return null;
        }
      });
  }

  getDependents(): Observable<DependentsResponseModelInterface | {}> {
    return this.dependantsService.fetchDependentsList().catch(() => {
      return Observable.empty();
    });
  }

}
