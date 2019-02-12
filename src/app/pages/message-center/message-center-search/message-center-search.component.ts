import {
  Component, OnInit, OnChanges, ViewChild,
  ElementRef, EventEmitter, Input,
  Output, SimpleChanges
} from '@angular/core';
import { GlobalService } from '../../../shared/services/global.service';
import { FilterService } from '../../../shared/services/filter.service';
import {
  MatSelectionListChange,
  MatSidenav, MatRadioChange, MatListOption
} from '@angular/material';
import * as moment from 'moment';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
import { MessageCenterConstants } from '../constants/messageCenter.constants';
import {
  MessageDetailsSearchResponseModelInterface,
  MessageCenterSearchCompOutputModelInterface
} from '../modals/interfaces/message-center-search.interface';
import {
  SearchCriteriaItem,
  MessageCenterSearchCompOutputModel
} from '../modals/message-center-search.model';
import { MessageCenterSearchService } from './message-center-search.service';

@Component({
  selector: 'app-message-center-search',
  templateUrl: './message-center-search.component.html',
  styleUrls: ['./message-center-search.component.scss']
})

export class MessageCenterSearchComponent implements OnInit, OnChanges {

  @Input('searchCriteriaData') searchCriteriaData: MessageDetailsSearchResponseModelInterface;
  @Output('onSearch') onSearch = new EventEmitter<MessageCenterSearchCompOutputModelInterface>();

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
  public messageCenterConstants;
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
  private componentOutput: MessageCenterSearchCompOutputModelInterface = new MessageCenterSearchCompOutputModel();

  constructor(private bcbsmaErrorHandler: BcbsmaerrorHandlerService, public globalService: GlobalService,
    private messageCenterSearchService: MessageCenterSearchService,
    private filterService: FilterService
  ) {
    this.messageCenterConstants = MessageCenterConstants;
  }

  ngOnInit() {
    try {
      if (this.messageCenterSearchService.isPersistSearchCriteria) {
        this.messageCenterSearchService.isPersistSearchCriteria = false;
        this.searchCriteriaData = this.messageCenterSearchService.cachedSearchCriteriaData;
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
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.messageCenterSearchComponent,
        MessageCenterConstants.methods.ngOnInit);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    try {
      this.searchCriteriaData = changes.searchCriteriaData.currentValue;
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.messageCenterSearchComponent,
        MessageCenterConstants.methods.ngOnChanges);
    }
  }

  private throwInvalidServiceResponseDataErrorInOnInit(): void {
    this.bcbsmaErrorHandler.logError(
      new Error(MessageCenterConstants.errorMessages.invalidServiceResponseData),
      BcbsmaConstants.modules.messageCenterModule,
      MessageCenterConstants.components.documentsComponent,
      MessageCenterConstants.methods.ngOnInit
    );
  }

  public isSortOpened() {
    this.isSortExpanded = true;
  }

  public isSortClosed() {
    this.isSortExpanded = false;
  }

