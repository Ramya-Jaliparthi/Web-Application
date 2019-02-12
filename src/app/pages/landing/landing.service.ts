import {Injectable} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {GlobalService} from '../../shared/services/global.service';
import {AuthHttp} from '../../shared/services/authHttp.service';
import {ConstantsService} from '../../shared/services/constants.service';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ArticleModel} from './landing.model';
import {DomSanitizer} from '@angular/platform-browser';
import {Finanical} from '../../shared/models/finanical.model';
import * as moment from 'moment';
import {DependantsService} from '../../shared/services/dependant.service';
import {LineChartOptions} from '../../shared/components/alegeus-line-chart/line-chart.model';
import {
  CoinsuranceInterface,
  OutofpocketInterface, OverallBenefitInterface,
  OverallDeductablesInterface
} from '../myded-co/models/interfaces/myded-co-info-model.interface';
import {AccumChartType} from '../myded-co/models/types/myded-co.types';
import {LineChartOptionsInterface} from '../../shared/components/alegeus-line-chart/line-chart.interface';

@Injectable()
export class LandingService {
  public _article1$: BehaviorSubject<ArticleModel>;
  public _article2$: BehaviorSubject<ArticleModel>;
  public _article3$: BehaviorSubject<ArticleModel>;

  public article1$: Observable<ArticleModel>;
  public article2$: Observable<ArticleModel>;
  public article3$: Observable<ArticleModel>;

  public articles: any;

  constructor(private http: AuthHttp,
              private constants: ConstantsService,
              private sanitizer: DomSanitizer,
              private constantsService: ConstantsService,
              private authService: AuthService,
              private dependantsService: DependantsService
  ) {
    this._article1$ = new BehaviorSubject(new ArticleModel(1));
    this._article2$ = new BehaviorSubject(new ArticleModel(2));
    this._article3$ = new BehaviorSubject(new ArticleModel(3));

    this.article1$ = this._article1$.asObservable();
    this.article2$ = this._article2$.asObservable();
    this.article3$ = this._article3$.asObservable();

    this.articles = [];
    this.articles.push(this.article1$);
    this.articles.push(this.article2$);
    this.articles.push(this.article3$);
  }


  loadArticle(number) {
    this.http.get(this.constants.drupalTestUrl + `/page/home-promoblock${number}`).subscribe(item => {
      this[`_article${number}$`].next(new ArticleModel(number).deserialize(item[0], this.sanitizer));
    });
  }

  getCarouselItemDetails(): Observable<any> {
    return this.http.get(this.constantsService.drupalSliderUrl);
  }


  getFinanceBalanceData(): Observable<any> {
    const request = {
      useridin: this.authService.useridin
    };

    return this.http.encryptPost(this.constants.financeUrl, request, null, null, false);
  }

  getFinanceBalancChartData(): Observable<Finanical[]> {
    return this.getFinanceBalanceData().map((response) => this.transformFinanceChartData(response));
  }

  // Heq data
  transformChartData(finanicalInfo: any, AccountId): Finanical {
    const finanicalData = new Finanical();
    let accountNum = AccountId;
    accountNum = accountNum.substr(0, accountNum.length - 4).replace(/[0-9]/g, '*') + accountNum.substr(-4);
    finanicalData.acountNumber = accountNum;
    finanicalData.PlanStartDate = finanicalInfo.Description.slice(9).replace('to', '-');
    finanicalData.PlanEndDate = '';
    finanicalData.chartOptions = (new LineChartOptions())
      .setHeaderText('Annual Election')
      .setHeaderText1(this.getfinancialHeaderText(finanicalInfo))
      .setTotalValue(finanicalInfo.AvailableBalance)
      .setChartValue(this.isHsaAccount(finanicalInfo.AccountType) ?  finanicalInfo.Investments :
        (finanicalInfo.Distributions  ? finanicalInfo.Distributions : finanicalInfo.YtdClaimsAllowed))  // investments savingssccountinfo
      .setAnnualElection(finanicalInfo.ElectionAmount)
      .setChartColor('#3DA148')
      .setChartBackgroundColor('#FFFFFF')
      .setChartOption1Text('Available')
      .setChartOption2Text(this.isHsaAccount(finanicalInfo.AccountType) ? 'Investment' : 'Spent');
    return finanicalData;
  }

