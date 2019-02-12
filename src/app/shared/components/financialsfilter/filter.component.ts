import { animate, state, style, transition, trigger } from '@angular/animations';
import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    OnInit,
    Output,
    QueryList,
    ViewChild,
    ViewChildren
} from '@angular/core';
import {
    MatCalendar,
    MatListOption,
    MatRadioChange,
    MatRadioGroup,
    MatSelectionList,
    MatSelectionListChange
} from '@angular/material';
import * as moment from 'moment';
import { FilterService } from '../../services/filter.service';
import { GlobalService } from '../../services/global.service';
import { FilterComponentConstants } from './filter.constants';
import { FilterInterface, FilterOptionInterface, FilterItemInterface, FilterSelectionItemInterface } from './filter.model';

@Component({
    selector: 'app-financials-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss'],
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
export class FinancialFilterComponent implements OnInit, OnChanges, AfterViewInit {
    @Input() filterConfig: FilterInterface;
    @Input() dispatchEvent: string;
    @Output() radioChange = new EventEmitter();
    @Output() checkboxChange = new EventEmitter();
    @Output() dateChange = new EventEmitter();
    @Output() applyFilter = new EventEmitter();
    @Output() clearFilter = new EventEmitter();
    @Output() toggleFilter = new EventEmitter(); // Mobile & Tablet
    @ViewChildren(MatSelectionList) matSelectionLists: QueryList<MatSelectionList>;
    @ViewChildren(MatRadioGroup) matRadioGroups: QueryList<MatRadioGroup>;
    @ViewChild('searchInput') inputSearch: ElementRef;
    @ViewChild('searchDrpContainer') searchDrpContainer;
    @ViewChild('matcalender') picker: MatCalendar<Date>;
    @ViewChild('fromDateInput') fromInputDate: ElementRef;
    @ViewChild('toDateInput') toInputDate: ElementRef;
    private defaultOptions = {
        items: []
    };
    private filterConfigClone: FilterInterface;
    _filterConfig: FilterInterface;
    myFocusTriggeringEventEmitter = new EventEmitter<boolean>();
    isSidenavOpened = false;
    sideNavMode: string;
    sideNavStatus: string;
    searchVal: string;
    searchValWhenFilterApplied: string;
    showClearLink: boolean;
    mobileViewPort = 992;
    ismobile: boolean;
    isAutoSearch: boolean;
    showClose: boolean;
    autoCompleteSearchArray: string[] = [];
    dateSelectedFilter: string;
    showCalender: boolean;
    showDate: boolean;
    fromMinDate: Date;
    calendarMaxDate = new Date();
    currentSelectedDate: Date = null;
    isCustomDateRangeInValid = false;
    isSelectedDateInvalid = false;
    lastDate: Date;
    fromDate: string;
    toDate: string = moment().format('L');
    dateFormat = 'MM/DD/YYYY';
    isFormDateSelected = true;
    errorMessage = null;
    defaultSort: FilterOptionInterface;

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        if (event.target.innerWidth <= this.mobileViewPort) {
            this.ismobile = true;
        } else {
            this.ismobile = false;
            this.sideNavStatus = 'in';
        }
    }

    constructor(private filterService: FilterService, private globalService: GlobalService) {
        if (window.innerWidth <= this.mobileViewPort) {
            this.ismobile = true;
        }
        this.sideNavStatus = this.ismobile ? 'out' : 'in';
    }

    ngOnInit() {
        this._filterConfig = Object.assign(this.defaultOptions, this.filterConfig);
        this.addAdditionalProp();
        this.filterConfigClone = JSON.parse(JSON.stringify(this.filterConfig));
        if (this._filterConfig.saveFilterState === true && this.globalService.filterState[this._filterConfig.filterStatePropName]) {
            this._filterConfig = this.globalService.filterState[this._filterConfig.filterStatePropName];
            this.searchVal = this._filterConfig['searchVal'];
            this.fromDate = this._filterConfig['fromDate'];
            this.toDate = this._filterConfig['toDate'];
        }
    }

    ngAfterViewInit() {
        this.syncInitialDataForCheckbox();
        if (!this._filterConfig.dontEmitOnInit) {
            setTimeout(() => {
                this.applyFilter.emit(
                    {
                        selections: this.getSelections(),
                        searchVal: this.searchVal
                    }
                );
            }, 1);
        } else {
            if (this._filterConfig.saveFilterState === true && this.globalService.filterState[this._filterConfig.filterStatePropName]) {
                setTimeout(() => {
                    this.applyFilter.emit(
                        {
                            selections: this.getSelections(),
                            searchVal: this.searchVal
                        }
                    );
                }, 1);
            }
        }
    }

    ngOnChanges(change) {
        setTimeout(() => {
            if (change.dispatchEvent) {
                if (change.dispatchEvent.currentValue === FilterComponentConstants.CLEAR) {
                    this.clearFilterHandler();
                }
            }
        }, 1);
    }

    radioChangeHandler(selectedOption: MatRadioChange, index: number): void {
        if (this._filterConfig.items[index] && selectedOption) {
            const list = this._filterConfig.items[index].list;
            for (let i = 0; i < list.length; i++) {
                if (list[i].value === selectedOption.value) {
                    list[i].selected = true;
                } else {
                    list[i].selected = false;
                }
            }
        }
        this.radioChange.emit({
            selectedOption: selectedOption,
            filterItemNumber: index
        });
    }

    checkboxChangeHandler(selectedOption: MatSelectionListChange, index: number): void {
        if (this._filterConfig.items[index] && selectedOption && selectedOption.option) {
            const list = this._filterConfig.items[index].list;
            if (this._filterConfig.items[index].selectEveryOnAll) {
                if (selectedOption.option.value === FilterComponentConstants.ALL) {
                    if (selectedOption.option.selected) {
                        for (let i = 0; i < list.length; i++) {
                            if (list[i].value === FilterComponentConstants.ALL) {
                                list[i].disabled = false;
                            } else {
                                if (this._filterConfig.items[index].disableOnAll) {
                                    list[i].disabled = true;
                                }
                            }
                        }
                        selectedOption.source.selectAll();
                    } else {
                        for (let i = 0; i < list.length; i++) {
                            list[i].disabled = false;
                        }
                        selectedOption.source.deselectAll();
                    }
                }
            }
            if (this._filterConfig.items[index].selectAllOnEvery) {
                const selectedList = selectedOption.source.selectedOptions.selected;
                if (selectedOption.option.value === FilterComponentConstants.ALL) {
                    if (!selectedOption.option.selected) {
                        selectedOption.source.deselectAll();
                    }
                } else {
                    let count = 0;
                    for (let i = 0; i < selectedList.length; i++) {
                        if (selectedList[i].selected && selectedList[i].value !== FilterComponentConstants.ALL) {
                            count++;
                        }
                    }
                    if (count === (list.length - 1)) {
                        selectedOption.source.selectAll();
                        if (this._filterConfig.items[index].disableOnAll) {
                            for (let i = 0; i < list.length; i++) {
                                if (list[i].value === FilterComponentConstants.ALL) {
                                    list[i].disabled = false;
                                } else {
                                    list[i].disabled = true;
                                }
                            }
                        }
                    } else {
                        for (let i = 0; i < selectedList.length; i++) {
                            if (selectedList[i].value === FilterComponentConstants.ALL) {
                                selectedList[i].toggle();
                            }
                        }
                    }
                }
            }
        }
        this._filterConfig.items[index]['selectedOptions'] = selectedOption.source.selectedOptions.selected;
        this.syncDataForCheckbox(selectedOption.source.selectedOptions.selected, this._filterConfig.items[index].list);
        this.checkboxChange.emit({
            selectedOption: selectedOption,
            selectedOptions: selectedOption.source.selectedOptions.selected,
            filterItemNumber: index
        });
    }

    dateFilterChanged(selectedOption: MatRadioChange, index) {
        for (let i = 0; i < this._filterConfig.items[index].list.length; i++) {
            if (this._filterConfig.items[index].list[i].value === selectedOption.value) {
                this._filterConfig.items[index].list[i].selected = true;
            } else {
                this._filterConfig.items[index].list[i].selected = false;
            }
        }
        if (selectedOption.value === 'Custom Date Range') {
            this.showDate = true;
            this.showCalender = true;
        } else {
            this.showDate = false;
            this.showCalender = false;
        }
        this.clearCustomDateRangeSelections();
        this.dateChange.emit({
            selectedOption: selectedOption,
            filterItemNumber: index
        });
    }

    fromDateChange(fromdate) {
        this.validateFromDate();
        this.validateCustomRange();
        if (!this.isCustomDateRangeInValid && !this.isSelectedDateInvalid) {
            this.showCalender = false;
        }
    }

    toDateChange(toDate) {
        this.validateCustomRange();
        this.validateToDate();
        if (!this.isCustomDateRangeInValid && !this.isSelectedDateInvalid) {
            this.showCalender = false;
        }
    }

    syncInitialDataForCheckbox() {
        const filterList = this._filterConfig.items.filter((item, index) => {
            return (item.type === 'checkbox');
        });
        if (filterList.length > 0) {
            this.matSelectionLists.forEach((selectionList: MatSelectionList, index: number) => {
                filterList[index].selectedOptions = selectionList.selectedOptions.selected;
            });
        }
    }

    syncDataForCheckbox(selectedOptions: MatListOption[], list: FilterOptionInterface[]): void {
        for (let j = 0; j < list.length; j++) {
            list[j].selected = false;
        }
        if (selectedOptions.length > 0) {
            for (let i = 0; i < selectedOptions.length; i++) {
                for (let j = 0; j < list.length; j++) {
                    if (selectedOptions[i].value === list[j].value) {
                        list[j].selected = selectedOptions[i].selected;
                    }
                }
            }
        }
    }

    addAdditionalProp(): void {
        this._filterConfig.items = this._filterConfig.items.map((obj: FilterItemInterface) => {
            const selected = obj.list.filter((option: FilterOptionInterface) => option.selected === true);
            obj.model = selected[0] ? selected[0].value : '';
            if (obj.type === 'checkbox') {
                obj['selectedOptions'] = [];
            }
            if (obj.type === 'radio' && obj.sortBy === true) {
                this.defaultSort = obj.list.filter((item) => {
                    return (item.selected === true);
                })[0];
            }
            return { ...obj };
        });
    }

    isOpened(index: number) {
        this._filterConfig.items[index].expanded = true;
    }

    isClosed(index: number) {
        this._filterConfig.items[index].expanded = false;
    }

    triggerChange(): void {
        this._filterConfig = Object.assign({}, this._filterConfig);
    }

    getSelections(): FilterSelectionItemInterface[] {
        const selectedArray: FilterSelectionItemInterface[] = [];
        if (this._filterConfig.items.length > 0) {
            this._filterConfig.items.forEach((item, index) => {
                if (item.type === 'radio') {
                    if (item.list && item.list.length > 0) {
                        let selectedRadioArray: Array<any> = [];
                        selectedRadioArray = item.list.filter(option => option.selected === true);
                        selectedArray.push({
                            selectedOption: selectedRadioArray[0],
                            filterItemNumber: index
                        });
                    } else {
                        selectedArray.push({
                            selectedOption: {
                                text: '',
                                value: '',
                                selected: false,
                                disabled: false
                            },
                            filterItemNumber: index
                        });
                    }
                } else if (item.type === 'checkbox') {
                    if (item.list && item.selectedOptions && item.selectedOptions.length > 0) {
                        let selectedCheckboxArray: Array<any> = [];
                        selectedCheckboxArray = item.selectedOptions.filter(option => option.selected === true);
                        selectedArray.push({
                            selectedOptions: selectedCheckboxArray,
                            filterItemNumber: index
                        });
                    } else {
                        this.clearFilterList();
                        // selectedArray.push({
                        //     selectedOptions: [],
                        //     filterItemNumber: index
                        // });
                    }
                } else if (item.type === 'calendar') {
                    if (item.list && item.list.length > 0) {
                        let selectedDateArray: Array<any> = [];
                        selectedDateArray = item.list.filter(option => option.value === item.model);
                        if (selectedDateArray[0] && selectedDateArray[0].value === FilterComponentConstants.CUSTOM) {
                            selectedDateArray[0] = Object.assign(selectedDateArray[0], {
                                toDate: this.toDate,
                                fromDate: this.fromDate,
                                isSelectedDateInvalid: this.isSelectedDateInvalid,
                                isCustomDateRangeInValid: this.isCustomDateRangeInValid,
                                dateFormat: this.dateFormat
                            });
                        }
                        selectedArray.push({
                            selectedOption: selectedDateArray[0],
                            filterItemNumber: index
                        });
                    } else {
                        selectedArray.push({
                            selectedOption: {
                                text: '',
                                value: '',
                                selected: false,
                                disabled: false
                            },
                            filterItemNumber: index
                        });
                    }
                }

            });
        }
        return selectedArray;
    }

    clearFilterList(fromSearch?: boolean) {
        this.matSelectionLists.forEach((selectionList: MatSelectionList) => {
            selectionList.deselectAll();
        });
        if (fromSearch && this._filterConfig.items.length > 0) {
            this._filterConfig.items.forEach((item, index) => {
                if (item.type === 'radio' || item.type === 'calendar') {
                    if (!item.sortBy) {
                        item.model = '';
                        item.list.forEach((listItem) => {
                            listItem.selected = false;
                        });
                    } else {
                        item.model = this.defaultSort ? this.defaultSort.value : '';
                        item.list.forEach((listItem) => {
                            listItem.selected = false;
                            if (listItem.value === item.model) {
                                listItem.selected = true;
                            }
                        });
                    }
                }
            });
            this._filterConfig = this._filterConfig;
        } else {
            this._filterConfig = JSON.parse(JSON.stringify(this.filterConfigClone));
        }
    }

    clearSearch(value: boolean = true) {
        this.searchVal = '';
        this.isAutoSearch = false;
        sessionStorage.removeItem('searchval');
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

    setShowClearLink() {
        this.showClearLink = false;
        if (this._filterConfig.items.some(this.filterModelCheck)) {
            this.showClearLink = true;
        }
    }

    filterModelCheck(item: FilterItemInterface): boolean {
        return (item.model !== null && item.model !== undefined);
    }

    clearFilterHandler() {
        this.closeFilter();
        this.clearFilterList();
        this.clearSearch();
        this.showClearLink = false;
        this.showClose = false;
        this.isCustomDateRangeInValid = false;
        this.showClose = false;
        this.showCalender = false;
        this.isSelectedDateInvalid = false;
        this.isCustomDateRangeInValid = false;
        this.filterService.scrollToTop();
        this.saveFilterState();
        this.clearFilter.emit(
            {
                selections: this.getSelections(),
                searchVal: this.searchVal
            }
        );
    }

    toggleFilterHandler(toggleStatus: string) {
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
        this.toggleFilter.emit(
            {
                toggle: toggleStatus
            }
        );
    }

    applyFilterHandler() {
        this.closeFilter();
        this.closeSideNavigation();
        this.setShowClearLink();
        this.isAutoSearch = false;
        this.saveFilterState();
        this.applyFilter.emit(
            {
                selections: this.getSelections(),
                searchVal: this.searchVal
            }
        );
    }

    saveFilterState() {
        if (this._filterConfig.saveFilterState === true) {
            this._filterConfig['searchVal'] = this.searchVal;
            this._filterConfig['fromDate'] = this.fromDate;
            this._filterConfig['toDate'] = this.toDate;
            this.globalService.filterState[this._filterConfig.filterStatePropName] = this._filterConfig;
        }
    }

    searchAutoComplete(event, data: any) {
        if (data.value.length > 0) {
            this.showClose = true;
        } else {
            this.showClose = false;
        }
        const filtervalue = data.value.toLowerCase();
        if (data.value.length > 2) {
            this.autoCompleteSearchArray = [];
            if (this._filterConfig.searchDataList) {
                for (let i = 0; i < this._filterConfig.searchDataList.length; i++) {
                    const dataItem = this._filterConfig.searchDataList[i];
                    for (let j = 0; j < dataItem.property.length; j++) {
                        for (let k = 0; k < dataItem.data.length; k++) {
                            if (dataItem.data[k][dataItem.property[j]].toLowerCase().includes(data.value.toString().toLowerCase())) {
                                this.autoCompleteSearchArray.push(dataItem.data[k][dataItem.property[j]].toString());
                            }
                        }
                    }
                }
            }
            this.isAutoSearch = true;
            if (this.autoCompleteSearchArray.length <= 0) {
                this.isAutoSearch = false;
            }
        } else {
            this.isAutoSearch = false;
        }
        this.autoCompleteSearchArray = this.uniqueArray(this.autoCompleteSearchArray);
        if (event.which === 40) {
            if (this.searchDrpContainer) {
                this.searchDrpContainer.nativeElement.getElementsByTagName('li')[0].focus();
            }
        }
        if (event.which === 27 || event.which === 38) {
            this.escapeSearchContainer(event);
        }
    }

    searchKeyDown(event, index) {
        const oListItem = this.searchDrpContainer.nativeElement.getElementsByTagName('li');
        const length = this.autoCompleteSearchArray.length;
        if (event.which === 40) {
            event.preventDefault();
            if (index === length - 1) {
                this.myFocusTriggeringEventEmitter.emit(true);
                this.isAutoSearch = false;
            } else {
                oListItem[index + 1].focus();
            }
        } else if (event.which === 38) {
            if (index === 0) {
                this.myFocusTriggeringEventEmitter.emit(true);
                this.isAutoSearch = false;
            } else {
                event.preventDefault();
                oListItem[index - 1].focus();
            }
        } else if (event.which === 13) {
            this.getSearchValue(event, event.target.textContent.toString().trim());
        } else if (index === length - 1) {
            this.myFocusTriggeringEventEmitter.emit(true);
            this.isAutoSearch = false;
        }
        this.escapeSearchContainer(event);
    }

    getSearchValue(event, value: any) {
        this.searchVal = value;
        sessionStorage.setItem('searchval', this.searchVal);
        this.search(event, value);
        this.isAutoSearch = false;
    }

    escapeSearchContainer(event) {
        if (event.which === 27) {
            this.isAutoSearch = false;
        }
    }

    search(event, data: any) {
        this.isAutoSearch = false;
        const val = data.value === undefined ? data : data.value;
        if (val.length > 0) {
            sessionStorage.setItem('searchval', val);
        } else {
            this.isAutoSearch = false;
        }
        this.clearFilterList(true);
        this.applyFilterHandler();
    }

    clearSearchVal() {
        this.searchVal = '';
        this.showClose = false;
        this.isAutoSearch = false;
        this.inputSearch.nativeElement.focus();
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
    }

    validateCustomRange() {
        if (this.toDate && this.fromDate) {
            this.isCustomDateRangeInValid = moment(this.toDate).diff(moment(this.fromDate)) < 0;
        }
        return this.isCustomDateRangeInValid;
    }

    clearCustomDateRangeSelections() {
        this.toDate = moment().format('L');
        this.fromDate = null;
        this.fromMinDate = null;
        this.isCustomDateRangeInValid = false;
        this.isSelectedDateInvalid = false;
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

    getSelectedValue(date) {
        this.isCustomDateRangeInValid = false;
        this.isSelectedDateInvalid = false;
        if (this.isFormDateSelected) {
            this.fromDate = this.filterService.getFormatDateString(date);
        } else {
            this.toDate = this.filterService.getFormatDateString(date);
        }
        this.setCalendarMinimumDate();
        this.showCalender = this.validateCustomRange();
    }

    setCalendarMinimumDate() {
        if (!this.isFormDateSelected && this.fromDate) {
            this.fromMinDate = new Date(this.fromDate);
        } else {
            const minFormDate = this.filterService.getMinimumFromDate();
            this.fromMinDate = minFormDate;
        }
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

    customDateInputKeyDownEvent(e) {
        return this.filterService.customDateInputKeyDownEvent(e);
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
}
