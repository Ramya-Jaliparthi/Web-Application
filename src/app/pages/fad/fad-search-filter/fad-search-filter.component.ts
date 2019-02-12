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
import { MatSidenav, MatRadioChange, MatSelectionListChange, MatListOption, MatCheckboxChange } from '@angular/material';
import { FadSearchFilterService } from './fad-search-filter.service';
import { GlobalService } from '../../../shared/services/global.service';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
import { FadSearchListComponentInputModelInterface } from '../modals/interfaces/fad-search-list.interface';
import { GetSearchByProfessionalResponseModelInterface, FacetsListInterface } from '../modals/interfaces/getSearchByProfessional-models.interface';

@Component({
  selector: 'app-fad-search-filter',
  templateUrl: './fad-search-filter.component.html',
  styleUrls: ['./fad-search-filter.component.scss']
})
export class FadSearchFilterComponent implements OnInit, OnChanges {

  @Output('componentOutput') componentOutput
    = new EventEmitter<FadSearchFilterComponentOutputModelInterface>();

  @Input('componentInput') componentInput: FadSearchFilterComponentInputModelInterface = new FadSearchFilterComponentInputModel();

  @ViewChild('searchDrpContainer') searchDrpContainer;
  @ViewChild('sideNavContainer') elementView: ElementRef;
  @ViewChild('filterWidth') filterElementView: ElementRef;
  @ViewChild('searchInput') searchInput;
  @ViewChild('sidenav') sideNav: MatSidenav;
  @ViewChild('fromDateInput') fromInputDate: ElementRef;
  @ViewChild('toDateInput') toInputDate: ElementRef;

  // being used both the html view and the component(this file)
  public showCalender: boolean;
  public currentSelectedDate: Date = null;
  public isDisplayFilter: boolean = false;
  public dateSelectedFilter: string;
  
  public fadConstants;
  public errorMessage: string = null;
  public fromMinDate: Date;
  public isCustomDateRangeInValid = false;
  public isSelectedDateInvalid = false;
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

  // flag values used with in this component only (ts file)
  private isFormDateSelected: boolean;
  private isMemberExpanded = false;
  private isPharmacyExpanded: boolean;

