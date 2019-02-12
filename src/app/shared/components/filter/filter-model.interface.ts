import { MatSelectionListChange, MatRadioChange, MatListOption } from '@angular/material';

export interface FilterOptionInterface {
    name?: string;
    memSuffix?: string;
    loggedinUserSuffix?: string;
    depSuffix?: string;
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
    cobundledPlanFlag: string;

    getSubscrberNo(): string;
    setSubscriberNo(subscriberNo: string): FilterOptionInterface;

    getCoverageType(): string;
    setCoverageType(coverageType: string): FilterOptionInterface;

    getDepSuffix(): string;
    setDepSuffix(depSuffix: string): FilterOptionInterface;

    getLoggedinUserSuffix(): string;
    setLoggedinUserSuffix(loggedinUserSuffix: string): FilterOptionInterface;

    getMemSuffix(): string;
    setMemSuffix(memSuffix: string): FilterOptionInterface;

    getName(): string;
    setName(name: string): FilterOptionInterface;

    getText(): string;
    setText(text: string): FilterOptionInterface;

    getValue(): any;
    setValue(value: any): FilterOptionInterface;

    getSelected(): boolean;
    setSelected(selected: boolean): FilterOptionInterface;

    getDisabled(): boolean;
    setDisabled(disabled: boolean): FilterOptionInterface;

    getCount(): number;
    setCount(count: number): FilterOptionInterface;

    getFromDate(): string;
    setFromDate(fromDate: string): FilterOptionInterface;

    getToDate(): string;
    setToDate(toDate: string): FilterOptionInterface;

    getIsCustomDateRangeInValid(): boolean;
    setIsCustomDateRangeInValid(isCustomDateRangeInValid: boolean): FilterOptionInterface;

    getIsSelectedDateInvalid(): boolean;
    setIsSelectedDateInvalid(isSelectedDateInvalid: boolean): FilterOptionInterface;

    getError(): boolean;
    setError(error: boolean): FilterOptionInterface;

    getDateFormat(): string;
    setDateFormat(dateFormat: string): FilterOptionInterface;

    getClassName(): string;
    setClassName(className: string): FilterOptionInterface;

    setCobundledPlanFlag(cobundledPlanFlag: string): FilterOptionInterface;
    getCobundledPlanFlag(): string;
}

export interface FilterItemInterface {
    list: FilterOptionInterface[];
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

    getList(): FilterOptionInterface[];
    setList(list: FilterOptionInterface[]): FilterItemInterface;

    getType(): string;
    setType(type: string): FilterItemInterface;

    getDivider(): boolean;
    setDivider(divider: boolean): FilterItemInterface;

    getMulti(): boolean;
    setMulti(multi: boolean): FilterItemInterface;

    getSortBy(): boolean;
    setSortBy(sortBy: boolean): FilterItemInterface;

    getSelectEveryOnAll(): boolean;
    setSelectEveryOnAll(selectEveryOnAll: boolean): FilterItemInterface;

    getSelectAllOnEvery(): boolean;
    setSelectAllOnEvery(selectAllOnEvery: boolean): FilterItemInterface;

    getHeaderText(): string;
    setHeaderText(headerText: string): FilterItemInterface;

    getHideToggle(): boolean;
    setHideToggle(hideToggle: boolean): FilterItemInterface;

    getExpanded(): boolean;
    setExpanded(expanded: boolean): FilterItemInterface;

    getDisabled(): boolean;
    setDisabled(disabled: boolean): FilterItemInterface;

    getDisableRipple(): boolean;
    setDisableRipple(disableRipple: boolean): FilterItemInterface;

    getCollapsedHeight(): string;
    setCollapsedHeight(collapsedHeight: string): FilterItemInterface;

    getExpandedHeight(): string;
    setExpandedHeight(expandedHeight: string): FilterItemInterface;

    getTitlecase(): boolean;
    setTitlecase(titlecase: boolean): FilterItemInterface;

    getModel(): string;
    setModel(model: string): FilterItemInterface;

    getDefaultModel(): string;
    setDefaultModel(defaultModel: string): FilterItemInterface;

    getSelectedOptions(): MatListOption[];
    setSelectedOptions(selectedOptions: MatListOption[]): FilterItemInterface;

    getHide(): boolean;
    setHide(hide: boolean): FilterItemInterface;

    getDisableOnAll(): boolean;
    setDisableOnAll(disableOnAll: boolean): FilterItemInterface;

    getHideHeader(): boolean;
    setHideHeader(hideHeader: boolean): FilterItemInterface;

    getClassName(): string;
    setClassName(className: string): FilterItemInterface;

}

export interface FilterInterface {
    items: FilterItemInterface[];
    hasSearch: boolean;
    searchPlaceHolder?: string;
    searchDataList?: SearchDataListInterface[];
    dontEmitOnInit?: boolean;
    saveFilterState?: boolean;
    closeAccordionOnBack?: boolean;
    filterStatePropName?: string;
    error?: FilterErrorMessageInterface;
}

export interface FilterErrorMessageInterface {
    START_DATE_INCORRECT_FORMAT_MSG: string;
    START_DATE_PRIOR_TWO_YEARS_MSG: string;
    END_DATE_INCORRECT_FORMAT_MSG: string;
    END_DATE_PRIOR_TWO_YEARS_MSG: string;
    END_DATE_PRIOR_START_DATE_MSG: string;
}

export interface SearchDataListInterface {
    data: Object[];
    property: string[];
}

export interface FilterRadioChangeInterface {
    selectedOption: MatRadioChange;
    filterItemNumber: number;
}

export interface FilterCheckboxChangeInterface {
    selectedOption: MatSelectionListChange;
    selectedOptions: MatListOption[];
    filterItemNumber: number;
}

export interface FilterSelectionItemInterface {
    selectedOption?: FilterOptionInterface;
    selectedOptions?: FilterOptionInterface[];
    filterItemNumber: number;
}

export interface FilterSelectionInterface {
    searchVal?: string;
    selections: FilterSelectionItemInterface[];
}

export interface FilterToggleInterface {
    toggle: string;
}

