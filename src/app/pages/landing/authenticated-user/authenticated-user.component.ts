import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../../shared/services/auth.service';
import {GlobalService} from '../../../shared/services/global.service';
import {AlertService} from '../../../shared/services/alert.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LandingService} from '../landing.service';
import {Image} from '../../../shared/models/image.model';
import {Finanical} from '../../../shared/models/finanical.model';
import {Observable} from 'rxjs/Observable';
import {AuthHttp} from '../../../shared/services/authHttp.service';
import {ConstantsService} from '../../../shared/services/constants.service';
import {HomePageInfoModel} from '../landing.model';
import {DatePipe, TitleCasePipe} from '@angular/common';
import {RxDetailsRequestModelInterface} from '../../medications/models/interfaces/rx-details-model.interface';
import {RxDetailsRequestModel} from '../../medications/models/rx-details.model';
import {MyMedicationDetailsService} from '../../medications/myMedicationDetails/my-medication-details.service';
import {LineChartOptionsInterface} from '../../../shared/components/alegeus-line-chart/line-chart.interface';
import {LineChartOptions} from '../../../shared/components/alegeus-line-chart/line-chart.model';
import {MyDedCoService} from '../../myded-co/myded-co.service';
import {DeductiblesAccumsInterface} from '../../myded-co/models/interfaces/myded-co-info-model.interface';
import {AccumChartType} from '../../myded-co/models/types/myded-co.types';


declare let $: any;