  isHsaAccount(accountType) {
    return accountType === 'ABH' || accountType === 'HSA' || accountType === 'AB2';
  }

  // alg data
  transformChartDataNew(finanicalInfo: any): Finanical {
    const finanicalData = new Finanical();
    let accountNum = finanicalInfo.FlexAcctId;
    accountNum = accountNum.substr(0, accountNum.length - 4).replace(/[0-9]/g, '*') + accountNum.substr(-4);
    finanicalData.acountNumber = accountNum;
    finanicalData.accountType = finanicalInfo.AccountType ? finanicalInfo.AccountType : '';
    finanicalData.PlanStartDate = moment(finanicalInfo.PlanStartDate, 'YYYYMMDD').format();
    finanicalData.PlanEndDate = moment(finanicalInfo.PlanEndDate, 'YYYYMMDD').format();
    finanicalData.chartOptions = (new LineChartOptions())
      .setHeaderText('Annual Election')
      .setHeaderText1(this.getfinancialHeaderText(finanicalInfo))
      .setTotalValue(this.isHsaAccount(finanicalInfo.AccountType) ? finanicalInfo.HSABalance : finanicalInfo.Balance)
      .setChartValue(this.isHsaAccount(finanicalInfo.AccountType) ? finanicalInfo.PortfolioBalance : finanicalInfo.Payments)
      .setAnnualElection(finanicalInfo.AnnualElection)
      .setChartColor('#3DA148')
      .setChartBackgroundColor('#FFFFFF')
      .setChartOption1Text('Available')
      .setChartOption2Text(this.isHsaAccount(finanicalInfo.AccountType) ? 'Investment' : 'Spent');
    // console.log('financial test data', finanicalInfo.PlanStartDate.moment().format());
    return finanicalData;
  }

  getfinancialHeaderText(fincialInfo): string {
    const headers = {
      'HSA': 'Health Savings Account',
      'FSA': 'Flexible Spending Account',
      'HRA': 'Health Reimbursement Arrangement',
      'DTR': 'Deductible Tracking Account'
    };
    if (headers[fincialInfo.AccountType]) {
      return headers[fincialInfo.AccountType];
    } else if (headers[fincialInfo.Type]) {
      return headers[fincialInfo.Type];
    } else {
      return fincialInfo.AccountDisplayHeader;
    }
  }

  transformFinanceChartData(response: any): Finanical[] {
    const finanicalDataList = [];
    if (response && response.heqmsg
      && response.heqmsg.GetMemberBalanceResponse
      && response.heqmsg.GetMemberBalanceResponse.GetMemberBalanceResult) {
      if (response.heqmsg.GetMemberBalanceResponse.GetMemberBalanceResult.SavingsAccountInfos
        && response.heqmsg.GetMemberBalanceResponse.GetMemberBalanceResult.SavingsAccountInfos.SavingsAccountInfo) {
        finanicalDataList.push(this.transformChartData(
          response.heqmsg.GetMemberBalanceResponse.GetMemberBalanceResult.SavingsAccountInfos.SavingsAccountInfo,
          response.heqmsg.GetMemberBalanceResponse.GetMemberBalanceResult.MemberId
        ));
      }
      if (response.heqmsg.GetMemberBalanceResponse.GetMemberBalanceResult.ReimbursementAccountInfos
        && response.heqmsg.GetMemberBalanceResponse.GetMemberBalanceResult.ReimbursementAccountInfos.ReimbursementAccountInfo) {
        finanicalDataList.push(this.transformChartData(
          response.heqmsg.GetMemberBalanceResponse.GetMemberBalanceResult.ReimbursementAccountInfos.ReimbursementAccountInfo,
          response.heqmsg.GetMemberBalanceResponse.GetMemberBalanceResult.MemberId
        ));
      }
    }
    if (response && response.algmsg && response.algmsg.length > 0) {
      // Alg Data Mapping
      for (const data of response.algmsg) {
        finanicalDataList.push(this.transformChartDataNew(data));
      }
    }

    // if (response && response.algmsg
    //   && response.algmsg.GetMemberBalanceResponse
    //   && response.algmsg.GetMemberBalanceResponse.GetMemberBalanceResult) {
    //   if (response.algmsg.GetMemberBalanceResponse.GetMemberBalanceResult.SavingsAccountInfos
    //     && response.algmsg.GetMemberBalanceResponse.GetMemberBalanceResult.SavingsAccountInfos.SavingsAccountInfo) {
    //     finanicalDataList.push(this.transformChartData(
    //       response.algmsg.GetMemberBalanceResponse.GetMemberBalanceResult.SavingsAccountInfos.SavingsAccountInfo));
    //   }
    //   if (response.algmsg.GetMemberBalanceResponse.GetMemberBalanceResult.ReimbursementAccountInfos
    //     && response.algmsg.GetMemberBalanceResponse.GetMemberBalanceResult.ReimbursementAccountInfos.ReimbursementAccountInfo) {
    //     finanicalDataList.push(this.transformChartData(
    //       response.algmsg.GetMemberBalanceResponse.GetMemberBalanceResult.ReimbursementAccountInfos.ReimbursementAccountInfo));
    //   }
    // }
    return finanicalDataList;
  }

