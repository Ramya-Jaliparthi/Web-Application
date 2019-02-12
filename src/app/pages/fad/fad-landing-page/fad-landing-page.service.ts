import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BcbsmaHttpService } from '../../../shared/services/bcbsma-http.service';
import {
  // FadVitalsAutoCompleteSearchRequestModelInterface,
  // FadVitalsAutoCompleteSearchResponseModelInterface,
  FadZipCodeSearchResponseModelInterface,
  FadPlanSearchResponseModelInterface,
  // FadVitalsSearchHistoryResponseModelInterface,
  // FadVitalsZipCodeSearchRequestModelInterface,
  DoctorProfileSearchRequestModelInterface,
  // FadVitalsProfessionalsSearchResponseModelInterface,
  // FacilityProfileSearchRequestModelInterface,
  // FadVitalsFacilitiesSearchResponseModelInterface,
  FADPlanSearchRequestModelInterface,
  FadVitalsZipCodeSearchRequestModelInterface,
  FacilityProfileSearchRequestModelInterface
} from '../modals/interfaces/fad-vitals-collection.interface';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import {
  FadLandingPageSearchControlsModelInterface,
  FadLandingPageSearchControlValuesInterface,
  // FadAutoCompleteOptionForSearchTextInterface,
  LandingPageResponseCacheModelInterface
} from '../modals/interfaces/fad-landing-page.interface';
import {
  FadLandingPageSearchControlsModel, FadLandingPageSearchControlValues, FadAutoCompleteOptionForSearchText,
  // FadAutoCompleteOptionForSearchText
} from '../modals/fad-landing-page.modal';
import { FadConstants } from '../constants/fad.constants';
import { ConstantsService, AuthService } from '../../../shared/shared.module';
import { LeafLetResponseModelInterface } from '../modals/interfaces/leaflet-model.interface';
import { AuthHttp, IRequestOptions } from '../../../shared/services/authHttp.service';
import {
  GetSearchByProfessionalResponseModelInterface,
  // GetSearchByProfessionalRequestModelInterface
} from '../modals/interfaces/getSearchByProfessional-models.interface';
import { FadZipCodeSearchResponseModel, FZCSRCity } from '../modals/fad-vitals-collection.model';
import {
  GetSearchByProviderResponseModelInterface,
  GetSearchByProviderRequestModelInterface
} from '../modals/interfaces/getSearchByProvider-models.interface';
import { FadSearchResultsService } from '../fad-search-results/fad-search-results.service';
import {
  GetSearchByFacilityResponseModelInterface,
  GetSearchByFacilityRequestModelInterface
} from '../modals/interfaces/getSearchByFacility-models.interface';
import { HashMapInterface } from '../../financials/models';
import { HashMap } from '../../financials/utils/all-transaction.utilities';


@Injectable()
export class FadLandingPageService {

  public vitalsZipCodeInfo: FadZipCodeSearchResponseModelInterface = null;
  public cachedResponse: LandingPageResponseCacheModelInterface = null;
  // private httpOptions = {
  //   headers: new HttpHeaders({
  //     'Accept': 'application/json',
  //     'Content-Type': 'application/json',
  //     'Authorization': 'my-auth-token'
  //   })
  // };

  private cachedSearchControlState: FadLandingPageSearchControlsModelInterface = null;
  private cachedSearchTextLookupOptions: HashMapInterface<FadAutoCompleteOptionForSearchText[]>
    = new HashMap<FadAutoCompleteOptionForSearchText[]>();
  private cachedZipCodeLookupOptions: HashMapInterface<FZCSRCity[]>
    = new HashMap<FZCSRCity[]>();

  public showAutoCompleteDropDownSpinner: boolean = false;

  constructor(private bcbsmaHttpService: BcbsmaHttpService, private http: AuthHttp, private authService: AuthService,
    private constants: ConstantsService, private fadSearchResultsService: FadSearchResultsService) { }

  public getCachedZipCodeLookupOptions(searchText: string): FZCSRCity[] {
    return this.cachedZipCodeLookupOptions.get(searchText);
  }
  public setCachedZipCodeLookupOptions(searchText: string, zipCodeLookupOptions: FZCSRCity[]): FadLandingPageService {
    this.cachedZipCodeLookupOptions.put(searchText, zipCodeLookupOptions);
    return this;
  }

  public getCachedSearchTextLookupOptions(searchText: string): FadAutoCompleteOptionForSearchText[] {
    return this.cachedSearchTextLookupOptions.get(searchText);
  }

  public setCachedSearchTextLookupOptions(searchText: string, lookupOptions: FadAutoCompleteOptionForSearchText[]): FadLandingPageService {
    this.cachedSearchTextLookupOptions.put(searchText, lookupOptions);
    return this;
  }

