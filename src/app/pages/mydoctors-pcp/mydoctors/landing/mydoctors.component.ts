import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { FilterService } from '../../../../shared/services/filter.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { AlertService } from '../../../../shared/services/alert.service';
import { MyDoctorsPcpService } from '../../mydoctors-pcp.service';
import { FilterComponentConstants, FilterErrorConstants } from '../../../../shared/components/filter/filter.constants';
import { MemberInfo } from '../../../../shared/models/memberInfo.model';
import { Provider } from '../../mydoctors-pcp.model';
import { DependentsResponseModel } from '../../../myclaims/models/dependants.model';
import { DependentsResponseModelInterface } from '../../../myclaims/models/interfaces/dependants-model.interface';
import { environment } from '../../../../../environments/environment';
import {
  FilterInterface,
  FilterSelectionItemInterface,
  FilterSelectionInterface,
  FilterToggleInterface
} from '../../../../shared/components/filter/filter-model.interface';
import {
  FilterItem, FilterOption
} from '../../../../shared/components/filter/filter.model';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-mydoctors',
  templateUrl: './mydoctors.component.html',
  styleUrls: ['./mydoctors.component.scss']
})
export class MyDoctorsComponent implements OnInit, OnDestroy {
  userString: 'User' = 'User';
  public ismobile: any;
  mobileViewPort = 992;
  dependent: string;
  isSearchShowing: boolean;
  hasDependents: boolean;
  noDoctorVisits: boolean;
  noDoctorVisitsAfterFilter: boolean;
  isActive: boolean;
  memberPCP: Object;
  sideNavStatus: string;
  eventAction: string = '';
  searchVal: string = '';
  doctorListClone: Provider[] = [];
  doctorList: Provider[] = [];
  specialtyList = [];
  memberList = [];
  dependentList: DependentsResponseModelInterface = new DependentsResponseModel();
  dependents = [];
  tooltipState: Array<Object>;
  memberInfo: MemberInfo;
  filterConfig: FilterInterface;
  user;
  hideMainContentOnFilterToggleForMobile: boolean = false;
  routeSubscription: Subscription;
  fpoTargetListingUrl = environment.drupalTestUrl + '/page/mydoctors-listingscreen';
  fpoTargetNoResultsUrl = environment.drupalTestUrl + '/page/mydoctors-nosearchresults';
  layout = 'central';
  memberHasMultiplePlans: boolean = false;
  tempDoctorList: any;
  initialRecentVisitsCount: number;
  private oSortingFilterItem;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth <= this.mobileViewPort) {
      this.ismobile = true;
    } else {
      this.ismobile = false;
      this.sideNavStatus = 'in';

    }
  }

  constructor(private doctorService: MyDoctorsPcpService,
    private route: ActivatedRoute,
    private router: Router,
    private title: TitleCasePipe,
    public filterService: FilterService,
    private alertService: AlertService,
    private authService: AuthService) {

    if (this.route.snapshot.data && this.route.snapshot.data.doctorList) {
      const self = this;
      this.route.snapshot.data.doctorList.DoctorList.forEach(function (visits) {
        if (visits && visits.length >= 1) {
          self.doctorList = self.doctorList.concat(visits);
        }
      });
      if (this.route.snapshot.data.doctorList.MemBasicInfo && this.route.snapshot.data.doctorList.MemBasicInfo.rxSummary) {
        this.memberInfo = this.route.snapshot.data.doctorList.MemBasicInfo.rxSummary;
      }
    }
    this.initialRecentVisitsCount = this.doctorList.length;
    // clear the session on selected doctor
    this.doctorService.selectedDoctor = null;
    sessionStorage.setItem('providerName', '');
    sessionStorage.setItem('providerNumber', '');
    sessionStorage.setItem('docDependentId', '');

    this.dependent = this.userString;
    this.doctorService.memberInfo = this.memberInfo;
    this.doctorService.setMemberPCP();
    this.isActive = this.doctorService.active;
    this.memberPCP = this.doctorService.memberPCP;
    this.dependentList = this.authService.getDependentsList();
    // To do - Will be removed when during API integration
    if (this.memberInfo && !this.memberInfo['error']) {
      this.hasDependents = this.dependentList && this.dependentList.dependents.length >= 1;
      if (this.memberInfo.relationship.toLowerCase().indexOf('spouse') >= 0 ||
        this.memberInfo.relationship.toLowerCase().indexOf('partner') >= 0) {
        this.doctorList = this.doctorList.filter((doctor) => {
          return (!doctor.memberRelationship || doctor.memberRelationship.toLowerCase().indexOf('subscriber') < 0);
        });
      }
      this.doctorList = this.doctorList.map((doctor) => {
        if (!doctor['dependentId']) {
          doctor['mem_name'] = doctor.memberMiddleInitial ?
            [doctor.memberFirstName, ' ', doctor.memberMiddleInitial, ' ', doctor.memberLastName].join('') :
            [doctor.memberFirstName, ' ', doctor.memberLastName].join('');
        }
        return doctor;
      });
    }

    this.user = sessionStorage.getItem('key');
    console.log(this.user, this.dependentList);
    this.doctorListClone = JSON.parse(JSON.stringify(this.doctorList));
    if (this.doctorList.length <= 0) {
      this.noDoctorVisits = true;
      // this.noDoctorVisitstorVisitsAfterFilter = true;
    } else {
      this.noDoctorVisits = false;
      // this.noDoctorVisitsAfterFilter = false;
    }
    this.tooltipState = new Array(this.doctorList.length).fill(false);
    this.memberList = this.getMembersList();
    this.isSearchShowing = false;
    this.applyUserFilter();
    /*if (this.doctorList.length <= 0) {
      this.noDoctorVisitsAfterFilter = true;
    }*/
    this.updateFilterConfig();
    this.applyDefaultSorting();
  }

  checkIfIsDependentIsChanged() {
    const previousSelectedDependent = sessionStorage.getItem('docSelectedUserId');
    if (this.dependent.toString() !== previousSelectedDependent) {
      sessionStorage.setItem('setSelectedUserId', this.dependent.toString());
      sessionStorage.setItem('docSelectedUserId', this.dependent.toString());
      return true;
    } else {
      return false;
    }
  }

  ngOnInit() {
    this.clearSessionItems();
    this.alertService.clearError();
  }

  clearSessionItems() {
    sessionStorage.removeItem('docDependentId');
  }

  ngOnDestroy() {
    this.alertService.clearError();
  }

  onScroll() {
  }

  applyUserFilter() {
    if (this.dependent !== null && this.dependent !== undefined && this.dependent !== 'All') {

      this.doctorList = this.doctorList.filter((medication) => {
        const bufferMedication: any = Object.assign({}, medication);
        return ((this.dependent.includes(this.userString) && bufferMedication.currUser) || // DependentId =>uniquePersonId
          (bufferMedication['mem_name'] && this.dependent.includes(this.title.transform(bufferMedication['mem_name']))));
      });
      this.tempDoctorList = JSON.parse(JSON.stringify(this.doctorList));
    } else {
      this.doctorList = this.doctorList.map((medication) => {
        return { ...medication };
      });
      this.tempDoctorList = JSON.parse(JSON.stringify(this.doctorList));
    }
    this.specialtyList = this.filterService.getListItems('providerSpeciality', this.doctorList, FilterComponentConstants.ALL);
    this.specialtyList = this.specialtyList.map((item) => {
      if (item.value === FilterComponentConstants.ALL) {
        item['text'] = 'All Specialties';
      } else {
        item['text'] = item.value;
      }
      return item;
    });
    // this.updateFilterConfig();
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

  getMembersList() {
    const membersListItems = [];
    if (this.memberInfo) {
      const loggedInUserName = this.memberInfo['memMiddleInitial'] ? [this.memberInfo['memFirstName'], ' ',
      this.memberInfo['memMiddleInitial'], ' ', this.memberInfo['memLastName']].join('') :
        [this.memberInfo['memFirstName'], ' ', this.memberInfo['memLastName']].join('');
      membersListItems.push(
        {
          value: this.userString,
          selected: this.dependent.includes(this.userString) || this.dependent === 'All',
          count: this.getDependantVisitCount(this.userString),
          name: this.userString,
          disabled: this.dependent === 'All',
          text: this.title.transform(loggedInUserName)
        });
      if (sessionStorage.getItem('docSelectedUserId') === null) {
        sessionStorage.setItem('setSelectedUserId', this.title.transform(loggedInUserName));
        sessionStorage.setItem('docSelectedUserId', this.title.transform(loggedInUserName));
      }
    }


    if (this.dependentList && this.dependentList.dependents) {
      this.dependentList.dependents.forEach(user => {
        membersListItems.push({
          value: user.dependent.depId,
          selected: this.dependent.includes(user.dependent.depId.toString()) || this.dependent === 'All',
          count: this.getDependantVisitCount(user.dependent.depId),
          name: user.dependent.middleInitial ? [user.dependent.firstName, ' ',
          user.dependent.middleInitial, ' ', user.dependent.lastName].join('') :
            [user.dependent.firstName, ' ', user.dependent.lastName].join(''),
          text: user.dependent.middleInitial ? [user.dependent.firstName, ' ',
          user.dependent.middleInitial, ' ', user.dependent.lastName].join('') :
            [user.dependent.firstName, ' ', user.dependent.lastName].join(''),
          disabled: this.dependent === 'All'
        });
      });
    }
    membersListItems.push({
      value: FilterComponentConstants.ALL,
      selected: this.dependent === 'All',
      count: this.doctorList.length,
      name: 'All Members',
      text: 'All Members',
      disabled: false
    });

    return membersListItems;
  }


  getDependantVisitCount(dependentId: number | 'User') {
    return dependentId === this.userString ? this.doctorList.filter((medication) => {
      const bufferMedication: any = Object.assign({}, medication);
      return bufferMedication.currUser;
    }).length :
      this.doctorList.filter((medication) => {
        const bufferMedication: any = Object.assign({}, medication);
        return bufferMedication.dependentId === dependentId;
      }).length;


  }

  toggleFilter(event: FilterToggleInterface) {
    this.hideMainContentOnFilterToggleForMobile = !this.hideMainContentOnFilterToggleForMobile;
  }

  applyFilter(event: FilterSelectionInterface) {
    this.filterData(event);
    this.applySorting(event.selections[0]);
    this.searchVal = event.searchVal ? event.searchVal : '';
    this.isSearchShowing = true;
    // M30-2974
    // if (event.searchVal) {
    //   this.isSearchShowing = true;
    // } else {
    //   this.isSearchShowing = false;
    // }
    this.hideMainContentOnFilterToggleForMobile = false;
  }

  clearFilter(event?: FilterSelectionInterface) {
    // On clearing the filter, add the logged-in-member in filter by default (only if member filter is shown)
    this.doctorList = [];
    if (event) {
      if (this.memberInfo && this.hasDependents) {
        event.selections[2].selectedOptions.push(
          (new FilterOption()).setText('User')
            .setValue('User')
            .setSelected(true)
            .setDisabled(false)
        );

      }
      this.filterData(event);
    } else {
      this.filterData();
      this.noDoctorVisitsAfterFilter = false;
    }

    this.filterConfig.items.forEach((item, index) => {
      if (item.type === 'checkbox') {
        item.list.forEach((listItem) => {
          if (item.headerText === 'Member' && listItem.value === 'User') {
            listItem.selected = true;
          }
        });
      }
    });

    this.applyUserFilter();
    this.hideMainContentOnFilterToggleForMobile = false;
    this.isSearchShowing = false;
    this.dispatchEvent('CLEAR');
    this.updateFilterConfig();
    this.applyDefaultSorting();
  }

  dispatchEvent(eventType: string) {
    if (eventType === FilterComponentConstants.CLEAR) {
      this.eventAction = FilterComponentConstants.CLEAR;
    }
    if (eventType === 'UPDATE') {
      this.eventAction = 'UPDATE';
    }
    setTimeout(() => {
      this.eventAction = '';
    }, 1);
  }

  filterData(filter?: FilterSelectionInterface) {
    this.doctorList = this.doctorListClone.map((doctor) => {
      return { ...doctor };
    });
    if (filter && filter.selections) {
      if (filter.searchVal) {
        this.doctorList = this.doctorList.filter(
          doctor =>
            doctor.providerName && doctor.providerSpeciality &&
            doctor.providerName.toString().toLowerCase().includes(filter.searchVal.toString().toLowerCase()) ||
            doctor.providerSpeciality.toString().toLowerCase().includes(filter.searchVal.toString().toLowerCase()) ||
            doctor['mem_name'] && doctor['mem_name'].toString().toLowerCase().includes(filter.searchVal.toString().toLowerCase())
        );
      }
      if (this.memberInfo && this.hasDependents) {
        this.applyMembersFilter(filter);
        if (this.checkIfIsDependentIsChanged()) {
          this.dispatchEvent('UPDATE');
          // this.updateFilterConfig();
        } else {
          if (filter.selections[1].selectedOption !== undefined && filter.selections[1].selectedOption !== null) {
            this.applyDateFilter(filter.selections[1]);
          }
          if (filter.selections[3].selectedOptions && filter.selections[3].selectedOptions.length > 0) {
            this.applySpecialtyFilter(filter.selections[3]);
          }
        }
      } else {
        if (filter.selections[1].selectedOption !== undefined && filter.selections[1].selectedOption !== null) {
          this.applyDateFilter(filter.selections[1]);
        }
        if (filter.selections[2].selectedOptions && filter.selections[2].selectedOptions.length > 0) {
          this.applySpecialtyFilter(filter.selections[2]);
        }
      }

      if (this.doctorList.length <= 0) {
        this.noDoctorVisitsAfterFilter = true;
      } else {
        this.noDoctorVisitsAfterFilter = false;
      }
      // this.updateFilterConfig();
    }
  }

  applyMembersFilter(filter): void {
    const selection: FilterSelectionItemInterface = filter.selections[2];
    if (this.doctorList) {
      if (selection.selectedOptions && selection.selectedOptions.length > 0) {
        this.dependent = selection.selectedOptions.map((selectedOption) =>
          this.memberList.filter((item) => item.value === selectedOption.value)[0].text).join(',');
      } else {
        let selectedItems;
        selectedItems = this.memberList.filter((item) => {
          if (item.selected) {
            return item;
          }
        });
        console.log(selectedItems.map((item) => item.text).join(','));
        this.dependent = selectedItems.map((item) => item.text).join(',');
      }
      sessionStorage.setItem('setSelectedUserId', this.dependent.toString());
      this.applyUserFilter();
    }
  }

  applySpecialtyFilter(selection: FilterSelectionItemInterface): void {
    if (this.doctorList) {
      let selectionList = [];
      selectionList = selection.selectedOptions.map((item) => {
        return item.value;
      });
      this.doctorList = this.doctorList.filter((doctor) => {
        return selectionList.includes(doctor.providerSpeciality);
      });
    }
  }

  applyDateFilter(selection: FilterSelectionItemInterface): void {
    console.log(selection);
    if (selection.selectedOption && selection.selectedOption.value !== FilterComponentConstants.ALL) {
      if (selection.selectedOption.value === 'CUSTOM') {
        this.applyCustomRangeDateFilter(selection);
      } else if (selection.selectedOption.value !== 'Year') {
        this.doctorList = this.doctorList.filter((doctor) => {
          return moment().diff(moment(doctor.dateOfservice), 'days') <= +selection.selectedOption.value;
        });
      } else {
        this.doctorList = this.doctorList.filter((doctor) => {
          return moment().diff(moment(doctor.dateOfservice), 'years', true) <= 1;
        });
      }
    }
  }

  applyCustomRangeDateFilter(selection: FilterSelectionItemInterface) {
    if (!selection.selectedOption.error &&
      selection.selectedOption.toDate && selection.selectedOption.fromDate) {
      const toDate = moment(selection.selectedOption.toDate, selection.selectedOption.dateFormat);
      const fromDate = moment(selection.selectedOption.fromDate, selection.selectedOption.dateFormat);
      if (toDate.isValid() && fromDate.isValid()) {
        this.doctorList = this.doctorList.filter((doctor) => {
          const doctorDate = moment(doctor.dateOfservice);
          return doctorDate.diff(toDate) <= 0 && doctorDate.diff(fromDate) >= 0;
        });
      }
    }
  }
  applyDefaultSorting() {
    this.doctorList = this.doctorList
      .sort((item1, item2) => moment(item1.dateOfservice).diff(moment(item2.dateOfservice), 'days'));
    this.doctorList = this.doctorList.reverse();
  }


  applySorting(sortObj: FilterSelectionItemInterface): void {
    if (!sortObj.selectedOption || !sortObj.selectedOption.value || sortObj.selectedOption.value === 'Most Recent') {
      this.doctorList = this.doctorList
        .sort((item1, item2) => moment(item1.dateOfservice).diff(moment(item2.dateOfservice), 'days'));
      this.doctorList = this.doctorList.reverse();
    } else if (sortObj.selectedOption.value === 'A to Z') {
      this.doctorList = this.doctorList
        .sort((item1, item2) => (this.compareStringField(item2.providerName, item1.providerName)) ||
          moment(item2.dateOfservice).diff(moment(item1.dateOfservice), 'days'));
    } else if (sortObj.selectedOption.value === 'Z to A') {
      this.doctorList = this.doctorList
        .sort((item1, item2) => (this.compareStringField(item1.providerName, item2.providerName)) ||
          moment(item2.dateOfservice).diff(moment(item1.dateOfservice), 'days'));
    }
    if (this.doctorList.length <= 0) {
      this.noDoctorVisitsAfterFilter = true;
    } else {
      this.noDoctorVisitsAfterFilter = false;
    }
  }

  compareStringField(value1: string, value2: string) {
    if (value1 === value2) {
      return 0;
    }
    return value1 > value2 ? -1 : 1;
  }

  getDateCount(property: string, year?: boolean): Array<any> {
    if (year) {
      return this.tempDoctorList.map((doctor: Provider) => moment().diff(moment(doctor[property]), 'years', true));
    } else {
      return this.tempDoctorList.map((doctor: Provider) => moment().diff(moment(doctor[property]), 'days'));
    }
  }

  setDoctor(doctor: Provider, navigate: boolean): void {
    this.doctorService.selectedDoctor = doctor;
    if (navigate) {
      console.log(doctor);
      sessionStorage.setItem('providerName', doctor.providerName);
      sessionStorage.setItem('providerNumber', doctor.providerNumber);
      if (doctor.dependentId) {
        sessionStorage.setItem('docDependentId', doctor.dependentId);
      }
      this.router.navigate([`/mydoctors/details`]);
    }
  }

  phoneClick(event: Event): void {
    event.stopPropagation();
  }

  showToolTip(type: string, index: number): void {
    switch (type) {
      case 'link':
        this.tooltipState[index] = !this.tooltipState[index];
        break;
    }
  }

  updateFilterConfig(): void {

    if (!this.oSortingFilterItem) {
      this.oSortingFilterItem = new FilterItem();
    }

    this.oSortingFilterItem.setType('radio')
      .setDivider(true).setSortBy(true).setMulti(true)
      .setHeaderText('Sort by').setHideToggle(false).setExpanded(false)
      .setDisabled(false).setDisableRipple(false).setCollapsedHeight(null)
      .setExpandedHeight('48px').setTitlecase(false).setModel('Most Recent').setDefaultModel('Most Recent')
      .setList([
        (new FilterOption()).setText('Most Recent')
          .setValue('Most Recent').setSelected(true).setDisabled(false),
        (new FilterOption()).setText('A to Z')
          .setValue('A to Z').setSelected(false).setDisabled(false),
        (new FilterOption()).setText('Z to A')
          .setValue('Z to A').setSelected(false).setDisabled(false)
      ]);


    this.filterConfig = {
      hasSearch: false,
      searchPlaceHolder: 'Keyword',
      searchDataList: [{
        data: this.doctorList,
        property: ['providerName', 'providerSpeciality', 'mem_name']
      }],
      dontEmitOnInit: true,
      saveFilterState: false,
      filterStatePropName: 'mydoctors',
      closeAccordionOnBack: false,
      error: {
        START_DATE_INCORRECT_FORMAT_MSG: FilterErrorConstants.START_DATE_INCORRECT_FORMAT_MSG,
        START_DATE_PRIOR_TWO_YEARS_MSG: FilterErrorConstants.START_DATE_PRIOR_TWO_YEARS_MSG,
        END_DATE_INCORRECT_FORMAT_MSG: FilterErrorConstants.END_DATE_INCORRECT_FORMAT_MSG,
        END_DATE_PRIOR_TWO_YEARS_MSG: FilterErrorConstants.END_DATE_PRIOR_TWO_YEARS_MSG,
        END_DATE_PRIOR_START_DATE_MSG: FilterErrorConstants.END_DATE_PRIOR_START_DATE_MSG
      },
      items: [
        this.oSortingFilterItem
        ,
        (new FilterItem())
          .setType('calendar').setDivider(false).setMulti(true)
          .setHeaderText('Date').setHideToggle(false).setExpanded(false)
          .setDisabled(false).setDisableRipple(false).setCollapsedHeight(null)
          .setExpandedHeight('44px').setTitlecase(false)
          .setList([
            (new FilterOption())
              .setText('Last 30 days').setValue(30).setSelected(true).setDisabled(false)
              .setCount(this.filterService.getDateCount(this.getDateCount('dateOfservice', false), 30))
            ,
            (new FilterOption())
              .setText('Last 60 days').setValue(60).setSelected(false).setDisabled(false)
              .setCount(this.filterService.getDateCount(this.getDateCount('dateOfservice', false), 60))
            ,
            (new FilterOption())
              .setText('Last 90 days').setValue(90).setSelected(false).setDisabled(false)
              .setCount(this.filterService.getDateCount(this.getDateCount('dateOfservice', false), 90))
            ,
            (new FilterOption())
              .setText('Year-to-date').setValue('Year').setSelected(false).setDisabled(false)
              .setCount(this.filterService.getDateCount(this.getDateCount('dateOfservice', true), 1))
            ,
            (new FilterOption())
              .setText('All dates').setValue(FilterComponentConstants.ALL)
              .setSelected(false).setDisabled(false).setCount(this.tempDoctorList.length)
            ,
            (new FilterOption())
              .setText('Custom Date Range').setValue(FilterComponentConstants.CUSTOM).setSelected(false)
              .setDisabled(false)

          ]),
        (new FilterItem())
          .setType('checkbox').setDivider(false).setMulti(true).setHeaderText('Member')
          .setHideToggle(false).setExpanded(false).setDisabled(false).setDisableRipple(false)
          .setCollapsedHeight(null).setExpandedHeight('44px').setTitlecase(false).setSelectEveryOnAll(true)
          .setSelectAllOnEvery(true).setDisableOnAll(true).setList(this.memberList)
        ,
        (new FilterItem())
          .setType('checkbox').setDivider(false).setMulti(true).setHeaderText('Specialty')
          .setHideToggle(false).setExpanded(false).setDisabled(false).setDisableRipple(false)
          .setCollapsedHeight(null).setExpandedHeight('44px').setTitlecase(false).setSelectEveryOnAll(true)
          .setSelectAllOnEvery(true).setDisableOnAll(true).setList(this.specialtyList)

      ]
    };
    console.log(this.filterConfig);
    //Dont add the member filter if there are no dependents
    if (this.memberInfo) {
      if (!this.hasDependents) {
        this.filterConfig.items.splice(2, 1);
        this.filterConfig = this.filterConfig;
      }
    }
  }

}
