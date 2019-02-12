import { SearchCriteriaItem } from '../message-center-search.model';
import { HashMapInterface } from '../../../../shared/models/interfaces/hash-map.interface';

export interface MessageCenterSearchFilterConsumer {
    mobileHideByFilterOverlay: boolean;
    searchCriteriaData: MessageDetailsSearchResponseModelInterface;
    createSearchCriteria(): void;
    onSearch(searchFilterOptions: MessageCenterSearchCompOutputModelInterface): void;
}

export interface MessageCenterSearchCompOutputModelInterface {
    searchCriteriaData: MessageDetailsSearchResponseModelInterface;
    filterOverlayFlag: boolean;
    applyFilter?: boolean;
}

export interface MessageCenterSearchFilterDateRanges {
    last_30_days: number;
    last_60_days: number;
    last_90_days: number;
    year_to_date: number;
    all_dates: number;
}

export interface SearchCriteriaItemInterface {
    criteriaName: string;
    criteriaSelected: boolean;
    matchingResultsCount?: number;

    setCriteriaName(criteriaName: string): SearchCriteriaItemInterface;
    setCriteriaSelected(criteriaSelected: boolean): SearchCriteriaItemInterface;
    setMatchingResultsCount(matchingResultsCount: number): SearchCriteriaItemInterface;
}

export interface MessageDetailsSearchResponseModelInterface {
    keywordToSearch: string;
    keywordList: string[];
    matchingKeywords: string[];

    dateFilterCustomStartDate: string;
    dateFilterCustomEndDate: string;

    sortByFilterMap: HashMapInterface<SearchCriteriaItemInterface>;
    categoryFilterMap: HashMapInterface<SearchCriteriaItemInterface>;
    dateFilterMap: HashMapInterface<SearchCriteriaItemInterface>;

    addSortByFilter(searchCriteriaItem: SearchCriteriaItem): MessageDetailsSearchResponseModelInterface;
    addCategoryFilter(searchCriteriaItem: SearchCriteriaItem): MessageDetailsSearchResponseModelInterface;
    addDateFilter(searchCriteriaItem: SearchCriteriaItem): MessageDetailsSearchResponseModelInterface;
}
