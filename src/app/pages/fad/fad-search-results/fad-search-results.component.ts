// import { FadSearchRequestByProfessionalModel } from './../modals/fad-vitals-collection.model';
import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import {
  FadLandingPageConsumer, FadSearchFilterConsumer, FadSearchListConsumer
} from '../modals/interfaces/fad.interface';
import { FadLandingPageCompInput, FadLandingPageSearchControlValues } from '../modals/fad-landing-page.modal';
import {
  FadLandingPageCompInputInterface, FadLandingPageCompOutputInterface, FadLandingPageSearchControlValuesInterface
} from '../modals/interfaces/fad-landing-page.interface';
import { FadConstants } from '../constants/fad.constants';

import {
  FadSearchFilterComponentOutputModelInterface,
  FadSearchFilterComponentInputModelInterface,
  FadSearchFilterResponseModelInterface
} from '../modals/interfaces/fad-search-filter.interface';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
import {
  FadSearchListComponentInputModelInterface,
  FadSearchListComponentOutputModelInterface,
  FadFacilityListComponentInputModelInterface,
  FadFacilityListComponentOutputModelInterface
} from '../modals/interfaces/fad-search-list.interface';
import { FadSearchCriteriaItem, FadSearchFilterResponseModel, FadSearchFilterComponentInputModel } from '../modals/fad-search-filter.modal';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
import { FadSearchListComponentInputModel, FadFacilityListComponentInputModel } from '../modals/fad-search-list.modal';
import { FadSearchResultsService } from './fad-search-results.service';
// import {
//   FadVitalsProfessionalsSearchResponseModelInterface,
//   FadSearchRequestByProfessionalModelInterface
// } from '../modals/interfaces/fad-vitals-collection.interface';
import { AuthService } from '../../../shared/services/auth.service';
import { FadCompareTableService } from '../fad-compare-table/fad-compare-table.service';
import {
  GetSearchByProfessionalRequestModelInterface,
  GetSearchByProfessionalResponseModelInterface
} from '../modals/interfaces/getSearchByProfessional-models.interface';
import {
  GetSearchByFacilityRequestModelInterface,
  GetSearchByFacilityResponseModelInterface
} from '../modals/interfaces/getSearchByFacility-models.interface';
import { GetSearchByProfessionalRequestModel } from '../modals/getSearchByProfessional.model';
import { ActivatedRoute } from '@angular/router';
import { FadResouceTypeCodeConfig, FadResourceTypeCode } from '../modals/types/fad.types';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { GetSearchByFacilityResponseModel } from '../modals/getSearchByFacility.model';


