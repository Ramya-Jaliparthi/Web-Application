import { Component, OnInit, OnDestroy, ViewChild, HostListener, ElementRef, EventEmitter } from '@angular/core';
import { DialogTermsComponent } from './dialogTerms/dialogTerms.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog, MatSelectionList, MatRadioChange } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { MyplansService } from './myplans.service';
import {
  PlanBenefitsListResponseModelInterface,
  MyPlansModuleRadioListInterface,
  PlanBenefitsPlanModelInterface
} from './models/interfaces/plan-benefits-list-model.interface';
import { PlanBenefitsListResponseModel } from './models/plan-benefits-list.model';
import { BcbsmaerrorHandlerService } from '../../shared/services/bcbsmaerror-handler.service';
import { BcbsmaConstants } from '../../shared/constants/bcbsma.constants';
import { MyPlansConstants } from './constants/my-plans.constants';
import { PlanEntityInterface, PlanEntityMemberInterface } from './models/interfaces/plan-benefits-page-adapted-data-model.inteface';
import { PlanEntity, PlanEntityMember } from './models/plan-benefits-page-adapted-data.model';
import { PlanEntityMemberType, PlanTypeOrder } from './models/types/myplans.types';
import { Router, ActivatedRoute } from '@angular/router';
import { GetPlanBenefitServicesRequestModelInterface } from './models/interfaces/plans-benefits-service-model.interface';
import { GetPlanBenefitServicesRequestModel } from './models/plans-benefits-service.model';
import { AuthService } from '../../shared/services/auth.service';
import { ConstantsService } from '../../shared/services/constants.service';
import { FilterService } from '../../shared/services/filter.service';
import { GlobalService } from '../../shared/services/global.service';
import { ValidationService } from '../../shared/services/validation.service';
import { AlertService } from '../../shared/services/alert.service';
import { AlertType } from '../../shared/alerts/alertType.model';
import * as moment from 'moment';
import { GeneralErrorInterface } from '../../shared/models/interfaces/generic-app-models.interface';
// window['moment'] = moment;
@Component({
  templateUrl: './myplans.component.html',
  styleUrls: ['./myplans.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      state('out', style({
        transform: 'translate3d(-100%,0,0)',
        display: 'none'
      })),
      transition('in => out', animate('100ms ease-in-out')),
      transition('out => in', animate('100ms ease-in-out'))
    ])
  ]
})


export class MyplansComponent implements OnInit, OnDestroy {
  @ViewChild('searchDrpContainer') searchDrpContainer;
  @ViewChild('sideNavContainer') elementView: ElementRef;
  @ViewChild('searchDateInput') fromInputDate: ElementRef;

