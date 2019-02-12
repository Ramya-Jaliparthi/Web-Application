import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { MyplansService } from '../myplans.service';
import { ConstantsService } from '../../../shared/services/constants.service';
import { GlobalService } from '../../../shared/services/global.service';
import { AlertService } from '../../../shared/services/alert.service';
import { AlertType } from '../../../shared/alerts/alertType.model';
import { MyPlansConstants } from '../constants/my-plans.constants';
import { GetPlanBenefitServicesResponseModelInterface } from '../models/interfaces/plans-benefits-service-model.interface';
import { FpocontentService } from '../../../shared/services/fpocontent.service';
import { NetworkType } from '../models/interfaces/benefits-model.interface';

@Component({
  selector: 'app-plandetails',
  templateUrl: './plandetails.component.html',
  styleUrls: ['./plandetails.component.scss']
})
export class PlandetailsComponent implements OnInit, OnDestroy {

  public planBenefitDetails = null;
  public deductibleObject;
  public coinsuranceMaxObject;
  public lifetimeBenefitObject;
  public fpoTargetUrl: string;
  public fpoTargetTooltipUrl: string;
  public drupalData: object;
  public isplandetails: boolean = true;
  public keys = Object.keys;
  public networkType = NetworkType;

  constructor(public myPlansService: MyplansService,
    private constants: ConstantsService,
    private globalService: GlobalService,
    private fpocontentService: FpocontentService,
    private alertService: AlertService,
    private route: ActivatedRoute) {
    this.fpoTargetTooltipUrl = this.constants.drupalMyPlansDetailsTooltipUrl;
    this.fpoTargetUrl = this.constants.drupalMyPlansDetails;
  }

  toolTipVisible: boolean = false;

  ngOnInit() {
    const resolvedData = this.route.snapshot.data;
    if (resolvedData && resolvedData.planDetails) {
      if (resolvedData.planDetails['result'] < 0) {
        this.alertService.setAlert(resolvedData.planDetails['displaymessage'], '', AlertType.Failure);
      } else {
        this.planBenefitDetails = <GetPlanBenefitServicesResponseModelInterface>this.route.snapshot.data.planDetails;
        this.populateBenefits();
      }
    } else {
      this.getPlanDetails();
    }
    this.getTooltipData();
  }

  getTooltipData() {
    this.fpocontentService.fetchContent(this.fpoTargetTooltipUrl).subscribe((response) => {
      this.drupalData = response;
    });
  }

  ngOnDestroy() {
    this.alertService.clearError();
  }

  getPlanDetails() {
    this.myPlansService.getPlanBenefitServices(false).subscribe(planBenefitDetails => {
      if (planBenefitDetails.result < 0) {
        this.alertService.setAlert(planBenefitDetails.displaymessage, '', AlertType.Failure);
        return;
      }
      this.planBenefitDetails = <GetPlanBenefitServicesResponseModelInterface>planBenefitDetails;
      this.populateBenefits();
    });
  }

  populateBenefits() {
    if (this.planBenefitDetails.PlanBenefitFeatures) {
      if (this.planBenefitDetails.PlanBenefitFeatures.deductibleText) {
        this.deductibleObject = this.planBenefitDetails.PlanBenefitFeatures.deductibleText;
      }
      if (this.planBenefitDetails.PlanBenefitFeatures.coinsuranceMaxText) {
        this.coinsuranceMaxObject = this.planBenefitDetails.PlanBenefitFeatures.coinsuranceMaxText;
      }
      if (this.planBenefitDetails.PlanBenefitFeatures.lifetimeBenefitText) {
        this.lifetimeBenefitObject = this.planBenefitDetails.PlanBenefitFeatures.lifetimeBenefitText;
      }
      // console.log(this.deductibleObject, this.coinsuranceMaxObject, this.lifetimeBenefitObject);
    }
  }

  showToolTip() {
    this.toolTipVisible = !this.toolTipVisible;
  }

}