@Component({
  selector: 'app-fad-search-results',
  templateUrl: './fad-search-results.component.html',
  styleUrls: ['./fad-search-results.component.scss']
})
export class FadSearchResultsComponent implements OnInit, OnDestroy, FadLandingPageConsumer,
  FadSearchFilterConsumer, FadSearchListConsumer {

  public fadConstants = FadConstants;

  // fad-landing-page component consumption requirements
  public miniSearchBarData: FadLandingPageCompInputInterface = new FadLandingPageCompInput();

  // fad-search-filter component consumption requirement
  public searchFilterComponentInput: FadSearchFilterComponentInputModelInterface = new FadSearchFilterComponentInputModel();
  public mobileHideByFilterOverlay: boolean = false;

  // fad-search-list component consumption requirement
  public searchListComponentInput: FadSearchListComponentInputModelInterface;
  public facilityListComponentInput: FadFacilityListComponentInputModelInterface;

  public isNoSearchResults: boolean = false;

  public searchResults: GetSearchByProfessionalResponseModelInterface; // FadVitalsProfessionalsSearchResponseModelInterface;
  private totalCount: number;
  public resourceTypeCode: FadResourceTypeCode = null;

  private infiniteScrollIndexCache: number = 1;

  @ViewChild(InfiniteScrollDirective) infiniteScroll: InfiniteScrollDirective;
  public isDisplaySpinner: boolean = false;
  public isDisplaySpinnerProfessional: boolean = false;

  constructor(private bcbsmaErrorHandler: BcbsmaerrorHandlerService,
    private fadSearchResultsService: FadSearchResultsService,
    private cdRef: ChangeDetectorRef,
    private authService: AuthService,
    private fadCompareTableService: FadCompareTableService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    try {
      this.miniSearchBarData.componentMode = FadConstants.flags.fadLandingPageComponentMode_Abstract;
      this.miniSearchBarData.fadBaseSearchModel = this.fadSearchResultsService.getSearchCriteria();

      // console.log('COMPONENT MODE', this.miniSearchBarData.componentMode);

      // console.log('SEARCH RESULTS', this.fadSearchResultsService.getSearchCriteria());
      const searchCriteria: FadLandingPageSearchControlValuesInterface = this.fadSearchResultsService.getSearchCriteria();

      if (searchCriteria) {  // ensure that the a valid request is present before querying for a response
        this.resourceTypeCode = searchCriteria.getSearchText().getResourceTypeCode();
        this.searchListComponentInput = new FadSearchListComponentInputModel();
        //this.searchListComponentInput.searchResults = this.searchResults;

        if (this.resourceTypeCode === FadResouceTypeCodeConfig.professional) {
          this.getFadProfileSearchResults(searchCriteria, false, <GetSearchByProfessionalResponseModelInterface>this.activatedRoute.snapshot.data.fadLandingPageSearchResults);
        } else {
          this.getFadFacilitySearchResults(searchCriteria, false, <GetSearchByFacilityResponseModelInterface>this.activatedRoute.snapshot.data.fadLandingPageSearchResults);
        }


      } else {
        this.isNoSearchResults = true;
      }

      // populate filter section to help enable users refine /alter search results
      this.createSearchCriteriaForFilterSection();
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadSearchResultsComponent,
        FadConstants.methods.ngOnInit);
    }
  }

  ngOnDestroy(): void {
    this.infiniteScrollIndexCache = 1;
  }

  /**
   * @description helps obtain search results based on input parameters
   *  The method gets from ngOnInit event or through search button click on landing page component in abstract mode
   * @param request : FadLandingPageSearchControlValuesInterface - search parameters
   */
  private getFadProfileSearchResults(request: FadLandingPageSearchControlValuesInterface,
    scroll: boolean = false, resolvedData?: GetSearchByProfessionalResponseModelInterface): void {
    // PLEASE NOTE
    // THIS METHOD DOES NOT USE THE INPUT REQUEST YET
    // BUT THE SAME WILL BE USED ONCE ALL THE GET REQUESTS ARE CONVERTED INTO POST REQUESTS
    // PLEASE DONOT DELETE THE INPUT PARAMETER request: FadLandingPageSearchControlValuesInterface
    try {

      if (resolvedData) {
        this.updateProfessionalsDataToView(resolvedData, false, scroll);
        return;
      }

      this.isDisplaySpinnerProfessional = scroll;
      const vitalsSearchRequestbyProfessional: GetSearchByProfessionalRequestModelInterface = new GetSearchByProfessionalRequestModel();
      if (!scroll) {
        this.infiniteScrollIndexCache = 0;
      }
      vitalsSearchRequestbyProfessional.setGeoLocation(request.getZipCode().geo)
        .setLimit(10)
        .setPage(++this.infiniteScrollIndexCache)
        .setRadius(25)
        .setNetworkId((request.getPlanName && request.getPlanName().getNetworkId()) ?
          request.getPlanName().getNetworkId() : FadConstants.defaults.networkId);
      // vitalsSearchRequestbyProfessional.searchSpecialtyId = ;
      // vitalsSearchRequestbyProfessional.name = ;

      if (request.getSearchText().getSpecialityId()) {
        vitalsSearchRequestbyProfessional.setSearchSpecialtyId(request.getSearchText().getSpecialityId());
      } else {
        let searchText = request.getSearchText().getSimpleText();
        if (searchText.indexOf(FadConstants.text.allDoctorOptionText) >= 0) {
          searchText = searchText.replace(FadConstants.text.allDoctorOptionText, '').replace(/["']/g, '');
        }
        vitalsSearchRequestbyProfessional.setName(searchText);
      }

      const skipNoResultsValidationFlag: boolean = true;
      this.fadSearchResultsService.getFadProfileSearchResults(vitalsSearchRequestbyProfessional, scroll).subscribe((data) => {
        this.isDisplaySpinnerProfessional = false;
        this.updateProfessionalsDataToView(data, skipNoResultsValidationFlag, scroll);
        this.cdRef.detectChanges();
      }, (error) => {
        this.isDisplaySpinnerProfessional = false;
        this.isNoSearchResults = !skipNoResultsValidationFlag && true;
        this.cdRef.detectChanges();
        this.bcbsmaErrorHandler.handleHttpError(error,
          BcbsmaConstants.modules.fadModule,
          FadConstants.services.fadSearchResultsService,
          FadConstants.methods.getFadProfileSearchResults);
      });
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadSearchResultsComponent,
        FadConstants.methods.getFadProfileSearchResults);
    }
  }

  private updateProfessionalsDataToView(data: GetSearchByProfessionalResponseModelInterface,
    skipNoResultsValidationFlag?: boolean, scroll?: boolean) {
    if (data && data.professionals && data.professionals.length > 0) {
      this.totalCount = data.totalCount;
      // this.isNoSearchResults = false;

      if (!scroll) {
        this.fadSearchResultsService.searchResultCache = data;

        this.searchListComponentInput = new FadSearchListComponentInputModel();
        this.searchListComponentInput.searchResults = data;
      } else {

        data.professionals.map(profRecord => {
          this.searchListComponentInput.searchResults.professionals.push(profRecord);
        });

        // this.searchListComponentInput.searchResults.professionals =
        //   Object.assign(this.searchListComponentInput.searchResults.professionals,
        //     ...data.professionals);
      }

      this.fadCompareTableService.setSearchResult(this.searchListComponentInput.searchResults);
      // console.log('Professional ', this.searchListComponentInput.searchResults);
    } else {
      this.isNoSearchResults = !skipNoResultsValidationFlag && true;
    }
  }

  /**
   * @description helps obtain search results based on input parameters
   *  The method gets from ngOnInit event or through search button click on landing page component in abstract mode
   * @param request : FadLandingPageSearchControlValuesInterface - search parameters
   */
  private getFadFacilitySearchResults(request: FadLandingPageSearchControlValuesInterface,
    scroll: boolean = false, resolvedData?: GetSearchByFacilityResponseModelInterface): void {
    // PLEASE NOTE
    // THIS METHOD DOES NOT USE THE INPUT REQUEST YET
    // BUT THE SAME WILL BE USED ONCE ALL THE GET REQUESTS ARE CONVERTED INTO POST REQUESTS
    // PLEASE DONOT DELETE THE INPUT PARAMETER request: FadLandingPageSearchControlValuesInterface
    try {

      if (resolvedData) {
        // this.updateFacilityDataToView(Object.assign(
        //   Object.create(new GetSearchByFacilityResponseModel()), resolvedData,scroll));
        this.updateFacilityDataToView(resolvedData, false, scroll);
        return;
      }

      this.isDisplaySpinner = scroll;
      if (!scroll) {
        this.infiniteScrollIndexCache = 0;
      }

      const vitalsSearchRequestbyProfessional: GetSearchByProfessionalRequestModelInterface = new GetSearchByProfessionalRequestModel();
      vitalsSearchRequestbyProfessional.setGeoLocation(request.getZipCode().geo)
        .setLimit(10)
        .setPage(++this.infiniteScrollIndexCache)
        .setRadius(25)
        .setNetworkId((request.getPlanName && request.getPlanName().getNetworkId()) ?
          request.getPlanName().getNetworkId() : FadConstants.defaults.networkId);

      if (request.getSearchText().getSpecialityId()) {
        vitalsSearchRequestbyProfessional.setSearchSpecialtyId(request.getSearchText().getSpecialityId());
      } else {
        let searchText = request.getSearchText().getSimpleText();
        if (searchText.indexOf(FadConstants.text.allHospitalsOrFacilitiesText) >= 0) {
          searchText = searchText.replace(FadConstants.text.allHospitalsOrFacilitiesText, '').replace(/["']/g, '');
        }

        vitalsSearchRequestbyProfessional.setName(searchText);
      }

      const skipNoResultsValidationFlag: boolean = true;
      this.fadSearchResultsService.getFadFacilitySearchResults(vitalsSearchRequestbyProfessional, scroll)
        .subscribe((data) => {

          this.isDisplaySpinner = false;
          this.updateFacilityDataToView(<GetSearchByFacilityResponseModelInterface>data, scroll, skipNoResultsValidationFlag);

          this.cdRef.detectChanges();
        }, (error) => {
          this.isDisplaySpinner = false;
          this.isNoSearchResults = !skipNoResultsValidationFlag && true;
          this.cdRef.detectChanges();
          this.bcbsmaErrorHandler.handleHttpError(error,
            BcbsmaConstants.modules.fadModule,
            FadConstants.services.fadSearchResultsService,
            FadConstants.methods.getFadProfileSearchResults);
        });
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadSearchResultsComponent,
        FadConstants.methods.getFadProfileSearchResults);
    }
  }

  private updateFacilityDataToView(data: GetSearchByFacilityResponseModelInterface, scroll?: boolean,
    skipNoResultsValidationFlag?: boolean) {
    if (data && data.facilities && data.facilities.length > 0) {
      this.totalCount = data.totalCount;
      this.isNoSearchResults = !skipNoResultsValidationFlag && false;

      if (!scroll) {
        this.fadSearchResultsService.facilityResultCache = data;

        this.facilityListComponentInput = new FadFacilityListComponentInputModel();
        this.facilityListComponentInput.facilityResults = data;
      } else {
        data.facilities.map(facilityRecord => {
          this.facilityListComponentInput.facilityResults.facilities.push(facilityRecord);
        });
      }

      this.fadCompareTableService.setSearchResult(this.facilityListComponentInput.facilityResults);
      // console.log('Facility ', this.facilityListComponentInput.facilityResults);
    } else {
      this.isNoSearchResults = !skipNoResultsValidationFlag && true;
    }
  }

  /**
   * @description fad-search-list component consumption requirement.
   *  The method gets triggered when filter component produces an output
   * @param fadSeachListComponentOutput : FadSearchListComponentOutputModelInterface
   */
  public onSearchListComponentInteraction(fadSeachListComponentOutput: FadSearchListComponentOutputModelInterface): void {
    try {
      throw new Error('Method not implemented.');
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadSearchResultsComponent,
        FadConstants.methods.onSearchListComponentInteraction);
    }
  }

  /**
   * @description action associated with search button in landing page in abstract mode
   * @param fadLandingPageCompOutputInterface : FadLandingPageCompOutputInterface
   */
  public onLandingPageSearchComponentInteraction(fadLandingPageCompOutputInterface: FadLandingPageCompOutputInterface): void {
    try {
      const searchCriteria: FadLandingPageSearchControlValuesInterface = this.fadSearchResultsService.getSearchCriteria();
      this.resourceTypeCode = searchCriteria.getSearchText().getResourceTypeCode();

      if (searchCriteria.getSearchText().getResourceTypeCode() === FadResouceTypeCodeConfig.professional) {
        this.getFadProfileSearchResults(fadLandingPageCompOutputInterface.searchCriteria, false);
      } else {
        this.getFadFacilitySearchResults(fadLandingPageCompOutputInterface.searchCriteria, false);
      }
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadSearchResultsComponent,
        FadConstants.methods.onLandingPageSearchComponentInteraction);
    }
  }

  /**
   * @description fad-search-filter component consumption requirement.
   *  The method helps prepare input data for the fad-search-filter component
   */
  public createSearchCriteriaForFilterSection(): FadSearchFilterResponseModelInterface {
    const searchCriteriaData: FadSearchFilterResponseModelInterface = new FadSearchFilterResponseModel();
    const keywordList: string[] = [];
    try {
      searchCriteriaData
        .addSortByFilter((new FadSearchCriteriaItem())
          .setCriteriaName('Sample 1'))
        .addSortByFilter((new FadSearchCriteriaItem())
          .setCriteriaName('Sample 2'))
        .addSortByFilter((new FadSearchCriteriaItem())
          .setCriteriaName('Sample 3'))

        .addDistanceFilter(
          (new FadSearchCriteriaItem()).setCriteriaName('distance sample')
            .setMatchingResultsCount(0))
        .addGenderFilter(
          (new FadSearchCriteriaItem()).setCriteriaName('gender sample')
            .setMatchingResultsCount(5))
        .addLanguageFilter(
          (new FadSearchCriteriaItem()).setCriteriaName('language sample')
            .setMatchingResultsCount(6))
        .addRatingFilter(
          (new FadSearchCriteriaItem()).setCriteriaName('rating sample')
            .setMatchingResultsCount(8))
        .addAgesTreatedFilter(
          (new FadSearchCriteriaItem()).setCriteriaName('ages-treated sample')
            .setMatchingResultsCount(10))
        .addSpecialitiesFilter(
          (new FadSearchCriteriaItem()).setCriteriaName('speciality sample')
            .setMatchingResultsCount(9))
        .addDisordersTreatedFilter(
          (new FadSearchCriteriaItem()).setCriteriaName('disorders-treated sample')
            .setMatchingResultsCount(8))
        .addTreatmentMethodFilter(
          (new FadSearchCriteriaItem()).setCriteriaName('treatment-method sample')
            .setMatchingResultsCount(7))
        .addHospitalsAndMedicalGroupsFilter(
          (new FadSearchCriteriaItem()).setCriteriaName('hospitals and medical groups sample')
            .setMatchingResultsCount(6));


      this.searchFilterComponentInput.searchCriteriaData = searchCriteriaData;
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadSearchResultsComponent,
        FadConstants.methods.createSearchCriteria);
    }

    return searchCriteriaData;
  }

  /**
   * @description fad-search-filter component consumption requirement.
   *  The method gets triggered when filter component produces an output
   * @param fadSearchFilterComponentOutput : FadSearchFilterComponentOutputModelInterface
   */
  public onSearchFilterComponentInteraction(fadSearchFilterComponentOutput: FadSearchFilterComponentOutputModelInterface): void {
    const searchCriteriaData: FadSearchFilterResponseModelInterface = fadSearchFilterComponentOutput.searchCriteriaData;
    const filterOverlayFlag = fadSearchFilterComponentOutput.filterOverlayFlag;

    // toggle filter section display as necessary
    if (filterOverlayFlag) {
      this.mobileHideByFilterOverlay = true;
    } else {
      this.mobileHideByFilterOverlay = false;
    }

    // if the emit event has not been triggered by apply or clear filters then do nothing
    if (searchCriteriaData === null) {
      return;
    }
  }

  public reviewBenefits(): void {
    throw new Error('reviewBenefits Method not implemented.');
  }

  public requestWrittenEstimte(): void {
    throw new Error('reviewBenefits Method not implemented.');
  }

  private isAnonymousUser() {
    return this.authService.useridin && this.authService.useridin !== 'undefined' ? true : false;
  }
  private isAuthenticatedUser() {
    const scopeName = this.authService.getScopeName();
    return scopeName === 'AUTHENTICATED-AND-VERIFIED' ? true : false;
  }

  public onFacilityScrollDown() {
    this.infiniteScroll.ngOnDestroy();
    this.infiniteScroll.setup();

    const searchCriteria = this.fadSearchResultsService.getSearchCriteria();
    if (searchCriteria && this.totalCount > this.facilityListComponentInput.facilityResults.facilities.length && !this.mobileHideByFilterOverlay) {
      this.getFadFacilitySearchResults(searchCriteria, true);
    }

  }

  public onProfessionalScrollDown() {
    this.infiniteScroll.ngOnDestroy();
    this.infiniteScroll.setup();

    const searchCriteria = this.fadSearchResultsService.getSearchCriteria();
    if (searchCriteria
      && this.totalCount > this.searchListComponentInput.searchResults.professionals.length && !this.mobileHideByFilterOverlay) {
      this.getFadProfileSearchResults(searchCriteria, true);
    }

  }

}
