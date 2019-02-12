import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../shared/services/auth.service';
import {FinancialsConstants} from '../constants/financials.constants';
import {FinancialsLandingPageService} from './financials-landing.service';
import {BcbsmaerrorHandlerService} from '../../../shared/services/bcbsmaerror-handler.service';
import {BcbsmaConstants} from '../../../shared/constants/bcbsma.constants';
import {
  AccountSummaryTypeInterface,
  TransactionSummaryResponseInterface
} from '../models';
import {AlertService} from '../../../shared/shared.module';
import {AlertType} from '../../../shared/alerts/alertType.model';
import * as moment from 'moment';

@Component({
  selector: 'app-financials-landing',
  templateUrl: './financials.component.html',
  styleUrls: ['./financials.component.scss']
})
export class FinancialsComponent implements OnInit, OnDestroy {
  public financialConstants = FinancialsConstants;
  mobileViewPort = 992;
  ismobile: boolean;
  public accountDetails: AccountSummaryTypeInterface[];
  public previousAccountDetails: AccountSummaryTypeInterface[];
  public futureAccountDetails: AccountSummaryTypeInterface[];
  public transactionDetails: TransactionSummaryResponseInterface;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.ismobile = event.target.innerWidth <= this.mobileViewPort;
  }

  constructor(private authService: AuthService, private router: Router,
              private landingPageService: FinancialsLandingPageService,
              private bcbsmaErrorHandler: BcbsmaerrorHandlerService,
              private r: ActivatedRoute,
              private alertService: AlertService
  ) {
    if (window.innerWidth <= this.mobileViewPort) {
      this.ismobile = true;
    }
  }

  ngOnInit() {
    try {
      if (this.r.snapshot.data && this.r.snapshot.data.summary[0] && !(this.r.snapshot.data.summary[0].result < 0)) {
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

        this.futureAccountDetails = this.landingPageService.getAccountDetails(this.accountDetails, 3);

        this.previousAccountDetails = this.landingPageService.getAccountDetails(this.accountDetails, 2);

        // doing changes as per sprint 1 request
        // this.accountDetails = this.accountDetails.filter((item) => {
        //   // return item.planYear === 1 && ('DFS' === item.accountType || 'FSL' === item.accountType);
        //   return item.planYear === 1; // We are displaying current year results
        // });

        this.accountDetails = this.landingPageService.getAccountDetails(this.accountDetails, 1);
        console.warn(this.accountDetails);

      } else if (this.r.snapshot.data && this.r.snapshot.data.summary[0] && this.r.snapshot.data.summary[0].result < 0) {
        const alegeusResponse = this.r.snapshot.data.summary[0];
        this.alertService.setAlert(alegeusResponse['displaymessage'], '', AlertType.Failure);
      }
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.financialModule,
        FinancialsConstants.components.financialComponent,
        FinancialsConstants.methods.ngOnInit);
    }
  }



  ngOnDestroy() {
    this.alertService.clearError();
  }

  fetchCurrentAndFutureAccounts() {
    const accountDetails = [...this.accountDetails.filter((item) => item.planYear === 1),
      ...this.accountDetails.filter((item) => item.planYear === 3)] ;
    return accountDetails;
  }

  public navigateToAllTransaction() {
    try {
      this.router.navigate(['/myfinancials/alltransactions']);
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.financialModule,
        FinancialsConstants.components.financialComponent,
        FinancialsConstants.methods.navigateToAllTransaction);
    }
  }

  public navigateToAccountDetail(accDetail: AccountSummaryTypeInterface) {
    try {
      if (accDetail && accDetail.accountType) {
        this.router.navigate([`/myfinancials/account`, accDetail.accountType, accDetail.planYear]); // , accDetail.FlexAccountKey
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

  navigateToPreviousAccounts() {
    this.router.navigate(['/myfinancials/previousaccounts']);
  }

}
