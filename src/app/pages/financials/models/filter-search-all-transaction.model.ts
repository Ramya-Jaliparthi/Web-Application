import {
  SearchCriteriaItemInterface,
  AllTransactionSearchCompOutputModelInterface,
  TransactionDetailsSearchResponseModelInterface
} from './interfaces/filter-search-all-transaction.interface';
import { HashMap } from '../utils/all-transaction.utilities';
import * as moment from 'moment';

export class SearchCriteriaItem implements SearchCriteriaItemInterface {
  public criteriaName: string;
  public criteriaSelected: boolean = false;
  public matchingResultsCount?: number;

  public setCriteriaName(criteriaName: string): SearchCriteriaItem {
    this.criteriaName = criteriaName;
    return this;
  }

  public setCriteriaSelected(criteriaSelected: boolean): SearchCriteriaItem {
    this.criteriaSelected = criteriaSelected;
    return this;
  }

  public setMatchingResultsCount(matchingResultsCount: number): SearchCriteriaItem {
    this.matchingResultsCount = matchingResultsCount;
    return this;
  }
}

export class TransactionDetailsSearchResponseModel implements TransactionDetailsSearchResponseModelInterface {
  public keywordToSearch: string;
  public keywordList: string[];
  public matchingKeywords: string[];

  public dateFilterCustomStartDate: string;
  public dateFilterCustomEndDate: string;

  public sortByFilterMap: HashMap<SearchCriteriaItem> = new HashMap<SearchCriteriaItem>();
  public categoryFilterMap: HashMap<SearchCriteriaItem> = new HashMap<SearchCriteriaItem>();
  public dateFilterMap: HashMap<SearchCriteriaItem> = new HashMap<SearchCriteriaItem>();

  constructor() {
    this.dateFilterCustomStartDate = moment().format('L');
  }

  public addSortByFilter(searchCriteriaItem: SearchCriteriaItem): TransactionDetailsSearchResponseModel {
    this.sortByFilterMap.put(searchCriteriaItem.criteriaName, searchCriteriaItem);
    return this;
  }

  public addCategoryFilter(searchCriteriaItem: SearchCriteriaItem): TransactionDetailsSearchResponseModel {
    this.categoryFilterMap.put(searchCriteriaItem.criteriaName, searchCriteriaItem);
    return this;
  }

  public addDateFilter(searchCriteriaItem: SearchCriteriaItem): TransactionDetailsSearchResponseModel {
    this.dateFilterMap.put(searchCriteriaItem.criteriaName, searchCriteriaItem);

    return this;
  }
}

export class AllTransactionSearchCompOutputModel implements AllTransactionSearchCompOutputModelInterface {
  searchCriteriaData: TransactionDetailsSearchResponseModelInterface;
  filterOverlayFlag: boolean = false;
}


