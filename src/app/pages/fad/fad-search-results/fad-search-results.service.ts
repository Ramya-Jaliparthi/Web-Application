// import { FadSearchRequestByProfessionalModelInterface } from './../modals/interfaces/fad-vitals-collection.interface';
import { Injectable } from '@angular/core';
import { FadLandingPageSearchControlValuesInterface } from '../modals/interfaces/fad-landing-page.interface';
import { Observable } from 'rxjs/Observable';
// import { FadVitalsProfessionalsSearchResponseModelInterface } from '../modals/interfaces/fad-vitals-collection.interface';
import { FadConstants } from '../constants/fad.constants';
// import { BcbsmaHttpService } from '../../../shared/services/bcbsma-http.service';
import {
  GetSearchByProfessionalRequestModelInterface,
  GetSearchByProfessionalResponseModelInterface
} from '../modals/interfaces/getSearchByProfessional-models.interface';
import { AuthHttp } from '../../../shared/services/authHttp.service';
import { FadLandingPageSearchControlValues, FadAutoCompleteComplexOption } from '../modals/fad-landing-page.modal';
import {
  GetSearchByFacilityRequestModelInterface,
  GetSearchByFacilityResponseModelInterface
} from '../modals/interfaces/getSearchByFacility-models.interface';
import { FZCSRCity } from '../modals/fad-vitals-collection.model';
import * as cloneDeep from 'lodash/cloneDeep';

@Injectable()
export class FadSearchResultsService {

  private searchCriteria: FadLandingPageSearchControlValuesInterface;
  public searchResultCache: GetSearchByProfessionalResponseModelInterface = null;
  public facilityResultCache: GetSearchByFacilityResponseModelInterface = null;
  private lastSelectedSearchTextOption: FadAutoCompleteComplexOption = null;
  private lastSelectedZipCodeOption: FZCSRCity = null;
public getLocalStorageZipCodeOption: any;
  private setLocalStorageZipCodeOption: FZCSRCity = null;

  constructor(private http: AuthHttp) { }

  public getLastSelectedSearchTextOption(): FadAutoCompleteComplexOption {
    // <FadAutoCompleteComplexOption>this.lastSelectedSearchTextOption;
    return this.lastSelectedSearchTextOption ?
      Object.assign(Object.create(new FadAutoCompleteComplexOption()), this.lastSelectedSearchTextOption)
      : this.lastSelectedSearchTextOption;
  }

  public setLastSelectedSearchTextOption(lastSelectedSearchTextOption: FadAutoCompleteComplexOption): FadSearchResultsService {
    const modelEnforcedSearchTextOption = lastSelectedSearchTextOption ?
      Object.assign(Object.create(new FadAutoCompleteComplexOption()), lastSelectedSearchTextOption) : lastSelectedSearchTextOption;
    this.lastSelectedSearchTextOption = modelEnforcedSearchTextOption;
    return this;
  }

  public getLastSelectedZipCodeOption(onNewSessionPageLoad?: boolean): FZCSRCity {
    // this.getLocalStorageZipCodeOption = localStorage.getItem('zipcode');
    return onNewSessionPageLoad ? localStorage.getItem('zipcode') : this.lastSelectedZipCodeOption ?
      Object.assign(Object.create(new FZCSRCity()), this.lastSelectedZipCodeOption) :
      this.lastSelectedZipCodeOption; // <FZCSRCity>this.lastSelectedZipCodeOption;
  }

  public setLastSelectedZipCodeOption(lastSelectedZipCodeOption: FZCSRCity): FadSearchResultsService {
    const modelEnforcedZipCodeOption = lastSelectedZipCodeOption ?
      Object.assign(Object.create(new FZCSRCity()), lastSelectedZipCodeOption) : lastSelectedZipCodeOption;
    this.lastSelectedZipCodeOption = modelEnforcedZipCodeOption;

    // if (!lastSelectedZipCodeOption) {
    //   //this.getLastSelectedZipCodeOption();
    //   this.getLocalStorageZipCodeOption = localStorage.getItem('zipcode');
    //   this.lastSelectedZipCodeOption = this.getLocalStorageZipCodeOption;
    //   console.log("localStorage zip", this.lastSelectedZipCodeOption);
    // }
    if (this.lastSelectedZipCodeOption) {
      localStorage.setItem('zipcode', JSON.stringify(this.lastSelectedZipCodeOption));
    }
    return this;
  }

  public getSearchCriteria(): FadLandingPageSearchControlValuesInterface {
    if (!this.searchCriteria) {
      const cachedSearchCriteria = <FadLandingPageSearchControlValues>JSON.parse(sessionStorage.getItem('FadLandingPageSearchCriteria'));
      if (cachedSearchCriteria) {
        //  console.log('dumm dumm',cloneDeep(cachedSearchCriteria),new FadLandingPageSearchControlValues(),Object.assign(new FadLandingPageSearchControlValues(), cloneDeep(cachedSearchCriteria)));
        this.searchCriteria = Object.assign(new FadLandingPageSearchControlValues(), cloneDeep(cachedSearchCriteria));
      } else {
        this.searchCriteria = null;
      }
    }
    return <FadLandingPageSearchControlValuesInterface>this.searchCriteria;
  }

  public setSearchCriteria(searchCriteria: FadLandingPageSearchControlValuesInterface): FadSearchResultsService {

    // check if the last selected option and the text value in the search text field are the same.
    // if yes use the object reference for last selected option in memory
    if (this.lastSelectedSearchTextOption && searchCriteria.getSearchText()
      && searchCriteria.getSearchText().getSimpleText().toUpperCase().trim()
      === this.lastSelectedSearchTextOption.getSimpleText().toUpperCase().trim()) {
      searchCriteria.setSearchText(this.lastSelectedSearchTextOption);
    }

    this.searchCriteria = searchCriteria;
    sessionStorage.setItem('FadLandingPageSearchCriteria', JSON.stringify(searchCriteria));
    return this;
  }

  public getFadProfileSearchResults(vitalsSearchRequestbyProfessional: GetSearchByProfessionalRequestModelInterface,
    scroll: boolean = false)
    : Observable<GetSearchByProfessionalResponseModelInterface> {

    let useGlobalSpinner = true;
    if (scroll) {
      useGlobalSpinner = false;
    }

    return this.http.encryptPost(
      FadConstants.urls.fadLandingPageProfessionalsSearchListUrl, vitalsSearchRequestbyProfessional,
      '', '', useGlobalSpinner).map(response => {
        return <GetSearchByProfessionalResponseModelInterface>response;
      });
  }

  public getFadFacilitySearchResults(vitalsSearchRequestbyProfessional: GetSearchByFacilityRequestModelInterface, scroll: boolean = false)
    : Observable<GetSearchByFacilityResponseModelInterface> {

    let useGlobalSpinner = true;
    if (scroll) {
      useGlobalSpinner = false;
    }

    return this.http.encryptPost(
      FadConstants.urls.fadLandingPageFacilitiesSearchListUrl, vitalsSearchRequestbyProfessional,
      '', '', useGlobalSpinner).map(response => {
        return <GetSearchByFacilityResponseModelInterface>response;
      });
  }

}
