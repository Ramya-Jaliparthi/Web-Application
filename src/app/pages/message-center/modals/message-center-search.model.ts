import {
    SearchCriteriaItemInterface,
    MessageDetailsSearchResponseModelInterface,
    MessageCenterSearchCompOutputModelInterface
} from './interfaces/message-center-search.interface';
import * as moment from 'moment';
import { HashMap } from '../../../shared/models/hash-map.model';

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

export class MessageDetailsSearchResponseModel implements MessageDetailsSearchResponseModelInterface {
    public keywordToSearch: string;
    public keywordList: string[];
    public matchingKeywords: string[];

    public dateFilterCustomStartDate: string;
    public dateFilterCustomEndDate: string;

    public sortByFilterMap: HashMap<SearchCriteriaItem> = new HashMap<SearchCriteriaItem>();
    public categoryFilterMap: HashMap<SearchCriteriaItem> = new HashMap<SearchCriteriaItem>();
    public dateFilterMap: HashMap<SearchCriteriaItem> = new HashMap<SearchCriteriaItem>();

    constructor() {
        this.dateFilterCustomEndDate = moment().format('L');
    }

    public addSortByFilter(searchCriteriaItem: SearchCriteriaItem): MessageDetailsSearchResponseModel {
        this.sortByFilterMap.put(searchCriteriaItem.criteriaName, searchCriteriaItem);
        return this;
    }

    public addCategoryFilter(searchCriteriaItem: SearchCriteriaItem): MessageDetailsSearchResponseModel {
        this.categoryFilterMap.put(searchCriteriaItem.criteriaName, searchCriteriaItem);
        return this;
    }

    public addDateFilter(searchCriteriaItem: SearchCriteriaItem): MessageDetailsSearchResponseModel {
        this.dateFilterMap.put(searchCriteriaItem.criteriaName, searchCriteriaItem);

        return this;
    }
}

export class MessageCenterSearchCompOutputModel implements MessageCenterSearchCompOutputModelInterface {
    searchCriteriaData: MessageDetailsSearchResponseModelInterface;
    filterOverlayFlag: boolean = false;
    applyFilter?: boolean = false;
}


