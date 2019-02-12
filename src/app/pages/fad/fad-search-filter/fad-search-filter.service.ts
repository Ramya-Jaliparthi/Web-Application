import { Injectable } from '@angular/core';
import { BcbsmaHttpService } from '../../../shared/services/bcbsma-http.service';
import { FadSearchFilterResponseModelInterface } from '../modals/interfaces/fad-search-filter.interface';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FadSearchFilterService {

  constructor(private bcbsmaHttpService: BcbsmaHttpService) { }

  getSearchFilters(): Observable<FadSearchFilterResponseModelInterface> {
    const FAD_SEARCH_FILTERS_URL = '/assets/data/messageCenterModule/messageListingComponent_SampleData.json';
    return this.bcbsmaHttpService.get(FAD_SEARCH_FILTERS_URL);
  }

}
