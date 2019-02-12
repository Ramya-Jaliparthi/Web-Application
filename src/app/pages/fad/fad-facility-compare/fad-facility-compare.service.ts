import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BcbsmaHttpService } from '../../../shared/services/bcbsma-http.service';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
import { FadConstants } from '../constants/fad.constants';
import { GetSearchByProfessionalResponseModelInterface } from '../modals/interfaces/getSearchByProfessional-models.interface';
// import { FadVitalsFacilitiesSearchResponseModelInterface } from '../modals/interfaces/fad-vitals-collection.interface';

@Injectable()
export class FadFacilityCompareService {

  public searchResults: GetSearchByProfessionalResponseModelInterface;
  public searchData;

  constructor(private bcbsmaHttpService: BcbsmaHttpService) { }

  getCompareTableDetail() {
    // console.log('Value from Serach thorugh getSearchResult:', this.getSearchResult());
    const url = FadConstants.jsonurls.fadFacilityCompareUrl;
    // FadConstants.api.fadUrl + FadConstants.urls.fadFacilityCompareUrl : 
    return this.bcbsmaHttpService.get(url);
  }

  setSearchResult(searchResults) {
    this.searchResults = searchResults;
  }

  getSearchResult() {
    return this.searchResults;
  }


}
