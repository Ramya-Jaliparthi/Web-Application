import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RoutesRecognized} from '@angular/router';
import {FinancialsConstants} from '../constants/financials.constants';
import {BcbsmaerrorHandlerService} from '../../../shared/services/bcbsmaerror-handler.service';
import {BcbsmaConstants} from '../../../shared/constants/bcbsma.constants';
import {
  AccountDetailInfoInterface
} from '../models';
import {LineChartOptions} from '../../../shared/components/alegeus-line-chart/line-chart.model';
import {LineChartOptionsInterface} from '../../../shared/components/alegeus-line-chart/line-chart.interface';
import * as moment from 'moment';
import {FinancialsLandingPageService} from '../landing/financials-landing.service';
import {FpocontentService} from '../../../shared/services/fpocontent.service';
import {AlertService, ConstantsService} from '../../../shared/shared.module';
import {BreadCrumb} from '../../../shared/components/breadcrumbs/breadcrumbs';


@Component({
  selector: 'app-financial-account-detail',
  templateUrl: './financial-account-detail.component.html',
  styleUrls: ['./financial-account-detail.component.scss']
})
export class FinancialAccountDetailComponent implements OnInit, OnDestroy {
  public financialConstants = FinancialsConstants;
  public accountDetail: AccountDetailInfoInterface[];
  hideMainContentOnFilterToggleForMobile: boolean = false;
  public breadCrumbs: BreadCrumb[];
  accountType: string;
  accountPlanYear: number;
  public detailsheader: string = '';
  public headerToolTipVisible: boolean;
  drupalFinancialTooltipUrl: string;
  drupalFinancialTooltipUrlData: object;

  /* Rules for filter values for years
    None - -1
    All -  0
    Current - 1
    Previous - 2
    Future - 3
    Active - 4
  */

  constructor(private route: ActivatedRoute,
              private constants: ConstantsService,
              private router: Router,
              private alertService: AlertService,
              private fpocontentService: FpocontentService,
              private financialsService: FinancialsLandingPageService,
              private bcbsmaErrorHandler: BcbsmaerrorHandlerService  ) {

  }

