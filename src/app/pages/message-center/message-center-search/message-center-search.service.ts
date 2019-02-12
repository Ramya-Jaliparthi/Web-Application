import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BcbsmaHttpService } from '../../../shared/services/bcbsma-http.service';
import { MessageDetailsSearchResponseModel } from '../modals/message-center-search.model';
import { MessageDetailsSearchResponseModelInterface } from '../modals/interfaces/message-center-search.interface';

@Injectable()
export class MessageCenterSearchService {

  public cachedSearchCriteriaData: MessageDetailsSearchResponseModelInterface;
  public isPersistSearchCriteria: boolean = false;

  constructor(private bcbsmaHttpService: BcbsmaHttpService) { }

  getSearchFilters(): Observable<MessageDetailsSearchResponseModel> {
    const MESSAGE_CENTER_SEARCH_FILTERS_URL = '/assets/data/messageCenterModule/messageListingComponent_SampleData.json';
    return this.bcbsmaHttpService.get(MESSAGE_CENTER_SEARCH_FILTERS_URL);
  }

}