  @Input('componentFilterInput') componentFilterInput: FadSearchListComponentInputModelInterface;
  public searchResponse: GetSearchByProfessionalResponseModelInterface;
  public facetsList: FacetsListInterface;
  public locationGeoList: FilterListItemInterface[] = [];
  public languagesList: FilterListItemInterface[] = [];
  public genderList: FilterListItemInterface[] = [];
  public ratingList: FilterListItemInterface[] = [];
  public agesTreatedList: FilterListItemInterface[] = [];
  public specialtyList: FilterListItemInterface[] = [];
  public disordersTreatedList: FilterListItemInterface[] = [];
  public treatmentMethodsList: FilterListItemInterface[] = [];
  public grpHospitalAffiliationList: FilterListItemInterface[] = [];
  public acceptingNewPatientsCheckbox: FilterCheckboxItemInterface;
  public techSavvyCheckbox: FilterCheckboxItemInterface;
  public inNetworkOnlyCheckbox: FilterCheckboxItemInterface;
  public primaryCareProviderCheckbox: FilterCheckboxItemInterface;

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
    private fadSearchFilterService: FadSearchFilterService, public globalService: GlobalService, private cdRef: ChangeDetectorRef) {
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
      if (this.componentFilterInput) {
        this.searchResponse = this.componentFilterInput.searchResults;
        if (this.searchResponse && this.searchResponse.facets) {
          this.facetsList =  this.searchResponse.facets;
          this.manageFilter(this.facetsList);
        }        
        this.cdRef.detectChanges();
      }

    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadSearchFilterComponent,
        FadConstants.methods.ngOnChanges);
    }
  }

  public manageFilter(facetsList: FacetsListInterface) {
    this.locationGeoList = facetsList.locationGeo ? facetsList.locationGeo : [];
    this.genderList = facetsList.professionalGender ? facetsList.professionalGender : [];
    this.languagesList = facetsList.professionalLanguages ? facetsList.professionalLanguages : [];
    this.ratingList = facetsList.overallRating ? facetsList.overallRating : [];
    this.agesTreatedList = facetsList.treatedTypeCodes ? facetsList.treatedTypeCodes : [];
    this.specialtyList = facetsList.fieldSpecialtyIds ? facetsList.fieldSpecialtyIds : [];
    this.disordersTreatedList = facetsList.disordersTreatedTypeCodes ? facetsList.disordersTreatedTypeCodes : [];
    this.treatmentMethodsList = facetsList.treatmentMethodsTypeCodes ? facetsList.treatmentMethodsTypeCodes : [];
    this.grpHospitalAffiliationList = facetsList.grpHospitalAffiliationIds ? facetsList.grpHospitalAffiliationIds : [];

    this.acceptingNewPatientsCheckbox = facetsList.acceptingNewPatients ? facetsList.acceptingNewPatients : null;
    this.techSavvyCheckbox = facetsList.techSavvy ? facetsList.techSavvy : null;
    this.inNetworkOnlyCheckbox = facetsList.inNetwork ? facetsList.inNetwork : null;
    this.primaryCareProviderCheckbox = facetsList.isPcp ? facetsList.isPcp : null;
  }

  private throwInvalidServiceResponseDataErrorInOnInit(): void {
    this.bcbsmaErrorHandler.logError(
      new Error(FadConstants.errorMessages.invalidServiceResponseData),
      BcbsmaConstants.modules.fadModule,
      FadConstants.components.fadSearchFilterComponent,
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
    this.showClose = false;
    this.showCalender = false;
    this.isSortExpanded = false;

    this.isDateExpanded = false;
    this.isMemberExpanded = false;
    this.isPharmacyExpanded = false;
    this.isProviderExpanded = false;
    this.isDisplayFilter = false;

    const sortFilterItems: string[] = this.componentInput.searchCriteriaData.sortByFilterMap.getKeys();
    for (const sortFilterItem of sortFilterItems) {
      const fadSearchCriteriaItem: FadSearchCriteriaItem = this.componentInput.searchCriteriaData.sortByFilterMap.get(sortFilterItem);
      fadSearchCriteriaItem.criteriaSelected = false;
    }

    const distanceFilterItems: string[] = this.componentInput.searchCriteriaData.distanceFilterMap.getKeys();
    for (const distanceFilterItem of distanceFilterItems) {
      const fadSearchCriteriaItem: FadSearchCriteriaItem = this.componentInput.searchCriteriaData.distanceFilterMap.get(distanceFilterItem);
      fadSearchCriteriaItem.criteriaSelected = false;
    }

    const genderFilterItems: string[] = this.componentInput.searchCriteriaData.genderFilterMap.getKeys();
    for (const genderFilterItem of genderFilterItems) {
      const fadSearchCriteriaItem: FadSearchCriteriaItem = this.componentInput.searchCriteriaData.genderFilterMap.get(genderFilterItem);
      fadSearchCriteriaItem.criteriaSelected = false;
    }

    const languageFilterItems: string[] = this.componentInput.searchCriteriaData.languageFilterMap.getKeys();
    for (const languageFilterItem of languageFilterItems) {
      const fadSearchCriteriaItem: FadSearchCriteriaItem = this.componentInput.searchCriteriaData.languageFilterMap.get(languageFilterItem);
      fadSearchCriteriaItem.criteriaSelected = false;
    }

    const ratingFilterItems: string[] = this.componentInput.searchCriteriaData.ratingFilterMap.getKeys();
    for (const ratingFilterItem of ratingFilterItems) {
      const fadSearchCriteriaItem: FadSearchCriteriaItem = this.componentInput.searchCriteriaData.ratingFilterMap.get(ratingFilterItem);
      fadSearchCriteriaItem.criteriaSelected = false;
    }

    const agesTreatedFilterItems: string[] = this.componentInput.searchCriteriaData.agesTreatedFilterMap.getKeys();
    for (const agesTreatedFilterItem of agesTreatedFilterItems) {
      const fadSearchCriteriaItem: FadSearchCriteriaItem = this.componentInput.searchCriteriaData
        .agesTreatedFilterMap.get(agesTreatedFilterItem);
      fadSearchCriteriaItem.criteriaSelected = false;
    }

    // const selectedCheckBoxOption: MatListOption = selectedCheckBox.option;
    // const fadSearchCriteriaItem: FadSearchCriteriaItem = this.componentInput.searchCriteriaData
    //   .specialitiesFilterMap.get(selectedCheckBoxOption.value);
    // fadSearchCriteriaItem.criteriaSelected = false;

    const disordersTreatedFilterItems: string[] = this.componentInput.searchCriteriaData.disordersTreatedFilterMap.getKeys();
    for (const disordersTreatedFilterItem of disordersTreatedFilterItems) {
      const fadSearchCriteriaItem: FadSearchCriteriaItem = this.componentInput.searchCriteriaData
        .disordersTreatedFilterMap.get(disordersTreatedFilterItem);
      fadSearchCriteriaItem.criteriaSelected = false;
    }

    const treatmentMethodFilterItems: string[] = this.componentInput.searchCriteriaData.treatmentMethodFilterMap.getKeys();
    for (const treatmentMethodFilterItem of treatmentMethodFilterItems) {
      const fadSearchCriteriaItem: FadSearchCriteriaItem = this.componentInput.searchCriteriaData
        .treatmentMethodFilterMap.get(treatmentMethodFilterItem);
      fadSearchCriteriaItem.criteriaSelected = false;
    }

    const hospitalsAndMedicalGroupsFilterItems: string[] = this.componentInput.searchCriteriaData
      .hospitalsAndMedicalGroupsFilterMap.getKeys();
    for (const hospitalsAndMedicalGroupsFilterItem of hospitalsAndMedicalGroupsFilterItems) {
      const fadSearchCriteriaItem: FadSearchCriteriaItem = this.componentInput.searchCriteriaData
        .hospitalsAndMedicalGroupsFilterMap.get(hospitalsAndMedicalGroupsFilterItem);
      fadSearchCriteriaItem.criteriaSelected = false;
    }

    const blueDistinctionRecognitionFilterItems: string[] = this.componentInput.searchCriteriaData
      .blueDistinctionRecognitionFilterMap.getKeys();
    for (const blueDistinctionRecognitionFilterItem of blueDistinctionRecognitionFilterItems) {
      const fadSearchCriteriaItem: FadSearchCriteriaItem = this.componentInput.searchCriteriaData
        .blueDistinctionRecognitionFilterMap.get(blueDistinctionRecognitionFilterItem);
      fadSearchCriteriaItem.criteriaSelected = false;
    }


    const awardsFilterItems: string[] = this.componentInput.searchCriteriaData.awardsFilterMap.getKeys();
    for (const awardsFilterItem of awardsFilterItems) {
      const fadSearchCriteriaItem: FadSearchCriteriaItem = this.componentInput.searchCriteriaData.awardsFilterMap.get(awardsFilterItem);
      fadSearchCriteriaItem.criteriaSelected = false;
    }


    const clinicalQualityMeasureFilterItems: string[] = this.componentInput.searchCriteriaData.clinicalQualityMeasureFilterMap.getKeys();
    for (const clinicalQualityMeasureFilterItem of clinicalQualityMeasureFilterItems) {
      const fadSearchCriteriaItem: FadSearchCriteriaItem = this.componentInput.searchCriteriaData
        .clinicalQualityMeasureFilterMap.get(clinicalQualityMeasureFilterItem);
      fadSearchCriteriaItem.criteriaSelected = false;
    }

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

  /* public onDistanceFilterChanged(selectedRadioButton: MatRadioChange): void {
    const distanceFilterItems: string[] = this.componentInput.searchCriteriaData.distanceFilterMap.getKeys();
    for (const distanceFilterItem of distanceFilterItems) {
      const fadSearchCriteriaItem: FadSearchCriteriaItem = this.componentInput.searchCriteriaData.distanceFilterMap.get(distanceFilterItem);
      fadSearchCriteriaItem.criteriaSelected = (selectedRadioButton.value === distanceFilterItem);
    }
  }
  public onGenderFilterChanged(selectedRadioButton: MatRadioChange): void {
    const genderFilterItems: string[] = this.componentInput.searchCriteriaData.genderFilterMap.getKeys();
    for (const genderFilterItem of genderFilterItems) {
      const fadSearchCriteriaItem: FadSearchCriteriaItem = this.componentInput.searchCriteriaData.genderFilterMap.get(genderFilterItem);
      fadSearchCriteriaItem.criteriaSelected = (selectedRadioButton.value === genderFilterItem);
    }
  }
  public onLanguageFilterChanged(selectedRadioButton: MatRadioChange): void {
    const languageFilterItems: string[] = this.componentInput.searchCriteriaData.languageFilterMap.getKeys();
    for (const languageFilterItem of languageFilterItems) {
      const fadSearchCriteriaItem: FadSearchCriteriaItem = this.componentInput.searchCriteriaData.languageFilterMap.get(languageFilterItem);
      fadSearchCriteriaItem.criteriaSelected = (selectedRadioButton.value === languageFilterItem);
    }
  }
  public onRatingFilterChanged(selectedRadioButton: MatRadioChange): void {
    const ratingFilterItems: string[] = this.componentInput.searchCriteriaData.ratingFilterMap.getKeys();
    for (const ratingFilterItem of ratingFilterItems) {
      const fadSearchCriteriaItem: FadSearchCriteriaItem = this.componentInput.searchCriteriaData.ratingFilterMap.get(ratingFilterItem);
      fadSearchCriteriaItem.criteriaSelected = (selectedRadioButton.value === ratingFilterItem);
    }
  }
  public onAgesTreatedFilterChanged(selectedRadioButton: MatRadioChange): void {
    const agesTreatedFilterItems: string[] = this.componentInput.searchCriteriaData.agesTreatedFilterMap.getKeys();
    for (const agesTreatedFilterItem of agesTreatedFilterItems) {
      const fadSearchCriteriaItem: FadSearchCriteriaItem = this.componentInput.searchCriteriaData
        .agesTreatedFilterMap.get(agesTreatedFilterItem);
      fadSearchCriteriaItem.criteriaSelected = (selectedRadioButton.value === agesTreatedFilterItem);
    }
  }

  public onSpecialitiesFilterChange(selectedCheckBox: MatSelectionListChange): void {
    const selectedCheckBoxOption: MatListOption = selectedCheckBox.option;
    const fadSearchCriteriaItem: FadSearchCriteriaItem = this.componentInput.searchCriteriaData
      .specialitiesFilterMap.get(selectedCheckBoxOption.value);
    fadSearchCriteriaItem.criteriaSelected = selectedCheckBoxOption.selected;
  }
  public onDisordersTreatedFilterChanged(selectedRadioButton: MatRadioChange): void {
    const disordersTreatedFilterItems: string[] = this.componentInput.searchCriteriaData.disordersTreatedFilterMap.getKeys();
    for (const disordersTreatedFilterItem of disordersTreatedFilterItems) {
      const fadSearchCriteriaItem: FadSearchCriteriaItem = this.componentInput.searchCriteriaData
        .disordersTreatedFilterMap.get(disordersTreatedFilterItem);
      fadSearchCriteriaItem.criteriaSelected = (selectedRadioButton.value === disordersTreatedFilterItem);
    }
  }
  public onTreatmentMethodFilterChanged(selectedRadioButton: MatRadioChange): void {
    const treatmentMethodFilterItems: string[] = this.componentInput.searchCriteriaData.treatmentMethodFilterMap.getKeys();
    for (const treatmentMethodFilterItem of treatmentMethodFilterItems) {
      const fadSearchCriteriaItem: FadSearchCriteriaItem = this.componentInput.searchCriteriaData
        .treatmentMethodFilterMap.get(treatmentMethodFilterItem);
      fadSearchCriteriaItem.criteriaSelected = (selectedRadioButton.value === treatmentMethodFilterItem);
    }
  }
  public onHospitalsAndMedicalGroupsFilterChanged(selectedRadioButton: MatRadioChange): void {
    const hospitalsAndMedicalGroupsFilterItems: string[] = this.componentInput.searchCriteriaData
      .hospitalsAndMedicalGroupsFilterMap.getKeys();
    for (const hospitalsAndMedicalGroupsFilterItem of hospitalsAndMedicalGroupsFilterItems) {
      const fadSearchCriteriaItem: FadSearchCriteriaItem = this.componentInput.searchCriteriaData
        .hospitalsAndMedicalGroupsFilterMap.get(hospitalsAndMedicalGroupsFilterItem);
      fadSearchCriteriaItem.criteriaSelected = (selectedRadioButton.value === hospitalsAndMedicalGroupsFilterItem);
    }
  }
  public onBlueDistinctionRecognitionFilterChanged(selectedRadioButton: MatRadioChange): void {
    const blueDistinctionRecognitionFilterItems: string[] = this.componentInput.searchCriteriaData
      .blueDistinctionRecognitionFilterMap.getKeys();
    for (const blueDistinctionRecognitionFilterItem of blueDistinctionRecognitionFilterItems) {
      const fadSearchCriteriaItem: FadSearchCriteriaItem = this.componentInput.searchCriteriaData
        .blueDistinctionRecognitionFilterMap.get(blueDistinctionRecognitionFilterItem);
      fadSearchCriteriaItem.criteriaSelected = (selectedRadioButton.value === blueDistinctionRecognitionFilterItem);
    }
  }
  public onAwardsFilterChanged(selectedRadioButton: MatRadioChange): void {
    const awardsFilterItems: string[] = this.componentInput.searchCriteriaData.awardsFilterMap.getKeys();
    for (const awardsFilterItem of awardsFilterItems) {
      const fadSearchCriteriaItem: FadSearchCriteriaItem = this.componentInput.searchCriteriaData.awardsFilterMap.get(awardsFilterItem);
      fadSearchCriteriaItem.criteriaSelected = (selectedRadioButton.value === awardsFilterItem);
    }
  }
  public onClinicalQualityMeasureFilterChanged(selectedRadioButton: MatRadioChange): void {
    const clinicalQualityMeasureFilterItems: string[] = this.componentInput.searchCriteriaData.clinicalQualityMeasureFilterMap.getKeys();
    for (const clinicalQualityMeasureFilterItem of clinicalQualityMeasureFilterItems) {
      const fadSearchCriteriaItem: FadSearchCriteriaItem = this.componentInput.searchCriteriaData
        .clinicalQualityMeasureFilterMap.get(clinicalQualityMeasureFilterItem);
      fadSearchCriteriaItem.criteriaSelected = (selectedRadioButton.value === clinicalQualityMeasureFilterItem);
    }
  } */

  // public toggleCalender(selectedDateType: string) {
  //   const isControlChanged = (selectedDateType === 'to' && this.isFormDateSelected) ||
  //     (selectedDateType === 'from' && !this.isFormDateSelected);
  //   this.isFormDateSelected = selectedDateType === 'from';
  //   this.currentSelectedDate = this.isFormDateSelected ?
  //     new Date(this.searchCriteriaData.dateFilterCustomStartDate) : new Date(this.searchCriteriaData.dateFilterCustomEndDate);
  //   this.setCalendarMinimumDate();
  //   if (isControlChanged) {
  //     this.toggleCalendarDisplay();
  //   } else {
  //     this.showCalender = true;
  //   }
  // }

  // private setCalendarMinimumDate() {
  //   if (!this.isFormDateSelected && this.searchCriteriaData.dateFilterCustomStartDate) {
  //     this.fromMinDate = new Date(this.searchCriteriaData.dateFilterCustomStartDate);
  //   } else {
  //     const minFormDate = this.getMinimumFromDate();
  //     this.fromMinDate = minFormDate;
  //   }
  // }

  // private toggleCalendarDisplay() {
  //   this.showCalender = false;
  //   setTimeout(() => {
  //     this.showCalender = true;
  //     setTimeout(() => {
  //       if (this.isFormDateSelected) {
  //         this.fromInputDate.nativeElement.focus();
  //       } else {
  //         this.toInputDate.nativeElement.focus();
  //       }
  //     }, 1);
  //   }, 1);
  // }

  // private getMinimumFromDate() {
  //   const minFormDate = new Date();
  //   minFormDate.setFullYear(minFormDate.getFullYear() - 2);
  //   return minFormDate;
  // }

  // public getSelectedValue(date) {
  //   this.isCustomDateRangeInValid = false;
  //   this.isSelectedDateInvalid = false;
  //   if (this.isFormDateSelected) {
  //     this.searchCriteriaData.dateFilterCustomStartDate = moment(date).format('L');
  //   } else {
  //     this.searchCriteriaData.dateFilterCustomEndDate = moment(date).format('L');
  //   }
  //   this.setCalendarMinimumDate();
  //   this.showCalender = false;
  // }

  // public isOpened(value) {
  //   switch (value) {
  //     case 'isDateExpanded':
  //       this.isDateExpanded = true;
  //       break;
  //     case 'isMemberExpanded':
  //       this.isMemberExpanded = true;
  //       break;
  //     case 'isPharmacyExpanded':
  //       this.isPharmacyExpanded = true;
  //       break;
  //     case 'isProviderExpanded':
  //       this.isProviderExpanded = true;
  //       break;
  //   }

  // }

  // public isClosed(value) {
  //   switch (value) {
  //     case 'isDateExpanded':
  //       this.isDateExpanded = false;
  //       break;
  //     case 'isMemberExpanded':
  //       this.isMemberExpanded = false;
  //       break;
  //     case 'isPharmacyExpanded':
  //       this.isPharmacyExpanded = false;
  //       break;
  //     case 'isProviderExpanded':
  //       this.isProviderExpanded = false;
  //       break;
  //   }
  // }

  // public showTypeAHeadList(event, data: any) {
  //   let matchingKeywords = [];
  //   if (data.value.length > 0) {
  //     this.showClose = true;
  //   } else {
  //     this.showClose = false;
  //   }

  //   if (data.value.length <= 2) {
  //     this.isAutoSearch = false;
  //   }
  //   if (data.value.length > 2) {
  //     matchingKeywords = this.searchCriteriaData.keywordList.filter((keywordItem) => {
  //       return keywordItem.toLowerCase().includes(this.searchCriteriaData.keywordToSearch.toLowerCase());
  //     });

  //     // get unique values only
  //     this.searchCriteriaData.matchingKeywords = Array.from(new Set(matchingKeywords).values());

  //     if (this.searchCriteriaData.matchingKeywords.length > 0) {
  //       this.isAutoSearch = true;
  //     } else {
  //       this.isAutoSearch = false;
  //     }
  //     if (event.which === 40) {
  //       if (this.searchDrpContainer) {
  //         this.searchDrpContainer.nativeElement.getElementsByTagName('li')[0].focus();
  //       }
  //     }
  //     if (event.which === 27 || event.which === 38) {
  //       this.escapeSearchContainer(event);
  //     }
  //   }
  // }



  // public clearSearchVal() {
  //   this.searchCriteriaData.keywordToSearch = '';
  // }

  // public search(event, data: HTMLInputElement | string) {

  //   let val;
  //   this.isAutoSearch = false;

  //   if (data instanceof HTMLInputElement) {
  //     val = data.value;
  //   } else {
  //     val = data;
  //   }

  //   if (val.length > 0) {
  //     sessionStorage.setItem('searchval', this.searchCriteriaData.keywordToSearch);
  //   } else {
  //     this.isAutoSearch = false;
  //   }
  //   this.applyFilter();
  // }

  // public getSearchValue(event, matchingKeyword: string) {
  //   this.searchCriteriaData.keywordToSearch = matchingKeyword;
  //   sessionStorage.setItem('searchval', this.searchCriteriaData.keywordToSearch);
  //   this.search(event, matchingKeyword);
  //   this.isAutoSearch = false;
  // }

}
