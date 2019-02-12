import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AuthService } from './../../../shared/services/auth.service';
import { ConstantsService } from './../../../shared/services/constants.service';
import { AuthHttp } from '../../../shared/services/authHttp.service';
import { BcbsmaHttpService } from '../../../shared/services/bcbsma-http.service';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
import * as moment from 'moment';
import {
  GetPlansBenefitsListResponseModelInterface,
  GetPlansBenefitsListRequestModelInterface,
  GetPlansBenefitsListPlanItemInterface
} from '../modals/interfaces/get-plans-benefits-list-models.interface';
import { GetPlansBenefitsListRequestModel } from '../modals/get-plans-benefits-list.model';
import {
  GetBenefitCoverageRequestModelInterface,
  GetBenefitCoverageResponseModelInterface,
  EocPolicyInterface
} from '../modals/interfaces/getBenefitCoverage-models.interface';
import { GetBenefitCoverageRequestModel } from '../modals/getBenefitCoverage.model';
import { sessionStorageFactory } from 'angular-webstorage-service';

@Injectable()
export class DocumentsService {

  private selectedPlan: GetPlansBenefitsListPlanItemInterface = null;
  private selectedPolicy: EocPolicyInterface = null;
  private planBenefitsList: GetPlansBenefitsListResponseModelInterface;

  constructor(private http: AuthHttp,
    private authService: AuthService,
    private constants: ConstantsService) { }

  public getSelectedPlan(): GetPlansBenefitsListPlanItemInterface {
    return this.selectedPlan ? this.selectedPlan
      : JSON.parse(sessionStorage.getItem('messageCenter_selectedPlan'));
  }

  public setSelectedPlan(selectedPlan: GetPlansBenefitsListPlanItemInterface) {
    this.selectedPlan = selectedPlan;
    sessionStorage.setItem('messageCenter_selectedPlan', JSON.stringify(selectedPlan));
  }

  public getSelectedPolicy(): EocPolicyInterface {
    return this.selectedPolicy ? this.selectedPolicy
      : JSON.parse(sessionStorage.getItem('messageCenter_selectedPolicy'));
  }

  public setSelectedPolicy(selectedPolicy: EocPolicyInterface) {
    this.selectedPolicy = selectedPolicy;
    sessionStorage.setItem('messageCenter_selectedPolicy', JSON.stringify(selectedPolicy));
  }

  public getPlanBenefitsList(): GetPlansBenefitsListResponseModelInterface {
    return this.planBenefitsList ? this.planBenefitsList
      : JSON.parse(sessionStorage.getItem('messageCenter_GetPlanBenefitsListResponse'));
  }

  public setPlanBenefitsList(planBenefitsList: GetPlansBenefitsListResponseModelInterface) {
    this.planBenefitsList = planBenefitsList;
    sessionStorage.setItem('messageCenter_GetPlanBenefitsListResponse', JSON.stringify(planBenefitsList));
  }

  public getPlanDetailsList(): Observable<GetPlansBenefitsListResponseModelInterface> {

    const request: GetPlansBenefitsListRequestModelInterface = new GetPlansBenefitsListRequestModel();
    request.useridin = this.authService.useridin;
    request.effectiveDate = moment().format('YYYY-MM-DD');

    return this.http.encryptPost(this.constants.getPlansBenefitsListUrl, request).map(response => {
      if (response.result < 0) {
        this.setPlanBenefitsList(null);
        return <GetPlansBenefitsListResponseModelInterface>response;
      } else {
        const planBenefitsListResponse: GetPlansBenefitsListResponseModelInterface
          = <GetPlansBenefitsListResponseModelInterface>response;
        if (planBenefitsListResponse.result && planBenefitsListResponse.result < 0) {
          this.setPlanBenefitsList(null);
          return;
        } else {
          this.setPlanBenefitsList(planBenefitsListResponse);
          return planBenefitsListResponse;
        }
      }
    });
  }

  public getBenefitCoverageList(): Observable<GetBenefitCoverageResponseModelInterface> {

    const request: GetBenefitCoverageRequestModelInterface = new GetBenefitCoverageRequestModel();
    const selectedPlan: GetPlansBenefitsListPlanItemInterface = this.getSelectedPlan();

    request.setUseridin(this.authService.useridin)
      .setPlanName(selectedPlan.planName)
      .setCoveragePackageCode(selectedPlan.coveragePackageCode);

    return this.http.encryptPost(this.constants.getBenefitsCoverageUrl, request).map(response => {
      if (response.result < 0) {
        sessionStorage.setItem('messageCenter_GetBenefitCoverageResponse', null);
        return <GetBenefitCoverageResponseModelInterface>response;
      } else {
        const benefitCoverageResponse: GetBenefitCoverageResponseModelInterface
          = <GetBenefitCoverageResponseModelInterface>response;
        if (benefitCoverageResponse.result && benefitCoverageResponse.result < 0) {
          sessionStorage.setItem('messageCenter_GetBenefitCoverageResponse', null);
          return;
        } else {
          sessionStorage.setItem('messageCenter_GetBenefitCoverageResponse', JSON.stringify(benefitCoverageResponse));
          return benefitCoverageResponse;
        }
      }
    });
  }
}
