import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BcbsmaHttpService } from '../../../shared/services/bcbsma-http.service';
import { GetSearchByProfessionalResponseModelInterface } from '../modals/interfaces/getSearchByProfessional-models.interface';
// import { HttpHeaders, HttpParams } from '@angular/common/http';
// import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
// import { FadConstants } from '../constants/fad.constants';
// import { FadVitalsProfessionalsSearchResponseModelInterface } from '../modals/interfaces/fad-vitals-collection.interface';

@Injectable()
export class FadCompareTableService {

  public searchResults: GetSearchByProfessionalResponseModelInterface;
  public searchData;

  constructor(private bcbsmaHttpService: BcbsmaHttpService) { }

  public getCompareTableDetail(): Observable<GetSearchByProfessionalResponseModelInterface> {
    console.log('Value from Serach thorugh getSearchResult:', this.getSearchResult());
    // const url =
    // (FadConstants.api.switchToApiUrlFromJsonFile) ?
    // FadConstants.api.fadUrl+FadConstants.urls.fadCompareTablePage : FadConstants.jsonurls.fadCompareTableUrl;
    // return this.bcbsmaHttpService.get(url);
    // this.searchData=this.getSearchResult();
    // return this.searchData;
    return null;
  }

  setSearchResult(searchResults) {
    this.searchResults = searchResults;
  }

  getSearchResult() {
    return this.searchResults;
  }


}
