import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { AuthHttp } from '../../shared/services/authHttp.service';
import { ConstantsService } from '../../shared/services/constants.service';
import { MyPlansConstants } from './constants/my-plans.constants';
import { AuthService } from '../../shared/services/auth.service';
import {
  PlanBenefitsListResponseModelInterface,
  PlanBenefitsListRequestModelInterface
} from './models/interfaces/plan-benefits-list-model.interface';
import { PlanBenefitsListRequestModel } from './models/plan-benefits-list.model';
import {
  GetPlanBenefitServicesRequestModelInterface,
  GetPlanBenefitServicesResponseModelInterface
} from './models/interfaces/plans-benefits-service-model.interface';
import { PlanEntityInterface, PlanEntityMemberInterface } from './models/interfaces/plan-benefits-page-adapted-data-model.inteface';
import { NetworkType } from './models/interfaces/benefits-model.interface';
import {
  LimitationResponseInterface,
  AuthReferralResponseInterface,
  BenefitDetailsResponseInterface
} from './models/interfaces/benefit-details-model.interface';
import { GetPlanBenefitServicesRequestModel } from './models/plans-benefits-service.model';

@Injectable()
export class MyplansService {

  private planBenefitRequest: GetPlanBenefitServicesRequestModelInterface = null;
  private selectedPlanEntity: PlanEntityInterface = null;
  private planBenefits: GetPlanBenefitServicesResponseModelInterface;
  private serviceBenefitCategoryName: string = ''; // To Do

  constructor(private http: AuthHttp,
    private constants: ConstantsService,
    private router: Router,
    private authService: AuthService) {
  }

  public getPlanBenefits() {
    return this.planBenefits;
  }

  public setPlanBenefits(planBenefits) {
    this.planBenefits = planBenefits;
  }

  public setPlanBenefitRequest(planBenefitRequest: GetPlanBenefitServicesRequestModelInterface) {
    this.planBenefitRequest = planBenefitRequest;
    sessionStorage.setItem('myplans.selectedPlan', JSON.stringify(planBenefitRequest));
  }

  public getPlanBenefitRequest(): GetPlanBenefitServicesRequestModelInterface {
    if (this.planBenefitRequest) {
      return this.planBenefitRequest;
    } else {
      const plan = sessionStorage.getItem('myplans.selectedPlan');
      if (plan) {
        return JSON.parse(plan);
      } else {
        return null;
      }
    }
  }

  public setSelectedPlanEntity(setSelectedPlanEntity: PlanEntityInterface) {
    this.selectedPlanEntity = setSelectedPlanEntity;
    sessionStorage.setItem('myplans.selectedPlanEntity', JSON.stringify(setSelectedPlanEntity));
  }

  public getSelectedPlanEntity(): PlanEntityInterface {
    if (this.selectedPlanEntity) {
      return this.selectedPlanEntity;
    } else {
      const selectedPlanEntity = sessionStorage.getItem('myplans.selectedPlanEntity');
      if (selectedPlanEntity) {
        return JSON.parse(selectedPlanEntity);
      } else {
        return <PlanEntityInterface>{};
      }
    }
  }

  public getServiceBenefitCategoryName(): string {
    if (this.serviceBenefitCategoryName) {
      return this.serviceBenefitCategoryName;
    } else {
      const serviceBenefitCategoryName = sessionStorage.getItem('myplans.serviceBenefitCategoryName');
      if (serviceBenefitCategoryName) {
        return JSON.parse(serviceBenefitCategoryName);
      } else {
        return '';
      }
    }
  }

  public setServiceBenefitCategoryName(serviceBenefitCategoryName: string) {
    this.serviceBenefitCategoryName = serviceBenefitCategoryName;
    sessionStorage.setItem('myplans.serviceBenefitCategoryName', JSON.stringify(serviceBenefitCategoryName));
  }

  getPlansData(effectiveDate: string): Observable<PlanBenefitsListResponseModelInterface> {
    const request: PlanBenefitsListRequestModelInterface = new PlanBenefitsListRequestModel();
    request.useridin = this.authService.useridin;
    request.effectiveDate = effectiveDate;

    return this.http.encryptPost(this.constants.getPlansBenefitsListUrl, request).map(response => {
      if (response.result < 0) {
        return <PlanBenefitsListResponseModelInterface>response;
      } else {
        const planBenefitsListResponse: PlanBenefitsListResponseModelInterface = <PlanBenefitsListResponseModelInterface>response;
        console.log('Getplansbenefitslist', planBenefitsListResponse);
        if (planBenefitsListResponse['type'] !== 'error') {
          if (planBenefitsListResponse.fault && planBenefitsListResponse.fault.faultstring) {
            return;
          } else {
            return planBenefitsListResponse;
          }
        }
      }
    });
  }

