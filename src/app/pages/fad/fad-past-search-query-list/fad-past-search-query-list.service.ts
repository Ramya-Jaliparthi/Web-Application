import { Injectable } from '@angular/core';
import { FadVitalsSearchHistoryResponseModelInterface } from '../modals/interfaces/fad-vitals-collection.interface';
import { Observable } from 'rxjs/Observable';
import { FadConstants } from '../constants/fad.constants';
import { BcbsmaHttpService } from '../../../shared/services/bcbsma-http.service';
import { FadLandingPageSearchControlValuesInterface } from '../modals/interfaces/fad-landing-page.interface';

@Injectable()
export class FadPastSearchQueryListService {

  public searchControlValues: FadLandingPageSearchControlValuesInterface = null;

  constructor(private bcbsmaHttpService: BcbsmaHttpService) { }

  getVitalsSearchHistory(): Observable<FadVitalsSearchHistoryResponseModelInterface> {
    const url = FadConstants.jsonurls.fadSearchHistoryUrl;
    return this.bcbsmaHttpService.get(url);
  }
}
