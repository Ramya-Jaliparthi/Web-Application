import {
  Component, OnInit, OnChanges, ViewChild,
  ElementRef, EventEmitter, Input,
  Output, SimpleChanges
} from '@angular/core';
import { GlobalService } from '../../../shared/services/global.service';
import { RadioList } from '../models/search-filter.modal';
import {
  MatSelectionList, MatSelectionListChange,
  MatSidenav, MatRadioGroup, MatCalendar, MatRadioChange, MatListOption
} from '@angular/material';
import * as moment from 'moment';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
import { FinancialsConstants } from '../constants/financials.constants';
import {
  AllTransactionSearchCompOutputModelInterface,
  SearchCriteriaItemInterface,
  TransactionDetailsSearchResponseModelInterface
} from '../models/interfaces/filter-search-all-transaction.interface';
import {
  AllTransactionSearchCompOutputModel,
  SearchCriteriaItem,
  TransactionDetailsSearchResponseModel
} from '../models/filter-search-all-transaction.model';
import { FilterAlltransactionService } from './filter-all-transaction.service';

@Component({
  selector: 'app-filter-search-all-transactions',
  templateUrl: './filter-search-all-transactions.component.html',
  styleUrls: ['./filter-search-all-transactions.component.scss']
})
export class FilterSearchAllTransactionsComponent implements OnInit, OnChanges {

  @Input('searchCriteriaData') searchCriteriaData: TransactionDetailsSearchResponseModelInterface;
  @Output('onSearch') onSearch = new EventEmitter<AllTransactionSearchCompOutputModelInterface>();

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
  public isSortExpanded: boolean;
  public financialConstants;
  public errorMessage: string = null;
  public fromMinDate: Date;
  public isCustomDateRangeInValid = false;
  public isSelectedDateInvalid = false;
  public showClose: boolean;
  public isDateExpanded: boolean;

  public myFocusTriggeringEventEmitter = new EventEmitter<boolean>();
  public isAutoSearch: boolean;
  public isProviderExpanded: boolean;

  // flag values used bound to the view alone (html tags)
  public collapsedSortHeight: string;
  public expandedSortHeight: string;
  public sortSelectedFilter: string;
  public calendarMaxDate = new Date();
  public collapsedHeight: string;
  public expandedHeight: string;

  // flag values used with in this component only (ts file)
  private isFormDateSelected: boolean;
  private componentOutput: AllTransactionSearchCompOutputModelInterface = new AllTransactionSearchCompOutputModel();

  constructor(private bcbsmaErrorHandler: BcbsmaerrorHandlerService, public globalService: GlobalService,
    private filterSearchAllTransactionService: FilterAlltransactionService) {
    this.financialConstants = FinancialsConstants;
  }

  ngOnInit() {
    if (this.filterSearchAllTransactionService.isPersistSearchCriteria) {
      this.filterSearchAllTransactionService.isPersistSearchCriteria = false;
      this.searchCriteriaData = this.filterSearchAllTransactionService.cachedSearchCriteriaData;
      this.searchCriteriaData.sortByFilterMap.getValues().some((sortCriteriaItem) => {
        if (sortCriteriaItem.criteriaSelected) {
          this.sortSelectedFilter = sortCriteriaItem.criteriaName;
          return true;
        }
      });
      this.searchCriteriaData.dateFilterMap.getValues().some((dateCriteriaItem) => {
        if (dateCriteriaItem.criteriaSelected) {
          this.dateSelectedFilter = dateCriteriaItem.criteriaName;
          return true;
        }
      });
      this.applyFilter();
    } else {
      this.initDefaultSortFilter();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    try {
      this.searchCriteriaData = changes.searchCriteriaData.currentValue;
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        FinancialsConstants.components.filterSearchAllTransactionComponent,
        FinancialsConstants.methods.ngOnChanges);
    }
  }

  private throwInvalidServiceResponseDataErrorInOnInit(): void {
    this.bcbsmaErrorHandler.logError(
      new Error(FinancialsConstants.errorMessages.invalidServiceResponseData),
      BcbsmaConstants.modules.messageCenterModule,
      FinancialsConstants.components.documentsComponent,
      FinancialsConstants.methods.ngOnInit
    );
  }

  public isSortOpened() {
    this.isSortExpanded = true;
  }

  public isSortClosed() {
    this.isSortExpanded = false;
  }

  public initDefaultSortFilter() {
    this.sortSelectedFilter = this.financialConstants.filters.sortByFilters.mostRecent;
    this.searchCriteriaData.sortByFilterMap.get(this.sortSelectedFilter).criteriaSelected = true;
    this.applyFilter();
  }