  ngOnInit() {
    this.breadCrumbs = [];
    const planInfo = JSON.parse(sessionStorage.getItem('planInfo'));
    if (planInfo && planInfo.planStartDate) {
    } else {

      if (this.router.url.includes('/myfinancials/account')) {
        this.router.navigate(['/myfinancials']);
      } else if (this.router.url.includes('/myfinancials/previousaccounts')) {
        this.router.navigate(['/myfinancials/previousaccounts']);
      }
      console.log(this.router.url.split('/')[this.router.url.split('/').length - 3]);
      return;
    }
    this.accountPlanYear = parseInt(this.route.snapshot.paramMap.get('planyear'), 10);
    this.prepareChildBreadCrumbs(this.router.url.split('/')[this.router.url.split('/').length - 3]);
    try {
      this.accountType = this.route.snapshot.paramMap.get('acctype');
      this.detailsheader = this.financialsService.getfinancialHeaderText(this.accountType);
      this.applyFilter();
      this.getTooltipData();
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.financialModule,
        FinancialsConstants.components.financialAccountDetailComponent,
        FinancialsConstants.methods.ngOnInit);
    }


  }

  getTooltipData() {
    this.fpocontentService.fetchContent(this.constants.drupalDedCoTooltipUrl).subscribe((response) => {
      this.drupalFinancialTooltipUrlData = response;
    });
  }

  ngOnDestroy() {
    this.alertService.clearError();
    sessionStorage.removeItem('planInfo');
  }


  public convertEpochDateIntoDateTimeFormat(dateValue) {
    const regex = /-?\d+/;
    const match = regex.exec(dateValue);
    return match;
  }

  public convertAccountDetailIntoLineChartOptions(item: AccountDetailInfoInterface, chartNumber = FinancialsConstants.text.chart1) {

    const linechartOption: LineChartOptionsInterface = new LineChartOptions();

    try {

      switch (chartNumber) {
        // TODO: need to rename totalValue and chartValue
        case FinancialsConstants.text.chart1:
          linechartOption.headerText = FinancialsConstants.text.chartHeader1;
          linechartOption.chartOption1Text = FinancialsConstants.text.chart1Param1Text;
          linechartOption.chartOption2Text = FinancialsConstants.text.chart1Param2Text;
          linechartOption.chartOption3Text = FinancialsConstants.text.chart1Param3Text;
          linechartOption.totalValue = (item.balance);
          linechartOption.chartValue = item.payments;
          linechartOption.chartOption3Value = item.availableRollover;
          linechartOption.chartOption3BackgroundColor = FinancialsConstants.text.remainingValueColor;
          // linechartOption.showOption3 = item.availableRollover ? true : false;
          linechartOption.showOption3 = true;
          linechartOption.AnnualElection = item.availBalance;
          if (item.accountType !== 'HRA') {
            linechartOption.currentYear = item.currentyear;
          }
          linechartOption.roolOverYear = item.rolloveryear;
          break;
        case FinancialsConstants.text.chart2:
          linechartOption.headerText = this.getChart2HeaderText(item);
          linechartOption.chartOption1Text = this.getChart2Option1Text(item);
          linechartOption.chartOption2Text = this.getChart2Option2Text(item);
          linechartOption.chartColor = FinancialsConstants.text.chart2BarColor;
          linechartOption.totalValue = item.contributionsYTD;
          linechartOption.chartValue = item.remainingContributions;
          linechartOption.AnnualElection = item.annualElection;
          break;
        default:
          break;
      }

    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.financialModule,
        FinancialsConstants.components.financialAccountDetailComponent,
        FinancialsConstants.methods.convertAccountDetailIntoLineChartOptions);
    }

    return linechartOption;
  }

  // getChart1Option1Text(item) {
  //   let labelText = '';
  //   if (item.accountType === 'PFS' || item.accountType === 'DFS' || item.accountType === 'FSL' || item.accountType === 'DCA' ||
  //     item.accountType === 'ROL' || item.accountType === 'ROI') {
  //     labelText = 'Available Balance';
  //   } else {
  //     labelText = 'Available';
  //   }
  //
  //   return labelText;
  // }
  //
  // getChart1HeaderText(item) {
  //   let headerText = '';
  //   if (item.accountType === 'PFS' || item.accountType === 'DFS' || item.accountType === 'FSL' || item.accountType === 'DCA'
  //   || item.accountType === 'ROL' || item.accountType === 'ROI') {
  //     headerText = 'Account Balance';
  //   } else {
  //     headerText = 'Available Balance';
  //   }
  //
  //   return headerText;
  // }

  getChart2HeaderText(item) {
    let headerText = '';
    if (item.accountType === 'PFS') {
      headerText = 'Annual Contribution';
    } else if (item.accountType === 'HRA') {
      headerText = 'Annual Allocation';
    } else {
      headerText = 'Annual Election';
    }

    return headerText;
  }

  getChart2Option1Text(item) {
    let labelText = '';
    if (item.accountType === 'HRA') {
      labelText = 'Allocated so far';
    } else if (item.accountType === 'ROL' || item.accountType === 'ROI' || item.accountType === 'DCA' || item.accountType === 'DFS' ||
      item.accountType === 'DFS' || item.accountType === 'FSL' || item.accountType === 'FSA' || item.accountType === 'TFS') {
      labelText = 'Payroll Deposits YTD';
    }  else if (item.accountType === 'PFS') {
      labelText = 'Contributed so far';
    } else {
      labelText = 'Payroll Deposits YTD';
    }

    return labelText;
  }

  getChart2Option2Text(item) {
    let labelText = '';
    if (item.accountType === 'HRA') {
      labelText = 'Remaining Allocation';
    } else if (item.accountType === 'ROL' || item.accountType === 'ROI' || item.accountType === 'DCA' || item.accountType === 'DFS' ||
      item.accountType === 'DFS' || item.accountType === 'FSL' || item.accountType === 'FSA' || item.accountType === 'TFS') {
      labelText = 'Remaining Payroll Deposits';
    }  else if (item.accountType === 'PFS') {
      labelText = 'Remaining Contribution';
    } else {
      labelText = 'Remaining Payroll Deposits';
    }
    return labelText;
  }

  applyFilter() {
    this.resetAccountDetailData();
    const planInfo = JSON.parse(sessionStorage.getItem('planInfo'));
    this.accountDetail = this.accountDetail.filter((detail) => {
      return detail.planYear === this.accountPlanYear && this.accountType === detail.accountType &&
        detail.planStartDate === planInfo.planStartDate && detail.planEndDate === planInfo.planEndDate;
    });
  }

  resetAccountDetailData() {
    const currentYear = new Date().getFullYear();
    if (this.route.snapshot.data && this.route.snapshot.data.summary && !this.route.snapshot.data.summary.error) {
      this.accountDetail = this.route.snapshot.data.summary[0];
      if (Array.isArray(this.accountDetail)) {
        this.accountDetail.map((member) => {
          if (member.planYear === 1) {
            member.currentyear = currentYear;
            member.rolloveryear = currentYear - 1;
          }
          if (member.planYear === 2) {
            member.currentyear = currentYear - 1;
            member.rolloveryear = currentYear - 2;
          }
          if (!Array.isArray(member.familyDetailInfo)) {
            member.familyDetailInfo = [member.familyDetailInfo];
          }
        });
      }
    }
    // console.log('Account Details page Response', this.accountDetail);
  }

  convertDate(date) {
    if (date) {
      return moment(date, 'YYYYMMDD').format();
    } else {
      return '';
    }
  }

  public showToolTip() {
    this.headerToolTipVisible = !this.headerToolTipVisible;
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

    if (this.accountPlanYear === 2) {
      this.breadCrumbs.push({
        label: 'Previous Accounts',
        url: ['/myfinancials/previousaccounts']
      });
    }
    switch (folderId) {
      case 'account':
        this.breadCrumbs.push({
          label: 'Account Details',
          url: [this.router.url]
        });
        break;
    }
    console.log('this.breadCrumbs', this.breadCrumbs);
  }

  getStatus(status?) {
    if (status.toString() === '1') {
      return 'Active';
    } else if (status.toString() === '2') {
      return 'Inactive';
    } else if (status.toString() === '3') {
      return 'Temporarily Inactive';
    } else if (status.toString() === '0') {
      return 'All';
    } else {
      return '-';
    }
  }

  isHRAaccount(accountType?) {
    return accountType === 'HRA' || accountType === 'HRD';
  }

}