  getVitalsAutoCompleteSearchResponse(request: GetSearchByProviderRequestModelInterface)
    : Observable<GetSearchByProviderResponseModelInterface> {

    this.showAutoCompleteDropDownSpinner = true;

    let params = new HttpParams();
    // tslint:disable-next-line:forin
    for (const key in request) {
      params = params.append(key.toString(), request[key]);
    }

    // const url = FadConstants.jsonurls.fadLandingPageSearchAutocompleteListUrl;
    // FadConstants.api.fadUrl + FadConstants.urls.fadLandingPageSearchAutocompleteListUrl :

    return this.http.encryptPost(FadConstants.jsonurls.fadLandingPageSearchAutocompleteListUrl,
      request, '', '', false).map(response => {
        return response;
      });

    // return this.bcbsmaHttpService.get(url);

    // return this.http.encryptPost(this.constants.autoCompleteSearchUrl, request, null, null, false);
  }

  getVitalsPlanInfo(request: FADPlanSearchRequestModelInterface): Observable<FadPlanSearchResponseModelInterface> {

    let params = new HttpParams();
    // tslint:disable-next-line:forin
    for (const key in request) {
      params = params.append(key.toString(), request[key]);
    }

    const url = FadConstants.jsonurls.fadLandingPagePlansAutocompleteListUrl;
    // FadConstants.api.fadUrl + FadConstants.urls.fadLandingPagePlansAutocompleteListUrl :

    return this.bcbsmaHttpService.get(url);

    // return this.http.encryptPost(this.constants.getPlanDetailsUrl, request, null, null, false);
  }

  getVitalsZipCodeInfo(vitalsZipCodeSearchRequest: FadVitalsZipCodeSearchRequestModelInterface):
    Observable<FadZipCodeSearchResponseModelInterface> {
    // let dumZipCodeRes: FadZipCodeSearchResponseModelInterface = new FadZipCodeSearchResponseModel();
    // if ('A' == 'a'.toUpperCase()) {
    //   return Observable.of(dumZipCodeRes);
    // }

    if (!vitalsZipCodeSearchRequest.place || vitalsZipCodeSearchRequest.place.length <= 2) {
      const dumZipCodeRes: FadZipCodeSearchResponseModelInterface = new FadZipCodeSearchResponseModel();
      return Observable.of(dumZipCodeRes);
    }
    // request: FadVitalsZipCodeSearchRequestModelInterface

    // tslint:disable-next-line:max-line-length
    const url = `${FadConstants.urls.fadLandingPageZipcodeAutocompleteListUrl}?limit=${vitalsZipCodeSearchRequest.limit}&place=${vitalsZipCodeSearchRequest.place}`;
    let reqOptions: IRequestOptions = null;
    const httpOptions = {
      headers: new HttpHeaders({
        'uitxnid': 'WEB_v3.0_' + this.http.uuid()
      })
    };
    return this.http.get(url, httpOptions, false);

    // return this.http.encryptPost(this.constants.zipCodeSearchUrl, request, null, null, false);
  }

  getCachedSearchControlState(): FadLandingPageSearchControlsModelInterface {
    // if (!this.cachedSearchControlState) {
    //   this.cachedSearchControlState = new FadLandingPageSearchControlsModel();

    //   this.cachedSearchControlState.setValues(
    //     <FadLandingPageSearchControlValues>this.fadSearchResultsService.getSearchCriteria());
    // }
    return this.cachedSearchControlState;
  }

  setCachedSearchControlState(
    searchControlState: FadLandingPageSearchControlsModelInterface | FadLandingPageSearchControlValuesInterface): FadLandingPageService {
    this.cachedSearchControlState = new FadLandingPageSearchControlsModel();
    if (searchControlState instanceof FadLandingPageSearchControlsModel) {
      this.cachedSearchControlState.setControls(<FadLandingPageSearchControlsModelInterface>searchControlState,
        this.fadSearchResultsService);
    } else {
      this.cachedSearchControlState.setValues(<FadLandingPageSearchControlValues>searchControlState);
    }
    return this;
  }



  clearCachedSearchControlState(): FadLandingPageService {
    this.cachedSearchControlState = null;
    return this;
  }

  getLocationFromLatLong(position: Position):
    Observable<LeafLetResponseModelInterface> {

    let params = new HttpParams();
    params = params.append('access_token', FadConstants.text.leafLetAccessToken);
    params = params.append('types', FadConstants.text.leafLetGeoCodingQueryTypes.join(','));

    const url = this.constants.leafLetGecodingVersionUrl + '/' + position.coords.longitude + ',' + position.coords.latitude + '.json';
    return this.bcbsmaHttpService.get(url, { params: params });
  }

  getDoctorProfileDetails(request: DoctorProfileSearchRequestModelInterface): Observable<GetSearchByProfessionalResponseModelInterface> {

    request.userid = this.authService.useridin;

    const url = FadConstants.jsonurls.fadGetDoctorProfile;
    // FadConstants.api.fadUrl + FadConstants.urls.fadGetDoctorProfile :

    return this.bcbsmaHttpService.get(url);

    // return this.http.encryptPost(this.constants.getDoctorProfileUrl, request, null, null, false);
  }

  getFacilityProfileDetails(request: GetSearchByFacilityRequestModelInterface)
    : Observable<GetSearchByFacilityResponseModelInterface> {

    const url = FadConstants.urls.fadGetFacilityProfile;
    return this.bcbsmaHttpService.get(url);

    // return this.http.encryptPost(this.constants.getFacilityProfileUrl, request, null, null, false);
  }
}