  getPlanBenefitServices(checkAvailablility: boolean, sortFlag?: string): Observable<GetPlanBenefitServicesResponseModelInterface> {
    if (!this.getPlanBenefitRequest()) {
      this.router.navigate(['home']);
      return Observable.throw(new Error('Invalid Request'));
    }
    if (checkAvailablility) {
      const benefits = this.getPlanBenefits();
      if (benefits && benefits.planBenefits.length > 0) {
        return Observable.of(benefits);
      }
    }
    const request = Object.assign(this.getPlanBenefitRequest(), {
      sortFlag: sortFlag || 'A-Z'
    });
    return this.http.encryptPost(this.constants.getPlanBenefitServicesUrl, request).map(response => {
      const planmemberCostTextResponse: GetPlanBenefitServicesResponseModelInterface
        = <GetPlanBenefitServicesResponseModelInterface>response;
      console.log('getplansbenefitsservices', planmemberCostTextResponse);
      if (planmemberCostTextResponse.planBenefits) {
        this.setPlanBenefits(planmemberCostTextResponse);
      }
      return planmemberCostTextResponse;
    });
  }

  getPlanBenefitDetails(): Observable<BenefitDetailsResponseInterface> {
    if (!this.getPlanBenefitRequest()) {
      this.router.navigate(['home']);
      return Observable.throw(new Error('Invalid Request'));
    }
    const request = Object.assign(this.getPlanBenefitRequest(), {
      benefitCategoryName: this.getServiceBenefitCategoryName()
    });
    return this.http.encryptPost(this.constants.getPlanBenefitDetailsUrl, request).map(response => {
      return response;
    });
  }

  getLimitationText(): Observable<LimitationResponseInterface> {
    if (!this.getPlanBenefitRequest()) {
      this.router.navigate(['home']);
      return Observable.throw(new Error('Invalid Request'));
    }
    const request = Object.assign(this.getPlanBenefitRequest(), {
      benefitCategoryName: this.getServiceBenefitCategoryName()
    });
    return this.http.encryptPost(this.constants.getLimitationTextUrl, request).map(response => {
      return response;
    });
  }

  getAuthReferral(): Observable<AuthReferralResponseInterface> {
    const request = Object.assign(this.getPlanBenefitRequest(), {
      state: this.getSelectedPlanEntity().pcpState,
      benefitCategoryName: this.getServiceBenefitCategoryName(),
      planEffectiveDate: this.getSelectedPlanEntity().effectiveStartDate
    });
    return this.http.encryptPost(this.constants.getAuthReferralUrl, request).map(response => {
      return response;
    });
  }

  getNetworkString(network: string): string {
    if (network === NetworkType.inNetwork || network === 'I' || network === MyPlansConstants.network.inNetwork) {
      return MyPlansConstants.network.inNetwork;
    } else if (network === NetworkType.outOfNetwork || network === 'O' || network === MyPlansConstants.network.outNetwork) {
      return MyPlansConstants.network.outNetwork;
    } else if (network === NetworkType.inNetworkAndOutOfNetworkCombined || network === 'C'
    || network === MyPlansConstants.network.combined) {
      return MyPlansConstants.network.combined;
    }
  }

  getStyledHtmlText(str: string): string {
    if (str === null || str === undefined) {
      return;
    }
    const currencyMatch = str.match(/[$]/i);
    const percentMatch = str.match(/([0-9]+)[%]/i);
    for (let i = 0; i < MyPlansConstants.regexMatch.length; i++) {
      const customMatch = str.match(new RegExp(MyPlansConstants.regexMatch[i], 'i'));
      if (currencyMatch && currencyMatch.length > 0) {
        if (customMatch && customMatch.length > 0 && customMatch.index > currencyMatch.index) {
          return str.substring(0, currencyMatch.index) +
          '<span class="bold">' + str.substring(currencyMatch.index, (customMatch.index + customMatch[0].length)) + '</span>' +
          str.substring((customMatch.index + customMatch[0].length), str.length);
        }
      }
      if (percentMatch && percentMatch.length > 0) {
        if (customMatch && customMatch.length > 0 && customMatch.index > percentMatch.index) {
          return str.substring(0, percentMatch.index) +
          '<span class="bold">' + str.substring(percentMatch.index, (customMatch.index + customMatch[0].length)) + '</span>' +
          str.substring((customMatch.index + customMatch[0].length), str.length);
        }
      }
    }
    if (str === MyPlansConstants.noCostText || str === MyPlansConstants.noLimitText) {
      return '<span class="bold">' + str + '</span>';
    }
    return str;
  }
}