@Component({
  selector: 'app-authuser-landing',
  templateUrl: './authenticated-user.component.html',
  styleUrls: ['./authenticated-user.component.scss']
})
export class AuthUserLandingComponent implements OnInit, OnDestroy {
  isRegisteredUser: boolean;
  memberInfo: HomePageInfoModel;
  carouselItemDetails: Image[] = [];
  bannerImage: any = '';
  doctorData: any;
  medicationData: any;
  ClaimsData: any;
  isdependant: boolean = false;
  ismedicaremember: boolean = false;
  isFinancialView: boolean = false;
  isSmartShopperUser: boolean = false;
  ismobile: boolean = false;
  mobileViewPort = 992;
  showDedcoSpinner = false;
  showDrupal: boolean = false;
  showDoctorDrupal: boolean = false;
  showMedicationDrupal: boolean = false;
  showClaimsDrupal: boolean = false;
  dedCoInfo: DeductiblesAccumsInterface = null;
  deductibleChartDetails: LineChartOptionsInterface[];
  financialChartCounter: number = 0;
  financialChartDetails: Finanical[] = [];
  isDisplayFinanceLoader: boolean;
  showNurseLine: boolean = false;
  hasBqi: boolean = false;
  hasBlueGreen: boolean = false;
  ahealthyme: boolean = false;
  hasFamily: boolean;
  dedCoName: string;
  blueGreenUrl: string = this.constantsService.blueGreenUrl; // 'https://www.fidelity.com/fidelityhsa';
  nurseLineUrl: string = this.constantsService.nurseLineUrl; // 'https://myblue.bluecrossma.com/tools-resources/find-care/nurse-phone-line';
  cernerEEUrl: string = this.constantsService.cernerEEUrl;
  CernerMedicareUrl: string = this.constantsService.CernerMedicareUrl;
  drupalContentInactiveWithFinancials: string = this.constantsService.drupalContentInactiveWithFinancialsUrl;
  drupalContentInactiveNoFinancials: string = this.constantsService.drupalContentInactiveNoFinancialsUrl;
  urlConfig = {
    mymedications: '../mymedications',
    medicationdetails: '../mymedications/medicationdetails',
    myclaims: '../myclaims',
    claimdetails: '/myclaims/claimdetails',
    mycards: '../mycards',
    myplans: '../myplans',
    myaccount: '../myaccount',
    messagecenter: '../message-center/messages',
    documents: '../message-center/documents/home',
    uploads: '../message-center/uploads',
    deductibles: '../mydedco',
    maintenance: '../pages/maintenance',
    mydoctors: '../mydoctors',
    doctordetails: '../mydoctors/details',
    myInbox: '../message-center',
    myprofile: '../myprofile'
  };


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.ismobile = event.target.innerWidth <= this.mobileViewPort;
  }


  constructor(private authService: AuthService,
              private globalService: GlobalService,
              private router: Router,
              private http: AuthHttp,
              private titleCase: TitleCasePipe,
              private r: ActivatedRoute,
              private constantsService: ConstantsService,
              public landingService: LandingService,
              private alertService: AlertService,
              private datePipe: DatePipe,
              private myDedCoService: MyDedCoService,
              private myMedicationDetailsService: MyMedicationDetailsService) {
    if (window.innerWidth <= this.mobileViewPort) {
      this.ismobile = true;
    }
    /* -- Don't Make changes Here -- */
    if (this.r.snapshot.data.home && this.r.snapshot.data.home.ROWSET &&
      !Array.isArray(this.r.snapshot.data.home.ROWSET.ROW) &&
      typeof this.r.snapshot.data.home.ROWSET.ROW === 'object') {
      this.memberInfo = new HomePageInfoModel(titleCase).deserialize(this.r.snapshot.data.home.ROWSET
        && this.r.snapshot.data.home.ROWSET.ROW);

      // Smart Shopper Deferred to 3.1
      // this.isSmartShopperUser = this.memberInfo.hasSS === 'true' ? true : false;

      this.showNurseLine = ((this.memberInfo.cerner
        && (this.memberInfo.cerner.hasCerner !== 'true' &&
          this.memberInfo.cerner.hasCernerEE !== 'true' &&
          this.memberInfo.cerner.hasCernerMedicare !== 'true') &&
        (this.memberInfo.hasBlueGreen !== 'true' && this.memberInfo.hasBQi !== 'true')));
      this.hasBqi = this.memberInfo.hasBQi === 'true';
      this.hasBlueGreen = this.memberInfo.hasBlueGreen === 'true';

      this.ahealthyme = this.memberInfo.cerner && (this.memberInfo.cerner.hasCerner === 'true' || this.memberInfo.cerner.hasCernerEE === 'true' || this.memberInfo.cerner.hasCernerMedicare === 'true');

      this.globalService.landingPageMemberInfo = this.memberInfo;
      this.authService.storeUserState(this.memberInfo.userState);
      console.log('Homepage Data', this.memberInfo);
      if (this.memberInfo.myclaims && this.memberInfo.myclaims.clmICN) {
        sessionStorage.setItem('claimId', this.memberInfo.myclaims.clmICN);
      }
    } else if (this.r.snapshot.data.home && this.r.snapshot.data.home.result < 0) {
      console.log('Homepage API expected response is incorrect');
    }
    // else if (this.r.snapshot.data.home && this.r.snapshot.data.home.ROWSET &&
    //   Array.isArray(this.r.snapshot.data.home.ROWSET.ROW)) {
    //   this.bannerImage = 'Hero_Image_Default';
    //   this.http.hideSpinnerLoading();
    //   this.http.showServiceErrorModalPopup('requestTimeoutError');
    // }
    /* -- Don't Make changes Here -- */
    if (this.memberInfo) {
      this.showUserBanner();
      this.getFinancialData();
      this.showUserDataBlocks();
    }


    this.landingService.getCarouselItemDetails().subscribe(response => {
      this.carouselItemDetails = this.transformCarouselResponse(response);
    });

    this.landingService.loadArticle(1);
    this.landingService.loadArticle(2);
    this.landingService.loadArticle(3);
  }

  showUserBanner(): void {
    try {
      if (this.authService.authToken && (this.authService.authToken.userType.toLowerCase() === 'medicare' ||
        this.authService.authToken.userType.toLowerCase() === 'medex')) {
        this.bannerImage = 'Hero_Image_Medicare';
        this.ismedicaremember = true;
      } else if (this.memberInfo && (this.memberInfo.hasDependents.toString() === 'false') &&
        (this.authService.authToken.userType.toLowerCase() !== 'medicare' ||
          this.authService.authToken.userType.toLowerCase() !== 'medex')) {
        this.bannerImage = 'Hero_Image_No_Dependents';
        this.isdependant = true;
      } else {
        this.bannerImage = 'Hero_Image_Default';
      }
    } catch (exception) {
      console.log(exception);
    }

  }

  getHomePageInfo() {
    return this.landingService.getHomepageinfo();
  }

  getDedcoInfo() {
    // this.showDedcoSpinner = true;
    return this.landingService.getDedcoInfo();
  }

  getFinancialData() {
    if (this.hasFinancialsData()) {
      this.isFinancialView = true;
      this.isDisplayFinanceLoader = true;
      this.showDedcoSpinner = true;
      this.landingService.getFinanceBalancChartData().subscribe((response) => {
        if (response && response.length) {
          // this.isFinancialView = true;
          this.financialChartDetails = response;
          console.log(this.financialChartDetails, 'financial data length');
        } else {
          // this.isFinancialView = true;
          this.financialChartDetails = [];
        }

        this.isDisplayFinanceLoader = false;
        if (this.financialChartDetails.length === 0) {
          this.deductibleChartDetails = [];
          this.getDeductiblesAndCoinsuranceInfo(this.financialChartDetails);
        } else {
          this.deductibleChartDetails = [];
          this.getDeductiblesAndCoinsuranceInfo(this.financialChartDetails);
        }
        this.http.hideSpinnerLoading();
      }, (error) => {
        this.isDisplayFinanceLoader = false;
      });
    } else {
      this.deductibleChartDetails = [];
      this.financialChartDetails = [];
      this.getDeductiblesAndCoinsuranceInfo(this.financialChartDetails);
      this.http.hideSpinnerLoading();
    }
  }

  getDeductiblesAndCoinsuranceInfo(financialChartDetails) {
    this.showDedcoSpinner = true;
    this.myDedCoService.getDeductiblesAndCoinsuranceInfo().subscribe((response) => {
      this.showDedcoSpinner = false;
      if (response && response.accums && response.accums[0]) {
        this.dedCoInfo = response.accums[0];
        console.log('Deductible and Co-Insurance', response);
        if (response.hasFamily === 'True') {
          this.hasFamily = true;
        } else {
          this.hasFamily = false;
          response.members.map(member => {
            this.dedCoName = member.name;
          });
        }
        this.deductibleChartDetails = this.getLineChartData(response.accums[0], financialChartDetails);
      }
    });
  }

  getLineChartOptionsList(serviceLineOptionsList, chartType: AccumChartType, lineChartOptions): LineChartOptionsInterface[] {
    if (serviceLineOptionsList && serviceLineOptionsList.length > 0) {
      for (const option of serviceLineOptionsList) {
        lineChartOptions.push(this.landingService.getLineChartOptions(option, chartType));
      }
    }
    return lineChartOptions;
  }

  getLineChartData(accum, financialChartDetails): LineChartOptionsInterface[] {
    let lineChartOptions = [];
    lineChartOptions = this.getLineChartOptionsList(accum.coinsurance, AccumChartType.Coinsurance, lineChartOptions);
    lineChartOptions = this.getLineChartOptionsList(accum.overallDeductables, AccumChartType.overallDeductables, lineChartOptions);
    lineChartOptions = this.getLineChartOptionsList(accum.outOfPocket, AccumChartType.outOfPocket, lineChartOptions);
    lineChartOptions = this.getLineChartOptionsList(accum.overallBenefit, AccumChartType.overallBenefit, lineChartOptions);

    let dedCoResponse = [];
    if ((financialChartDetails.length > 0 && lineChartOptions) || (financialChartDetails.length === 0 && lineChartOptions && this.hasFinancialsData())) {
      dedCoResponse = [lineChartOptions[0]];
    } else if (financialChartDetails.length === 0 && lineChartOptions) {
      dedCoResponse = lineChartOptions.length === 1 ? [lineChartOptions[0]] : lineChartOptions.slice(0, 2);
    }
    return dedCoResponse;
    // return financialChartDetails.length === 1 ? [...lineChartOptions[0]] : lineChartOptions;
  }


  hasFinancialsData(): boolean {
    const hasALG = this.memberInfo.hasALG.toString().toLowerCase();
    const hasHEQ = this.memberInfo.hasHEQ.toString().toLowerCase();
    const result = this.memberInfo && (hasALG === 'yes' || hasHEQ === 'yes' || hasHEQ === 'true' || hasALG === 'true');
    sessionStorage.setItem('hasALG', hasALG);
    sessionStorage.setItem('hasHEQ', hasHEQ);
    this.isFinancialView = result;
    return result;
  }

  transformCarouselResponse(response: any): Image[] {
    if (response && response.length) {
      return response.map((item) => {
        const carouselItem = new Image();
        carouselItem.src = this.constantsService.drupalTestUrl + item.RegularImages;
        carouselItem.mobilesrc = this.constantsService.drupalTestUrl + item.MobileImages;
        // item.isVideo ? '/assets/images/promo/bluebikes-myblue-promo-1002x435.png' : item.VIdeoUrl;
        carouselItem.text = item.ArticleText;
        carouselItem.isVideo = item.VideoUrl.length;
        carouselItem.VIdeoUrl = item.VideoUrl;
        carouselItem.urlLink = item.ArticleUrl;
        carouselItem.Title = item.Title;
        carouselItem.Body = item.Body;
        return carouselItem;
      });
    }
    return [];
  }

  ngOnDestroy() {

  }

  stopEventPropagation(event) {
    event.stopPropagation();
  }

  ngOnInit() {
    this.isRegisteredUser = this.authService.getScopeName().includes('REGISTERED');
    this.alertService.clearError();

    if (!this.authService.tokenError) {
      this.http.showSpinnerLoading();
    } else {
      this.http.hideSpinnerLoading();
    }
    this.clearSessionItems();
  }

  showUserDataBlocks(): void {
    if (this.memberInfo && (this.memberInfo.mydoctors && !this.memberInfo.mydoctors.visitPrvName &&
      this.memberInfo.mymedications && !this.memberInfo.mymedications.rxDrugName && this.memberInfo.myclaims && !this.memberInfo.myclaims.clmICN)) {
      this.showDrupal = false;
      this.showMedicationDrupal = false;
      this.showDoctorDrupal = false;
      this.showClaimsDrupal = false;
    } else if (this.memberInfo && ((this.memberInfo.mydoctors && !this.memberInfo.mydoctors.visitPrvName) ||
      (this.memberInfo.mymedications && !this.memberInfo.mymedications.rxDrugName) || (this.memberInfo.myclaims && !this.memberInfo.myclaims.clmICN))) {

      if (this.memberInfo && this.memberInfo.mydoctors && !this.memberInfo.mydoctors.visitPrvName) {
        this.showDoctorDrupal = true;
        this.getDrupalContent(this.constantsService.drupalDoctorsUrl).subscribe(response => {
          this.doctorData = response[0];
        });
      }

      if (this.memberInfo && this.memberInfo.mymedications && !this.memberInfo.mymedications.rxDrugName) {
        this.showMedicationDrupal = true;
        this.getDrupalContent(this.constantsService.drupalMedicationsUrl).subscribe(response => {
          this.medicationData = response[0];
        });
      }
      if (this.memberInfo && this.memberInfo.myclaims && !this.memberInfo.myclaims.clmICN) {
        this.showClaimsDrupal = true;
        this.getDrupalContent(this.constantsService.drupalClaimsUrl).subscribe(response => {
          this.ClaimsData = response[0];
        });
      }
    } else {
      this.showDrupal = false;
    }
  }

  formattedData(value: string) {
    // console.log('hello value = ' + value);
    if (!value) {
      return '';
    } else {
      value = value.substring(0, 11);
      return this.datePipe.transform(value, 'MM/dd/yyyy');
    }
  }

  navigate(id, routeParams?) {
    const url = this.urlConfig[id];

    if (url) {
      if (!routeParams) {
        this.router.navigate([url], {relativeTo: this.r});
      } else {
        this.router.navigate([url], {relativeTo: this.r});

      }
    } else {
      return;
    }
  }

  incrementFinancialDetailsCounter() {
    if (this.financialChartCounter !== (this.financialChartDetails.length - 1)) {
      this.financialChartCounter = this.financialChartCounter === (this.financialChartDetails.length - 1) ?
        0 : (this.financialChartCounter + 1);
      $('.finanicals-details .financial-carousel').carousel('next');
    }
  }


  decrementFinancialDetailsCounter() {
    if (this.financialChartCounter > 0) {
      this.financialChartCounter = this.financialChartCounter === 0 ?
        (this.financialChartDetails.length - 1) : (this.financialChartCounter - 1);
      $('.finanicals-details .financial-carousel').carousel('prev');
    }
  }

  openUrl(url) {
    if (url) {
      window.open(url, '_self');
    }
  }

  openUrlinNewWindow(url) {
    if (url) {
      window.open(url, '_blank');
    }
  }
  openFadSSO() {
      window.open('/fad', '_blank');
  }

  openOtherPartySite() {
    $('#openOtherPartySite').modal('open');
  }

  getDrupalContent(url): Observable<any> {
    return this.http.get(url).map((response) => {
      return this.transformCarouselResponse(response);
    });
  }

  authRestartScreen() {
    this.globalService.redirectionRoute().then((response) => {
      console.log(response);
    }).catch((route) => {
      this.router.navigate([route]);
    });
  }

  showMedicationDetails() {
    const medicationDetailReq: RxDetailsRequestModelInterface = new RxDetailsRequestModel();
    medicationDetailReq.useridin = this.authService.useridin;
    medicationDetailReq.rxIncurredDate = this.globalService.getUTCDate(this.memberInfo.mymedications.rxIncurredDate);
    medicationDetailReq.ndcCd = this.memberInfo.mymedications.rxNDCCode; // ndcCd;
    if (this.memberInfo && this.memberInfo.mymedications && this.memberInfo.mymedications.rxDependentId) {
      medicationDetailReq.dependentId = this.memberInfo.mymedications.rxDependentId;
    }
    this.myMedicationDetailsService.setMyMedicationDetailsRequest(medicationDetailReq);
    this.router.navigate(['../mymedications/medicationdetails']);
  }

  showDoctorDetails() {
    sessionStorage.setItem('providerName', this.memberInfo.mydoctors.visitPrvName);
    sessionStorage.setItem('providerNumber', this.memberInfo.mydoctors.visitPrvNum);
    if (this.memberInfo && this.memberInfo.mydoctors && this.memberInfo.mydoctors.visitDependentId) {
      sessionStorage.setItem('docDependentId', this.memberInfo.mydoctors.visitDependentId);
    }
    this.router.navigate([`/mydoctors/details`]);
  }

  clearSessionItems() {
    sessionStorage.removeItem('medicationDetailRequest');
    sessionStorage.removeItem('medicationDependentMemberInfo');
  }

  navigateToAlegeus(): void {
    const hasALG = this.memberInfo && this.memberInfo.hasALG.toString().toLowerCase();
    const hasHEQ = this.memberInfo && this.memberInfo.hasHEQ.toString().toLowerCase();
    /* if (hasALG === 'true') {
      window.open('/sso/alegeus', '_blank');
      // this.router.navigate(['/sso/alegeus']);
    } else if (hasHEQ === 'true') {
      window.open('/sso/heathequity', '_blank');
    } */

    this.router.navigate(['/myfinancials']);
  }

  openAhealthyme() {
    if (this.memberInfo.cerner.hasCernerMedicare === 'true') {
      window.open(this.constantsService.CernerMedicareUrl, '_blank');
    } else if (this.memberInfo.cerner.hasCernerEE === 'true') {
      window.open(this.constantsService.cernerEEUrl, '_blank');
    } else if (this.memberInfo.cerner.hasCerner === 'true') {
      window.open('/sso/cerner', '_blank');
    }
  }

  openBqi() {
    window.open('sso/connecture', '_blank');
  }

  isHsaAccount(accountType) {
    return accountType === 'ABH' || accountType === 'HSA' || accountType === 'AB2';
  }


}
