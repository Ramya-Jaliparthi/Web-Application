import { GetSearchByFacilityResponseModelInterface, FacetsFacilityListInterface } from './../modals/interfaces/getSearchByFacility-models.interface';
import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import {
  FadSearchFilterComponentOutputModelInterface,
  FadSearchFilterComponentInputModelInterface,
  FilterListItemInterface,
  FilterCheckboxItemInterface
} from '../modals/interfaces/fad-search-filter.interface';
import {
  FadSearchFilterComponentOutputModel,
  FadSearchFilterComponentInputModel,
  FadSearchCriteriaItem,
  FilterRadioItem,
  FilterCheckboxItem
} from '../modals/fad-search-filter.modal';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
import { FadConstants } from '../constants/fad.constants';
import { MatSidenav, MatRadioChange, MatCheckboxChange } from '@angular/material';
import { GlobalService } from '../../../shared/services/global.service';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
import { FadFacilityListComponentInputModelInterface } from '../modals/interfaces/fad-search-list.interface';

@Component({
  selector: 'app-facility-search-filter',
  templateUrl: './fad-facility-search-filter.component.html',
  styleUrls: ['./fad-facility-search-filter.component.scss']
})
export class FadFacilitySearchFilterComponent implements OnInit, OnChanges {

  @Output('componentOutput') componentOutput = new EventEmitter<FadSearchFilterComponentOutputModelInterface>();
  @Input('componentInput') componentInput: FadSearchFilterComponentInputModelInterface = new FadSearchFilterComponentInputModel();
  @ViewChild('searchDrpContainer') searchDrpContainer;
  @ViewChild('sideNavContainer') elementView: ElementRef;
  @ViewChild('filterWidth') filterElementView: ElementRef;
  @ViewChild('searchInput') searchInput;
  @ViewChild('sidenav') sideNav: MatSidenav;
  @ViewChild('fromDateInput') fromInputDate: ElementRef;
  @ViewChild('toDateInput') toInputDate: ElementRef;

  // being used both the html view and the component(this file)
  public isDisplayFilter: boolean = false;
  
  public fadConstants;
  public showClose: boolean;
  public isDateExpanded: boolean;
  public outputTransaction: FadSearchFilterComponentOutputModelInterface = new FadSearchFilterComponentOutputModel();

  public myFocusTriggeringEventEmitter = new EventEmitter<boolean>();
  public isAutoSearch: boolean;
  public isProviderExpanded: boolean;
  public calendarMaxDate = new Date();

  // flag values used bound to the view alone (html tags)
  public collapsedSortHeight: string;
  public expandedSortHeight: string;
  public sortSelectedFilter: string;
  public collapsedHeight: string;
  public expandedHeight: string;

  @Input('componentFilterInput') componentFilterInput: FadFacilityListComponentInputModelInterface;
  public searchResponse: GetSearchByFacilityResponseModelInterface;
  public facetsList: FacetsFacilityListInterface;
  public locationGeoList: FilterListItemInterface[] = [];
  public ratingList: FilterListItemInterface[] = [];
  public specialtyList: FilterListItemInterface[] = [];
  public bdcTypeList: FilterListItemInterface[] = [];
  public awardTypeList: FilterListItemInterface[] = [];
  public cqmsTypeList: FilterListItemInterface[] = [];
  public inNetworkOnlyCheckbox: FilterCheckboxItemInterface;
  
  public isSortExpanded: boolean;
  public sortList: FilterRadioItem[] = [
    {
      'name' : 'Distance',
      'value': 'distance',
      'order': 'asc', 
      'checked': true
    },
    {
      'name' : 'Last Name A-Z',
      'value': 'provider_name_sortable',
      'order': 'asc',
      'checked': false
    },
    {
      'name' : 'Last Name Z-A',
      'value': 'provider_name_sortable',
      'order': 'desc',
      'checked': false
    },
    {
      'name' : 'Best Match',
      'value': 'relevancy',
      'order': 'desc',
      'checked': false
    },
    {
      'name' : 'Quality',
      'value': 'clinical_quality',
      'order': 'desc',
      'checked': false
    },
    {
      'name' : 'Ratings',
      'value': 'prs_overall_rating',
      'order': 'desc',
      'checked': false
    }
  ];


