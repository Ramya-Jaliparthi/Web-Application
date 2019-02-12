import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../shared/services/auth.service';
import {FinancialsConstants} from '../constants/financials.constants';
import {FinancialsLandingPageService} from '../landing/financials-landing.service';
import {BcbsmaerrorHandlerService} from '../../../shared/services/bcbsmaerror-handler.service';
import {BcbsmaConstants} from '../../../shared/constants/bcbsma.constants';
import {
  AccountSummaryTypeInterface,
  TransactionSummaryResponseInterface
} from '../models';
import {AlertService} from '../../../shared/shared.module';
import {AlertType} from '../../../shared/alerts/alertType.model';
import * as moment from 'moment';
import {BreadCrumb} from '../../../shared/components/breadcrumbs/breadcrumbs';

@Component({
  selector: 'app-previous-accounts',
  templateUrl: './previous-accounts.component.html',
  styleUrls: ['./previous-accounts.component.scss']
})
export class PreviousAccountsComponent implements OnInit {
  public financialConstants = FinancialsConstants;
  public accountDetails: AccountSummaryTypeInterface[];
  public breadCrumbs: BreadCrumb[];

  constructor(private authService: AuthService, private router: Router,
        private landingPageService: FinancialsLandingPageService,
        private bcbsmaErrorHandler: BcbsmaerrorHandlerService,
        private r: ActivatedRoute,
        private alertService: AlertService
    ) {

  }

  ngOnInit() {
    this.breadCrumbs = [];
    this.prepareChildBreadCrumbs(this.router.url.split('/')[this.router.url.split('/').length - 1]);
    try {
      if (this.r.snapshot.data && this.r.snapshot.data.summary) {
        const alegeusResponse = this.r.snapshot.data.summary[0];
        if (alegeusResponse.error) {
          this.accountDetails = [];
        } else if (alegeusResponse.result !== '0' || alegeusResponse.result !== 0) {
          this.accountDetails = alegeusResponse;
        } else {
          this.accountDetails = [];
          this.alertService.setAlert(alegeusResponse['displaymessage'], '', AlertType.Failure);
        }

        this.accountDetails = this.r.snapshot.data.summary[0].error ? [] : this.r.snapshot.data.summary[0];

        // this.accountDetails = this.accountDetails.filter((item) => {
        //   // return item.planYear === 1 && ('DFS' === item.accountType || 'FSL' === item.accountType);
        //   return item.planYear === 2; // We are displaying current year results
        // });
        this.accountDetails = this.landingPageService.getAccountDetails(this.accountDetails, 2);
      }
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.financialModule,
        FinancialsConstants.components.financialComponent,
        FinancialsConstants.methods.ngOnInit);
    }
  }

  public navigateToAccountDetail(accDetail: AccountSummaryTypeInterface) {
    try {
      if (accDetail && accDetail.accountType) {
        this.router.navigate([`/myfinancials/previousaccounts/account`,
         accDetail.accountType, accDetail.planYear]); // , accDetail.FlexAccountKey
          const planInfo = {
            planStartDate: accDetail.planStartDate,
            planEndDate: accDetail.planEndDate,
          };
         sessionStorage.setItem('planInfo', JSON.stringify(planInfo));
      } else {
        this.bcbsmaErrorHandler.logError(
          new Error(FinancialsConstants.errorMessages.invalidParamInFunctionCall),
          BcbsmaConstants.modules.messageCenterModule,
          FinancialsConstants.components.financialComponent,
          FinancialsConstants.methods.accountDetail
        );
      }

    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.financialModule,
        FinancialsConstants.components.financialComponent,
        FinancialsConstants.methods.accountDetail);
    }
    return;
  }

  convertDate(date) {
    if (date) {
      return moment(date, 'YYYYMMDD').format();
    } else {
      return '';
    }
  }

  openPage(url?) {
    if (url) {
      this.router.navigate([url]);
    }
  }

  getHeader(item) {
    return this.landingPageService.getfinancialHeaderText(item);
  }

  prepareChildBreadCrumbs(folderId) {
    // console.log('Folder Id', folderId, this.breadCrumbs);
    this.breadCrumbs.push({
      label: 'Home',
      url: ['/home']
    });
    this.breadCrumbs.push({
      label: 'My Financials',
      url: ['/myfinancials']
    });

    switch (folderId) {
      case 'previousaccounts':
        this.breadCrumbs.push({
          label: 'Previous Accounts',
          url: [this.router.url]
        });
        break;
    }
    // console.log('this.breadCrumbs', this.breadCrumbs);
  }

}
