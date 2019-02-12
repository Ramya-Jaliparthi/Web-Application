import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { MatCalendar, MatRadioGroup, MatSelectionList, MatSelectionListChange, MatSidenav } from '@angular/material';
import { ActivatedRoute, NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import * as moment from 'moment';
import { MemberInfo } from '../../../shared/models/memberInfo.model';
import { AuthHttp } from '../../../shared/services/authHttp.service';
import { DependantsService } from '../../../shared/services/dependant.service';
import { FilterService } from '../../../shared/services/filter.service';
import { GlobalService } from '../../../shared/services/global.service';
import { AuthService, AlertService } from '../../../shared/shared.module';
import { MedicationsService } from '../../../shared/services/medications/medications.service';
import { ConstantsService } from '../../../shared/services/constants.service';
import { DependentsModelInterface } from '../../myclaims/models/interfaces/dependants-model.interface';
import { DependentsModel } from '../../myclaims/models/dependants.model';
import { RadioListInterface, RxSummaryInterface } from '../models/interfaces/my-medications-generic-models.interface';
import { RadioList } from '../models/my-medications-generic.models';
import { environment } from '../../../../environments/environment';
import { DependentRecentRxResponseModelInterface } from '../models/interfaces/dependant-recent-rx-model.interface';
import { DependentRecentRxResponseModel } from '../models/dependant-recent-rx.model';
import { MyMedicationDetailsService } from '../myMedicationDetails/my-medication-details.service';
import { RxDetailsRequestModelInterface } from '../models/interfaces/rx-details-model.interface';
import { RxDetailsRequestModel } from '../models/rx-details.model';
import { GetMemBasicInfoResponseModelInterface } from '../models/interfaces/get-member-basic-info-model.interface';
import { Observable } from 'rxjs/Observable';
import { TitleCasePipe } from '@angular/common';

@Component({
  templateUrl: './mymedications.component.html',
  styleUrls: ['./mymedications.component.scss'],
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

export class MyMedicationsComponent implements OnInit, OnDestroy {
  userString: 'User' = 'User';
  dependant: string;
  memberData: MemberInfo;
  basicMemInfo: GetMemBasicInfoResponseModelInterface;
  medications: DependentRecentRxResponseModelInterface = new DependentRecentRxResponseModel();
  filteredMedications: DependentRecentRxResponseModelInterface = new DependentRecentRxResponseModel();
  private allMedications: DependentRecentRxResponseModelInterface = new DependentRecentRxResponseModel();
  sideNavHeight: string;
  sideNavStatus: string;
  noMedicationsAvailable = false;
  dateList = [];
  showClose: boolean;
  showCalender: boolean;
  bHasDependents = false;
  // ar00001
  fpoTargetUrl = environment.drupalTestUrl + '/page/mymedications-nomedications';
  layout = 'central';
  // Fix for MWIT-522
  sortList: RadioListInterface[] = [
    (new RadioList()).setValue('Most Recent').setChecked(true),
    (new RadioList()).setValue('A to Z').setChecked(false),
    (new RadioList()).setValue('Z to A').setChecked(false)
  ];
  sortSelectedFilter: string;
  searchval: string;
  isautosearch: boolean;
  isDisplayMessage: boolean;
  medicationsMessage: string;
  issearchShowing: boolean;
  isfilterShowing: boolean;
  // Filter options
  dateSelectedFilter: string;
  showDate: boolean;
  fromMinDate: Date;
  calendarMaxDate = new Date();
  currentSelectedDate: Date = null;
  isCustomDateRangeInValid = false;
  isSelectedDateInvalid = false;
  sideNavMode: string;
  lastDate: Date;
  fromDate: any;
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
  isSortExpanded: boolean;

  isFormDateSelected = true;
  dateFormat = 'MM/DD/YYYY';
  doctorList = [];
  selectedDoctorList: string[] = [];
  pharmacyList = [];
  membersList = [];
  selectedPharmacyList: string[] = [];
  memberSelectedFilter = [];
  allPharmaciesString = 'All Pharmacies';
  allDoctorsString = 'All Prescribing Doctors';
  dependentList: DependentsModelInterface = new DependentsModel();
  selectedSortString: string;
  myFocusTriggeringEventEmitter = new EventEmitter<boolean>();
  showClearLink = false;
  showResultsCount = false;
  searchString: string;
  step = [];
  medsInfo: DependentRecentRxResponseModelInterface[];
  isInActiveUser: boolean = false;
  showFilterCount: boolean = false;
  // public displayName: string = '';

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

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth <= this.mobileViewPort) {
      this.ismobile = true;
    } else {
      this.ismobile = false;
      this.sideNavStatus = 'in';
    }
  }

  constructor(private medicationsService: MedicationsService,
    public authService: AuthService,
    private router: Router,
    public dependantsService: DependantsService,
    public filterService: FilterService,
    public globalService: GlobalService,
    public authHttp: AuthHttp,
    public constants: ConstantsService,
    private activatedRoute: ActivatedRoute,
    private title: TitleCasePipe,
    private myMedicationsDetailsService: MyMedicationDetailsService,
    private alertService: AlertService) {

  }

  ngOnInit() {
    // wait for the service calls in the mymeds-resolver to produce response and then proceed
    this.medsInfo = this.activatedRoute.snapshot.data && this.activatedRoute.snapshot.data.medsInfo &&
      this.activatedRoute.snapshot.data.medsInfo.MedRecords;
    this.basicMemInfo = this.activatedRoute.snapshot.data.medsInfo.MemBasicInfo;
    if (this.basicMemInfo.rxSummary) {
      this.basicMemInfo.rxSummary.fullName = this.basicMemInfo.rxSummary.memMiddleInitial ?
        [this.title.transform(this.basicMemInfo.rxSummary.memFirstName), ' ',
        this.title.transform(this.basicMemInfo.rxSummary.memMiddleInitial), ' ',
        this.title.transform(this.basicMemInfo.rxSummary.memLastName), ' (',
        (this.title.transform(this.basicMemInfo.rxSummary.relationship)), ')'].join('') :
        [this.title.transform(this.basicMemInfo.rxSummary.memFirstName), ' ',
        this.title.transform(this.basicMemInfo.rxSummary.memLastName), ' (',
        (this.title.transform(this.basicMemInfo.rxSummary.relationship)), ')'].join('');

      this.basicMemInfo.rxSummary.filterName = this.basicMemInfo.rxSummary.memMiddleInitial ?
        [this.title.transform(this.basicMemInfo.rxSummary.memFirstName), ' ',
        this.title.transform(this.basicMemInfo.rxSummary.memMiddleInitial), ' ',
        this.title.transform(this.basicMemInfo.rxSummary.memLastName)].join('') :
        [this.title.transform(this.basicMemInfo.rxSummary.memFirstName), ' ',
        this.title.transform(this.basicMemInfo.rxSummary.memLastName)].join('');
    }
    this.medicationsService.setBasicMemInfo(this.basicMemInfo);

    this.sortSelectedFilter = 'Most Recent';
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
    this.sideNavHeight = '600';
    this.isSortExpanded = false;
    this.showCalender = false;
    this.searchString = '';

    if (window.innerWidth <= this.mobileViewPort) {
      this.ismobile = true;
    }
    this.sideNavStatus = this.ismobile ? 'out' : 'in';
    this.dependentList = this.authService.getDependentsList();

    this.dependant = this.userString;
    this.membersList = this.getMembersList();
    this.sortSelectedFilter = 'Most Recent';

    this.initializeFiltersState();

    let medications: DependentRecentRxResponseModelInterface;
    if (this.medsInfo && this.medsInfo[0] !== undefined && this.medsInfo[0].rxSummary) {
      this.medsInfo[0].rxSummary = this.medsInfo[0].rxSummary.map((med) => {
        // med.uniquePersonId = null;
        const stampedMed: any = Object.assign({ 'currUser': true }, med);
        return stampedMed;
      });
      medications = this.medsInfo.reduce(
        (prev: DependentRecentRxResponseModelInterface, curr: DependentRecentRxResponseModelInterface) => {
          if (curr.rxSummary && prev.rxSummary) {
            curr.rxSummary = curr.rxSummary.concat(prev.rxSummary);
          }
          return curr;
        }
        , new DependentRecentRxResponseModel());
    }

    if (medications && medications.rxSummary && medications.rxSummary.length) {
      this.handleMedicationsResponse(medications);
    } else {
      this.noMedicationsAvailable = true;
    }

    this.clearSessionStorageItems();
    this.clearSessionItems();
    this.setInActiveUserFlag();

    const filterStateStr = sessionStorage.getItem('med_filterState');
    const filterState = JSON.parse(filterStateStr);
    if (filterState) {
      sessionStorage.setItem('medicationSelectedUserId', filterState.dependant);
    } else {
      sessionStorage.setItem('medicationSelectedUserId', 'User');
    }
  }

  setInActiveUserFlag() {
    try {
      const authDetails = JSON.parse(sessionStorage.getItem('authToken'));
      if (authDetails && authDetails.HasActivePlan && authDetails.HasActivePlan === 'false') {
        this.isInActiveUser = true;
      }
    } catch (ex) {
    }
  }

  ngOnDestroy() {
    this.alertService.clearError();
    sessionStorage.removeItem('medicationSelectedUserId');
  }

  initializeFiltersState() {
    const filterStateStr = sessionStorage.getItem('med_filterState');
    const filterState = JSON.parse(filterStateStr);
    if (filterState) {
      this.selectedDoctorList = filterState.selectedDoctorList;
      this.selectedPharmacyList = filterState.selectedPharmacyList;
      this.dateSelectedFilter = filterState.dateSelectedFilter;
      this.toDate = filterState.toDate;
      this.fromDate = filterState.fromDate;
      this.searchval = filterState.searchval;
      this.sortSelectedFilter = filterState.sortSelectedFilter;
      this.dependant = filterState.dependant;
      this.membersList = this.getMembersList();
      if (this.searchval) {
        this.issearchShowing = true;
      }
    }
    this.router.events
      .filter(e => e instanceof RoutesRecognized)
      .pairwise()
      .subscribe((event: any[]) => {
        if (!(event[0].urlAfterRedirects === '/mymedications/medicationdetails' || event[0].urlAfterRedirects === '/mymedications')) {
          sessionStorage.removeItem('med_filterState');
        }
      });
  }

  uniqueArray(array) {
    const j = {};
    array.forEach(function (item) {
      j[item + '::' + typeof item] = item;
    });
    return Object.keys(j).map(function (item) {
      return j[item];
    });
  }

  ClearSearch(value: boolean = true) {
    this.issearchShowing = false;
    this.searchval = '';
    this.isDisplayMessage = false;
    this.isautosearch = false;
    sessionStorage.removeItem('searchval');
  }

  SearchAutoComplete(event, data: any) {
    this.showClose = data.value.length > 0;

    if (data.value.length <= 2) {
      this.isautosearch = false;
    }
    if (data.value.length > 2) {
      this.autoCompleteSearchArray = [];
      for (let i = 0; i < this.medications.rxSummary.length; i++) {
        this.isautosearch = true;

        if (this.medications[i].rxSummary.genericName.toLowerCase().includes(data.value.toString().toLowerCase())) {
          this.autoCompleteSearchArray.push(this.medications[i].rxSummary.genericName.toString());
        }

        if (this.medications[i].rxSummary.prescribingDoctor.toLowerCase().toString().includes(data.value.toString().toLowerCase())) {
          this.autoCompleteSearchArray.push(this.medications[i].rxSummary.prescribingDoctor.toString());
        }

        if (this.medications[i].rxSummary.genericName.toLowerCase().includes(data.value.toString().toLowerCase())) {
          this.autoCompleteSearchArray.push(this.medications[i].rxSummary.genericName.toString());
        }
      }
      this.autoCompleteSearchArray = this.uniqueArray(this.autoCompleteSearchArray);
      if (this.autoCompleteSearchArray.length <= 0) {
        this.isautosearch = false;
      }
      if (event.which === 40) {
        if (this.searchDrpContainer) {
          this.searchDrpContainer.nativeElement.getElementsByTagName('li')[0].focus();
        }
      }
      if (event.which === 27 || event.which === 38) {
        this.escapeSearchContainer(event);
      }
    }
  }

  search(event, data: any, doctorList: MatSelectionList, pharmacyList: MatSelectionList) {
    this.issearchShowing = true;
    this.index = 0;
    this.isDisplayMessage = false;
    this.isautosearch = false;

    const val = data.value === undefined ? data : data.value;
    if (val.length > 0) {
      sessionStorage.setItem('searchval', val);
    } else {
      this.isautosearch = false;
      this.issearchShowing = false;
    }
    this.searchString = val;
    this.applyFilter(doctorList, pharmacyList); // , false
    this.claimsErrorMessage();
  }

  getSearchValue(event, value: any, doctorList: MatSelectionList, pharmacyList: MatSelectionList) {
    this.searchval = value;
    sessionStorage.setItem('searchval', this.searchval);
    this.search(event, value, doctorList, pharmacyList);
    this.isautosearch = false;
  }

  // filter Logic below
  toggleFilter(toggleStatus) {
    this.isSidenavOpened = !this.isSidenavOpened;
    this.sideNavStatus = this.sideNavStatus === 'out' ? 'in' : 'out';
    if (toggleStatus) {
      this.sideNavStatus = toggleStatus;
    }
    if (window.innerWidth <= 992) {
      this.sideNavMode = 'over';
    } else {
      this.sideNavMode = 'side';
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
        || this.filteredMedications.rxSummary.length !== this.medications.rxSummary
          .filter((medication) => {
            const bufferMedication: any = Object.assign({}, medication);
            return bufferMedication.currUser ? bufferMedication.currUser : !medication.uniquePersonId;
          }).length) {
        this.showClearLink = true;
      }

    }
  }

  applyFilter(doctorList: MatSelectionList, pharmacyList: MatSelectionList) { // , clearSearch: boolean = true
    this.filterService.scrollToTop();
    this.closeFilter();
    this.closeSideNavigation();
    // if (clearSearch) {
    //   this.ClearSearch();
    // }
    this.selectedDoctorList = this.getSelectedItems(doctorList);
    this.selectedPharmacyList = this.getSelectedItems(pharmacyList);
    sessionStorage.setItem('sortSelectedFilter', this.sortSelectedFilter);
    if (this.checkIfIsDependentIsChanged()) {
      this.clearFilterList();
      this.handleMedicationsResponse(this.allMedications, true);
    } else {
      this.showResultsCount = true;
      this.filterData();
      this.applySorting();
    }
    this.setShowClearLink();
    this.isautosearch = false;
    this.showCalender = false;
    this.showFilterCount = this.isFilterApplied();
  }

  applyUserFilter() {
    if (this.dependant !== null && this.dependant !== undefined && this.dependant !== 'All') {

      this.medications.rxSummary = this.allMedications.rxSummary.filter((medication) => {
        const bufferMedication: any = Object.assign({}, medication);
        return ((this.dependant.includes(this.userString) && bufferMedication.currUser) || // DependentId =>uniquePersonId
          (bufferMedication.dependentId && this.dependant.includes(bufferMedication.dependentId.toString())));
      });

    } else {
      this.medications.rxSummary = this.allMedications.rxSummary.map((medication) => {
        return { ...medication };
      });
    }
  }

  getDependantMedicationCount(dependentId: number | 'User') {

    return dependentId === this.userString ? this.allMedications.rxSummary.filter((medication) => {
      const bufferMedication: any = Object.assign({}, medication);
      return bufferMedication.currUser;
    }).length :
      this.allMedications.rxSummary.filter((medication) => {
        const bufferMedication: any = Object.assign({}, medication);
        return bufferMedication.dependentId === dependentId;
      }).length;


  }

  applyDoctorsFilter() {
    if (this.selectedDoctorList && this.selectedDoctorList.length && this.filteredMedications) {
      this.filteredMedications.rxSummary = this.filteredMedications.rxSummary.filter((medication) => {
        return this.selectedDoctorList.includes(medication.prescribingDoctor);
      });
    }
  }

  applyPharmacyFilter() {
    if (this.selectedPharmacyList && this.selectedPharmacyList.length && this.filteredMedications) {
      this.filteredMedications.rxSummary = this.filteredMedications.rxSummary.filter((medication) => {
        return this.selectedPharmacyList.includes(medication.pharmacy.name);
      });
    }
  }

  applyCustomRangeDateFilter() {
    if (this.toDate && this.fromDate) { // !this.isCustomDateRangeInValid && !this.isSelectedDateInvalid &&
      const toDate = moment(this.toDate, this.dateFormat, true);
      const fromDate = moment(this.fromDate, this.dateFormat, true);
      if (toDate.isValid() && fromDate.isValid()) {
        this.filteredMedications.rxSummary = this.filteredMedications.rxSummary.filter((medication) => {

          const medicationDate = moment(medication.rxIncurredDate);

          return medicationDate.diff(toDate) <= 0 && medicationDate.diff(fromDate) >= 0;
        });
      } else {
        this.filteredMedications.rxSummary = [];
      }
    }
  }

  applyDateFilter() {
    if (this.dateSelectedFilter && this.dateSelectedFilter !== 'All') {
      if (this.dateSelectedFilter === 'Custom') {
        this.applyCustomRangeDateFilter();
      } else if (this.dateSelectedFilter !== 'Year') {
        this.filteredMedications.rxSummary = this.filteredMedications.rxSummary.filter((medication) => {
          // return moment().diff(moment(medication.DispDt), 'days') <= +this.dateSelectedFilter;
          return moment().diff(medication.rxIncurredDate, 'days') <= +this.dateSelectedFilter;
        });
      } else {
        this.filteredMedications.rxSummary = this.filteredMedications.rxSummary.filter((medication) => {
          // return moment().diff(moment(medication.DispDt), 'years', true) <= 1;
          return moment().diff(medication.rxIncurredDate, 'years', true) <= 1;
        });
      }
    }
  }

  checkIfIsDependentIsChanged() {
    const previousSelectedDependent = sessionStorage.getItem('medicationSelectedUserId');
    if (this.dependant.toString() !== previousSelectedDependent) {
      sessionStorage.setItem('medicationSelectedUserId', this.dependant.toString());
      return true;
    } else {
      return false;
    }
  }

  handleNoMedicationAvailble(medications) {
    this.noMedicationsAvailable = (!medications || medications.length === 0)
      && (this.dependentList && this.dependentList.dependents.length === 0);
    // this.noMedicationsAvailable = true;
  }

  getCurrentUserMedications() {
    this.medicationsService.getMedications()
      .subscribe(response => {
        this.handleMedicationsResponse(response);
      }, err => {
        this.isDisplayMessage = true;
      });
  }

  getMembersList() {
    const membersListItems = [];
    membersListItems.push(
      {
        value: this.userString,
        selected: this.dependant.includes(this.userString) || this.dependant === 'All',
        count: this.getDependantMedicationCount(this.userString),
        name: this.userString,
        disabled: this.dependant === 'All'
      });

    if (this.dependentList && this.dependentList.dependents) {
      this.dependentList.dependents.forEach(user => {
        membersListItems.push({
          value: user.dependent.depId,
          selected: this.dependant.includes(user.dependent.depId.toString()) || this.dependant === 'All',
          count: this.getDependantMedicationCount(user.dependent.depId),
          name: user.dependent.middleInitial ? [user.dependent.firstName, ' ', user.dependent.middleInitial, ' ', user.dependent.lastName].join('') : [user.dependent.firstName, ' ', user.dependent.lastName].join(''),
          disabled: this.dependant === 'All'
        });
      });
    }
    membersListItems.push({
      value: 'All',
      selected: this.dependant === 'All',
      count: this.allMedications.rxSummary.length,
      name: 'All Members',
      disabled: false
    });

    return membersListItems;
  }

  getListItems(property: string, list, selectAllOptionIdentifier: string, secondaryProperty: string = '') {
    const itemsCount = {};
    for (const listItem of list) {
      const propertyValue = secondaryProperty ? listItem[property][secondaryProperty] : listItem[property];
      itemsCount[propertyValue] = itemsCount[propertyValue] ? itemsCount[propertyValue] + 1 : 1;
    }
    const listItems = [];
    for (const key of Object.keys(itemsCount)) {
      listItems.push({
        value: key,
        selected: false,
        count: itemsCount[key]
      });
    }
    if (listItems && listItems.length > 1) {
      listItems.push({
        value: selectAllOptionIdentifier,
        selected: false,
        count: list.length
      });
    }
    return listItems;
  }

  onSelectionChange(selectionListChange: MatSelectionListChange, selectAllOptionIdentifier: string, selectedList) {
    const changeEvent = selectionListChange.option;
    if (changeEvent && changeEvent.value === selectAllOptionIdentifier) {
      this.selectAllOptions(selectedList, changeEvent.selected, selectAllOptionIdentifier);
    } else {
      const selectedOption = selectedList.find((listItem) => changeEvent && listItem.value === changeEvent.value);
      if (selectedOption) {
        selectedOption.selected = changeEvent.selected;
      }
      if (changeEvent.selected) {
        // when the user wants to check all option if he selects all the other list items
        // if (changeEvent.selectionList.selectedOptions.selected.length === selectedList.length - 1) {
        //   this.checkSelectAllOptionIfAllSelected(selectedList, selectAllOptionIdentifier);
        // }
      } else {
        this.unCheckSelectAllOption(selectedList, selectAllOptionIdentifier);
      }
    }
  }

  onDoctorSelectionChange(selectionListChange: MatSelectionListChange) {
    this.onSelectionChange(selectionListChange, this.allDoctorsString, this.doctorList);
  }

  onMemberSelectionChange(selectionListChange: MatSelectionListChange) {
    const changeEvent = selectionListChange.option;
    if (changeEvent.value === 'All') {
      this.dependant = changeEvent.selected ? 'All' : '';
      this.selectAllMembers(changeEvent.selected);
    } else {
      if (changeEvent.value === 'User') {
        this.membersList[0].selected = changeEvent.selected;
      }
      this.dependant = this.generateDependantString(selectionListChange);
    }
    // this.membersList = this.getMembersList();
  }

  generateDependantString(selectionListChange: MatSelectionListChange): string {
    const selectedOptions = selectionListChange.source.selectedOptions.selected;
    if (selectedOptions && selectedOptions.length > 0) {
      return selectionListChange.source.selectedOptions.selected.map((selectedItem) => selectedItem.value).join();
    } else {
      return '';
    }
  }

  selectAllMembers(select: boolean) {
    this.membersList = this.membersList.map((member) => {
      if (select) {
        member.selected = true;
        member.disabled = member.value !== 'All';
      } else {
        member.selected = false;
        member.disabled = false;
      }
      return member;
    });
  }

  onPharmacySelectionChange(selectionListChange: MatSelectionListChange) {
    this.onSelectionChange(selectionListChange, this.allPharmaciesString, this.pharmacyList);
  }

  checkSelectAllOptionIfAllSelected(list, selectedAllOptionIdentifier: string) {
    const selectedAllOption = list.find((listItem) => listItem.value === selectedAllOptionIdentifier);
    if (selectedAllOption && !selectedAllOption.selected) {
      selectedAllOption.selected = true;
    }
    return list;
  }

  unCheckSelectAllOption(list, selectedAllOptionIdentifier: string) {
    const selectedAllOption = list.find((listItem) => listItem.value === selectedAllOptionIdentifier);
    if (selectedAllOption && selectedAllOption.selected) {
      selectedAllOption.selected = false;
    }
    return list;
  }

  // selectAllOptions(list, selectedValue: boolean) {
  //   return list.map((listItem) => {
  //     listItem.selected = selectedValue;
  //     return listItem;
  //   });
  // }

  selectAllOptions(list, selectedValue: boolean, selectAllOptionIdentifier: string) {
    return list.map((listItem) => {
      listItem.selected = selectedValue;
      if (selectedValue) {
        listItem.selected = true;
        listItem.disabled = listItem.value !== selectAllOptionIdentifier;
      } else {
        listItem.selected = false;
        listItem.disabled = false;
      }

      return listItem;
    });
  }

  getDateCount(listOfDatesDiffInDays, dateSpan) {
    if (listOfDatesDiffInDays) {
      const filterList = listOfDatesDiffInDays.filter((item) => item <= dateSpan);
      return filterList ? filterList.length : 0;
    }
    return 0;
  }

  getDateListItems(property: string) {
    const listOfDatesDiffInDays: number[] = this.medications.rxSummary.map(
      (medication) => moment().diff(medication[property], 'days'));
    const listOfDatesDiffInYears: number[] = this.medications.rxSummary.map(
      (medication) => moment().diff(medication[property], 'years', true));
    this.dateList = [
      {
        'label': 'Last 30 days',
        'value': 30,
        'checked': false,
        'count': this.getDateCount(listOfDatesDiffInDays, 30)
      },
      {
        'label': 'Last 60 days',
        'value': 60,
        'checked': false,
        'count': this.getDateCount(listOfDatesDiffInDays, 60)
      },
      {
        'label': 'Last 90 days',
        'value': 90,
        'checked': false,
        'count': this.getDateCount(listOfDatesDiffInDays, 90)
      },
      {
        'label': 'Year-to-date',
        'value': 'Year',
        'checked': false,
        'count': this.getDateCount(listOfDatesDiffInYears, 1)
      },
      {
        'label': 'All dates',
        'value': 'All',
        'checked': false,
        'count': listOfDatesDiffInDays.length
      },
      {
        'label': 'Custom Date Range',
        'value': 'Custom',
        'checked': false,
        'count': ''
      }
    ];
    return this.dateList;
  }

  setFilterData() {
    if (this.doctorList && this.selectedDoctorList) {
      this.doctorList.map((item) => {
        const isSelected = this.selectedDoctorList.includes(this.allDoctorsString)
          || this.selectedDoctorList.includes(item.value);
        item.selected = isSelected;
        return item;
      });
    }
    if (this.pharmacyList && this.selectedPharmacyList) {
      this.pharmacyList.map((item) => {
        const isSelected = this.selectedPharmacyList.includes(this.allPharmaciesString)
          || this.selectedPharmacyList.includes(item.value);
        item.selected = isSelected;
        return item;
      });
    }
    if (this.dateList && this.dateSelectedFilter) {
      for (let i = 0; i < this.dateList.length; i++) {
        if (this.dateList[i].value === this.dateSelectedFilter) {
          this.dateList[i].checked = true;
        }
      }
    }
  }

  handleMedicationsResponse(medications: DependentRecentRxResponseModelInterface, applyFilter: boolean = true) {
    this.allMedications = medications;
    if ((this.dependentList && this.dependentList.dependents && this.dependentList.dependents.length === 0) || !this.dependentList) {
      this.bHasDependents = this.allMedications.rxSummary.length !== 1;
    } else {
      this.bHasDependents = true;
    }
    this.applyUserFilter();
    this.doctorList = this.getListItems('prescribingDoctor', this.medications.rxSummary, this.allDoctorsString);
    this.pharmacyList = this.getListItems('pharmacy', this.medications.rxSummary, this.allPharmaciesString, 'name');
    this.membersList = this.getMembersList();
    this.dateList = this.getDateListItems('rxIncurredDate');
    this.setFilterData();
    if (applyFilter) {
      this.filterData();
    } else {
      this.filteredMedications.rxSummary = this.medications.rxSummary;
    }
    this.applySorting();
    this.setShowClearLink();
    this.showFilterCount = this.isFilterApplied();
  }

  filterData() {
    this.filteredMedications.rxSummary = this.medications.rxSummary;
    if (this.searchval) {
      this.filteredMedications.rxSummary = this.medications.rxSummary.filter(
        medication =>
          medication.genericName && medication.genericName.toString().toLowerCase().includes(this.searchval.toString().toLowerCase()) ||
          medication.prescribingDoctor && medication.prescribingDoctor.toString().toLowerCase()
            .includes(this.searchval.toString().toLowerCase()) ||
          medication.genericName && medication.genericName.toLowerCase().includes(this.searchval.toString().toLowerCase())
      );
    }

    this.applyDoctorsFilter();
    this.applyPharmacyFilter();
    this.applyDateFilter();

    this.isDisplayMessage = !this.filteredMedications || this.filteredMedications.rxSummary.length === 0;
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
    const NOOP = () => {
      return;
    };
    sessionStorage.removeItem('providerSelectedfilter');
    sessionStorage.removeItem('visitTypeSelectedfilter');
    sessionStorage.removeItem('claimStatusSelectedfilter');
    sessionStorage.removeItem('dateSelectedFilter');
    sessionStorage.removeItem('fromDate');
    sessionStorage.removeItem('toDate');
    sessionStorage.removeItem('sortSelectedFilter');
    if (sessionStorage.getItem('medicationSelectedUserId') !== 'User') {
      sessionStorage.removeItem('medicationSelectedUserId');
    }
  }

  clearFilterList() {
    this.selectedDoctorList = [];
    this.selectedPharmacyList = [];
    this.dateList = [];
    this.dateSelectedFilter = '';
  }


  clearFilter() {
    this.step = [];
    this.dependant = this.userString; // "User"
    this.setSortFiltervalue();
    this.ClearSearch();
    this.closeFilter();
    this.clearFilterList();
    this.handleMedicationsResponse(this.allMedications, true);
    this.clearSessionStorageItems();
    this.setShowClearLink();
    this.showClose = false;
    this.showCalender = false;
    this.showResultsCount = false;
    this.isSortExpanded = false;
    this.isSelectedDateInvalid = false;
    this.isCustomDateRangeInValid = false;
    this.showFilterCount = false;
    sessionStorage.setItem('medicationSelectedUserId', 'User');
    this.filterService.scrollToTop();
  }

  isFilterApplied(): boolean {
    return !!((this.selectedDoctorList && this.selectedDoctorList.length > 0) ||
      (this.selectedPharmacyList && this.selectedPharmacyList.length > 0) ||
      this.dateSelectedFilter || this.memberSelectedFilter.length > 0);
  }

  isSortOpened() {
    this.isSortExpanded = true;
  }

  isSortClosed() {
    this.isSortExpanded = false;
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

  applySorting() {
    const selectedSortFilter = this.sortSelectedFilter;
    if (!selectedSortFilter || selectedSortFilter === 'Most Recent') {
      this.filteredMedications.rxSummary = this.filteredMedications.rxSummary
        .sort((item1, item2) => moment(item1.rxIncurredDate).diff(moment(item2.rxIncurredDate), 'days') ||
          (this.compareStringField(item1.genericName, item2.genericName)));
      this.filteredMedications.rxSummary = this.filteredMedications.rxSummary.reverse();
    } else if (selectedSortFilter === 'A to Z') {
      this.filteredMedications.rxSummary = this.filteredMedications.rxSummary
        .sort((item1, item2) => (this.compareStringField(item2.genericName, item1.genericName)) || moment(item2.rxIncurredDate).diff(moment(item1.rxIncurredDate), 'days'));
    } else if (selectedSortFilter === 'Z to A') {
      this.filteredMedications.rxSummary = this.filteredMedications.rxSummary
        .sort((item1, item2) => (this.compareStringField(item1.genericName, item2.genericName)) || moment(item2.rxIncurredDate).diff(moment(item1.rxIncurredDate), 'days'));
    }
    // this.authService.hideSpinnerLoading();
    this.selectedSortString = selectedSortFilter ? selectedSortFilter : 'Most Recent';
  }

  compareStringField(value1: string, value2: string) {
    if (value1 === value2) {
      return 0;
    }
    return value1 > value2 ? -1 : 1;
  }

  claimsErrorMessage() {
    if (this.filteredMedications.rxSummary.length === 0) {
      this.medicationsMessage = 'For further inquiries, please contact member services';
      this.isDisplayMessage = true;
    }
  }

  searchMouseDown(event, index, doctorFilter, pharmacyFilter) {
    //  event.preventDefault();
    const oListItem = this.searchDrpContainer.nativeElement.getElementsByTagName('li');
    const length = this.autoCompleteSearchArray.length;
    if (index === length - 1) {
      this.myFocusTriggeringEventEmitter.emit(true);
      this.isautosearch = false;
    } else if (event.which === 40) {
      event.preventDefault();
      oListItem[index + 1].focus();
    } else if (event.which === 38) {
      if (index === 0) {
        this.myFocusTriggeringEventEmitter.emit(true);
        this.isautosearch = false;
      } else {
        event.preventDefault();
        oListItem[index - 1].focus();
      }
    } else if (event.which === 13) {
      this.getSearchValue(event, event.target.textContent.toString().trim(), doctorFilter, pharmacyFilter);
    }
    this.escapeSearchContainer(event);
  }

  escapeSearchContainer(event) {
    if (event.which === 27) {
      this.isautosearch = false;
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

  showMedicationDetails(medication: RxSummaryInterface) {
    const medicationDetailReq: RxDetailsRequestModelInterface = new RxDetailsRequestModel();
    medicationDetailReq.useridin = this.authService.useridin;
    medicationDetailReq.rxIncurredDate = medication.rxIncurredDate;
    medicationDetailReq.ndcCd = medication.ndcCd;
    if (medication.dependentId) {
      medicationDetailReq.dependentId = medication.dependentId;
    }
    console.log(medication);
    this.myMedicationsDetailsService.setMyMedicationDetailsRequest(medicationDetailReq);
    this.myMedicationsDetailsService.setCurrentUserInfo(!medication.currUser, medication.MemberInfo);
    this.router.navigate(['../mymedications/medicationdetails']);

    this.saveFilterDetails();
  }

  stopEventPropagation(event) {
    event.stopPropagation();
  }

  saveFilterDetails() {
    const filterDetails = {
      selectedDoctorList: this.selectedDoctorList,
      selectedPharmacyList: this.selectedPharmacyList,
      dateSelectedFilter: this.dateSelectedFilter,
      toDate: this.toDate,
      fromDate: this.fromDate,
      searchval: this.searchval,
      sortSelectedFilter: this.sortSelectedFilter,
      dependant: this.dependant
    };
    sessionStorage.setItem('med_filterState', JSON.stringify(filterDetails));
  }

  dateFilterChanged(temp) {
    for (let i = 0; i < this.dateList.length; i++) {
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
    this.clearCustomDateRangeSelections();
  }

  fromDateChange(fromdate) {
    this.validateFromDate();
    this.validateCustomRange();
    if (!this.isCustomDateRangeInValid && !this.isSelectedDateInvalid) {
      this.showCalender = false;
    }
  }

  validateFromDate() {
    const minFormDate = this.getMinimumFromDate();
    if (moment(this.fromDate, this.dateFormat, true).isValid()) {
      this.isSelectedDateInvalid = !this.fromDate || this.fromDate.length !== 10
        || moment(this.fromDate, this.dateFormat).diff(moment(this.calendarMaxDate)) > 0
        || moment(this.fromDate, this.dateFormat).diff(moment(minFormDate)) < 0;
    } else {
      this.isSelectedDateInvalid = true;
    }
  }

  getMinimumFromDate() {
    const minFormDate = new Date();
    const dateRangeAllowedYeardRange: number = this.isInActiveUser ? 1 : 2;
    minFormDate.setFullYear(minFormDate.getFullYear() - dateRangeAllowedYeardRange);
    return minFormDate;
  }

  validateToDate() {
    const minFormDate = this.getMinimumFromDate();
    if (moment(this.toDate, this.dateFormat, true).isValid()) {
      this.isSelectedDateInvalid = !this.toDate
        || moment(this.toDate, this.dateFormat).diff(moment(this.calendarMaxDate)) > 0
        || moment(this.fromDate, this.dateFormat).diff(moment(minFormDate)) < 0;
    } else {
      this.isSelectedDateInvalid = true;
    }
  }

  validateCustomRange() {
    if (this.toDate && this.fromDate) {
      this.isCustomDateRangeInValid = moment(this.toDate).diff(moment(this.fromDate)) < 0;
    }
    return this.isCustomDateRangeInValid;
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
    this.fromDate = '';
    this.fromMinDate = null;
    this.isCustomDateRangeInValid = false;
    this.isSelectedDateInvalid = false;
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

  getFormatDateString(date) {
    return moment(date).format('L');
  }

  getSelectedValue(date) {
    this.isCustomDateRangeInValid = false;
    this.isSelectedDateInvalid = false;
    if (this.isFormDateSelected) {
      this.fromDate = this.getFormatDateString(date);
    } else {
      this.toDate = this.getFormatDateString(date);
    }
    this.setCalendarMinimumDate();
    this.showCalender = this.validateCustomRange();
  }

  setCalendarMinimumDate() {
    if (!this.isFormDateSelected && this.fromDate) {
      this.fromMinDate = new Date(this.fromDate);
    } else {
      const minFormDate = this.getMinimumFromDate();
      this.fromMinDate = minFormDate;
    }
  }

  formatInputFromDate(value) {
    const dateString: any = this.convertInputStringToDate(value);
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
    const dateString = this.convertInputStringToDate(value);
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

  convertInputStringToDate(inputDateString: string) {
    if (inputDateString) {
      inputDateString = inputDateString.replace(/[/]/g, '');
      if (inputDateString.length >= 4) {
        inputDateString = inputDateString.substring(0, 2) + '/' + inputDateString.substring(2, 4) + '/' + inputDateString.substring(4);
      } else if (inputDateString.length >= 2) {
        inputDateString = inputDateString.substring(0, 2) + '/' + inputDateString.substring(2, 4);
      }
      return inputDateString;
    }
    return null;
  }

  customDateInputKeyDownEvent(e) {
    const regexStr = '^[0-9]*$';
    if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode === 65 && e.ctrlKey === true) ||
      // Allow: Ctrl+C
      (e.keyCode === 67 && e.ctrlKey === true) ||
      // Allow: Ctrl+V
      (e.keyCode === 86 && e.ctrlKey === true) ||
      // Allow: Ctrl+X
      (e.keyCode === 88 && e.ctrlKey === true) ||
      // Allow: home, end, left, right
      (e.keyCode >= 96 && e.keyCode <= 105) ||
      // allow num 0-9
      (e.keyCode >= 35 && e.keyCode <= 39)) {
      // let it happen, don't do anything
      return;
    }
    const regEx = new RegExp(regexStr);
    if (regEx.test(String.fromCharCode(e.keyCode))) {
      return;
    } else {
      e.preventDefault();
    }
  }

  trackByFn(index, medication) {
    return medication ? medication.id : index;
  }

  clearSessionItems() {
    sessionStorage.removeItem('medicationDetailRequest');
    sessionStorage.removeItem('medicationDependentMemberInfo');
  }
}