  public onSortFilterChanged(selectedRadioButton: MatRadioChange): void {
    const sortFilterItems: string[] = this.searchCriteriaData.sortByFilterMap.getKeys();
    for (const sortFitlterItem of sortFilterItems) {
      const searchCriteriaItem: SearchCriteriaItem = this.searchCriteriaData.sortByFilterMap.get(sortFitlterItem);
      searchCriteriaItem.criteriaSelected = (selectedRadioButton.value === sortFitlterItem);
    }
  }

  public onCategoryFilterChange(selectedCheckBox: MatSelectionListChange): void {
    const selectedCheckBoxOption: MatListOption = selectedCheckBox.option;
    const searchCriteriaItem: SearchCriteriaItem = this.searchCriteriaData.categoryFilterMap.get(selectedCheckBoxOption.value);
    searchCriteriaItem.criteriaSelected = selectedCheckBoxOption.selected;
  }

  public onDateFilterChanged(selectedRadioButton: MatRadioChange): void {
    const dateFilterItems: string[] = this.searchCriteriaData.dateFilterMap.getKeys();
    for (const dateFitlterItem of dateFilterItems) {
      const searchCriteriaItem: SearchCriteriaItem = this.searchCriteriaData.dateFilterMap.get(dateFitlterItem);
      searchCriteriaItem.criteriaSelected = (selectedRadioButton.value === dateFitlterItem);
    }
  }

  /**
   * @description helps hide the sections other than the filter section and vice versa when the "Filter" dropdown is clicked in
   *  mobile screen only. Does not have any effect on the desktop screens
   */
  public toggleFilter() {
    this.isDisplayFilter = !this.isDisplayFilter;
    this.componentOutput.searchCriteriaData = null;
    this.componentOutput.filterOverlayFlag = this.isDisplayFilter;
    this.onSearch.emit(this.componentOutput);
  }

  public applyFilter() {
    this.filterSearchAllTransactionService.cachedSearchCriteriaData = this.searchCriteriaData;
    this.componentOutput.searchCriteriaData = this.searchCriteriaData;
    this.componentOutput.filterOverlayFlag = false;


    this.isDisplayFilter = false;
    this.onSearch.emit(this.componentOutput);
  }

