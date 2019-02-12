import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatCalendar, MatRadioGroup, MatSelectionList, MatSelectionListChange, MatSidenav } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { ISubscription } from 'rxjs/Subscription';
import { ConstantsService } from '../../../shared/services/constants.service';
import { FilterItem } from '../../../shared/models/filterItem.model';
import { MemberInfo } from '../../../shared/models/memberInfo.model';
import { Option } from '../../../shared/models/option.model';
import { DependantsService } from '../../../shared/services/dependant.service';
import { FilterService } from '../../../shared/services/filter.service';
import { GlobalService } from '../../../shared/services/global.service';
import { ClaimsService } from '../../../shared/services/myclaims/claims.service';
// import { AuthService, AlertService } from '../../../shared/shared.module';
import { AuthService } from '../../../shared/shared.module';
import { AlertType } from '../../../shared/alerts/alertType.model';
import { AlertService } from '../../../shared/services/alert.service';

import { MyClaims, RadioList } from '../claims.model';
// import { ClaimsService } from '../claims.service';
import { DependentsResponseModel } from '../models/dependants.model';
import { DependentsResponseModelInterface } from '../models/interfaces/dependants-model.interface';
import { ClaimMemberRecord } from '../models/claims-summary-data.model';
import {
  ClaimFiltersMetadataInterface, ClaimSummaryMetadataInterface, ClaimMemberRecordInterface,
  ClaimsSummaryRequestModelInterface, ClaimsSummaryResponseModelInterface
} from '../models/interfaces/claims-summary-data-model.interface';
import {
  ProviderMetaInterface, VisitTypeMetaInterface, MemberTypeMetaInterface, ClaimStatusMetaInterface,
  PlanSearchListInterface, ProviderSearchListInterface,
  MemberTypeSearchListInterface, VisitTypeSearchListInterface,
  ClaimStatusSearchListInterface, DateMetaInterface, DateSearchListInterface, CustomDateRangeMetaInterface
} from '../models/interfaces/claims-generic-models.interface';
import { DatePipe } from '@angular/common';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { ClaimSummarySortOrderType } from '../models/types/claims.types';