  public isSearched: boolean;
  public showSideBarDrupal = false;
  public myFocusTriggeringEventEmitter = new EventEmitter<boolean>();
  public isSidenavOpened = false;
  public sideNavStatus: string;
  public showClose: boolean;
  public showClearLink: boolean;
  public filteredList: PlanEntityInterface[] = [];
  public noPlans: boolean = false;
  public collapsedHeight: string = null;
  public expandedHeight: string = '44px';
  public filterDate: string;
  public showCalender: boolean;
  public showDate: boolean;
  public calendarMinDate: Date;
  public calendarMaxDate = moment().add('d', 60).toDate();
  public currentSelectedDate: Date = null;
  public searchDate: string;
  public toDate: string = moment().format('L');
  public dateFormat = 'MM/DD/YYYY';
  public isFormDateSelected = true;
  public errorMessage = null;
  public errorObj = null;
  public fpoListingUrl: string;
  public fpoInformationUrl: string;
  public fpoTargetUrl: string;
  public contactus: string;
  private planBenefitsList: PlanBenefitsListResponseModelInterface;
  private mobileViewPort = 992;
  private plansList = [];
  private selectedPlanList = [];
  private sortSelectedFilter: string;
  private ismobile: boolean;
  private filteredBenefits = [];
  private benefitList = [];
  private sortList: MyPlansModuleRadioListInterface[];
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth <= this.mobileViewPort) {
      this.ismobile = true;
    } else {
      this.ismobile = false;
      this.sideNavStatus = 'in';
    }
  }

  constructor(public dialog: MatDialog,
    private bcbsmaErrorHandler: BcbsmaerrorHandlerService,
    private router: Router,
    private route: ActivatedRoute,
    private myPlansService: MyplansService,
    private authService: AuthService,
    private constants: ConstantsService,
    private globalService: GlobalService,
    private filterService: FilterService,
    private validationService: ValidationService,
    private alertService: AlertService) {
    if (window.innerWidth <= this.mobileViewPort) {
      this.ismobile = true;
    }
    this.sideNavStatus = this.ismobile ? 'out' : 'in';
    this.contactus = this.constants.contactus + this.authService.authToken.scopename;
    this.initErrorObj();
  }

  ngOnInit() {
    this.planBenefitsList = new PlanBenefitsListResponseModel();
    this.fpoListingUrl = this.constants.drupalMyPlansListingUrl;
    this.fpoTargetUrl = this.constants.drupalMyPlansFPOUrl;
    this.fpoInformationUrl = this.constants.drupalMyPlansInformationUrl;
    const resolvedData = this.route.snapshot.data;
    if (resolvedData && resolvedData.plan) {
      if (resolvedData.plan['result'] < 0) {
        this.alertService.setAlert(resolvedData.plan['displaymessage'], '', AlertType.Failure);
        this.noPlans = true;
        this.filteredList = [];
      } else {
        this.planBenefitsList = <PlanBenefitsListResponseModelInterface>this.route.snapshot.data.plan;
        this.filteredList = this.getTransformResponse(this.planBenefitsList);
        if (this.filteredList.length <= 0) {
          this.noPlans = true;
        }
      }
    } else {
      this.getPlans(moment().format('YYYY-MM-DD')).subscribe(data => {
        // console.log('final', data);
      });
    }
  }

  ngOnDestroy() {
    this.alertService.clearError();
  }

  getPlans(effectiveDate: string): Observable<PlanEntityInterface[] | GeneralErrorInterface> {
    return this.myPlansService.getPlansData(effectiveDate)
      .map((data) => {
        this.alertService.clearError();
        if (data['result'] < 0) {
          this.alertService.setAlert(data['displaymessage'], '', AlertType.Failure);
          this.noPlans = true;
          this.filteredList = [];
          return <GeneralErrorInterface>data;
        }
        this.planBenefitsList = <PlanBenefitsListResponseModelInterface>data;
        this.filteredList = this.getTransformResponse(this.planBenefitsList);
        if (this.filteredList.length <= 0) {
          this.noPlans = true;
        }
        return this.filteredList;
      });
  }

  private getTransformResponse(planBenefitsResponseData) {
    const transformedResponse: PlanEntityInterface[] = [];
    try {
      const planBenefitRowSet = Object.freeze(planBenefitsResponseData.RowSet);
      planBenefitRowSet.osplinPlans.plans.map((plan) => {
        const planEntity = new PlanEntity();
        planEntity.planName = plan.planName;
        planEntity.coveragePackageCode = plan.coveragePackageCode;
        planEntity.pcpState = plan.pcpState;
        plan.groupInfo.group.map((group) => {
          planEntity.effectiveEndDate = '';
          planEntity.effectiveStartDate = group.planEffectiveDt;
          planEntity.subscriberId = group.subscriberId;
          planEntity.groupName = group.groupName;
          planEntity.groupNumber = group.groupNumber;
        });
        planEntity.foundFlag = plan.foundFlag;
        const planEntityMembers: PlanEntityMemberInterface[] = [];
        plan.osplinPlanMembers.members.map((member) => {
          const planEntityMember: PlanEntityMemberInterface = new PlanEntityMember();
          planEntityMember.memberId = member.memberId;
          if (member.middleInitial) {
            planEntityMember.name = `${member.firstName} ${member.middleInitial} ${member.lastName}`;
          } else {
            planEntityMember.name = `${member.firstName} ${member.lastName}`;
          }
          planEntityMember.memberDOB = member.memberDOB;
          planEntityMember.UACoverageCode = member.UACoverageCode;
          switch (member.memberId) {
            case ('00'):
              planEntityMember.memberType = <PlanEntityMemberType>'Subscriber';
              break;
            case ('01'):
            case ('02'):
            case ('03'):
            case ('04'):
            case ('05'):
            case ('06'):
            case ('07'):
            case ('08'):
              planEntityMember.memberType = <PlanEntityMemberType>'Spouse';
              break;
            default:
              const age = this.validationService.getAge(member.memberDOB);
              if (!isNaN(age) && age > 18) {
                planEntityMember.memberType = <PlanEntityMemberType>'Dependent over 18 years';
              } else {
                planEntityMember.memberType = <PlanEntityMemberType>'Dependent';
              }
              break;
          }
          planEntityMembers.push(planEntityMember);
        });
        planEntity.members = planEntityMembers;
        transformedResponse.push(planEntity);
      });
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.myPlansModule,
        MyPlansConstants.components.myPlans,
        MyPlansConstants.methods.getTransformResponse);
    }
    return transformedResponse;
  }

  openPlanBenefitsDetail(selectedPlan: PlanEntityInterface) {
    if (selectedPlan.foundFlag === false || selectedPlan.foundFlag === 'N') {
      return;
    }
    const getPlanBenefitRequest: GetPlanBenefitServicesRequestModelInterface = new GetPlanBenefitServicesRequestModel();
    getPlanBenefitRequest.coveragePackageCode = selectedPlan.coveragePackageCode;
    getPlanBenefitRequest.planName = selectedPlan.planName;
    getPlanBenefitRequest.useridin = this.authService.useridin;
    this.myPlansService.setPlanBenefitRequest(getPlanBenefitRequest);
    this.myPlansService.setSelectedPlanEntity(selectedPlan);
    this.router.navigateByUrl('/myplans/plandetails');
  }
  showSideBarDrupalMat() {
    this.showSideBarDrupal = true;
  }

  closeSideBarDrupalMat() {
    this.showSideBarDrupal = false;
  }

  openTermsDialog() {
    this.dialog.open(DialogTermsComponent, {
      panelClass: 'modal-pd-0'
    });
  }

  initErrorObj() {
    this.errorObj = {
      isSelectedDateInvalid: false,
      sixtyDaysInvalid: false,
      twoYearsInvalid: false,
      required: false
    };
  }

  toggleFilter(toggleStatus) {
    this.isSidenavOpened = !this.isSidenavOpened;
    this.sideNavStatus = this.sideNavStatus === 'out' ? 'in' : 'out';
    if (toggleStatus) {
      this.sideNavStatus = toggleStatus;
    }
  }

  clearSearchVal() {
    this.showClose = false;
    this.searchDate = '';
  }

  setShowClearLink() {
    this.showClearLink = false;
    if (!(!this.selectedPlanList || this.selectedPlanList.length === 0)) {
      this.showClearLink = true;
    }
  }

  closeFilter() {
    if (this.ismobile) {
      this.sideNavStatus = 'out';
      this.isSidenavOpened = false;
    }
  }

  closeSideNavigation() {
    this.isSidenavOpened = false;
  }

  getSelectedItems(list: MatSelectionList) {
    if (list && list.selectedOptions.selected.length > 0) {
      return list.selectedOptions.selected.map((selectedItem) => selectedItem.value);
    }
    return null;
  }

  applyPlanFilter() {
    if (this.selectedPlanList && this.selectedPlanList.length && this.filteredBenefits) {
      this.filteredBenefits = this.filteredBenefits.filter((benefit) => {
        return (this.selectedPlanList.indexOf(benefit.planName) >= 0);
      });
    }
  }

  clearFilter() {
    this.showClearLink = false;
    this.isSidenavOpened = false;
    this.isSearched = false;
    // this.filteredList = this.plansList;
    this.showCalender = false;
    this.filterDate = null;
    this.clearSearchVal();
    this.initErrorObj();
    this.getPlans(moment().format('YYYY-MM-DD')).subscribe(data => {
      // console.log('final', data);
    });
  }

  applyFilter(value) {
    if (!value) {
      this.initErrorObj();
    }
    if (Object.keys(this.errorObj).every(k => !this.errorObj[k])) {
      if (!this.searchDate) {
        this.initErrorObj();
        this.errorObj = Object.assign(this.errorObj, {
          required: true
        });
      } else {
        this.showClearLink = true;
        this.isSidenavOpened = !this.isSidenavOpened;
        this.isSearched = true;
        this.getPlans(this.globalService.getUTCDate(this.searchDate)).subscribe(data => {
          // console.log('final', data);
        });
      }
    }
    window.scrollTo(0, 0);
  }

  // Calendar
  dateFilterChanged(selectedOption: MatRadioChange, index) {
    if (selectedOption.value === 'DATE') {
      this.showDate = true;
      this.showCalender = true;
    } else {
      this.showDate = false;
      this.showCalender = false;
    }
    this.clearCustomDateRangeSelections();
    this.setCalendarMinimumDate();
  }

  validateSearchDate() {
    const minFormDate = this.filterService.getMinimumFromDate();
    this.initErrorObj();
    if (moment(this.searchDate).isValid()) {
      this.errorObj = Object.assign(this.errorObj, {
        isSelectedDateInvalid: !this.searchDate || this.searchDate.length !== 10 ||
          !moment(this.searchDate, this.dateFormat, true).isValid(),
        sixtyDaysInvalid: moment(this.searchDate, this.dateFormat).diff(moment(this.calendarMaxDate)) > 0,
        twoYearsInvalid: moment(this.searchDate, this.dateFormat).diff(moment(minFormDate)) < 0
      });
    } else {
      this.errorObj = Object.assign(this.errorObj, {
        isSelectedDateInvalid: true
      });
    }
  }

  clearCustomDateRangeSelections() {
    this.searchDate = null;
    this.initErrorObj();
  }

  formatInputSearchDate(value) {
    if (!value) {
      this.initErrorObj();
    }
    const dateString = this.filterService.convertInputStringToDate(value);
    if (dateString) {
      this.searchDate = dateString;
    }
    if (this.searchDate.length >= 10) {
      this.validateSearchDate();
      if (Object.keys(this.errorObj).every(k => !this.errorObj[k])) {
        this.currentSelectedDate = new Date(this.searchDate);
        this.toggleCalendarDisplay();
      }
    }
  }

  getSelectedValue(date) {
    this.initErrorObj();
    this.searchDate = this.filterService.getFormatDateString(date);
    this.setCalendarMinimumDate();
    this.showCalender = false;
  }

  setCalendarMinimumDate() {
    this.calendarMinDate = this.filterService.getMinimumFromDate();
  }

  toggleCalender(selectedDateType: string) {
    this.isFormDateSelected = selectedDateType === 'search';
    this.currentSelectedDate = new Date(this.searchDate);
    this.setCalendarMinimumDate();
    this.showCalender = true;
    this.dateInputFocus();
  }

  toggleCalendarDisplay() {
    this.showCalender = !this.showCalender;
    this.dateInputFocus();
  }

  dateInputFocus() {
    setTimeout(() => {
      if (this.isFormDateSelected) {
        this.fromInputDate.nativeElement.focus();
      }
    }, 1);
  }

  customDateInputKeyDownEvent(e) {
    return this.filterService.customDateInputKeyDownEvent(e);
  }

  navigateToContactUs() {
    window.open(this.contactus, '_self');
  }

}
