import { Injectable } from '@angular/core';
import { FadConstants } from '../constants/fad.constants';
import { Observable } from 'rxjs/Observable';
import { BcbsmaHttpService } from '../../../shared/services/bcbsma-http.service';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
// import { FadVitalsProfessionalsSearchResponseModelInterface } from '../modals/interfaces/fad-vitals-collection.interface';
import { FadSearchResultsService } from '../fad-search-results/fad-search-results.service';
import { GetSearchByProfessionalResponseModelInterface } from '../modals/interfaces/getSearchByProfessional-models.interface';


@Injectable()
export class FadFacilityListService {

  private selectedId: any;


  constructor(private bcbsmaHttpService: BcbsmaHttpService, private errorHandler: BcbsmaerrorHandlerService,
    private searchResultsService: FadSearchResultsService) { }

  getProfessionalsInfo(): GetSearchByProfessionalResponseModelInterface {
    return this.searchResultsService.searchResultCache;
  }

  onMapContainerCreated(): Observable<Element> {
    return Observable
      .interval(500)
      .flatMap(() => {
        return document.querySelectorAll('#' + FadConstants.elementRef.fadSearchListMapContent);
      });
  }

  setSelectedId(selectedId) {
    this.selectedId = selectedId;
  }
  getSelectedId() {
    return this.selectedId;
  }
}
