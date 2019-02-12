import { MatSelectionListChange, MatRadioChange, MatListOption } from '@angular/material';

export interface FilterOptionInterface {
    text: string;
    value: any;
    selected: boolean;
    disabled: boolean;
    count?: number;
    fromDate?: string;
    toDate?: string;
    isCustomDateRangeInValid?: boolean;
    isSelectedDateInvalid?: boolean;
    dateFormat?: string;
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
    selectedOptions?: MatListOption[];
    hide?: boolean;
    disableOnAll?: boolean;
}

export interface FilterInterface {
    items: FilterItemInterface[];
    hasSearch: boolean;
    searchPlaceHolder?: string;
    searchDataList?: SearchDataListInterface[];
    dontEmitOnInit?: boolean;
    saveFilterState?: boolean;
    filterStatePropName?: string;
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

