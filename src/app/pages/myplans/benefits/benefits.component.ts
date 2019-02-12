import { Component, OnInit, ViewChild, ViewChildren, QueryList, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSelectionList, MatSelectionListChange, MatAccordion, MatExpansionPanel } from '@angular/material';
import { MyplansService } from '../myplans.service';
import { AlertService } from '../../../shared/services/alert.service';
import { AlertType } from '../../../shared/alerts/alertType.model';
import { AuthService } from '../../../shared/services/auth.service';
import { ConstantsService } from '../../../shared/services/constants.service';
import { MyPlansModuleRadioListInterface } from '../models/interfaces/plan-benefits-list-model.interface';
import { GetPlanBenefitServicesResponseModelInterface } from '../models/interfaces/plans-benefits-service-model.interface';
import { PlanEntityInterface, PlanEntityMemberInterface } from '../models/interfaces/plan-benefits-page-adapted-data-model.inteface';
import { NetworkType } from '../models/interfaces/benefits-model.interface';

@Component({
  selector: 'app-benefits',
  templateUrl: './benefits.component.html',
  styleUrls: ['./benefits.component.scss'],
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
export class BenefitsComponent implements OnInit {
  myFocusTriggeringEventEmitter = new EventEmitter<boolean>();
  isSidenavOpened = false;
  sideNavMode: string;
  sideNavStatus: string;
  mobileViewPort = 992;
  index: number;
  ismobile: boolean;
  showClose: boolean;
  showResultsCount: boolean;
  isSortExpanded: boolean;
  isPlanExpanded: boolean;
  isSearchShowing: boolean;
  isDisplayMessage: boolean;
  isFilterTriggered: boolean;
  showClearLink: boolean;
  selectedPlanList = [];
  sortSelectedFilter: string;
  collapsedHeight: string;
  collapsedSortHeight: string;
  expandedHeight: string;
  expandedSortHeight: string;
  selectedSortString: string;
  sortOn: string;
  sortReverse: boolean;
  planList = [];
  planListClone = [];
  benefitList;
  sortList: MyPlansModuleRadioListInterface[];
  allPlanCode: string;
  plans = [];
  filteredBenefits = [];
  hideToggle = true;
  selectedPlan: PlanEntityInterface;
  effectiveStartDate: string = '';
  effectiveEndDate: string = '';
  networkType = NetworkType;
  keys = Object.keys;
  contactus: string;
  fpoTargetUrl: string;
  planName: string;
  @ViewChild('sideNavContainer') elementView: ElementRef;
  @ViewChild('filterWidth') filterElementView: ElementRef;
  @ViewChildren('matExpansionPanelList') matExpansionPanelList: QueryList<MatExpansionPanel>;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth <= this.mobileViewPort) {
      this.ismobile = true;
    } else {
      this.ismobile = false;
      this.sideNavStatus = 'in';
    }
  }
  constructor(
    public myPlansService: MyplansService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private constants: ConstantsService
  ) {
    const resolvedData = this.route.snapshot.data;
    if (resolvedData && resolvedData.benefits) {
      if (resolvedData.benefits['result'] < 0) {
        this.alertService.setAlert(resolvedData.benefits['displaymessage'], '', AlertType.Failure);
        this.benefitList = [];
      } else {
        this.benefitList = this.route.snapshot.data.benefits.planBenefits;
        this.planName = this.route.snapshot.data.benefits.planName;
      }
    } else {
      this.getBenefits('A-Z');
    }
    this.selectedPlan = this.myPlansService.getSelectedPlanEntity();
    if (this.selectedPlan) {
      this.effectiveStartDate = this.selectedPlan.effectiveStartDate;
      this.effectiveEndDate = this.selectedPlan.effectiveEndDate;
    }
    this.contactus = this.constants.contactus + this.authService.authToken.scopename;
    this.sortSelectedFilter = 'A-Z';
    this.sortList = [
      {
        value: 'A-Z',
        text: 'A-Z',
        checked: true
      },
      {
        value: 'Z-A',
        text: 'Z-A',
        checked: false
      }
    ];
    if (window.innerWidth <= this.mobileViewPort) {
      this.ismobile = true;
    }
    this.sideNavStatus = this.ismobile ? 'out' : 'in';
    this.index = -1;
    this.allPlanCode = 'ALL';
    this.isPlanExpanded = true;
    this.sortOn = 'planBenefitName';
    this.sortReverse = false;
    this.expandedHeight = '44px';
    this.expandedSortHeight = '44px';
    this.fpoTargetUrl = this.constants.drupalMyBenefitsUrl;
  }

  ngOnInit() {

  }

  getBenefits(sortFlag: string) {
    this.myPlansService.getPlanBenefitServices(false, sortFlag).subscribe(response => {
      if (response['result'] < 0) {
        this.alertService.setAlert(response['displaymessage'], '', AlertType.Failure);
        this.benefitList = [];
        return;
      }
      this.closeExpansionPanel();
      this.benefitList = response.planBenefits;
    });
  }

  setBenefitName(planBenefitName: string) {
    this.myPlansService.setServiceBenefitCategoryName(planBenefitName);
  }

  toggleFilter(toggleStatus) {
    this.isSidenavOpened = !this.isSidenavOpened;
    this.sideNavStatus = this.sideNavStatus === 'out' ? 'in' : 'out';
    if (toggleStatus) {
      this.sideNavStatus = toggleStatus;
    }
    if (window.innerWidth <= 991) {
      this.sideNavMode = 'over';
    } else {
      this.sideNavMode = 'side';
    }
  }

  sortFilterChanged(selectedOption) {
    for (let i = 0; i < this.sortList.length; i++) {
      if (this.sortList[i].value === selectedOption.value) {
        this.sortList[i].checked = false;
        this.sortSelectedFilter = this.sortList[i].value;
      } else {
        this.sortList[i].checked = false;
      }
    }
    setTimeout(() => {
      const sortFilterItem = this.sortList.find((item) => item.value === this.sortSelectedFilter);
      if (sortFilterItem) {
        sortFilterItem.checked = true;
      }
    }, 0);
  }

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

  clearSearchVal() {
    this.showClose = false;
  }

  clearFilterList() {
    this.selectedPlanList = [];
  }

  clearSessionStorageItems() {
    sessionStorage.removeItem('providerSelectedfilter');
    sessionStorage.removeItem('sortSelectedFilter');
  }

  applyFilter() {
    this.closeFilter();
    this.closeSideNavigation();
    sessionStorage.setItem('sortSelectedFilter', this.sortSelectedFilter);
    this.filterData();
    this.applySorting();
    this.setShowClearLink();
    this.getBenefits(this.sortSelectedFilter);
  }

  applySorting() {
    const selectedSortFilter = sessionStorage.getItem('sortSelectedFilter');
    const sortFilterItem = this.sortList.find((item) => item.value === selectedSortFilter);
    if (!sortFilterItem || sortFilterItem.value === 'A-Z') {
      this.sortReverse = false;
    } else {
      this.sortReverse = true;
    }
    // this.closeExpansionPanel();
    this.selectedSortString = selectedSortFilter ? selectedSortFilter : 'A-Z';
  }

  filterData() {
    this.filteredBenefits = this.benefitList.map((benefit) => {
      return { ...benefit };
    });
  }

  getSelectedItems(list: MatSelectionList) {
    if (list && list.selectedOptions.selected.length > 0) {
      return list.selectedOptions.selected.map((selectedItem) => selectedItem.value);
    }
    return null;
  }

  clearFilter() {
    this.setSortFiltervalue();
    this.clearSearch();
    this.closeFilter();
    this.clearFilterList();
    this.clearSessionStorageItems();
    this.clearSelections();
    this.setShowClearLink();
    this.closeExpansionPanel();
    this.showClose = false;
    this.showResultsCount = false;
    this.isSortExpanded = false;
    this.isPlanExpanded = true;
    this.sortReverse = false;
    this.getBenefits(this.sortSelectedFilter);
  }

  clearSelections(): void {
    this.filteredBenefits = [];
  }

  clearSearch(value: boolean = true) {
    this.isSearchShowing = false;
    this.isDisplayMessage = false;
  }

  closeFilter() {
    if (this.ismobile) {
      this.sideNavStatus = 'out';
      this.isSidenavOpened = false;
    }
  }

  closeExpansionPanel() {
    this.matExpansionPanelList.forEach((panel: MatExpansionPanel, index: number) => {
      panel.close();
    });
  }

  closeSideNavigation() {
    this.isSidenavOpened = false;
  }

  setShowClearLink() {
    this.showClearLink = false;
    if (this.sortSelectedFilter !== 'A-Z') {
      this.showClearLink = true;
    }
  }

  isSortOpened() {
    this.isSortExpanded = true;
  }

  isSortClosed() {
    this.isSortExpanded = false;
  }

  setSortFiltervalue(sortValue: string = 'A-Z') {
    for (let i = 0; i < this.sortList.length; i++) {
      if (this.sortList[i].value === sortValue) {
        this.sortSelectedFilter = this.sortList[i].value;
        sessionStorage.setItem('sortSelectedFilter', this.sortSelectedFilter);
        this.sortList[i].checked = true;
      } else {
        this.sortList[i].checked = false;
      }
    }
  }

  trackByFunction(index, item) {
    return index;
  }

  isNetwork(network: string): boolean {
    if (network === NetworkType.inNetwork || network === NetworkType.outOfNetwork ||
      network === NetworkType.inNetworkAndOutOfNetworkCombined) {
        return true;
    }
    return false;
  }

  navigateToContactUs() {
    window.open(this.contactus, '_self');
  }

}
