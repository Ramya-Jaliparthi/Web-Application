import { SearchCriteriaItem } from '../filter-search-all-transaction.model';
import { HashMapInterface } from './all-transaction.interface';

export interface FilterSearchAllTransaction {
  mobileHideByFilterOverlay: boolean;
  searchCriteriaData: TransactionDetailsSearchResponseModelInterface;
  createSearchCriteria(): void;
  onSearch(searchFilterOptions: AllTransactionSearchCompOutputModelInterface): void;
}

export interface AllTransactionSearchCompOutputModelInterface {
  searchCriteriaData: TransactionDetailsSearchResponseModelInterface;
  filterOverlayFlag: boolean;
}

export interface AllTransactionSearchFilterDateRanges {
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

export interface TransactionDetailsSearchResponseModelInterface {
  keywordToSearch: string;
  keywordList: string[];
  matchingKeywords: string[];

  dateFilterCustomStartDate: string;
  dateFilterCustomEndDate: string;

  sortByFilterMap: HashMapInterface<SearchCriteriaItemInterface>;
  categoryFilterMap: HashMapInterface<SearchCriteriaItemInterface>;
  dateFilterMap: HashMapInterface<SearchCriteriaItemInterface>;

  addSortByFilter(searchCriteriaItem: SearchCriteriaItem): TransactionDetailsSearchResponseModelInterface;
  addCategoryFilter(searchCriteriaItem: SearchCriteriaItem): TransactionDetailsSearchResponseModelInterface;
  addDateFilter(searchCriteriaItem: SearchCriteriaItem): TransactionDetailsSearchResponseModelInterface;
}
