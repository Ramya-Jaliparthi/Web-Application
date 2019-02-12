import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BcbsmaHttpService } from '../../../shared/services/bcbsma-http.service';
import { TransactionDetailsSearchResponseModel } from '../models/filter-search-all-transaction.model';
import { TransactionDetailsSearchResponseModelInterface } from '../models/interfaces/filter-search-all-transaction.interface';

@Injectable()
export class FilterAlltransactionService {

  public cachedSearchCriteriaData: TransactionDetailsSearchResponseModelInterface;
  public isPersistSearchCriteria: boolean = false;

  constructor(private bcbsmaHttpService: BcbsmaHttpService) { }

  getSearchFilters(): Observable<TransactionDetailsSearchResponseModel> {
    const MESSAGE_CENTER_SEARCH_FILTERS_URL = '/assets/data/messageCenterModule/messageListingComponent_SampleData.json';
    return this.bcbsmaHttpService.get(MESSAGE_CENTER_SEARCH_FILTERS_URL);
  }

}