@Component({
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.scss'],
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

export class ClaimsComponent implements OnInit, OnDestroy {
  userString: 'User' = 'User';
  dependant: string;
  subscription: ISubscription;
  claimsListing;
  claims: ClaimMemberRecord[] = [];
  filteredClaims: ClaimMemberRecordInterface[] = ClaimMemberRecord[''];
  allClaims: ClaimMemberRecord[] = [];
  memberData: MemberInfo;
  sideNavHeight: string;
  sideNavStatus: string;
  noClaimsAvailable = false;
  dateList: DateSearchListInterface[] = [];
  showClose: boolean;
  showCalender: boolean;
  sortList: RadioList[] = [
    {
      'value': 'Most Recent',
      'checked': true
    },
    {
      'value': 'Oldest First',
      'checked': false
    }
  ];
  sortSelectedFilter: string;
  searchval: string;
  isautosearch: boolean;
  isDisplayMessage: boolean = false;
  isDisplayResults: boolean = false;
  medicationsMessage: string;
  issearchShowing: boolean;
  isfilterShowing: boolean;
  // Filter options
  dateSelectedFilter: DateSearchListInterface;
  showDate: boolean;
  fromMinDate: Date;
  calendarMaxDate = new Date();
  currentSelectedDate: Date = null;
  isCustomDateRangeInValid = false;
  isSelectedDateInvalid = false;
  sideNavMode: string;
  lastDate: Date;
  fromDate: string;
  toDate: string = moment().format('L');
  autoCompleteSearchArray: string[] = [];
  index: number;
  isSidenavOpened: boolean;
  ismobile: boolean;
  errorMessage: string;
  collapsedHeight: string;
  collapsedSortHeight: string;
  expandedHeight: string;
  expandedSortHeight: string;
  mobileViewPort = 992;
  filterWidth: string;
  isexpanded: boolean;
  isSortExpanded: boolean;
  isFormDateSelected = true;
  dateFormat = 'MM/DD/YYYY';
  currentSortValue: string;

  // Filters List
  planList: PlanSearchListInterface[] = [];
  selectedPlanList: Object[];
  allPlansString = 'All Plans';

  // Filters List
  visitTypeList: VisitTypeSearchListInterface[] = [];
  selectedVisitTypeList: Object[];
  selectedMemberList: Object[];
  allVisitsString = 'All visits';

  providerList: ProviderSearchListInterface[] = [];
  selectedProviderList: Object[];
  allProvidersString = 'All Providers';

  allClaimsStatuesString = 'All statuses';
  claimsStatuses = this.getDefaultClaimsStatuses();
  claimsStatusList: ClaimStatusSearchListInterface[] = [];
  selectedClaimsList: Object[];
  allClaimsString = 'All Claims';
  membersList: MemberTypeSearchListInterface[] = [];
  dependentList: DependentsResponseModelInterface = new DependentsResponseModel();
  selectedSortString: string;
  myFocusTriggeringEventEmitter = new EventEmitter<boolean>();
  showClearLink = false;
  showResultsCount = false;
  searchString: string;
  bHasDependents = false;
  claimsInfo: any;
  public allClaimsFilterOptions;
  public isDisplayCustomDateRange: boolean = false;
  public recordsPerPage: number = 50;
  public checkFromDate: boolean;
  public checkToDate: boolean;
  public isDisplaySpinner: boolean = false;
  public isClearFilter: boolean = false;
  step = [];
  fpoTargetUrl = '';
  showFinancialLink: boolean = false;
  showHEQALGFinancialLink: boolean = false;
  ssoFinancialLink: string = '';
  ssoALGFinancialLink: String = '';
  ssoHEQFinancialLink: String = '';
  initialClaimsCount: number;
  @ViewChild('searchDrpContainer') searchDrpContainer;
  @ViewChild('sideNavContainer') elementView: ElementRef;
  @ViewChild('filterWidth') filterElementView: ElementRef;
  @ViewChild('searchInput') searchInput;
  @ViewChild('sidenav') sideNav: MatSidenav;
  @ViewChild('dependantFilter') dependantFilterComponent: MatRadioGroup;
  @ViewChild('matcalender') picker: MatCalendar<Date>;
  @ViewChild('fromDateInput') fromInputDate: ElementRef;
  @ViewChild('toDateInput') toInputDate: ElementRef;
  @ViewChild('searchInput') inputSearch: ElementRef;
  @ViewChild('memberFilter') memberFilter;
  @ViewChild('providerFilter') providerFilter;
  @ViewChild('visitTypeFilter') visitTypeFilter;
  @ViewChild('claimStatusFilter') claimStatusFilter;
  @ViewChild(InfiniteScrollDirective) infiniteScroll: InfiniteScrollDirective;
  contactus = this.constants.contactus + this.authService.authToken.scopename;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth <= this.mobileViewPort) {
      this.ismobile = true;
    } else {
      this.ismobile = false;
      this.sideNavStatus = 'in';
    }
  }

  constructor(private claimService: ClaimsService,
    public authService: AuthService,
    private router: Router,
    public dependantsService: DependantsService,
    public filterService: FilterService,
    public globalService: GlobalService,
    public constants: ConstantsService,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef) {
    this.claimsInfo = this.activatedRoute.snapshot.data.claimsInfo;
    if (this.claimsInfo && this.claimsInfo[0] && this.claimsInfo[0].memberRecord) {
      this.initialClaimsCount = this.claimsInfo[0].memberRecord.length;
    }
    this.sortSelectedFilter = 'Most Recent';
    this.currentSortValue = this.sortSelectedFilter;
    this.isautosearch = false;
    this.isDisplayMessage = false;
    this.issearchShowing = false;
    this.showDate = false;
    this.sideNavMode = 'side';
    this.index = -1;
    this.isSidenavOpened = false;
    this.errorMessage = null;
    this.collapsedHeight = '32px';
    this.collapsedSortHeight = '48px';
    this.expandedHeight = '40px';
    this.expandedSortHeight = '48px';
    this.isexpanded = false;
    this.sideNavHeight = '600';
    this.showCalender = false;
    this.searchString = '';
    this.isSortExpanded = false;
    if (window.innerWidth <= this.mobileViewPort) {
      this.ismobile = true;
    }
    this.sideNavStatus = this.ismobile ? 'out' : 'in';
    this.dependentList = this.authService.getDependentsList();
    this.subscription = this.globalService.memberData$.subscribe(data => {
      this.memberData = data;
    });

    if (sessionStorage.getItem('claimsDepId')) {
      sessionStorage.removeItem('claimsDepId');
    }
  }

  private handleFinanceLinksInSideBar() {
    const hasALG = this.authService.authToken ? this.authService.authToken.isALG === 'true' : false;
    const hasHEQ = this.authService.authToken ? this.authService.authToken.isHEQ === 'true' : false;

    this.showHEQALGFinancialLink = false;
    this.showFinancialLink = false;
    if (hasALG) {
      if (hasHEQ) {
        // both are true - show 2 links
        this.showHEQALGFinancialLink = true;
        this.showFinancialLink = false;
      } else {
        this.showHEQALGFinancialLink = false;
        this.showFinancialLink = true;
      }
    } else {
      if (hasHEQ) {
        this.showHEQALGFinancialLink = false;
        this.showFinancialLink = true;
      } else {
        // both are false - show no links
        this.showHEQALGFinancialLink = false;
        this.showFinancialLink = false;
      }
    }

    // this.showFinancialLink = (hasALG || hasHEQ) ? true : false;
    this.ssoFinancialLink = hasHEQ ? '/sso/heathequity' : '/sso/alegeus';
  }

  openSSO(module?) {
    if (module === 'algOrHeq') {
      window.open(this.ssoFinancialLink, '_blank');
    } else if (module === 'alg') {
      window.open( '/sso/alegeus', '_blank');
    } else if (module === 'heq') {
      window.open( '/sso/heathequity' , '_blank');
    } else if (module === 'connecture') {
      window.open( '/sso/connecture' , '_blank');
    }
  }

  ngOnInit() {
    this.initAllClaimsFilterOptions();
    this.manageClaimsListing();
    this.handleFinanceLinksInSideBar();
  }

  formattedData(value: string) {
    // console.log('value = ' + value);
    value = value.substring(0, 11);
    return this.datePipe.transform(value, 'MM/dd/yyyy');
  }

  isSortOpened() {
    this.isSortExpanded = true;
  }

  isSortClosed() {
    this.isSortExpanded = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.alertService.clearError();
  }

  // filter Logic below
  toggleFilter(toggleStatus) {
    this.isSidenavOpened = !this.isSidenavOpened;
    this.sideNavStatus = this.sideNavStatus === 'out' ? 'in' : 'out';
    if (toggleStatus) {
      this.sideNavStatus = toggleStatus;
    }
    this.sideNavMode = window.innerWidth <= 992 ? 'over' : 'side';

  }

  closeSideNavigation() {
    this.isSidenavOpened = false;
  }

  closeFilter() {
    if (this.ismobile) {
      this.sideNavStatus = 'out';
      this.isSidenavOpened = false;
    }
  }

  setShowClearLink() {
    this.showClearLink = false;
    if (this.dependant !== this.userString) {
      this.showClearLink = true;
    } else {
      if (this.searchval || this.sortSelectedFilter !== 'Most Recent'
        || this.filteredClaims.length !== this.claims.filter((medication) => !medication.DependentId).length) {
        this.showClearLink = true;
      }
    }
  }




  getDependantMedicationCount(dependentId: number | 'User') {
    return dependentId === this.userString ? this.allClaims.filter((medication) => !medication.DependentId).length :
      this.allClaims.filter((medication) => medication.DependentId === dependentId).length;
  }

  transformClaimsData() {
    this.allClaims = this.allClaims.map((claim) => {
      claim.claimStatus = claim.claimStatus === 'Completed' ? 'Completed' : claim.claimStatus;
      return claim;
    });
  }


  setSortFiltervalue(sortValue: string = 'Most Recent') {
    for (let i = 0; i < this.sortList.length; i++) {
      if (this.sortList[i].value === sortValue) {
        this.sortSelectedFilter = sortValue;
        sessionStorage.setItem('sortSelectedFilter', this.sortSelectedFilter);
        this.sortList[i].checked = true;
      } else {
        this.sortList[i].checked = false;
      }
    }
  }

  clearSessionStorageItems() {
    sessionStorage.removeItem('providerSelectedfilter');
    sessionStorage.removeItem('visitTypeSelectedfilter');
    sessionStorage.removeItem('claimStatusSelectedfilter');
    sessionStorage.removeItem('dateSelectedFilter');
    sessionStorage.removeItem('fromDate');
    sessionStorage.removeItem('toDate');
    sessionStorage.removeItem('sortSelectedFilter');
    if (sessionStorage.getItem('claimsSelectedUserId') !== 'User') {
      sessionStorage.removeItem('claimsSelectedUserId');
    }
  }

  clearFilterList() {
    this.selectedPlanList = [];
    this.selectedProviderList = [];
    this.selectedVisitTypeList = [];
    this.selectedClaimsList = [];
    this.dateList = [];
    // this.dateSelectedFilter = '';
  }

  isOpened(value) {
    switch (value) {
      case 1:
        this.step[1] = 1;
        break;
      case 2:
        this.step[2] = 2;
        break;
      case 3:
        this.step[3] = 3;
        break;
      case 4:
        this.step[4] = 4;
        break;
      case 5:
        this.step[5] = 5;
        break;
      case 6:
        this.step[6] = 6;
        break;
      default:
        break;
    }

  }


  sortFilterChanged(selectedOption) {
    for (let i = 0; i < this.sortList.length; i++) {
      if (this.sortList[i].value === selectedOption.value) {
        this.sortList[i].checked = false;
        this.sortSelectedFilter = selectedOption.value;
      } else {
        this.sortList[i].checked = false;
      }
    }
    setTimeout(() => {
      const sortFilterItem = this.sortList.find((item) => item.value === this.sortSelectedFilter);
      if (sortFilterItem) {
        sortFilterItem.checked = true;
      }
    }, 1);
  }


  claimsErrorMessage() {
    if (this.filteredClaims.length === 0) {
      this.medicationsMessage = 'For further inquiries, please contact member services';
      this.isDisplayMessage = true;
    }
  }

  getSelectedSort(): string {
    let selectedSort = '';
    if (this.sortList && this.sortList.length > 0) {
      const selectedItem = this.sortList.find((item) => item.checked);
      selectedSort = selectedItem ? selectedItem.value : '';
    }
    return selectedSort;
  }

  showClaimDetails(claim) {
    // Reset the request params
    sessionStorage.setItem('claimId', claim.claimId);
    this.router.navigate(['/myclaims/claimdetails']);
    // this.saveFilterDetails();
  }

  saveFilterDetails() {
    const filterDetails = {
      selectedPlanList: this.selectedPlanList,
      selectedVisitTypeList: this.selectedVisitTypeList,
      selectedProviderList: this.selectedProviderList,
      selectedClaimsList: this.selectedClaimsList,
      dateSelectedFilter: this.dateSelectedFilter,
      toDate: this.toDate,
      fromDate: this.fromDate,
      searchval: this.searchval,
      sortSelectedFilter: this.sortSelectedFilter,
      dependant: this.dependant
    };
    sessionStorage.setItem('claims_filterState', JSON.stringify(filterDetails));
  }

  dateFilterChanged(temp) {

    if (this.dateSelectedFilter && Object.keys(this.dateSelectedFilter).length) {
      if (!(this.dateSelectedFilter.dateRange.indexOf(this.allClaimsFilterOptions.date.custom.dateRange) !== -1)) {
        this.clearCustomDateRangeSelections();
        this.showCalender = false;
      } else {
        this.isDisplayCustomDateRange = true;
        // this.showCalender = true;
      }
      this.fromDate = '';
      this.isSelectedDateInvalid = false;
      this.isCustomDateRangeInValid = false;
    }

    /*for (let i = 0; i < this.dateList.length; i++) {
      if (this.dateList[i].value === temp.value) {
        this.dateList[i].checked = true;
      }
    }
    if (temp.value === 'Custom Date Range') {
      this.showDate = true;
      this.showCalender = true;
    } else {
      this.showDate = false;
      this.showCalender = false;
    }
    this.clearCustomDateRangeSelections();*/
  }

  fromDateChange(fromdate) {
    this.validateFromDate();
    this.validateCustomRange();
    if (!this.isCustomDateRangeInValid && !this.isSelectedDateInvalid) {
      this.showCalender = false;
    }
  }

  validateFromDate() {
    const minFormDate = this.filterService.getMinimumFromDate();
    if (moment(this.fromDate).isValid()) {
      this.isSelectedDateInvalid = !this.fromDate || this.fromDate.length !== 10
        || moment(this.fromDate, this.dateFormat).diff(moment(this.calendarMaxDate)) > 0
        || moment(this.fromDate, this.dateFormat).diff(moment(minFormDate)) < 0;
    } else {
      this.isSelectedDateInvalid = true;
    }

    return this.isSelectedDateInvalid;
  }

  validateToDate() {
    const minFormDate = this.filterService.getMinimumFromDate();
    if (moment(this.toDate).isValid()) {
      this.isSelectedDateInvalid = !this.toDate
        || moment(this.toDate, this.dateFormat).diff(moment(this.calendarMaxDate)) > 0
        || moment(this.fromDate, this.dateFormat).diff(moment(minFormDate)) < 0;
    } else {
      this.isSelectedDateInvalid = true;
    }
    return this.isSelectedDateInvalid;
  }

  validateCustomRange() {
    if (this.toDate && this.fromDate) {
      this.isCustomDateRangeInValid = moment(this.toDate).diff(moment(this.fromDate)) < 0;
    }
  }

  toDateChange(toDate) {
    this.validateCustomRange();
    this.validateToDate();
    if (!this.isCustomDateRangeInValid && !this.isSelectedDateInvalid) {
      this.showCalender = false;
    }
  }

  clearCustomDateRangeSelections() {
    this.toDate = moment().format('L');
    this.fromDate = null;
    this.fromMinDate = null;
    this.isCustomDateRangeInValid = false;
    this.isSelectedDateInvalid = false;
    this.isDisplayCustomDateRange = false;
  }

  clearSearchVal() {
    this.searchval = '';
    this.showClose = false;
    this.isautosearch = false;
    this.inputSearch.nativeElement.focus();
  }

  toggleCalender(selectedDateType: string) {
    const isControlChanged = (selectedDateType === 'to' && this.isFormDateSelected) ||
      (selectedDateType === 'from' && !this.isFormDateSelected);
    this.isFormDateSelected = selectedDateType === 'from';
    this.currentSelectedDate = this.isFormDateSelected ? new Date(this.fromDate) : new Date(this.toDate);
    this.setCalendarMinimumDate();
    if (isControlChanged) {
      this.toggleCalendarDisplay();
    } else {
      this.showCalender = true;
    }
  }

  toggleCalendarDisplay() {
    this.showCalender = false;
    setTimeout(() => {
      this.showCalender = true;
      setTimeout(() => {
        if (this.isFormDateSelected) {
          this.fromInputDate.nativeElement.focus();
        } else {
          this.toInputDate.nativeElement.focus();
        }
      }, 1);
    }, 1);
  }

  getSelectedValue(date) {
    this.isCustomDateRangeInValid = false;
    this.isSelectedDateInvalid = false;
    if (this.isFormDateSelected) {
      this.fromDate = this.filterService.getFormatDateString(date);
    } else {
      this.toDate = this.filterService.getFormatDateString(date);
    }
    this.setCalendarMinimumDate();
    this.showCalender = false;
  }

  setCalendarMinimumDate() {
    if (!this.isFormDateSelected && this.fromDate) {
      this.fromMinDate = new Date(this.fromDate);
    } else {
      const minFormDate = this.filterService.getMinimumFromDate();
      this.fromMinDate = minFormDate;
    }
  }

  formatInputFromDate(value) {
    const dateString = this.filterService.convertInputStringToDate(value);
    if (dateString) {
      this.fromDate = dateString;
    }
    if (this.fromDate.length >= 10) {
      this.validateFromDate();
      this.validateCustomRange();
      if (!this.isCustomDateRangeInValid && !this.isSelectedDateInvalid) {
        this.currentSelectedDate = new Date(this.fromDate);
        this.toggleCalendarDisplay();
      }
    }
  }

  formatInputToDate(value) {
    const dateString = this.filterService.convertInputStringToDate(value);
    if (dateString) {
      this.toDate = dateString;
    }
    if (this.toDate.length >= 10) {
      this.validateToDate();
      this.validateCustomRange();
      if (!this.isCustomDateRangeInValid && !this.isSelectedDateInvalid) {
        this.currentSelectedDate = new Date(this.toDate);
        this.toggleCalendarDisplay();
      }
    }
  }

  customDateInputKeyDownEvent(e) {
    return this.filterService.customDateInputKeyDownEvent(e);
  }

  getDefaultClaimsStatusList() {
    return this.claimsStatuses.map((statusItem) => {
      return FilterItem.getDefaultFilterItem(statusItem.value, statusItem.label);
    });
  }

  getDefaultPlanList() {
    return [
      FilterItem.getDefaultFilterItem('Plan 1'),
      FilterItem.getDefaultFilterItem('Plan 2'),
      FilterItem.getDefaultFilterItem('Plan 3'),
      FilterItem.getDefaultFilterItem('Plan 4'),
      FilterItem.getDefaultFilterItem('Plan 5'),
      FilterItem.getDefaultFilterItem('All Plans')
    ];
  }

  getDefaultClaimsStatuses() {
    return [
      Option.getOption('Pending', 'Pending'),
      Option.getOption('Adjusted', 'Adjusted'),
      Option.getOption('Completed', 'Completed'),
      Option.getOption('Denied', 'Denied'),
      Option.getOption(this.allClaimsStatuesString)
    ];
  }

  openUrl() {
    window.open(this.contactus, '_self');
  }

  trackByFn(index, claim) {
    return claim ? claim.id : index;
  }


  /* Initialize all filter option for members, providers
     visits,status etc.
     Initialize all filter flag for the filter options
  */
  private initAllClaimsFilterOptions(): void {
    this.allClaimsFilterOptions = {
      plan: { text: 'plan', allOptRequired: false, all: { planName: 'All Plans', planCount: 0 } },
      date: { text: 'date', allOptRequired: false, custom: { dateRange: 'Custom Date Range', dateCount: 0 } },
      member: { text: 'member', allOptRequired: false, all: { memberName: 'All Members', memberCount: 0 } },
      provider: { text: 'provider', allOptRequired: false, all: { providerName: 'All Providers', providerCount: 0 } },
      visitType: { text: 'visit', allOptRequired: false, all: { visitType: 'All Visits', visitTypeCount: 0 } },
      claimStatus: { text: 'status', allOptRequired: false, all: { status: 'All Statuses', statusCount: 0 } }
    };
  }


  /* TO show the claims listing or member record on page load
     To show the filter criteria on page load
     TO check whether it belongs to page load api data or filter api data
  */

  public manageClaimsListing(filterPaginationApiData?: ClaimsSummaryResponseModelInterface): void {

    if (!filterPaginationApiData) {
      if (this.claimsInfo && this.claimsInfo.length) {
        if (!this.claimsInfo[0].hasOwnProperty('result') && this.claimsInfo[0].result !== 0) {
          this.claimsListing = this.claimsInfo[0];
          if (!this.isClearFilter) {
            this.recordsPerPage = this.claimsListing.summaryMetaData.recordEndIndex;
            this.manageClaimsFilter(this.claimsListing);
          }
        } else {
          //  this.alertService.setAlert('', this.claimsInfo[0]['displaymessage'], AlertType.Failure);
        }
      }
    } else {
      this.claimsListing = filterPaginationApiData;
    }

    if (this.claimsListing && this.claimsListing.hasOwnProperty('memberRecord') && this.claimsListing.memberRecord.length) {
      this.filteredClaims = this.claimsListing.memberRecord;
      this.fpoTargetUrl = this.constants.drupalClaimsrUrl;
    } else {
      this.fpoTargetUrl = this.constants.drupalNoClaimsrUrl;
      this.noClaimsAvailable = true;
    }
  }

  /*
     To set/show the filter criteria on page load for date, members, providers,visits, claims status etc..
  */
  public manageClaimsFilter(claimsListing) {
    this.allClaimsFilterOptions.member.all.memberCount = claimsListing.summaryMetaData.totalRecordCount;
    this.allClaimsFilterOptions.provider.all.providerCount = claimsListing.summaryMetaData.totalRecordCount;
    this.allClaimsFilterOptions.visitType.all.visitTypeCount = claimsListing.summaryMetaData.totalRecordCount;
    this.allClaimsFilterOptions.claimStatus.all.statusCount = claimsListing.summaryMetaData.totalRecordCount;
    if (claimsListing.filtersMetadata.dateMetaData.hasOwnProperty('customDateRange')) {
      this.allClaimsFilterOptions.date.custom.dateCount = claimsListing.dateMetaData.customDateRange.customDateCount;
    }

    this.membersList = claimsListing.filtersMetadata.memberTypeMetaData.memberTypeMetaList;
    if (!this.checkExistingClaimsFilterOptions(this.membersList, this.allClaimsFilterOptions.member.all.memberName)) {
      this.membersList.push(this.allClaimsFilterOptions.member.all);
    }

    // this.membersList = this.initClearFilterOptions(this.membersList);

    this.providerList = claimsListing.filtersMetadata.providerMetaData.providerMetaList;
    if (!this.checkExistingClaimsFilterOptions(this.providerList, this.allClaimsFilterOptions.provider.all.providerName)) {
      this.providerList.push(this.allClaimsFilterOptions.provider.all);
    }

    // this.providerList = this.initClearFilterOptions(this.providerList);


    this.visitTypeList = claimsListing.filtersMetadata.visitTypeMetaData.visitTypeMetaList;
    if (!this.checkExistingClaimsFilterOptions(this.visitTypeList, this.allClaimsFilterOptions.visitType.all.visitType)) {
      this.visitTypeList.push(this.allClaimsFilterOptions.visitType.all);
    }

    // this.visitTypeList = this.initClearFilterOptions(this.visitTypeList);

    this.claimsStatusList = claimsListing.filtersMetadata.claimStatusMetaData.claimStatusMetaList;
    if (!this.checkExistingClaimsFilterOptions(this.claimsStatusList, this.allClaimsFilterOptions.claimStatus.all.status)) {
      this.claimsStatusList.push(this.allClaimsFilterOptions.claimStatus.all);
    }

    // this.claimsStatusList = this.initClearFilterOptions(this.claimsStatusList);


    this.dateList = claimsListing.filtersMetadata.dateMetaData.dateMetaList;
    if (!this.checkExistingClaimsFilterOptions(this.dateList, this.allClaimsFilterOptions.date.custom.dateRange)) {
      this.dateList.push(this.allClaimsFilterOptions.date.custom);
    }
    // this.dateList = this.initClearFilterOptions(this.dateList, this.allClaimsFilterOptions.date.text);
  }

  private checkExistingClaimsFilterOptions(filterList, allOptions: string) {
    return filterList.find((oFilterList) => {
      return (Object.values(oFilterList).includes(allOptions));
    });
  }

  /*
     To get the selected filter criteria from the view/template while changing the options
  */
  public manageSelectedClaimsFilter(selectionListChange: MatSelectionListChange, filterType: string) {

    switch (filterType) {

      case this.allClaimsFilterOptions.member.text:
        this.allClaimsFilterOptions.member.allOptRequired = this.checkClaimsFilterOptions(selectionListChange,
          this.allClaimsFilterOptions.member.all.memberName, this.membersList);
        break;

      case this.allClaimsFilterOptions.provider.text:
        this.allClaimsFilterOptions.provider.allOptRequired = this.checkClaimsFilterOptions(selectionListChange,
          this.allClaimsFilterOptions.provider.all.providerName, this.providerList);
        break;

      case this.allClaimsFilterOptions.visitType.text:
        this.allClaimsFilterOptions.visitType.allOptRequired = this.checkClaimsFilterOptions(selectionListChange,
          this.allClaimsFilterOptions.visitType.all.visitType, this.visitTypeList);
        break;

      case this.allClaimsFilterOptions.claimStatus.text:
        this.allClaimsFilterOptions.claimStatus.allOptRequired = this.checkClaimsFilterOptions(selectionListChange,
          this.allClaimsFilterOptions.claimStatus.all.status, this.claimsStatusList);
        break;

    }
  }

  /*
     To check whether the user selected the all options or individula options and
     make disabled other relevant options if user selected the all options and vice-versa
  */
  public checkClaimsFilterOptions(selectionListChange: MatSelectionListChange, allOptions: string, filterList) {
    const selectAllOption = selectionListChange.option;
    let allOptRequired = false;
    if (Object.values(selectAllOption.value).includes(allOptions)) {
      /*if (selectAllOption.selected) {
        allOptRequired = true;
        selectionListChange.source.selectAll();
      } else {
        selectionListChange.source.deselectAll();
      }*/
      filterList = filterList.map(filterObj => {
        if (selectAllOption.selected) {
          filterObj.selected = true;
          filterObj.disabled = !Object.values(filterObj).includes(allOptions);
          allOptRequired = true;
        } else {
          filterObj.selected = false;
          filterObj.disabled = false;
        }

        return filterObj;
      });

    }

    // this.cdr.detectChanges();
    return allOptRequired;
  }

  /*
     To get the selected filter criteria from the view/template to apply filter for all the filter criteria
  */

  private getSelectedClaimsFilterOptions(list: MatSelectionList, allOptions: string) {
    if (list && list.selectedOptions.selected.length > 0) {
      const filteredItems = list.selectedOptions.selected.filter((selectedItem) => !Object.values(selectedItem.value).includes(allOptions));
      return filteredItems.map(filteredOptions => {
        const selectedFilterOptions = {};
        for (const prop in filteredOptions.value) {
          if (!(prop === 'selected' || prop === 'disabled')) {
            selectedFilterOptions[prop] = filteredOptions.value[prop];
          }
        }
        return selectedFilterOptions;
      }
      );
    }
    return null;
  }


  /*
     To apply filter for all the selected filter criteria
  */

  public applyFilter(providerList: MatSelectionList,
    claimStatusList: MatSelectionList, visitTypeList: MatSelectionList, memberList: MatSelectionList) { // , clearSearch: boolean = true
    this.filterService.scrollToTop();
    this.closeFilter();
    this.closeSideNavigation();
    this.isDisplaySpinner = false;
    this.showCalender = false;
    this.isDisplayMessage = false;
    this.alertService.clearError();


    this.selectedProviderList = this.getSelectedClaimsFilterOptions(providerList, this.allClaimsFilterOptions.provider.all.providerName);
    this.selectedClaimsList = this.getSelectedClaimsFilterOptions(claimStatusList, this.allClaimsFilterOptions.claimStatus.all.status);
    this.selectedVisitTypeList = this.getSelectedClaimsFilterOptions(visitTypeList, this.allClaimsFilterOptions.visitType.all.visitType);
    this.selectedMemberList = this.getSelectedClaimsFilterOptions(memberList, this.allClaimsFilterOptions.member.all.memberName);

    const reqParams = this.claimsFilterPaginationReqParams(
      this.selectedProviderList,
      this.selectedClaimsList,
      this.selectedVisitTypeList,
      this.selectedMemberList,
      this.sortSelectedFilter
    );

    // always send sort order for filter submit
    reqParams.summaryMetaData.sortOrder = this.sortSelectedFilter as ClaimSummarySortOrderType;

    if (!this.isSelectedDateInvalid && !this.isCustomDateRangeInValid) {
      this.claimService.getClaims(reqParams).subscribe(apiData => {
        if (apiData && Object.keys(apiData).length) {
          if (!apiData.hasOwnProperty('result') && apiData.result !== 0) {
            this.manageClaimsListing(apiData);
            this.isDisplayResults = true;
            this.showClearLink = true;
          } else {
            if (apiData.result === -90202) {
              this.isDisplayMessage = true;
              this.isDisplayResults = true;
              this.showClearLink = true;
              this.filteredClaims = [];
            } else {
              this.alertService.setAlert('', apiData['displaymessage'], AlertType.Failure);
            }
          }
        }
      });
    }

  }

  /*
       To clear the filter for all the selected filter criteria
  */

  public clearFilter(providerList: MatSelectionList,
    claimStatusList: MatSelectionList, visitTypeList: MatSelectionList, memberList: MatSelectionList) {
    this.step = [];
    // this.dependant = this.userString; // "User"
    // this.setSortFiltervalue();
    // this.ClearSearch();
    this.closeFilter();
    // this.clearFilterList();
    // this.handleMedicationsResponse(this.allClaims, true);
    // this.clearSessionStorageItems();
    // this.setShowClearLink();

    this.showClose = false;
    this.showCalender = false;
    this.showResultsCount = false;
    this.isSortExpanded = false;
    this.isClearFilter = true;
    this.isDisplayMessage = false;
    this.isDisplayResults = false;
    this.showClearLink = false;

    if (this.dateSelectedFilter && Object.keys(this.dateSelectedFilter).length) {
      this.dateSelectedFilter = {} as DateSearchListInterface;
      this.clearCustomDateRangeSelections();
    }

    this.clearFilterOptionsFromView(memberList);
    this.clearFilterOptionsFromView(providerList);
    this.clearFilterOptionsFromView(visitTypeList);
    this.clearFilterOptionsFromView(claimStatusList);

    this.initClearFilterOptions(this.membersList);
    this.initClearFilterOptions(this.providerList);
    this.initClearFilterOptions(this.visitTypeList);
    this.initClearFilterOptions(this.claimsStatusList);

    this.selectedProviderList = [];
    this.selectedClaimsList = [];
    this.selectedVisitTypeList = [];
    this.selectedMemberList = [];

    this.manageClaimsListing();
    this.filterService.scrollToTop();
    this.closeSideNavigation();
    this.alertService.clearError();
  }

  /*
      Inner function of clear filter to clear the filter for all the selected filter criteria
  */
  private clearFilterOptionsFromView(filterList) {
    if (filterList && filterList.selectedOptions.selected.length > 0) {
      filterList = filterList.selectedOptions.selected.map(oFilterList => {
        oFilterList.selected = false;
        oFilterList.disabled = false;
        return oFilterList;
      });
    }
  }

  private initClearFilterOptions(filterList, filterType?: string) {
    if (filterList && filterList.length) {
      // if (filterList && filterList.selectedOptions.selected.length > 0) {
      return filterList.map(oFilterList => {
        if (!filterType) {
          oFilterList.selected = false;
          oFilterList.disabled = false;
        } else {
          oFilterList.checked = false;
        }
        return oFilterList;
      });
    }
  }


  /*
    To get the another result set of records when scolling down
  */
  public paginationOnScrollDown() {
    this.infiniteScroll.ngOnDestroy();
    this.infiniteScroll.setup();
    this.alertService.clearError();

    if ((this.claimsListing.summaryMetaData.totalRecordCount > this.recordsPerPage) &&
      (this.filteredClaims && this.filteredClaims.length >= this.recordsPerPage) && (!this.isSidenavOpened)) {
      this.isDisplaySpinner = true;
      let reqParams;
      reqParams = this.claimsFilterPaginationReqParams(this.selectedProviderList, this.selectedClaimsList,
        this.selectedVisitTypeList, this.selectedMemberList, this.sortSelectedFilter);
      reqParams.scrollIndicator = 'DOWN';

      this.claimService.getClaims(reqParams, true).subscribe(apiData => {
        this.isDisplaySpinner = false;
        if (apiData && Object.keys(apiData).length) {
          if (!apiData.hasOwnProperty('result') && apiData.result !== 0) {
            if (apiData.hasOwnProperty('memberRecord') && apiData.memberRecord.length) {
              apiData.memberRecord.map(oMemberRecord => {
                this.filteredClaims.push(oMemberRecord);
              });
            }
          } else {
            this.alertService.setAlert('', apiData['displaymessage'], AlertType.Failure);
          }
        }
      });
    }
  }

  /*
    To get the another result set of records when scolling up
  */
  onScrollUp() {
    console.log('fdfdsf');
  }

  /*
     To create the request params for sorting, filter & pagination
  */

  private claimsFilterPaginationReqParams(selectedProviderList, selectedClaimsList,
    selectedVisitTypeList, selectedMemberList, sortSelectedFilter) {

    const providerMetaReqParams = {} as ProviderMetaInterface,
      visitTypeMetaReqParams = {} as VisitTypeMetaInterface,
      claimStatusMetaReqParams = {} as ClaimStatusMetaInterface,
      memberTypeMetaReqParams = {} as MemberTypeMetaInterface,
      claimFiltersMetaReqParams = {} as ClaimFiltersMetadataInterface,
      dateMetaReqParams = {} as DateMetaInterface,
      dateSearchListReqParams = {} as DateSearchListInterface,
      customDateRangeMetaReqParams = {} as CustomDateRangeMetaInterface,
      claimSummaryMetaReqParams = {} as ClaimSummaryMetadataInterface,
      claimsSummaryReqParams = {} as ClaimsSummaryRequestModelInterface;


    this.isSelectedDateInvalid = false;
    this.isCustomDateRangeInValid = false;


    if (this.dateSelectedFilter && Object.keys(this.dateSelectedFilter).length) {

      if (this.dateSelectedFilter.dateRange.toLowerCase().indexOf('all') !== -1) {
        dateMetaReqParams.allDatesRequired = true;
      } else if (this.dateSelectedFilter.dateRange.indexOf(this.allClaimsFilterOptions.date.custom.dateRange) !== -1) {
        dateMetaReqParams.allDatesRequired = false;
        this.checkFromDate = this.validateFromDate();
        this.checkToDate = this.validateToDate();
        if (!this.checkFromDate && !this.checkToDate) {
          this.validateCustomRange();
          customDateRangeMetaReqParams.startDate = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd');
          customDateRangeMetaReqParams.endDate = this.datePipe.transform(this.toDate, 'yyyy-MM-dd');
          dateMetaReqParams.customDateRange = customDateRangeMetaReqParams;
        } else {
          this.isSelectedDateInvalid = true;
        }
      } else {
        dateSearchListReqParams.dateRange = this.dateSelectedFilter.dateRange;
        dateMetaReqParams.dateMetaList = new Array(dateSearchListReqParams);
        dateMetaReqParams.allDatesRequired = false;
      }
      claimFiltersMetaReqParams.dateMetaData = dateMetaReqParams;
    }


    if (selectedProviderList && selectedProviderList.length) {
      providerMetaReqParams.allProvidersRequired = this.allClaimsFilterOptions.provider.allOptRequired;
      if (!providerMetaReqParams.allProvidersRequired) {
        providerMetaReqParams.providerMetaList = selectedProviderList;
      }
      claimFiltersMetaReqParams.providerMetaData = providerMetaReqParams;
    }

    if (selectedClaimsList && selectedClaimsList.length) {
      claimStatusMetaReqParams.allStatusesRequired = this.allClaimsFilterOptions.claimStatus.allOptRequired;
      if (!claimStatusMetaReqParams.allStatusesRequired) {
        claimStatusMetaReqParams.claimStatusMetaList = selectedClaimsList;
      }
      claimFiltersMetaReqParams.claimStatusMetaData = claimStatusMetaReqParams;
    }

    if (selectedVisitTypeList && selectedVisitTypeList.length) {
      visitTypeMetaReqParams.allVisitTypesRequired = this.allClaimsFilterOptions.visitType.allOptRequired;
      if (!visitTypeMetaReqParams.allVisitTypesRequired) {
        visitTypeMetaReqParams.visitTypeMetaList = selectedVisitTypeList;
      }
      claimFiltersMetaReqParams.visitTypeMetaData = visitTypeMetaReqParams;
    }

    if (selectedMemberList && selectedMemberList.length) {
      memberTypeMetaReqParams.allmembersRequired = this.allClaimsFilterOptions.member.allOptRequired;
      if (!memberTypeMetaReqParams.allmembersRequired) {
        memberTypeMetaReqParams.memberTypeMetaList = selectedMemberList;
      }
      claimFiltersMetaReqParams.memberTypeMetaData = memberTypeMetaReqParams;
    }

    claimsSummaryReqParams.useridin = this.authService.useridin;
    // for pagination
    claimSummaryMetaReqParams.hasMoreRecords = this.claimsListing.summaryMetaData.hasMoreRecords;
    claimSummaryMetaReqParams.recordStartIndex = this.claimsListing.summaryMetaData.recordStartIndex;
    claimSummaryMetaReqParams.recordEndIndex = this.claimsListing.summaryMetaData.recordEndIndex;
    claimSummaryMetaReqParams.totalRecordCount = this.claimsListing.summaryMetaData.totalRecordCount;

    // check if here is a change in sort order?
    if (this.currentSortValue !== this.sortSelectedFilter) {
      this.currentSortValue = this.sortSelectedFilter;
      claimSummaryMetaReqParams.sortOrder = sortSelectedFilter;
    } else {
      delete claimSummaryMetaReqParams.sortOrder;
    }

    claimsSummaryReqParams.summaryMetaData = claimSummaryMetaReqParams;
    if (Object.keys(claimFiltersMetaReqParams).length) {
      claimsSummaryReqParams.filtersMetadata = claimFiltersMetaReqParams;
    }
    console.log(claimsSummaryReqParams);

    return claimsSummaryReqParams;

  }


  public openPDF(fileItem: string) {
    window.location.href = fileItem;
    return;
  }

}