  getHomepageinfo() {
    const request = {
      useridin: this.authService.useridin
    };
    return this.http.encryptPost(this.constants.homepageUrl, request);
  }

  getDedcoInfo() {
    const request = {
      useridin: this.authService.useridin
    };
    return this.http.encryptPost(this.constants.dedcoUrl, request, null, null, false);
  }


  public getLineChartOptions(accumItem: CoinsuranceInterface | OverallDeductablesInterface |
    OutofpocketInterface | OverallBenefitInterface, target: AccumChartType): LineChartOptionsInterface {
    const lineChartOptions: LineChartOptionsInterface = new LineChartOptions();


    let refinedAccumItem: CoinsuranceInterface | OverallDeductablesInterface |
      OutofpocketInterface | OverallBenefitInterface = null;

    let headerText: string = '';
    let totalValue: number = 0;
    let chartValue: number = 0;

    switch (target) {
      case AccumChartType.Coinsurance:
        refinedAccumItem = <CoinsuranceInterface>accumItem;
        headerText = 'Co-Insurance Maximum';
        totalValue = Number(refinedAccumItem.coinsuranceMax);
        chartValue = refinedAccumItem.coinsuranceContributed ? Number(refinedAccumItem.coinsuranceContributed) : 0;
        break;

      case AccumChartType.overallDeductables:
        refinedAccumItem = <OverallDeductablesInterface>accumItem;
        headerText = 'Overall Deductible';
        totalValue = Number(refinedAccumItem.overallDeductible);
        chartValue = refinedAccumItem.deductibleContributed ? Number(refinedAccumItem.deductibleContributed) : 0;

        break;

      case AccumChartType.overallBenefit:
        refinedAccumItem = <OverallBenefitInterface>accumItem;
        headerText = 'Over-All-Benefit Maximum';
        totalValue = refinedAccumItem.overallBenefitMax;
        chartValue = refinedAccumItem.overallBenefitMaxContributed ? Number(refinedAccumItem.overallBenefitMaxContributed) : 0;

        break;

      case AccumChartType.outOfPocket:
        refinedAccumItem = <OutofpocketInterface>accumItem;
        headerText = 'Out-Of-Pocket Maximum';
        totalValue = refinedAccumItem.outOfPocketMax;
        chartValue = refinedAccumItem.oopMaxContributed ? Number(refinedAccumItem.oopMaxContributed) : 0;

        break;

      default:
        break;

    }

    lineChartOptions.setHeaderText(headerText)
      .setTotalValue(totalValue)
      .setChartValue(chartValue)
      .setChartColor('#3DA148')
      .setChartBackgroundColor('#FFFFFF')
      .setChartOption1Text('Contributed')
      .setChartOption2Text('Remaining to Meet');
    return lineChartOptions;
  }
}