  constructor(private bcbsmaErrorHandler: BcbsmaerrorHandlerService,
    public globalService: GlobalService, private cdRef: ChangeDetectorRef) {
    this.fadConstants = FadConstants;
    this.collapsedHeight = '32px';
    this.collapsedSortHeight = '56px';
    this.expandedHeight = '40px';
    this.expandedSortHeight = '48px';
    this.isSortExpanded = false;
    this.sortSelectedFilter = 'Distance';
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    try {
      this.componentInput.searchCriteriaData = changes.componentInput.currentValue.searchCriteriaData;

      this.componentFilterInput = changes.componentFilterInput.currentValue;
      console.log("FILTER", this.componentFilterInput);
      if (this.componentFilterInput) {
        this.searchResponse = this.componentFilterInput.facilityResults;
        if (this.searchResponse && this.searchResponse.facets) {
          this.facetsList =  this.searchResponse.facets;
          this.manageFilter(this.facetsList);
        }        
        this.cdRef.detectChanges();
      }

    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadFacilitySearchFilterComponent,
        FadConstants.methods.ngOnChanges);
    }
  }

  public manageFilter(facetsList: FacetsFacilityListInterface) {
    this.locationGeoList = facetsList.locationGeo ? facetsList.locationGeo : [];
    this.ratingList = facetsList.overallRating ? facetsList.overallRating : [];
    this.specialtyList = facetsList.fieldSpecialtyIds ? facetsList.fieldSpecialtyIds : [];
    this.bdcTypeList = facetsList.bdcTypeCodes ? facetsList.bdcTypeCodes : [];
    this.awardTypeList = facetsList.awardTypeCodes ? facetsList.awardTypeCodes : [];
    this.cqmsTypeList = facetsList.cqms ? facetsList.cqms : [];
    this.inNetworkOnlyCheckbox = facetsList.inNetwork ? facetsList.inNetwork : null;
  }

  private throwInvalidServiceResponseDataErrorInOnInit(): void {
    this.bcbsmaErrorHandler.logError(
      new Error(FadConstants.errorMessages.invalidServiceResponseData),
      BcbsmaConstants.modules.fadModule,
      FadConstants.components.fadFacilitySearchFilterComponent,
      FadConstants.methods.ngOnInit
    );
  }

  public isSortOpened() {
    this.isSortExpanded = true;
  }

  public isSortClosed() {
    this.isSortExpanded = false;
  }

  public onSortFilterChanged(selectedRadioButton: MatRadioChange): void {
    // const sortFilterItems: string[] = this.componentInput.searchCriteriaData.sortByFilterMap.getKeys();
    // for (const sortFitlterItem of sortFilterItems) {
    //   const fadSearchCriteriaItem: FadSearchCriteriaItem = this.componentInput.searchCriteriaData.sortByFilterMap.get(sortFitlterItem);
    //   fadSearchCriteriaItem.criteriaSelected = (selectedRadioButton.value === sortFitlterItem);
    // }
  }

  /**
   * @description helps hide the sections other than the filter section and vice versa when the "Filter" dropdown is clicked in
   *  mobile screen only. Does not have any effect on the desktop screens
   */
  public toggleFilter() {
    this.isDisplayFilter = !this.isDisplayFilter;
    this.outputTransaction.searchCriteriaData = null;
    this.outputTransaction.filterOverlayFlag = this.isDisplayFilter;
    this.componentOutput.emit(this.outputTransaction);
  }

  public applyFilter() {
    this.outputTransaction.searchCriteriaData = this.componentInput.searchCriteriaData;
    this.outputTransaction.filterOverlayFlag = false;
    this.isDisplayFilter = false;
    this.componentOutput.emit(this.outputTransaction);
  }

  public clearFilter() {

    this.showClose = false;
    this.isSortExpanded = false;

    this.isDateExpanded = false;
    this.isProviderExpanded = false;
    this.isDisplayFilter = false;

    this.outputTransaction.searchCriteriaData = this.componentInput.searchCriteriaData;
    this.outputTransaction.filterOverlayFlag = this.isDisplayFilter;

    this.componentOutput.emit(this.outputTransaction);

  }

  public customDateInputKeyDownEvent(e) {
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

  public escapeSearchContainer(event) {
    if (event.which === 27) {
      this.isAutoSearch = false;
    }
  }

  /*
     To get the selected filter criteria from the view/template while changing the options
  */
  public manageSelectedProfessionalFilter(selectionListChange: MatRadioChange) {
    console.log(selectionListChange);
  }

 /*
     To get the selected filter criteria from the view/template while changing the options
  */
  public manageCheckboxProfessionalFilter(selectionChBoxChange: MatCheckboxChange) {
    console.log(selectionChBoxChange);
  }
}
