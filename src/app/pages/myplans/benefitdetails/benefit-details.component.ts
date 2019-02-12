import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MyplansService } from '../myplans.service';
import { GlobalService } from '../../../shared/services/global.service';
import { ConstantsService } from '../../../shared/services/constants.service';
import { AlertService } from '../../../shared/services/alert.service';
import { AlertType } from '../../../shared/alerts/alertType.model';
import { MyPlansConstants } from '../constants/my-plans.constants';
import {
  LimitationResponseInterface,
  AuthReferralResponseInterface,
  BenefitDetailsResponseInterface
} from '../models/interfaces/benefit-details-model.interface';
import { NetworkType } from '../models/interfaces/benefits-model.interface';

@Component({
  selector: 'app-benefit-details',
  templateUrl: './benefit-details.component.html',
  styleUrls: ['./benefit-details.component.scss']
})
export class BenefitDetailsComponent implements OnInit, OnDestroy {
  benefitDetails;
  planBenefits;
  authReferralDetails;
  authReferralErrorText;
  serviceProviders;
  limitationDetails;
  hideLimitationContentAndBanner: boolean = false;
  networkType = NetworkType;
  benefitName: string = '';
  keys = Object.keys;
  displayState: boolean = false;
  fpoTargetUrl: string;
  constructor(private alertService: AlertService,
    public myPlansService: MyplansService,
    private constants: ConstantsService,
    private globalService: GlobalService,
    private route: ActivatedRoute) {
    this.benefitName = this.myPlansService.getServiceBenefitCategoryName();
    this.displayState = this.myPlansService.getSelectedPlanEntity().pcpState ? true : false;
    this.fpoTargetUrl = this.constants.drupalMyBenefitsDetailsUrl;
  }

  ngOnInit() {
    const resolvedData = this.route.snapshot.data;
    if (resolvedData && resolvedData.benefitDetails && resolvedData.benefitDetails.length > 0) {
      if (resolvedData.benefitDetails[0]['result'] < 0) {
        this.alertService.setAlert(resolvedData.benefitDetails[0]['displaymessage'], '', AlertType.Failure);
      } else if (resolvedData.benefitDetails[1]['result'] < 0) {
        if (resolvedData.benefitDetails[1]['result'] === -91339) {
          this.hideLimitationContentAndBanner = true;
        } else {
          this.hideLimitationContentAndBanner = false;
          this.alertService.setAlert(resolvedData.benefitDetails[1]['displaymessage'], '', AlertType.Failure);
        }
        this.populateBenefits(resolvedData.benefitDetails[0]);
        this.checkAuthReferral();
      } else {
        this.populateBenefits(resolvedData.benefitDetails[0]);
        this.limitationDetails = resolvedData.benefitDetails[1].RowSet.Rows;
        this.checkAuthReferral();
      }
    } else {
      this.getBenefitDetails();
      this.getLimitationText();
    }
  }

  ngOnDestroy() {
    this.alertService.clearError();
  }

  checkAuthReferral() {
    if (this.benefitDetails.authRefIndicator === true || this.benefitDetails.authRefIndicator === 'True') {
      this.getAuthReferral();
    }
  }

  getBenefitDetails() {
    this.myPlansService.getPlanBenefitDetails().subscribe(benefitDetails => {
      if (benefitDetails.result < 0) {
        this.alertService.setAlert(benefitDetails.displaymessage, '', AlertType.Failure);
        return;
      } else {
        this.populateBenefits(benefitDetails);
        this.checkAuthReferral();
      }
    });
  }

  populateBenefits(benefitDetails: BenefitDetailsResponseInterface) {
    this.benefitDetails = benefitDetails;
    this.planBenefits = this.benefitDetails.planBenefits;
    this.serviceProviders = this.globalService.groupBy(this.benefitDetails.serviceProviders, 'network');
  }

  getLimitationText() {
    this.myPlansService.getLimitationText().subscribe((data: LimitationResponseInterface) => {
      if (data.result < 0) {
        if (data.result === -91339) {
          this.hideLimitationContentAndBanner = true;
        } else {
          this.hideLimitationContentAndBanner = false;
          this.alertService.setAlert(data.displaymessage, '', AlertType.Failure);
        }
        return;
      } else {
        this.limitationDetails = data.RowSet.Rows;
        this.hideLimitationContentAndBanner = false;
      }
    });
  }

  getAuthReferral() {
    this.myPlansService.getAuthReferral().subscribe((data: AuthReferralResponseInterface) => {
      if (data.result < 0) {
        if (data.result === -91361) {
          this.authReferralErrorText = MyPlansConstants.errorMessages['-91361'];
        } else if (data.result === -91362) {
          this.authReferralErrorText = MyPlansConstants.errorMessages['-91362'];
        } else {
          this.alertService.setAlert(data.displaymessage, '', AlertType.Failure);
          this.authReferralErrorText = null;
        }
        return;
      } else {
        this.authReferralDetails = data.getAuthReferralResponse;
        this.authReferralErrorText = null;
      }
    });
  }

  isString(val) { return typeof val === 'string'; }

  isNetwork(network: string): boolean {
    if ((network === NetworkType.inNetwork || network === 'I' || network === MyPlansConstants.network.inNetwork)
      || (network === NetworkType.outOfNetwork || network === 'O' || network === MyPlansConstants.network.outNetwork)
      || (network === NetworkType.inNetworkAndOutOfNetworkCombined || network === 'C'
        || network === MyPlansConstants.network.combined)) {
      return true;
    }
    return false;
  }

}
