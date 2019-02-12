import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BcbsmaHttpService } from '../../../shared/services/bcbsma-http.service';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
import { FadConstants } from '../constants/fad.constants';

@Injectable()
export class FadCostBreakdownService {

  constructor(private bcbsmaHttpService: BcbsmaHttpService) { }

  public getCostBreakDown() {
    const url = FadConstants.jsonurls.fadCostBreakDownUrl;
    // FadConstants.api.fadUrl + FadConstants.urls.fadCostBreakDownUrl : 
    return this.bcbsmaHttpService.get(url);
  }

}