  public initDefaultSortFilter() {
    try {
      this.sortSelectedFilter = this.messageCenterConstants.filters.sortByFilters.mostRecent;
      this.searchCriteriaData.sortByFilterMap.get(this.sortSelectedFilter).criteriaSelected = true;
      this.applyFilter();
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.messageCenterSearchComponent,
        MessageCenterConstants.methods.initDefaultSortFilter);
    }
  }

  public onSortFilterChanged(selectedRadioButton: MatRadioChange): void {
    try {
      const sortFilterItems: string[] = this.searchCriteriaData.sortByFilterMap.getKeys();
      for (const sortFitlterItem of sortFilterItems) {
        const searchCriteriaItem: SearchCriteriaItem = this.searchCriteriaData.sortByFilterMap.get(sortFitlterItem);
        searchCriteriaItem.criteriaSelected = (selectedRadioButton.value === sortFitlterItem);
      }
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.messageCenterSearchComponent,
        MessageCenterConstants.methods.onSortFilterChanged);
    }
  }

  public onCategoryFilterChange(selectedCheckBox: MatSelectionListChange): void {
    try {
      const selectedCheckBoxOption: MatListOption = selectedCheckBox.option;
      const searchCriteriaItem: SearchCriteriaItem = this.searchCriteriaData.categoryFilterMap.get(selectedCheckBoxOption.value);
      searchCriteriaItem.criteriaSelected = selectedCheckBoxOption.selected;
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.messageCenterSearchComponent,
        MessageCenterConstants.methods.onCategoryFilterChange);
    }
  }

  public onDateFilterChanged(selectedRadioButton: MatRadioChange): void {
    try {
      const dateFilterItems: string[] = this.searchCriteriaData.dateFilterMap.getKeys();
      for (const dateFitlterItem of dateFilterItems) {
        const searchCriteriaItem: SearchCriteriaItem = this.searchCriteriaData.dateFilterMap.get(dateFitlterItem);
        searchCriteriaItem.criteriaSelected = (selectedRadioButton.value === dateFitlterItem);
      }
      if (!(this.dateSelectedFilter === this.messageCenterConstants.filters.dateFilters.customDateRange)) {
        this.clearCustomDateRangeSelections();
      }

    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.messageCenterSearchComponent,
        MessageCenterConstants.methods.onDateFilterChanged);
    }
  }

  /**
   * @description helps hide the sections other than the filter section and vice versa when the "Filter" dropdown is clicked in
   *  mobile screen only. Does not have any effect on the desktop screens
   */
  public toggleFilter() {
    try {
      this.isDisplayFilter = !this.isDisplayFilter;
      this.componentOutput.searchCriteriaData = null;
      this.componentOutput.filterOverlayFlag = this.isDisplayFilter;
      this.onSearch.emit(this.componentOutput);
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.messageCenterSearchComponent,
        MessageCenterConstants.methods.toggleFilter);
    }
  }

  public applyFilter(onClick?: boolean) {
    try {
      this.messageCenterSearchService.cachedSearchCriteriaData = this.searchCriteriaData;
      this.componentOutput.searchCriteriaData = this.searchCriteriaData;
      this.componentOutput.filterOverlayFlag = false;

      if (onClick) {
        this.componentOutput.applyFilter = true;
        if (this.dateSelectedFilter === this.messageCenterConstants.filters.dateFilters.customDateRange) {
          if (!this.validateDate(this.searchCriteriaData.dateFilterCustomStartDate)
            && !this.validateDate(this.searchCriteriaData.dateFilterCustomEndDate)) {
            this.validateCustomRange();
          }
        }
      }

      this.isDisplayFilter = false;
      if (!this.isSelectedDateInvalid && !this.isCustomDateRangeInValid) {
        this.onSearch.emit(this.componentOutput);
      }
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.messageCenterSearchComponent,
        MessageCenterConstants.methods.applyFilter);
    }
  }

  public clearFilter() {
    try {
      this.showClose = false;
      this.isAutoSearch = false;

      this.isSortExpanded = false;

      this.isDateExpanded = false;

      this.isProviderExpanded = false;
      this.isDisplayFilter = false;
      this.dateSelectedFilter = '';

      this.messageCenterSearchService.isPersistSearchCriteria = false;
      this.messageCenterSearchService.cachedSearchCriteriaData = null;

      this.clearCustomDateRangeSelections();

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
      this.componentOutput.applyFilter = false;

      this.onSearch.emit(this.componentOutput);
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.messageCenterSearchComponent,
        MessageCenterConstants.methods.clearFilter);
    }
  }

  public customDateInputKeyDownEvent(e) {
    try {
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
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.messageCenterSearchComponent,
        MessageCenterConstants.methods.customDateInputKeyDownEvent);
    }
  }


  public toggleCalender(selectedDateType: string) {
    try {
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
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.messageCenterSearchComponent,
        MessageCenterConstants.methods.toggleCalender);
    }
  }

  private setCalendarMinimumDate() {
    try {
      if (!this.isFormDateSelected && this.searchCriteriaData.dateFilterCustomStartDate) {
        this.fromMinDate = new Date(this.searchCriteriaData.dateFilterCustomStartDate);
      } else {
        const minFormDate = this.getMinimumFromDate();
        this.fromMinDate = minFormDate;
      }
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.messageCenterSearchComponent,
        MessageCenterConstants.methods.setCalendarMinimumDate);
    }
  }

  private toggleCalendarDisplay() {
    try {
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
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.messageCenterSearchComponent,
        MessageCenterConstants.methods.toggleCalendarDisplay);
    }
  }

  private getMinimumFromDate() {
    try {
      const minFormDate = new Date();
      minFormDate.setFullYear(minFormDate.getFullYear() - 2);
      return minFormDate;
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.messageCenterSearchComponent,
        MessageCenterConstants.methods.getMinimumFromDate);
    }
  }

  public getSelectedValue(date) {
    try {
      this.isCustomDateRangeInValid = false;
      this.isSelectedDateInvalid = false;
      if (this.isFormDateSelected) {
        this.searchCriteriaData.dateFilterCustomStartDate = moment(date).format('L');
      } else {
        this.searchCriteriaData.dateFilterCustomEndDate = moment(date).format('L');
      }
      this.setCalendarMinimumDate();
      this.showCalender = false;
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.messageCenterSearchComponent,
        MessageCenterConstants.methods.getSelectedValue);
    }
  }

  public isOpened(value) {
    try {
      switch (value) {
        case 'isDateExpanded':
          this.isDateExpanded = true;
          break;
        case 'isProviderExpanded':
          this.isProviderExpanded = true;
          break;
      }
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.messageCenterSearchComponent,
        MessageCenterConstants.methods.isOpened);
    }
  }

  public isClosed(value) {
    try {
      switch (value) {
        case 'isDateExpanded':
          this.isDateExpanded = false;
          break;
        case 'isProviderExpanded':
          this.isProviderExpanded = false;
          break;
      }
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.messageCenterSearchComponent,
        MessageCenterConstants.methods.isClosed);
    }
  }

  public showTypeAHeadList(event, data: any) {
    try {
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
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.messageCenterSearchComponent,
        MessageCenterConstants.methods.showTypeAHeadList);
    }
  }

  public escapeSearchContainer(event) {
    try {
      if (event.which === 27) {
        this.isAutoSearch = false;
      }
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.messageCenterSearchComponent,
        MessageCenterConstants.methods.escapeSearchContainer);
    }
  }

  public clearSearchVal() {
    try {
      this.searchCriteriaData.keywordToSearch = '';
      this.isAutoSearch = false;
      this.showClose = false;
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.messageCenterSearchComponent,
        MessageCenterConstants.methods.clearSearchVal);
    }
  }

  public search(event, data: HTMLInputElement | string) {
    try {
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
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.messageCenterSearchComponent,
        MessageCenterConstants.methods.search);
    }
  }

  public getSearchValue(event, matchingKeyword: string) {
    try {
      this.searchCriteriaData.keywordToSearch = matchingKeyword;
      sessionStorage.setItem('searchval', this.searchCriteriaData.keywordToSearch);
      this.search(event, matchingKeyword);
      this.isAutoSearch = false;
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.messageCenterSearchComponent,
        MessageCenterConstants.methods.getSearchValue);
    }
  }

  public proxyClick(event, targetGroupIdentified?: string) {
    try {
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
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.messageCenterSearchComponent,
        MessageCenterConstants.methods.proxyClick);
    }
  }

  public formatInputFromDate(value) {
    const dateString = this.filterService.convertInputStringToDate(value);
    if (dateString) {
      this.searchCriteriaData.dateFilterCustomStartDate = dateString;
    }
    if (this.searchCriteriaData.dateFilterCustomStartDate.length >= 10) {
      this.validateDate(this.searchCriteriaData.dateFilterCustomStartDate);
      this.validateCustomRange();
      if (!this.isCustomDateRangeInValid && !this.isSelectedDateInvalid) {
        this.currentSelectedDate = new Date(this.searchCriteriaData.dateFilterCustomStartDate);
        this.toggleCalendarDisplay();
      }
    }
  }

  public formatInputToDate(value) {
    const dateString = this.filterService.convertInputStringToDate(value);
    if (dateString) {
      this.searchCriteriaData.dateFilterCustomEndDate = dateString;
    }
    if (this.searchCriteriaData.dateFilterCustomEndDate.length >= 10) {
      this.validateDate(this.searchCriteriaData.dateFilterCustomEndDate);
      this.validateCustomRange();
      if (!this.isCustomDateRangeInValid && !this.isSelectedDateInvalid) {
        this.currentSelectedDate = new Date(this.searchCriteriaData.dateFilterCustomEndDate);
        this.toggleCalendarDisplay();
      }
    }
  }

  private validateDate(date) {
    const minFormDate = this.filterService.getMinimumFromDate();
    if (moment(date).isValid()) {
      this.isSelectedDateInvalid = !date || date.length !== 10
        || moment(date, 'MM/DD/YYYY').diff(moment(this.calendarMaxDate)) > 0
        || moment(date, 'MM/DD/YYYY').diff(moment(minFormDate)) < 0;
    } else {
      this.isSelectedDateInvalid = true;
    }

    if (this.isSelectedDateInvalid) {
      this.isCustomDateRangeInValid = false;
    }

    return this.isSelectedDateInvalid;
  }

  private validateCustomRange() {
    if (this.searchCriteriaData.dateFilterCustomEndDate && this.searchCriteriaData.dateFilterCustomStartDate) {
      this.isCustomDateRangeInValid = moment(this.searchCriteriaData.dateFilterCustomEndDate)
        .diff(moment(this.searchCriteriaData.dateFilterCustomStartDate)) < 0;
    }

    if (this.isCustomDateRangeInValid) {
      this.isSelectedDateInvalid = false;
    }
  }

  private clearCustomDateRangeSelections() {
    this.searchCriteriaData.dateFilterCustomEndDate = moment().format('L');
    this.searchCriteriaData.dateFilterCustomStartDate = '';
    this.fromMinDate = null;
    this.isCustomDateRangeInValid = false;
    this.isSelectedDateInvalid = false;
    this.showCalender = false;
  }

}
