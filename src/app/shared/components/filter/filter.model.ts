import { MatSelectionListChange, MatRadioChange, MatListOption } from '@angular/material';
import {
    FilterOptionInterface, FilterItemInterface, FilterInterface,
    FilterErrorMessageInterface, SearchDataListInterface,
    FilterRadioChangeInterface, FilterCheckboxChangeInterface,
    FilterSelectionItemInterface, FilterSelectionInterface,
    FilterToggleInterface
} from './filter-model.interface';

export class FilterOption implements FilterOptionInterface {
    name?: string;
    memSuffix?: string;
    depSuffix?: string;
    loggedinUserSuffix?: string;
    futureEffFlag?: string;
    text: string;
    value: any;
    selected: boolean;
    disabled: boolean;
    count?: number;
    fromDate?: string;
    toDate?: string;
    isCustomDateRangeInValid?: boolean;
    isSelectedDateInvalid?: boolean;
    error?: boolean;
    dateFormat?: string;
    className?: string;
    subscriberNo?: string;
    coverageType?: string;
    cobundledPlanFlag: string = 'False';

    public getSubscrberNo(): string {
        return this.subscriberNo;
    }

    public setSubscriberNo(subscriberNo: string): FilterOption {
        this.subscriberNo = subscriberNo;
        return this;
    }

    public getCoverageType(): string {
        return this.coverageType;
    }

    public setCoverageType(coverageType: string): FilterOption {
        this.coverageType = coverageType;
        return this;
    }

    public getDepSuffix(): string {
        return this.depSuffix;
    }

    public setDepSuffix(depSuffix: string): FilterOptionInterface {
        this.depSuffix = depSuffix;
        return this;
    }

    public setLoggedinUserSuffix(loggedinUserSuffix: string): FilterOptionInterface {
        this.loggedinUserSuffix = loggedinUserSuffix;
        return this;
    }

    public getLoggedinUserSuffix(): string {
        return this.loggedinUserSuffix;
    }

    public getMemSuffix(): string {
        return this.memSuffix;
    }

    public setMemSuffix(memSuffix: string): FilterOptionInterface {
        this.memSuffix = memSuffix;
        return this;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): FilterOption {
        this.name = name;
        return this;
    }

    public getText(): string {
        return this.text;
    }

    public setText(text: string): FilterOption {
        this.text = text;
        return this;
    }

    public getValue(): any {
        return this.value;
    }

    public setValue(value: any): FilterOption {
        this.value = value;
        return this;
    }

    public getSelected(): boolean {
        return this.selected;
    }

    public setSelected(selected: boolean): FilterOption {
        this.selected = selected;
        return this;
    }

    public getDisabled(): boolean {
        return this.disabled;
    }

    public setDisabled(disabled: boolean): FilterOption {
        this.disabled = disabled;
        return this;
    }

    public getCount(): number {
        return this.count;
    }

    public setCount(count: number): FilterOption {
        this.count = count;
        return this;
    }

    public getFromDate(): string {
        return this.fromDate;
    }

    public setFromDate(fromDate: string): FilterOption {
        this.fromDate = fromDate;
        return this;
    }

    public getToDate(): string {
        return this.toDate;
    }

    public setToDate(toDate: string): FilterOption {
        this.toDate = toDate;
        return this;
    }

    public getIsCustomDateRangeInValid(): boolean {
        return this.isCustomDateRangeInValid;
    }

    public setIsCustomDateRangeInValid(isCustomDateRangeInValid?: boolean): FilterOption {
        this.isCustomDateRangeInValid = isCustomDateRangeInValid;
        return this;
    }

    public getIsSelectedDateInvalid(): boolean {
        return this.isSelectedDateInvalid;
    }

    public setIsSelectedDateInvalid(isSelectedDateInvalid: boolean): FilterOption {
        this.isSelectedDateInvalid = isSelectedDateInvalid;
        return this;
    }

    public getError(): boolean {
        return this.error;
    }

    public setError(error: boolean): FilterOption {
        this.error = error;
        return this;
    }

    public getDateFormat(): string {
        return this.dateFormat;
    }

    public setDateFormat(dateFormat?: string): FilterOption {
        this.dateFormat = dateFormat;
        return this;
    }

    public getClassName(): string {
        return this.className;
    }

    public setClassName(className: string): FilterOption {
        this.className = className;
        return this;
    }

    public setCobundledPlanFlag(cobundledPlanFlag: string): FilterOption {
        this.cobundledPlanFlag = cobundledPlanFlag;
        return this;
    }

    public getCobundledPlanFlag() {
        return this.cobundledPlanFlag;
    }


}

export class FilterItem implements FilterItemInterface {
    list: FilterOption[];
    type: string;
    divider: boolean;
    multi: boolean;
    sortBy?: boolean;
    selectEveryOnAll?: boolean;
    selectAllOnEvery?: boolean;
    headerText: string;
    hideToggle: boolean;
    expanded: boolean;
    disabled: boolean;
    disableRipple: boolean;
    collapsedHeight: string;
    expandedHeight: string;
    titlecase: boolean;
    model?: string;
    defaultModel?: string;
    selectedOptions?: MatListOption[];
    hide?: boolean;
    disableOnAll?: boolean;
    hideHeader?: boolean;
    className?: string;

    getList(): FilterOptionInterface[] {
        return this.list;
    }

    setList(list: FilterOptionInterface[]): FilterItem {
        this.list = list;
        return this;
    }