  public clearFilter() {

    this.showClose = false;
    this.isAutoSearch = false;
    this.showCalender = false;
    this.isSortExpanded = false;

    this.isDateExpanded = false;

    this.isProviderExpanded = false;
    this.isDisplayFilter = false;

    this.filterSearchAllTransactionService.isPersistSearchCriteria = false;
    this.filterSearchAllTransactionService.cachedSearchCriteriaData = null;


    const sortFilterItems: string[] = this.searchCriteriaData.sortByFilterMap.getKeys();
    for (const sortFilterItem of sortFilterItems) {
      const searchCriteriaItem: SearchCriteriaItem = this.searchCriteriaData.sortByFilterMap.get(sortFilterItem);
      searchCriteriaItem.criteriaSelected = false;
    }

    const categoryFilterItems: string[] = this.searchCriteriaData.categoryFilterMap.getKeys();
    for (const categoryFilterItem of categoryFilterItems) {
      const searchCriteriaItem: SearchCriteriaItem = this.searchCriteriaData.categoryFilterMap.get(categoryFilterItem);
      searchCriteriaItem.criteriaSelected = false;
    }

    const dateFilterItems: string[] = this.searchCriteriaData.dateFilterMap.getKeys();
    for (const dateFitlterItem of dateFilterItems) {
      const searchCriteriaItem: SearchCriteriaItem = this.searchCriteriaData.dateFilterMap.get(dateFitlterItem);
      searchCriteriaItem.criteriaSelected = false;
    }

    this.searchCriteriaData.keywordToSearch = '';
    this.searchCriteriaData.matchingKeywords = [];

    this.initDefaultSortFilter();

    this.componentOutput.searchCriteriaData = this.searchCriteriaData;
    this.componentOutput.filterOverlayFlag = this.isDisplayFilter;

    this.onSearch.emit(this.componentOutput);

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


  public toggleCalender(selectedDateType: string) {
    const isControlChanged = (selectedDateType === 'to' && this.isFormDateSelected) ||
      (selectedDateType === 'from' && !this.isFormDateSelected);
    this.isFormDateSelected = selectedDateType === 'from';
    this.currentSelectedDate = this.isFormDateSelected ?
      new Date(this.searchCriteriaData.dateFilterCustomStartDate) : new Date(this.searchCriteriaData.dateFilterCustomEndDate);
    this.setCalendarMinimumDate();
    if (isControlChanged) {
      this.toggleCalendarDisplay();
    } else {
      this.showCalender = true;
    }
  }

  private setCalendarMinimumDate() {
    if (!this.isFormDateSelected && this.searchCriteriaData.dateFilterCustomStartDate) {
      this.fromMinDate = new Date(this.searchCriteriaData.dateFilterCustomStartDate);
    } else {
      const minFormDate = this.getMinimumFromDate();
      this.fromMinDate = minFormDate;
    }
  }

  private toggleCalendarDisplay() {
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

  private getMinimumFromDate() {
    const minFormDate = new Date();
    minFormDate.setFullYear(minFormDate.getFullYear() - 2);
    return minFormDate;
  }

  public getSelectedValue(date) {
    this.isCustomDateRangeInValid = false;
    this.isSelectedDateInvalid = false;
    if (this.isFormDateSelected) {
      this.searchCriteriaData.dateFilterCustomStartDate = moment(date).format('L');
    } else {
      this.searchCriteriaData.dateFilterCustomEndDate = moment(date).format('L');
    }
    this.setCalendarMinimumDate();
    this.showCalender = false;
  }

  public isOpened(value) {
    switch (value) {
      case 'isDateExpanded':
        this.isDateExpanded = true;
        break;
      case 'isProviderExpanded':
        this.isProviderExpanded = true;
        break;
    }

  }

  public isClosed(value) {
    switch (value) {
      case 'isDateExpanded':
        this.isDateExpanded = false;
        break;
      case 'isProviderExpanded':
        this.isProviderExpanded = false;
        break;
    }
  }

  public showTypeAHeadList(event, data: any) {
    let matchingKeywords = [];
    if (data.value.length > 0) {
      this.showClose = true;
    } else {
      this.showClose = false;
    }

    if (data.value.length <= 2) {
      this.isAutoSearch = false;
    }
    if (data.value.length > 2) {
      matchingKeywords = this.searchCriteriaData.keywordList.filter((keywordItem) => {
        return keywordItem.toLowerCase().includes(this.searchCriteriaData.keywordToSearch.toLowerCase());
      });

      // get unique values only
      this.searchCriteriaData.matchingKeywords = Array.from(new Set(matchingKeywords).values());

      if (this.searchCriteriaData.matchingKeywords.length > 0) {
        this.isAutoSearch = true;
      } else {
        this.isAutoSearch = false;
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

  public escapeSearchContainer(event) {
    if (event.which === 27) {
      this.isAutoSearch = false;
    }
  }

  public clearSearchVal() {
    this.searchCriteriaData.keywordToSearch = '';
    this.isAutoSearch = false;
    this.showClose = false;
  }

  public search(event, data: HTMLInputElement | string) {

    let val;
    this.isAutoSearch = false;

    if (data instanceof HTMLInputElement) {
      val = data.value;
    } else {
      val = data;
    }

    if (val.length > 0) {
      sessionStorage.setItem('searchval', this.searchCriteriaData.keywordToSearch);
    } else {
      this.isAutoSearch = false;
    }
    this.applyFilter();
  }

  public getSearchValue(event, matchingKeyword: string) {
    this.searchCriteriaData.keywordToSearch = matchingKeyword;
    sessionStorage.setItem('searchval', this.searchCriteriaData.keywordToSearch);
    this.search(event, matchingKeyword);
    this.isAutoSearch = false;
  }

  public proxyClick(event, targetGroupIdentified?: string) {

    if (targetGroupIdentified === 'radioButton') {
      if (event.target.tagName === 'MAT-RADIO-BUTTON') {
        // ensuring clicks on void area corresponding to the radio buttons are delegated to the radio buttons directly
        const labelNode = event.target.childNodes[0];
        const radioButton = labelNode.childNodes[1];
        radioButton.click();
      }
    } else if (targetGroupIdentified) {
      // have prevented direct clicks on mat-selection-list and
      // delegating click event to mat-pseudo-checkbox to workaround the disableRipple - angular material's animation bug
      event.cancelBubble = true;
      event.stopPropagation();
      const overLayDivElement = event.target;
      const categoryListContainer = overLayDivElement.parentElement;
      const materialPseudoCheckBoxElement = categoryListContainer.getElementsByTagName('mat-pseudo-checkbox')[0];
      materialPseudoCheckBoxElement.click();
      return false;
    } else if (event.target && event.target.childNodes && event.target.childNodes.length) {
      // ensuring the first-childs click event is also fired when a parent is clicked
      if (event.target.childNodes[0].click) {
        event.target.childNodes[0].click();
      }
    }
  }
}