    getType(): string {
        return this.type;
    }

    setType(type: string): FilterItem {
        this.type = type;
        return this;
    }

    getDivider(): boolean {
        return this.divider;
    }

    setDivider(divider: boolean): FilterItem {
        this.divider = divider;
        return this;
    }

    getMulti(): boolean {
        return this.multi;
    }

    setMulti(multi: boolean): FilterItem {
        this.multi = multi;
        return this;
    }

    getSortBy(): boolean {
        return this.sortBy;
    }

    setSortBy(sortBy: boolean): FilterItem {
        this.sortBy = sortBy;
        return this;
    }

    getSelectEveryOnAll(): boolean {
        return this.selectEveryOnAll;
    }

    setSelectEveryOnAll(selectEveryOnAll: boolean): FilterItem {
        this.selectEveryOnAll = selectEveryOnAll;
        return this;
    }

    getSelectAllOnEvery(): boolean {
        return this.selectAllOnEvery;
    }

    setSelectAllOnEvery(selectAllOnEvery: boolean): FilterItem {
        this.selectAllOnEvery = selectAllOnEvery;
        return this;
    }

    getHeaderText(): string {
        return this.headerText;
    }

    setHeaderText(headerText: string): FilterItem {
        this.headerText = headerText;
        return this;
    }

    getHideToggle(): boolean {
        return this.hideToggle;
    }

    setHideToggle(hideToggle: boolean): FilterItem {
        this.hideToggle = hideToggle;
        return this;
    }

    getExpanded(): boolean {
        return this.expanded;
    }

    setExpanded(expanded: boolean): FilterItem {
        this.expanded = expanded;
        return this;
    }

    getDisabled(): boolean {
        return this.disabled;
    }

    setDisabled(disabled: boolean): FilterItem {
        this.disabled = disabled;
        return this;
    }

    getDisableRipple(): boolean {
        return this.disableRipple;
    }

    setDisableRipple(disableRipple: boolean): FilterItem {
        this.disableRipple = disableRipple;
        return this;
    }

    getCollapsedHeight(): string {
        return this.collapsedHeight;
    }

    setCollapsedHeight(collapsedHeight: string): FilterItem {
        this.collapsedHeight = collapsedHeight;
        return this;
    }

    getExpandedHeight(): string {
        return this.expandedHeight;
    }

    setExpandedHeight(expandedHeight: string): FilterItem {
        this.expandedHeight = expandedHeight;
        return this;
    }

    getTitlecase(): boolean {
        return this.titlecase;
    }

    setTitlecase(titlecase: boolean): FilterItem {
        this.titlecase = titlecase;
        return this;
    }

    getModel(): string {
        return this.model;
    }

    setModel(model: string): FilterItem {
        this.model = model;
        return this;
    }

    getDefaultModel(): string {
        return this.defaultModel;
    }

    setDefaultModel(defaultModel: string): FilterItem {
        this.defaultModel = defaultModel;
        return this;
    }

    getSelectedOptions(): MatListOption[] {
        return this.selectedOptions;
    }

    setSelectedOptions(selectedOptions: MatListOption[]): FilterItem {
        this.selectedOptions = selectedOptions;
        return this;
    }

    getHide(): boolean {
        return this.hide;
    }

    setHide(hide: boolean): FilterItem {
        this.hide = hide;
        return this;
    }

    getDisableOnAll(): boolean {
        return this.disableOnAll;
    }

    setDisableOnAll(disableOnAll: boolean): FilterItem {
        this.disableOnAll = disableOnAll;
        return this;
    }

    getHideHeader(): boolean {
        return this.hideHeader;
    }

    setHideHeader(hideHeader: boolean): FilterItem {
        this.hideHeader = hideHeader;
        return this;
    }

    getClassName(): string {
        return this.className;
    }

    setClassName(className: string): FilterItem {
        this.className = className;
        return this;
    }
}

export class Filter implements FilterInterface {
    items: FilterItem[];
    hasSearch: boolean;
    searchPlaceHolder?: string;
    searchDataList?: SearchDataList[];
    dontEmitOnInit?: boolean;
    saveFilterState?: boolean;
    closeAccordionOnBack?: boolean;
    filterStatePropName?: string;
    error?: FilterErrorMessage;
}

export class FilterErrorMessage implements FilterErrorMessageInterface {
    START_DATE_INCORRECT_FORMAT_MSG: string;
    START_DATE_PRIOR_TWO_YEARS_MSG: string;
    END_DATE_INCORRECT_FORMAT_MSG: string;
    END_DATE_PRIOR_TWO_YEARS_MSG: string;
    END_DATE_PRIOR_START_DATE_MSG: string;
}

export class SearchDataList implements SearchDataListInterface {
    data: Object[];
    property: string[];
}

export class FilterRadioChange implements FilterRadioChangeInterface {
    selectedOption: MatRadioChange;
    filterItemNumber: number;
}

export class FilterCheckboxChange implements FilterCheckboxChangeInterface {
    selectedOption: MatSelectionListChange;
    selectedOptions: MatListOption[];
    filterItemNumber: number;
}

export class FilterSelectionItem implements FilterSelectionItemInterface {
    selectedOption?: FilterOption;
    selectedOptions?: FilterOption[];
    filterItemNumber: number;
}

export class FilterSelection implements FilterSelectionInterface {
    searchVal?: string;
    selections: FilterSelectionItem[];
}

export class FilterToggle implements FilterToggleInterface {
    toggle: string;
}

