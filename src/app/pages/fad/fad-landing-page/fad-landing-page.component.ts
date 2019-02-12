import {
  Component, OnInit, Input, OnChanges, SimpleChanges,
  ViewChild, HostListener, ElementRef, Output, EventEmitter, AfterViewInit
} from '@angular/core';
import {
  FadLandingPageCompInputInterface,
  FadAutoCompleteOptionForSearchTextInterface,
  FadAutoCompleteComplexOptionInterface,
  FadLinkOptionInterface,
  FadLandingPageCompOutputInterface
} from '../modals/interfaces/fad-landing-page.interface';
import {
  FadAutoCompleteOptionForSearchText,
  FadAutoCompleteComplexOption, FadLandingPageSearchControlsModel,
  FadLandingPageSearchControlValues,
  LandingPageResponseCacheModel,
  // FadLandingPageCompOutput
} from '../modals/fad-landing-page.modal';
import { Router } from '@angular/router';
import { FadConstants } from '../constants/fad.constants';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
import {
  FadLandingPageComponentMode,
  FadLandingPageFocusTracker,
  AuthRequestType,
  FadResourceTypeCode,
  FadResouceTypeCodeConfig
} from '../modals/types/fad.types';

import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { startWith } from 'rxjs/operators/startWith';
import { delay } from 'rxjs/operators/delay';
import { MatAutocompleteTrigger } from '@angular/material';
import { FadLandingPageService } from './fad-landing-page.service';
import {
  FPSRPlan,
  DoctorProfileSearchRequestModel,
  FADPlanSearchRequestModel, FZCSRCity, FadVitalsZipCodeSearchRequestModel
} from '../modals/fad-vitals-collection.model';
import {
  FVSHRSearchHistoryInterface,
  DoctorProfileSearchRequestModelInterface,
  // FacilityProfileSearchRequestModelInterface,
  FADPlanSearchRequestModelInterface,
  FadVitalsZipCodeSearchRequestModelInterface
} from '../modals/interfaces/fad-vitals-collection.interface';
import { FadPastSearchQueryListService } from '../fad-past-search-query-list/fad-past-search-query-list.service';
import { FadSearchResultsService } from '../fad-search-results/fad-search-results.service';
import { MatchTextHighlightPipe } from '../../../shared/pipes/match-text-highlight/match-text-highlight.pipe';
import { FadDoctorProfileService } from '../fad-doctor-profile/fad-doctor-profile.service';
import { FadFacilityProfileService } from '../fad-facility-profile/fad-facility-profile.service';
import { AuthService } from '../../../shared/shared.module';
import { GetSearchByProviderRequestModelInterface } from '../modals/interfaces/getSearchByProvider-models.interface';
import { GetSearchByProviderRequestModel } from '../modals/getSearchByProvider.models';
// import { GetSearchByFacilityRequestModelInterface } from '../modals/interfaces/getSearchByFacility-models.interface';
// import { GetSearchByFacilityRequestModel } from '../modals/getSearchByFacility.model';
import { FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-fad-landing-page',
  templateUrl: './fad-landing-page.component.html',
  styleUrls: ['./fad-landing-page.component.scss']
})
export class FadLandingPageComponent implements OnInit, OnChanges, AfterViewInit {

  // optional input value to be provided only when consumed by other components like
  // fad-search-results component
  @Input('componentInput') componentInput: FadLandingPageCompInputInterface;
  @Output('componentOutput') componentOutput = new EventEmitter<FadLandingPageCompOutputInterface>();
  @ViewChild('searchTextTypeAhead', { read: MatAutocompleteTrigger }) searchTextTypeAheadTrigger;
  @ViewChild('zipCodeTypeAhead', { read: MatAutocompleteTrigger }) zipCodeTypeAheadTrigger;
  @ViewChild('planTypeAhead', { read: MatAutocompleteTrigger }) planTypeAheadTrigger;
  @ViewChild('dependantListTypeAhead', { read: MatAutocompleteTrigger }) dependantListTypeAheadTrigger;
  @ViewChild('searchBar') searchBar: ElementRef;

  public fadConstants = FadConstants;
  public zipClearIcon = 'hidden';
  public planClearIcon = 'hidden';
  public dependantClearIcon = 'hidden';

  public componentMode: FadLandingPageComponentMode = FadConstants.flags.fadLandingPageComponentMode_Normal;

  public displayPastSearchHistoryFlag: boolean = false;
  public displayDependentsOptionFlag: boolean = false;

  public searchControls: FadLandingPageSearchControlsModel;

  public zipCodeOptions: FZCSRCity[] = [];
  public filteredZipCodeOptions: Observable<FZCSRCity[]>;

  public dependantsList: string[] = [];
  public filteredDependantsList: Observable<string[]>;

  public defaultPlanOptions: FadAutoCompleteOptionForSearchText[] = [];
  public planOptions: FadAutoCompleteOptionForSearchText[] = []; // FPSRPlan[] = [];
  public filteredPlanOptions: Observable<FadAutoCompleteOptionForSearchText[]>; // Observable<FPSRPlan[]>;

  public autoCompleteOptionsForSearchText: FadAutoCompleteOptionForSearchText[] = [];
  public filteredAutoCompleteSearchOptions: Observable<FadAutoCompleteOptionForSearchText[]>;

  public searchHistory: FVSHRSearchHistoryInterface[] = [];

  public viewPortWidth: number = null;
  public emboseSearchTextField: boolean = false;
  public emboseZipCodeField: boolean = false;
  public embosePlanField: boolean = false;
  public emboseDependantsField: boolean = false;

  public focusedTarget: string;
  public userCurrentPlan: FPSRPlan = new FPSRPlan();

  private preventSearchTextAutoCompleteDropdown: boolean = false;
  private textToHighlightInPlanOption: string;
  private textToHighlightInSearchTextOption: string;
  private isLogin: boolean = false;

  private defaultAutoCompleteSearchOption: FadAutoCompleteOptionForSearchTextInterface[] = [];
  private searchTextMaterialAutoCompleteBugWorkAroundFlag: number = 0;
  private searchTextMaterialAutoCompleteBugWorkAroundTimerFlag: number = 0;
  private debounceTime: number = 400;

  public getLocalStorageZipCodeOption: FZCSRCity;
  isSearchButtonDisabled: boolean = true;
  zipCodeValidationErrors = {
    'invalidZipCode': {
      exists: false,
      errorMsg: 'Please enter Zip Code or City, State.',
      display: false
    },
    'noMatchFound': {
      exists: false,
      errorMsg: 'Please check that you have entered the correct Zip Code or City.',
      display: false
    }
  };

  constructor(private router: Router,
    private bcbsmaErrorHandler: BcbsmaerrorHandlerService,
    public landingPageService: FadLandingPageService,
    private fadSearchResultsService: FadSearchResultsService,
    private fadPastSearchQueryListService: FadPastSearchQueryListService,
    private doctorProfileService: FadDoctorProfileService,
    private facilityProfileService: FadFacilityProfileService,
    public authService: AuthService, public fb: FormBuilder
  ) {
    this.viewPortWidth = window.innerWidth;
    this.getLocalStorageZipCodeOption = JSON.parse(localStorage.getItem('zipcode'));
    if (!this.getLocalStorageZipCodeOption) {
      this.isSearchButtonDisabled = true;
    } else {
      this.isSearchButtonDisabled = false;
    }
    // console.log("getLocalStorageZipCodeOption", this.getLocalStorageZipCodeOption);
  }

  ngOnInit() {
    try {

      // DO NOT CHANGE CODE ORDER - STEP 1
      // step 1 - If the component is being opened in abstract mode, the set values persisted from the
      // main screen on to the search fields in the current age
      if (this.componentInput && this.componentInput.componentMode === FadConstants.flags.fadLandingPageComponentMode_Abstract) {
        this.searchControls = new FadLandingPageSearchControlsModel();
        this.searchControls.setValues(<FadLandingPageSearchControlValues>this.fadSearchResultsService.getSearchCriteria());
        this.landingPageService.setCachedSearchControlState(this.searchControls);

        // if (this.viewPortWidth < 993) {
        // if the component is being opened in abstract mode on a mobile or tablet device, further manipulations are not
        // necessary due to the limited behaviour expected of the component as per requirements, comps and specs
        // return;
        // }
      }

      // DO NOTE CHANGE CODE ORDER - STEP 2
      // step 2 - use existing search control references if any
      if (this.landingPageService.getCachedSearchControlState()) {
        this.searchControls = <FadLandingPageSearchControlsModel>this.landingPageService.getCachedSearchControlState();
      } else {
        this.searchControls = new FadLandingPageSearchControlsModel();
      }

      // DO NOT CHANGE CODE ORDER - STEP 3
      // step 2 - service call initiations. This is sequential and hence the code order must not change
      if (this.viewPortWidth > 992 || (this.componentMode === FadConstants.flags.fadLandingPageComponentMode_Normal
        && this.viewPortWidth < 993)) {
        this.initData();
      }

      if ((this.landingPageService.getCachedSearchControlState() && this.searchControls.dependantNameControl.value)
        || (this.authService.getDependentsList() && this.authService.getDependentsList().dependents.length > 0)) {
        this.displayDependentsOptionFlag = true;
      }

      // DO NOTE CHANGE CODE ORDER - STEP 4
      // step 3 - page needs to be updated with cached values if any, only after the defaults are loaded into memory
      if (this.fadPastSearchQueryListService.searchControlValues) {
        // this.searchControls = new FadLandingPageSearchControlsModel();
        this.searchControls.setValues(<FadLandingPageSearchControlValues>this.fadPastSearchQueryListService.searchControlValues);
        this.fadPastSearchQueryListService.searchControlValues = null;
      }
      // else if (this.landingPageService.getCachedSearchControlState()) {
      //   // this.searchControls = <FadLandingPageSearchControlsModel>this.landingPageService.getCachedSearchControlState();
      //   this.landingPageService.clearCachedSearchControlState();
      // }
      // // else {
      // //   this.searchControls = new FadLandingPageSearchControlsModel();
      // // }

      // step 4 - help to enhanced the search functionlity in the typehead component which are loaded into memory with data
      if (this.viewPortWidth > 992 || (this.componentMode === FadConstants.flags.fadLandingPageComponentMode_Normal
        && this.viewPortWidth < 993)) {
        this.enhancedSearchAfterInitData();
      }


      let searchText: string = this.searchControls.searchTypeAheadControl.value;
      // console.log("search text", searchText);
      if ((searchText && this.searchControls.zipCodeTypeAheadControl.value &&
        this.textToHighlightInPlanOption) || (searchText && this.getLocalStorageZipCodeOption &&
          this.searchControls.zipCodeTypeAheadControl.value && this.textToHighlightInPlanOption)) {
        this.isSearchButtonDisabled = false;
      } else {
        this.isSearchButtonDisabled = true;
      }
      if (searchText && searchText.trim) {
        searchText = searchText.trim();
        if (searchText.indexOf(FadConstants.text.allHospitalsOrFacilitiesText) >= 0) {
          searchText = searchText.replace(FadConstants.text.allHospitalsOrFacilitiesText, '').replace(/["']/g, '');
          setTimeout(() => { this.searchControls.searchTypeAheadControl.setValue(searchText); }, 10);
        } else if (searchText.indexOf(FadConstants.text.allDoctorOptionText) >= 0) {
          searchText = searchText.replace(FadConstants.text.allDoctorOptionText, '').replace(/["']/g, '');
          setTimeout(() => { this.searchControls.searchTypeAheadControl.setValue(searchText); }, 10);
        }
      }


    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadLandingPageComponent,
        FadConstants.methods.ngOnInit);
    }

  }

  ngOnChanges(changes: SimpleChanges) {
    try {
      this.componentInput = changes.componentInput.currentValue;
      // if the component is being displayed as part of other components in 'abstract' mode
      // for example as part of fad-search-results component
      // use the input provided by the consumer to popuplate the component
      if (this.componentInput) {
        this.componentMode = this.componentInput.componentMode;
      }
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadLandingPageComponent,
        FadConstants.methods.ngOnChanges);
    }
  }

  ngAfterViewInit() {
    try {
      if (this.landingPageService.getCachedSearchControlState()) {
        this.landingPageService.clearCachedSearchControlState();
      }

      if (this.landingPageService.getCachedSearchControlState() && this.landingPageService.cachedResponse.planOptions
        && this.planTypeAheadTrigger) {
        this.planTypeAheadTrigger._element.nativeElement.value = this.searchControls.planControl.value.getSimpleText();
      } else if (this.isLogin && (!this.landingPageService.cachedResponse || !this.landingPageService.cachedResponse.planOptions)
        && this.planTypeAheadTrigger) {
        this.planTypeAheadTrigger._element.nativeElement.value = this.userCurrentPlan.name;
      }

      // Remove this after Sprint 1, Only for Sprint 1 Default value //
      // if (!this.landingPageService.cachedResponse) {
      if (this.componentMode === FadConstants.flags.fadLandingPageComponentMode_Normal) {
        this.UpdateZipCodeFieldFromApplicationStorage();

        const defaultObj = (new FadAutoCompleteComplexOption())
          .setSimpleText(this.userCurrentPlan.name).setNetworkId(this.userCurrentPlan.id);

        this.searchControls.planControl.setValue(defaultObj);

        const planOption = new FadAutoCompleteOptionForSearchText();
        planOption.addOption((new FadAutoCompleteComplexOption())
          .setSimpleText(this.userCurrentPlan.name).setNetworkId(this.userCurrentPlan.id));
        this.planOptions.push(planOption);
      }

      // if (!this.fadSearchResultsService.getLastSelectedZipCodeOption()) {
      //   // fix for, Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked
      //   window.setTimeout(() => {
      //     try {
      //       // requirement as per https://bcbsma.atlassian.net/browse/M31-72
      //       const defaultZipCodeOption = (new FZCSRCity()).setZip(FadConstants.defaults.zipCode)
      //       .setCity(FadConstants.defaults.city)
      //        .setState_code(FadConstants.defaults.stateCode)
      //       .setGeo(FadConstants.defaults.geo);
      //       const defaultZipCodeText =
      //       `${defaultZipCodeOption.getZip()} - ${defaultZipCodeOption.getCity()}, ${defaultZipCodeOption.getState_code()}`;

      //       this.fadSearchResultsService.setLastSelectedZipCodeOption(defaultZipCodeOption);
      //       this.searchControls.zipCodeTypeAheadControl.setValue(defaultZipCodeText);
      //     } catch (defaultZipError) {
      //       this.bcbsmaErrorHandler.logError(defaultZipError, BcbsmaConstants.modules.fadModule,
      //         FadConstants.components.fadLandingPageComponent,
      //         [FadConstants.methods.setTimeout, FadConstants.methods.ngAfterViewInit].join(' - '));
      //     }
      //   }, 10);
      // }

    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadLandingPageComponent,
        FadConstants.methods.ngAfterViewInit);
    }

  }

  // will help determine the window width of the screen at all times
  // helps make RWD specific code as necessary
  // viewPortWidth for desktop is >= 993, for mobile and tablet is <=992
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.viewPortWidth = window.innerWidth;
  }

  // helps track clicks outside the search bar to display/hide auto complete drop downs as desired
  @HostListener('document:click', ['$event'])
  onClick(event) {
    if (this.searchBar && !this.searchBar.nativeElement.contains(event.target)) {
      // if user clicks outside the search bar hide the remove icon
      // this.focusedTarget = '';
    }
  }

  /**
   * @description triggered with login/register/authenticate related links are clicked
   * YET TO BE CODED
   * @param event : HTML Event
   * @param target : AuthRequestType
   */
  public redirectRequestPlanDropDown(event, target?: AuthRequestType) {
    try {
      event.stopPropagation();
      throw new Error('Yet to code >>> target is ' + target);
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadLandingPageComponent,
        FadConstants.methods.redirectRequestPlanDropDown);
    }
  }

  /**
   * @description helps highlight text being searched for matching in the auto complete options
   * @param optionText - string  - the option that is displayed in the drop down autocompelete list
   */
  public getMatchHighlightedTextInPlanOption(optionText: string): string {
    let returnValue: string = '';
    try {
      if (optionText) {
        returnValue = (new MatchTextHighlightPipe()).transform(optionText, this.textToHighlightInPlanOption);
      }

    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadLandingPageComponent,
        FadConstants.methods.getMatchHighlightedTextInPlanOption);
    } finally {
      return returnValue;
    }
  }

  /**
   * @description helps highlight text being searched for matching in the auto complete options
   * @param optionText - string  - the option that is displayed in the drop down autocompelete list
   */
  public getMatchHighlightedTextInSearchTextOption(optionText: string): string {
    let returnValue: string = '';
    try {
      if (optionText) {
        returnValue = (new MatchTextHighlightPipe()).transform(optionText, this.textToHighlightInSearchTextOption);
      }

    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadLandingPageComponent,
        FadConstants.methods.getMatchHighlightedTextInSearchTextOption);
    } finally {
      return returnValue;
    }
  }

  /**
   * @description helps remove focus from a search field to avoid the auto complete list from being displayed
   * @param target - string
   */
  public removeIconFocusTracker(target: string, event?) {
    this.focusedTarget = target;
    if (this.viewPortWidth < 993) {
      switch (target) {
        // when remove icon inside the search doctor field is clicked
        case (FadLandingPageFocusTracker.searchText):

          break;
        // when remove icon inside the search zipcode field is clicked
        case (FadLandingPageFocusTracker.zipCode):
          this.displayZipCodeDropDown(event);
          break;
        // when remove icon inside the search plan field is clicked
        case (FadLandingPageFocusTracker.plan):
          this.displayPlanDropDown(event);
          break;
        // when remove icon inside the search dependant field is clicked
        case (FadLandingPageFocusTracker.dependant):

          break;
        // otherwise do nothing
        default: break;
      }
    }
  }

  /**
   * @description helps display only the search for doctor fiel on mobile screen
   * @param flag
   */
  public emboseSearchTextFieldOnScreen(flag: boolean, cancelButtonClicked?: boolean): boolean {
    this.emboseSearchTextField = flag;
    if (!flag && !cancelButtonClicked) {
      this.triggerSearchOnEnterKey();
    }
    return flag;
  }

  public triggerSearchOnSearchLensIcon(flag: boolean): boolean {
    this.emboseSearchTextFieldOnScreen(flag);
    return flag;
  }
  /**
   * @description helps display only the search for zipcode field on mobile screen
   * @param flag
   */
  public emboseZipCodeFieldOnScreen(flag: boolean, location?: FZCSRCity): boolean {
    try {
      if (location) {
        const selectedZipCodeOption: FZCSRCity = new FZCSRCity();
        selectedZipCodeOption
          .setCity(location.city)
          .setCounty(location.county)
          .setGeo(location.geo)
          .setLat(location.lat)
          .setLng(location.lng)
          .setName(location.name)
          .setPlace_id(location.place_id)
          .setScore(location.score)
          .setState(location.state)
          .setState_code(location.state_code)
          .setZip(location.zip);

        this.fadSearchResultsService.setLastSelectedZipCodeOption(selectedZipCodeOption);
      }
      this.emboseZipCodeField = flag;
      this.zipClearIcon = flag ? 'visible' : 'hidden';
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadLandingPageComponent,
        FadConstants.methods.emboseZipCodeFieldOnScreen);
    }
    return flag;
  }

  /**
   * @description helps display only the search for plan name field on mobile screen
   * @param flag
   */
  public embosePlanFieldOnScreen(flag: boolean): boolean {
    this.embosePlanField = flag;
    this.planClearIcon = flag ? 'visible' : 'hidden';
    return flag;
  }

  /**
   * @description helps display only the search for dependants field on mobile screen
   * @param flag
   */
  public emboseDependantsFieldOnScreen(flag: boolean): boolean {
    this.emboseDependantsField = flag;
    this.dependantClearIcon = flag ? 'visible' : 'hidden';
    return flag;
  }

  /**
   * @description helps navigate to All Specialities and All Procedures page
   * @param event
   * @param link
   */
  public openSelectionList(event, link: FadLinkOptionInterface): boolean {
    try {
      this.router.navigate([link.href]);
      event.stopPropagation();
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadLandingPageComponent,
        FadConstants.methods.openSelectionList);
    }
    return false;
  }

  /**
   * @description helps display the zip code typeahead drop down with options
   * @param event
   */
  public checkAndDisplayZipCodeDropDown(event): boolean {
    try {
      if (event.keyCode === 32 || event.keyCode === 13) {
        event.stopPropagation();
        this.displayZipCodeDropDown(event);
        return false;
      }
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadLandingPageComponent,
        FadConstants.methods.checkAndDisplayZipCodeDropDown);
    }
    return true;
  }

  /**
   * @description helps display the plan name typeahead drop down with options
   * @param event
   */
  public checkAndDisplayPlanDropDown(event) {
    try {
      if (event.keyCode === 32 || event.keyCode === 13) {
        event.stopPropagation();
        this.displayPlanDropDown(event);
        return false;
      }
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadLandingPageComponent,
        FadConstants.methods.checkAndDisplayPlanDropDown);
    }
  }

  /**
   * @description helps dislay dependants name typeahead drop down with options on screen
   * @param event
   */
  public checkAndDisplayDependentListDropDown(event): boolean {
    try {
      if (event.keyCode === 32 || event.keyCode === 13) {
        event.stopPropagation();
        this.displayDependentListDropDown(event);
        return false;
      }
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadLandingPageComponent,
        FadConstants.methods.checkAndDisplayDependentListDropDown);
    }
    return true;
  }

  /**
   * @description helps display past search history on screen
   * @param event
   */
  public checkAndDisplayPastSearchHistory(event): boolean {
    try {
      if (event.keyCode === 32 || event.keyCode === 13) {
        event.stopPropagation();
        this.displayPastSearchHistory();
        return false;
      }
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadLandingPageComponent,
        FadConstants.methods.checkAndDisplayPastSearchHistory);
    }
    return true;
  }

  /**
   * @description - defines what has to happen when the user selects a different option value in
   *    the search type a head drop down. In this case it ensures that the drop down list
   *    being displayed is hidden from view
   */
  public onSearchTextOptionSelected(option: FadAutoCompleteComplexOption, isSpecialityOption: boolean): void {
    try {
      this.fadSearchResultsService.setLastSelectedSearchTextOption(option);
      this.preventSearchTextAutoCompleteDropdown = true;

      if (isSpecialityOption) {
        // if a speciality option is clicked in the autocomplete dropdown, trigger the search for the same
        const searchControlValues: FadLandingPageSearchControlValues = this.searchControls.getValues(this.fadSearchResultsService);
        searchControlValues.setSearchText(option);
        this.searchControls.setValues(searchControlValues);

        if (this.searchControls.zipCodeTypeAheadControl.value && this.searchControls.zipCodeTypeAheadControl.value.trim()) {
          this.doSearch();
        }
      }
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadLandingPageComponent,
        FadConstants.methods.onSearchTextOptionSelected);
    }
  }

  onZipCodeTypeaheadOptionSelectionChange(location: FZCSRCity) {
    try {
      this.fadSearchResultsService.setLastSelectedZipCodeOption(location);
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadLandingPageComponent,
        FadConstants.methods.onZipCodeTypeaheadOptionSelectionChange);
    }
  }

  private triggerSearchOnEnterKey() {
    // if enter key has been pressed, select the first matching option in the dropdown as the lastselected option
    const userProvidedSearchText = this.searchControls.searchTypeAheadControl.value;
    if ((userProvidedSearchText && this.searchControls.zipCodeTypeAheadControl.value &&
      this.textToHighlightInPlanOption) || (userProvidedSearchText &&
        this.searchControls.zipCodeTypeAheadControl.value && this.textToHighlightInPlanOption &&
        this.getLocalStorageZipCodeOption)) {
      this.isSearchButtonDisabled = false;
    } else {
      this.isSearchButtonDisabled = true;
    }
    const cachedLookupOptions: FadAutoCompleteOptionForSearchText[] =
      this.landingPageService.getCachedSearchTextLookupOptions(userProvidedSearchText);

    if (cachedLookupOptions && cachedLookupOptions.length) {
      // if (cachedLookupOptions[0].category && cachedLookupOptions[0].category === FadConstants.text.areYouLookingFor) {
      if (cachedLookupOptions[0] && cachedLookupOptions[0].category === FadConstants.text.areYouLookingFor) {
        const firstSpecialityOption: FadAutoCompleteComplexOption = <FadAutoCompleteComplexOption>cachedLookupOptions[0].options[0];
        // firstSpecialityOption.setSpecialityId(firstSpecialityOption.)
        this.fadSearchResultsService.setLastSelectedSearchTextOption(firstSpecialityOption);
        this.emboseSearchTextField = false;
        this.searchControls.searchTypeAheadControl.setValue(cachedLookupOptions[0].options[0].getSimpleText());
        this.searchTextTypeAheadTrigger._onChange(this.searchControls.searchTypeAheadControl.value);
        this.searchTextTypeAheadTrigger.closePanel();
        if (this.searchControls.zipCodeTypeAheadControl.value && this.searchControls.zipCodeTypeAheadControl.value.trim()) {
          this.doSearch();
        }

      } else if (cachedLookupOptions[0] && cachedLookupOptions[0].category
        && cachedLookupOptions[0].category.indexOf(FadConstants.text.allDoctorOptionText) === 0) {
        const searchControlValues: FadLandingPageSearchControlValues = this.searchControls.getValues(this.fadSearchResultsService);

        const searchTextOption = new FadAutoCompleteComplexOption();
        searchTextOption.setSimpleText(cachedLookupOptions[0].category); // cachedLookupOptions[0].options[0].getSimpleText());
        searchTextOption.setResourceTypeCode(FadResouceTypeCodeConfig.professional);

        searchControlValues.setSearchText(searchTextOption);

        this.fadSearchResultsService.setLastSelectedSearchTextOption(searchTextOption);
        this.searchControls.setValues(searchControlValues);
        if (this.searchControls.zipCodeTypeAheadControl.value && this.searchControls.zipCodeTypeAheadControl.value.trim()) {
          this.doSearch();
        }

      } else if (cachedLookupOptions[0] && cachedLookupOptions[0].category
        && cachedLookupOptions[0].category.indexOf(FadConstants.text.allHospitalsOrFacilitiesText) === 0) {
        const searchControlValues: FadLandingPageSearchControlValues = this.searchControls.getValues(this.fadSearchResultsService);

        const searchTextOption = new FadAutoCompleteComplexOption();
        searchTextOption.setSimpleText(cachedLookupOptions[0].category); // cachedLookupOptions[0].options[0].getSimpleText());
        searchTextOption.setResourceTypeCode(FadResouceTypeCodeConfig.facility);

        searchControlValues.setSearchText(searchTextOption);

        this.fadSearchResultsService.setLastSelectedSearchTextOption(searchTextOption);
        this.searchControls.setValues(searchControlValues);
        if (this.searchControls.zipCodeTypeAheadControl.value && this.searchControls.zipCodeTypeAheadControl.value.trim()) {
          this.doSearch();
        }
      }
    }
  }

  /**
   * @description helps display values in the search for a doctor typeahead list
   */
  public displaySearchTextAutoCompleteDropDown(event?: KeyboardEvent): void {
    try {
      // console.log('into displaySearchTextAutoCompleteDropDown');
      this.removeIconFocusTracker(FadLandingPageFocusTracker.searchText);

      if (this.viewPortWidth < 993) {
        this.emboseSearchTextFieldOnScreen(!this.preventSearchTextAutoCompleteDropdown);

      }

      if (event && event.keyCode === 13) {
        this.triggerSearchOnEnterKey();

        return;
      } else if (event && event instanceof KeyboardEvent && (event.keyCode === 38 || event.keyCode === 40)) {
        // if up or down arrow is pressed do the associated menu navigation
        window.clearInterval(this.searchTextMaterialAutoCompleteBugWorkAroundTimerFlag);
        return;
      }

      if (this.preventSearchTextAutoCompleteDropdown) {
        this.preventSearchTextAutoCompleteDropdown = false;
        return;
      }

      // console.log('about to trigger first timeout');
      setTimeout(() => {
        try {
          // console.log('into first timeout');

          this.searchTextTypeAheadTrigger._onChange(this.searchControls.searchTypeAheadControl.value);
          this.searchTextTypeAheadTrigger.openPanel();

          // console.log('about to trigger second timeout');
          setTimeout(() => {
            try {
              // console.log('into second timeout', 'repeater count is  >>>' + this.searchTextMaterialAutoCompleteBugWorkAroundFlag);
              this.searchTextMaterialAutoCompleteBugWorkAroundFlag = 0;
              this.searchTextMaterialAutoCompleteBugWorkAroundTimerFlag = window.setInterval(() => {
                this.searchTextMaterialAutoCompleteBugWorkAroundFlag++;
                try {
                  const autoCompletePanes: HTMLCollection = document.getElementsByClassName('cdk-overlay-pane');
                  let activeAutoCompletePane: HTMLElement = null;
                  for (let acpItr = 0; acpItr < autoCompletePanes.length; acpItr++) {
                    const autoCompPane: HTMLElement = <HTMLElement>autoCompletePanes[acpItr];
                    if (autoCompPane.innerHTML !== '') {
                      activeAutoCompletePane = autoCompPane;
                      break;
                    }
                  }

                  if (activeAutoCompletePane) {


                    const optionGroups: HTMLCollectionOf<HTMLElement> =
                      <HTMLCollectionOf<HTMLElement>>activeAutoCompletePane.getElementsByClassName('mat-optgroup-label');

                    // console.log('got options? =>>> ' + optionGroups && optionGroups.length && activeAutoCompletePane ? 'yes' : 'no');

                    if (optionGroups && optionGroups.length && activeAutoCompletePane) {
                      const firstOptGroupLabel: HTMLElement = optionGroups[0];

                      // console.log('firstOptionGroupLabel exists =  ' + firstOptGroupLabel ? 'yes - innerhtml>>> ' +
                      // firstOptGroupLabel.innerHTML : 'no');

                      if (firstOptGroupLabel && firstOptGroupLabel.innerHTML &&
                        (firstOptGroupLabel.innerHTML.indexOf(FadConstants.text.allDoctorOptionText) === 0 ||
                          firstOptGroupLabel.innerHTML.indexOf(FadConstants.text.allHospitalsOrFacilitiesText) === 0)) {

                        // console.log('1.1 got into nested first if =>>> group label is' + firstOptGroupLabel.innerHTML);


                        if (firstOptGroupLabel.className.indexOf('mat-active') !== -1) {
                          // console.log('1.1.1 got into nested first if =>>> ');
                          this.searchTextMaterialAutoCompleteBugWorkAroundFlag = 0;
                          window.clearInterval(this.searchTextMaterialAutoCompleteBugWorkAroundTimerFlag);
                          return;
                        }
                        firstOptGroupLabel.className += ' mat-active';

                        const matOptions: HTMLCollectionOf<HTMLElement> =
                          <HTMLCollectionOf<HTMLElement>>activeAutoCompletePane.getElementsByTagName('mat-option');
                        const firstMatOption: HTMLElement = matOptions[0];
                        if (firstMatOption) {
                          firstMatOption.className = (firstMatOption.className) ?
                            firstMatOption.className.replace('mat-active', '').trim() : '';
                        }

                        // console.log('1.2 dump init >>> ' + this.searchTextMaterialAutoCompleteBugWorkAroundFlag + ' >>> done');


                      } else if (firstOptGroupLabel && firstOptGroupLabel.innerHTML
                        && firstOptGroupLabel.innerHTML.indexOf(FadConstants.text.notSureWhatToSearch) === 0) {
                        // console.log('its the default menu. no changes are required');
                        // if its the default menu, just exit. no changes are required
                        // this.searchTextMaterialAutoCompleteBugWorkAroundFlag = 0;
                        // window.clearInterval(this.searchTextMaterialAutoCompleteBugWorkAroundTimerFlag);
                        return;
                      } else if (firstOptGroupLabel && firstOptGroupLabel.innerHTML === '') {
                        // kalagi01 after removing 'are you looking for' opion
                        // && firstOptGroupLabel.innerHTML.indexOf(FadConstants.text.areYouLookingFor) === 0) {

                        // console.log('2.1 got into first nested else if =>>> group label is ' + firstOptGroupLabel.innerHTML);

                        const matOptions: HTMLCollectionOf<HTMLElement> =
                          <HTMLCollectionOf<HTMLElement>>activeAutoCompletePane.getElementsByTagName('mat-option');
                        const firstMatOption: HTMLElement = matOptions[0];
                        this.searchTextMaterialAutoCompleteBugWorkAroundFlag = 0;

                        if (firstMatOption && firstMatOption.className.indexOf('mat-active') === -1) {
                          firstMatOption.className += ' mat-active';
                          // console.log('2.2.1 >>>>>>>>>added mat-active to ' + firstOptGroupLabel.innerHTML);
                          // this.searchTextMaterialAutoCompleteBugWorkAroundFlag = 0;
                          // window.clearInterval(this.searchTextMaterialAutoCompleteBugWorkAroundTimerFlag);
                          return;
                        }

                        if (this.searchTextMaterialAutoCompleteBugWorkAroundFlag > 5) {
                          // console.log('2.3.1 >>>>>>>>> clearing stuffs');
                          // this.searchTextMaterialAutoCompleteBugWorkAroundFlag = 0;
                          // window.clearInterval(this.searchTextMaterialAutoCompleteBugWorkAroundTimerFlag);
                        }

                      }
                    }
                  }
                  if (this.searchTextMaterialAutoCompleteBugWorkAroundFlag > 25) {
                    //  console.log(' >>>>>>>>>> clearing over all repeater');
                    this.searchTextMaterialAutoCompleteBugWorkAroundFlag = 0;
                    window.clearInterval(this.searchTextMaterialAutoCompleteBugWorkAroundTimerFlag);
                  }
                  // console.log(' >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> repeat');
                } catch (exception) {
                  this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
                    FadConstants.components.fadLandingPageComponent,
                    [FadConstants.methods.displaySearchTextAutoCompleteDropDown,
                    FadConstants.methods.setInterval, 'nested level 3'].join(' - '));
                }
              }, 200);
            } catch (exception) {
              this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
                FadConstants.components.fadLandingPageComponent,
                [FadConstants.methods.displaySearchTextAutoCompleteDropDown,
                FadConstants.methods.setTimeout, 'nested level 2'].join(' - '));
            }
          }, 100);
        } finally {
          // IGNORE ERROR - IT WILL RESULT IN ANGULAR ERROR ON AUTOMATIC FOCUS TO SEARCH FIELD ON PAGE LOAD
        }
      }, 500);
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadLandingPageComponent,
        FadConstants.methods.displaySearchTextAutoCompleteDropDown);
    }
  }

  /**
  * @description hide the auto complete text search
  */
  public cancelSearchTextAutoCompleteDropDown(): void {
    try {
      if (this.viewPortWidth < 993) {
        const cancelFlag: boolean = true;
        this.emboseSearchTextFieldOnScreen(false, cancelFlag);
      }

      setTimeout(() => {
        try {
          this.searchControls.searchTypeAheadControl.setValue('');
          this.searchTextTypeAheadTrigger._onChange(this.searchControls.searchTypeAheadControl.value);
          this.searchTextTypeAheadTrigger.closePanel();
        } finally {
          // IGNORE ERROR - IT WILL RESULT IN ANGULAR ERROR ON AUTOMATIC FOCUS TO SEARCH FIELD ON PAGE LOAD
        }
      }, 100);
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadLandingPageComponent,
        FadConstants.methods.cancelSearchTextAutoCompleteDropDown);
    }
  }

  /**
   * @description helps display values in the search for a zip code typeahead list
   * @param event
   */
  public displayZipCodeDropDown(event): void {
    try {
      if (this.viewPortWidth < 993) {
        this.emboseZipCodeFieldOnScreen(true);
      }
      document.getElementsByTagName('body')[0].click();

      setTimeout(() => {
        const zipCodeField = this.zipCodeTypeAheadTrigger._element.nativeElement;
        zipCodeField.focus();
        if (zipCodeField.value && zipCodeField.value.length > 0) {
          this.zipClearIcon = 'visible';
          if (zipCodeField.value.length < 3) {
            return;
          }
        } else {
          this.zipClearIcon = 'hidden';
        }
        event.stopPropagation();
        setTimeout(() => {
          this.zipCodeTypeAheadTrigger._onChange('');
          this.zipCodeTypeAheadTrigger.openPanel();
        });
      });
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadLandingPageComponent,
        FadConstants.methods.displayZipCodeDropDown);
    }
  }

  /**
   * @description hide the plan drop down
   */
  public hiddenZipCodeDropDown(): void {
    try {
      if (this.viewPortWidth < 993) {
        this.emboseZipCodeFieldOnScreen(false);
      }

      setTimeout(() => {
        try {
          this.zipCodeTypeAheadTrigger._onChange(this.searchControls.zipCodeTypeAheadControl.value);
          this.planTypeAheadTrigger.closePanel();
        } finally {
          // IGNORE ERROR - IT WILL RESULT IN ANGULAR ERROR ON AUTOMATIC FOCUS TO SEARCH FIELD ON PAGE LOAD
        }
      }, 100);
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadLandingPageComponent,
        FadConstants.methods.hiddenPlanDropDown);
    }
  }

  /**
   * @description helps display values in the search for a plan name typeahead list
   * @param event
   */
  public displayPlanDropDown(event): void {
    try {
      if (this.viewPortWidth < 993) {
        this.embosePlanFieldOnScreen(true);
      }
      document.getElementsByTagName('body')[0].click();

      const planField = this.planTypeAheadTrigger._element.nativeElement;
      planField.focus();
      if (planField.value && planField.value.length > 0) {
        this.planClearIcon = 'visible';
      } else {
        this.planClearIcon = 'hidden';
      }

      event.stopPropagation();
      setTimeout(() => {
        this.planTypeAheadTrigger._onChange('');
        this.planTypeAheadTrigger.openPanel();
      });
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadLandingPageComponent,
        FadConstants.methods.displayPlanDropDown);
    }
  }

  /**
  * @description hide the plan drop down
  */
  public hiddenPlanDropDown(): void {
    try {
      if (this.viewPortWidth < 993) {
        this.embosePlanFieldOnScreen(false);
      }

      setTimeout(() => {
        try {
          this.planTypeAheadTrigger._onChange(this.searchControls.planControl.value);
          this.planTypeAheadTrigger.closePanel();
        } finally {
          // IGNORE ERROR - IT WILL RESULT IN ANGULAR ERROR ON AUTOMATIC FOCUS TO SEARCH FIELD ON PAGE LOAD
        }
      }, 100);
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadLandingPageComponent,
        FadConstants.methods.hiddenPlanDropDown);
    }
  }

  /**
   * @description helps display values in the search for a dependant typeahead list
   * @param event
   */
  public displayDependentListDropDown(event): void {
    try {
      if (this.viewPortWidth < 993) {
        this.emboseDependantsFieldOnScreen(true);
      }
      document.getElementsByTagName('body')[0].click();
      // this.dependantListTypeAheadTrigger._element.nativeElement.focus();

      const dependantField = this.dependantListTypeAheadTrigger._element.nativeElement;
      dependantField.focus();
      if (dependantField.value && dependantField.value.length > 0) {
        this.dependantClearIcon = 'visible';
      } else {
        this.dependantClearIcon = 'hidden';
      }
      event.stopPropagation();
      setTimeout(() => {
        this.dependantListTypeAheadTrigger._onChange('');
        this.dependantListTypeAheadTrigger.openPanel();
      });
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadLandingPageComponent,
        FadConstants.methods.displayDependentListDropDown);
    }
  }

  /**
   * @description hide the dependant drop down
   */
  public hiddenDependantDropDown(): void {
    try {
      if (this.viewPortWidth < 993) {
        this.emboseDependantsFieldOnScreen(false);
      }

      setTimeout(() => {
        try {
          this.dependantListTypeAheadTrigger._onChange(this.searchControls.dependantNameControl.value);
          this.dependantListTypeAheadTrigger.closePanel();
        } finally {
          // IGNORE ERROR - IT WILL RESULT IN ANGULAR ERROR ON AUTOMATIC FOCUS TO SEARCH FIELD ON PAGE LOAD
        }
      }, 100);
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadLandingPageComponent,
        FadConstants.methods.hiddenPlanDropDown);
    }
  }

  /**
   * @name showDoctorList
   * @description to help display the doctors list on screen
   */
  public showDoctorList(): void {
    try {
      this.router.navigate([FadConstants.urls.fadSearchResultsPage]);
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadLandingPageComponent,
        FadConstants.methods.showDoctorList);
    }
  }

  /**
   * @name displayPastSearchHistory
   * @description helps display 10 previous search results
   */
  public displayPastSearchHistory() {
    try {
      this.router.navigate([FadConstants.urls.fadPastSearchQueries]);
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadLandingPageComponent,
        FadConstants.methods.displayPastSearchHistory);
    }
  }

  /**
   * @description helps display the All Specialities and All Procedures screen
   * @param url - specialities/procedures routing url
   */
  public openMedicalIndex(url: string) {
    try {
      this.landingPageService.setCachedSearchControlState(this.searchControls);
      this.router.navigate([url]);
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadLandingPageComponent,
        FadConstants.methods.openMedicalIndex);
    }
  }

  /**
   * @description gets triggered when the remove icon is clicked inside the search fields. Helps clear the current field value when clicked
   * @return void - nothing
   */
  public clearTargetValue(target?: string): void {
    try {
      target = target || this.focusedTarget;

      switch (target) {
        // when remove icon inside the search doctor field is clicked
        case (FadLandingPageFocusTracker.searchText):
          this.searchControls.searchTypeAheadControl.setValue('');
          if (this.searchControls.searchTypeAheadControl.value === '') {
            this.isSearchButtonDisabled = true;
          }
          this.searchTextTypeAheadTrigger._element.nativeElement.focus();
          break;
        // when remove icon inside the search zipcode field is clicked
        case (FadLandingPageFocusTracker.zipCode):
          this.searchControls.zipCodeTypeAheadControl.setValue('');

          if (this.searchControls.zipCodeTypeAheadControl.value === '') {
            this.zipCodeValidationErrors.noMatchFound.display = false;
            this.zipCodeValidationErrors.invalidZipCode.display = true;
            this.isSearchButtonDisabled = true;
          }

          this.zipCodeTypeAheadTrigger._element.nativeElement.focus();
          break;
        // when remove icon inside the search plan field is clicked
        case (FadLandingPageFocusTracker.plan):
          this.searchControls.planControl.setValue('');
          if (this.searchControls.planControl.value === '') {
            this.isSearchButtonDisabled = true;
          }
          this.planTypeAheadTrigger._element.nativeElement.focus();
          break;
        // when remove icon inside the search dependant field is clicked
        case (FadLandingPageFocusTracker.dependant):
          this.searchControls.dependantNameControl.setValue('');
          if (this.searchControls.dependantNameControl.value === '') {
            // this.isSearchButtonDisabled = true;
          }
          this.dependantListTypeAheadTrigger._element.nativeElement.focus();
          break;
        // otherwise do nothing
        default: break;
      }
      this.focusedTarget = '';
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadLandingPageComponent,
        FadConstants.methods.clearTargetValue);
    }
  }

  /**
   * @description triggers when the 'Search' button is clicked on the landing page component
   *  defines specific behavour for Abstract mode (when displayed as child component)
   *  and Normal mode (when displayed as stand alone component)
   * @returns void - nothing
   */
  public doSearch(): void {
    try {

      if (this.viewPortWidth <= 992 && this.componentMode === <FadLandingPageComponentMode>'Abstract') {
        this.landingPageService.setCachedSearchControlState(this.searchControls);
        this.router.navigate([FadConstants.urls.fadLandingPage]);
        return;
      }

      const searchCriteria = this.searchControls.getValues(this.fadSearchResultsService);
      this.fadSearchResultsService.setSearchCriteria(searchCriteria);
      if (this.componentMode === <FadLandingPageComponentMode>'Abstract') {

        this.router.navigate([FadConstants.urls.fadSearchResultsPage]);

      } else {
        this.router.navigate([FadConstants.urls.fadSearchResultsPage]);
      }
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadLandingPageComponent,
        FadConstants.methods.doSearch);
    }
  }

  /**
   * @description helps populate the landing page's search control with default/cached values as necessary
   *  Also take care of initializing the drop down typeahead component behaviour for each of the search fields
   */
  private initData() {
    try {

      // temporary code - value should come from API
      this.userCurrentPlan.name = FadConstants.defaults.planName;
      this.userCurrentPlan.id = FadConstants.defaults.planId;
      // end: temporary code - value should come from API

      this.isLogin = this.authService.isLogin();

      if (this.isLogin) {
        this.defaultAutoCompleteSearchOption.push((new FadAutoCompleteOptionForSearchText())
          .setCategory(FadConstants.text.notSureWhatToSearch)
          .addOption((new FadAutoCompleteComplexOption()).setLink(FadConstants.text.allSpecialities, '/fad/medical-index/specialities'))
          .addOption((new FadAutoCompleteComplexOption()).setLink(FadConstants.text.allProcedures, '/fad/medical-index/procedures')));

        if (!this.landingPageService.getCachedSearchControlState()) {
          const defaultObj = (new FadAutoCompleteComplexOption())
            .setSimpleText(this.userCurrentPlan.name).setNetworkId(this.userCurrentPlan.id);
          this.searchControls.planControl.setValue(defaultObj);
        }
      } else {
        this.defaultAutoCompleteSearchOption.push((new FadAutoCompleteOptionForSearchText())
          .setCategory(FadConstants.text.notSureWhatToSearch)
          .addOption((new FadAutoCompleteComplexOption()).setLink(FadConstants.text.allSpecialities, '/fad/medical-index/specialities')));
      }


      if (!this.landingPageService.cachedResponse) {
        this.landingPageService.cachedResponse = new LandingPageResponseCacheModel();
      }

      this.autoCompleteOptionsForSearchText = this.defaultAutoCompleteSearchOption;

      // Start Handle Dependend list data //
      if (!this.landingPageService.cachedResponse.dependantsList) {
        this.dependantsList = [];

        if (this.authService.getDependentsList() && this.authService.getDependentsList().dependents.length > 0) {
          const dependantsData = this.authService.getDependentsList();

          dependantsData.dependents.map((listData) => {
            this.dependantsList.push(`${listData.dependent.firstName} - ${listData.dependent.lastName}`);
          });
        }
        this.landingPageService.cachedResponse.dependantsList = this.dependantsList;

      } else {
        this.dependantsList = this.landingPageService.cachedResponse.dependantsList;
      }
      // End Handle Dependend list data //


      // Start Handle Plan Option list data //
      if (!this.landingPageService.cachedResponse.planOptions) {
        const planSearchRequest: FADPlanSearchRequestModelInterface = new FADPlanSearchRequestModel();
        planSearchRequest.uid = this.authService.useridin;
        this.landingPageService.getVitalsPlanInfo(planSearchRequest).subscribe(response => {
          const planOption = new FadAutoCompleteOptionForSearchText();
          response.plans.map(plan => {
            planOption.addOption((new FadAutoCompleteComplexOption()).setSimpleText(plan.name).setNetworkId(plan.id));
          });
          this.planOptions.push(planOption);
          this.defaultPlanOptions = this.planOptions;
          this.landingPageService.cachedResponse.planOptions = this.planOptions;
        },
          error => {
            this.bcbsmaErrorHandler.handleHttpError(error,
              BcbsmaConstants.modules.fadModule,
              FadConstants.services.landingPageService,
              FadConstants.methods.getVitalsPlanInfo);
          });
      } else {
        this.planOptions = this.landingPageService.cachedResponse.planOptions;
        this.defaultPlanOptions = this.planOptions;
      }

      this.filteredPlanOptions = this.searchControls.planControl.valueChanges.pipe(
        startWith(''),
        delay(0),
        map(val => {
          try {
            if (this.planTypeAheadTrigger) {
              const currentSelectedValue = val ? val : this.planTypeAheadTrigger._element.nativeElement.value.trim();
              let searchPlanText = '';

              if (typeof currentSelectedValue === 'object') {
                searchPlanText = currentSelectedValue.getSimpleText() || currentSelectedValue.getSimpleText();
              }
              return this.filterAutoCompletePlanOptions(searchPlanText);
            } else {
              return this.filterAutoCompletePlanOptions('');
            }
          } catch (exception) {
            this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
              FadConstants.components.fadLandingPageComponent,
              FadConstants.methods.initData);
          }
        }
        )
      );
      // End Handle Plan Option list data

    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadLandingPageComponent,
        FadConstants.methods.initData);
    }
  }


  /**
   * @description helps to search the data on typehead component after populate the
   * landing page's search control with default/cached values as necessary
   */
  private enhancedSearchAfterInitData() {
    try {

      this.searchControls.zipCodeTypeAheadControl.valueChanges
        .subscribe(searchText => {
          if (searchText && this.searchControls.zipCodeTypeAheadControl.value.trim()) {
            this.removeZipCodeError();
          }

          if (!searchText || (searchText && searchText.length < 3)) {
            return;
          }

          const cachedZipCodeLookupOptions: FZCSRCity[] = this.landingPageService.getCachedZipCodeLookupOptions(searchText.trim());
          if (cachedZipCodeLookupOptions) {
            this.zipCodeOptions = cachedZipCodeLookupOptions;
            this.landingPageService.cachedResponse.setZipCodeOptions(this.zipCodeOptions);

            this.searchControls.zipCodeTypeAheadControl.valueChanges.pipe(
              startWith(''),
              delay(0),
              map(val => {
                if (this.zipCodeTypeAheadTrigger) {
                  clearInterval(this.zipCodeTypeAheadTrigger);
                  const currentSelectedValue = val ? val :
                    this.zipCodeTypeAheadTrigger._element.nativeElement.value.trim();

                  this.filteredZipCodeOptions = Observable.of(this.zipCodeOptions.filter(option =>
                    option.city.toLowerCase().indexOf(currentSelectedValue.toLowerCase()) !== -1 ||
                    option.zip.indexOf(currentSelectedValue) !== -1)
                  );
                } else {
                  this.filteredZipCodeOptions = Observable.of(this.zipCodeOptions);
                }
              })
            ).subscribe();

            return;
          }

          const zip_inSearchText = searchText ? searchText.split('-')[0].trim() : '';
          const vitalsZipCodeSearchRequest: FadVitalsZipCodeSearchRequestModelInterface = new FadVitalsZipCodeSearchRequestModel();
          vitalsZipCodeSearchRequest.place = zip_inSearchText;
          vitalsZipCodeSearchRequest.page = 1;
          vitalsZipCodeSearchRequest.limit = this.viewPortWidth > 992 ? 10 : 6;

          this.landingPageService.getVitalsZipCodeInfo(vitalsZipCodeSearchRequest)
            .subscribe(
              response => {
                try {
                  this.landingPageService.vitalsZipCodeInfo = response;
                  this.zipcodeResponseValidator();
                  if (response.cities) {
                    if (searchText && searchText.length >= 3 && response.cities.length === 0 &&
                      this.zipCodeValidationErrors.noMatchFound.exists === false) {
                      this.zipCodeValidationErrors.noMatchFound.display = false;
                      this.zipCodeValidationErrors.invalidZipCode.display = false;
                      if ((searchText && this.searchControls.searchTypeAheadControl.value &&
                        this.textToHighlightInPlanOption) || (searchText && this.getLocalStorageZipCodeOption &&
                          this.searchControls.searchTypeAheadControl.value && this.textToHighlightInPlanOption)) {
                        this.isSearchButtonDisabled = false;
                      }
                    }
                    if (searchText && searchText.length >= 3 && this.zipCodeValidationErrors.invalidZipCode.exists === false
                      && response.cities.length === 0 && this.zipCodeValidationErrors.noMatchFound.exists === true) {
                      this.zipCodeValidationErrors.noMatchFound.display = true;
                      this.zipCodeValidationErrors.invalidZipCode.display = false;
                      this.isSearchButtonDisabled = true;
                    }
                  }
                  if (this.zipCodeValidationErrors.invalidZipCode.exists === true) {
                    this.zipCodeValidationErrors.noMatchFound.display = false;
                    this.zipCodeValidationErrors.invalidZipCode.display = true;
                    this.isSearchButtonDisabled = true;
                  }

                  this.zipCodeOptions = response && response.cities ? <FZCSRCity[]>response.cities : <FZCSRCity[]>[];
                  if (!this.zipCodeTypeAheadTrigger) {
                    return;
                  }

                  this.landingPageService.cachedResponse.setZipCodeOptions(this.zipCodeOptions);
                  // this.landingPageService.setCachedZipCodeLookupOptions(searchText, Object.assign([], this.zipCodeOptions));
                  const zipFrag = searchText ? searchText.trim().split(' - ') : '';
                  if (zipFrag[0] && Number(zipFrag[0].trim())) {
                    this.landingPageService.setCachedZipCodeLookupOptions(zipFrag[0].trim(), Object.assign([], this.zipCodeOptions));
                  }

                  this.searchControls.zipCodeTypeAheadControl.valueChanges.pipe(
                    startWith(''),
                    delay(0),
                    map(val => {
                      if (this.zipCodeTypeAheadTrigger) {
                        clearInterval(this.zipCodeTypeAheadTrigger);
                        const currentSelectedValue = val ? val :
                          this.zipCodeTypeAheadTrigger._element.nativeElement.value.trim();

                        this.filteredZipCodeOptions = Observable.of(this.zipCodeOptions.filter(option =>
                          option.city.toLowerCase().indexOf(currentSelectedValue.toLowerCase()) !== -1 ||
                          option.zip.indexOf(currentSelectedValue) !== -1)
                        );
                      } else {
                        this.filteredZipCodeOptions = Observable.of(this.zipCodeOptions);
                      }
                    })
                  ).subscribe();

                } catch (exception) {
                  this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
                    FadConstants.components.fadLandingPageComponent,
                    FadConstants.methods.getVitalsZipCodeInfo);
                }
              },
              error => {
                this.bcbsmaErrorHandler.handleHttpError(error,
                  BcbsmaConstants.modules.fadModule,
                  FadConstants.services.landingPageService,
                  FadConstants.methods.getVitalsZipCodeInfo);
              });

        }, error => {
          this.bcbsmaErrorHandler.handleHttpError(error,
            BcbsmaConstants.modules.fadModule,
            FadConstants.services.searchTypeAheadControl_valueChanges,
            FadConstants.methods.valueChanges);
        });

      this.searchControls.planControl.valueChanges
        .subscribe(searchText => {
          try {
            if (typeof searchText === 'object') {
              searchText = searchText.getSimpleText() || searchText.getSimpleText();
            }

            this.planOptions = this.defaultPlanOptions;

            this.filteredPlanOptions = this.searchControls.planControl.valueChanges
              .pipe(
                startWith(''), delay(0),
                map(val => {
                  const searchPlanText = (searchText !== '') ? searchText : this.planTypeAheadTrigger._element.nativeElement.value.trim();
                  return this.filterAutoCompletePlanOptions(searchPlanText);
                })
              );
          } catch (exception) {
            this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
              FadConstants.components.fadLandingPageComponent,
              FadConstants.methods.ngOnInit);
          }
        },
          error => {
            this.bcbsmaErrorHandler.handleHttpError(error,
              BcbsmaConstants.modules.fadModule,
              FadConstants.services.planControl_valueChanges,
              FadConstants.methods.valueChanges);
          });

      // Karthik uncomment this for single search wait time strategy //
      this.searchControls.searchTypeAheadControl.valueChanges.debounceTime(this.debounceTime).distinctUntilChanged()
        // this.searchControls.searchTypeAheadControl.valueChanges
        .subscribe(searchText => {
          try {
            if (!searchText) {
              this.isSearchButtonDisabled = true;
            }
            if (searchText && searchText.length > 2) {
              if ((searchText && this.searchControls.searchTypeAheadControl.value &&
                this.searchControls.zipCodeTypeAheadControl.value && this.textToHighlightInPlanOption) ||
                (searchText && this.getLocalStorageZipCodeOption && this.searchControls.searchTypeAheadControl.value
                  && this.searchControls.zipCodeTypeAheadControl.value && this.textToHighlightInPlanOption)) {
                this.isSearchButtonDisabled = false;
              }
              // console.log("Autocomplete search text", searchText);
              const cachedLookupOptions: FadAutoCompleteOptionForSearchText[] =
                this.landingPageService.getCachedSearchTextLookupOptions(searchText);
              if (cachedLookupOptions) {
                this.autoCompleteOptionsForSearchText = cachedLookupOptions;
                this.filteredAutoCompleteSearchOptions = Observable.of(this.filterAutoCompleteSearchOptions(searchText));
                return;
              }
              const vitalsAutoCompleteSearchRequest: GetSearchByProviderRequestModelInterface
                = new GetSearchByProviderRequestModel();

              const selectedZipCodeOptions: FZCSRCity = this.searchControls.getValues(this.fadSearchResultsService)
                .getZipCode();
              vitalsAutoCompleteSearchRequest.setSearchParameter(searchText)
                .setGeoLocation(selectedZipCodeOptions ?
                  selectedZipCodeOptions.getGeo() : '') // this.getGeoLocationFromCityServiceReponse())
                .setNetworkId(FadConstants.defaults.networkId)  // have to check -
                // networkid has to come from chosen plan - check with prag - kalagi01
                .setLimit(FadConstants.defaults.autoCompleteSearchRequest_limit)
                .setPage(FadConstants.defaults.autoCompleteSearchRequest_page);

              // vitalsAutoCompleteSearchRequest.limit = 12;
              // vitalsAutoCompleteSearchRequest.networkPlanId = 311005033;

              this.landingPageService.getVitalsAutoCompleteSearchResponse(vitalsAutoCompleteSearchRequest)
                .subscribe(
                  response => {
                    try {

                      if (response.result && response.result < 0) {
                        console.log(response.displaymessage);
                        return;
                      }

                      this.autoCompleteOptionsForSearchText = [];
                      const conditionList = (new FadAutoCompleteOptionForSearchText()).setCategory('');
                      // .setCategory(FadConstants.text.areYouLookingFor);
                      // const procedureList = (new FadAutoCompleteOptionForSearchText())
                      // .setCategory(`All procedures with '${searchText}'`);
                      const doctorsList = (new FadAutoCompleteOptionForSearchText())
                        .setCategory(`${FadConstants.text.allDoctorOptionText}'${searchText}'`);
                      const facilityList = (new FadAutoCompleteOptionForSearchText())
                        .setCategory(`${FadConstants.text.allHospitalsOrFacilitiesText}'${searchText}'`);

                      if (response.searchSpecialties) {
                        response.searchSpecialties.map((speciality) => {
                          const conditionOption: FadAutoCompleteComplexOptionInterface = new FadAutoCompleteComplexOption();
                          conditionOption.setSimpleText(speciality.name)
                            .setSpecialityId(speciality.id)
                            .setInfoText(FadConstants.text.speciality)
                            .setResourceTypeCode(<FadResourceTypeCode>speciality.resourceTypeCode);
                          conditionList.options.push(conditionOption);
                        });
                      }

                      if (response.professionals) {
                        response.professionals.map((professional) => {
                          const doctorNameOption: FadAutoCompleteComplexOptionInterface = new FadAutoCompleteComplexOption();
                          doctorNameOption.setContextText(professional.name)
                            .setInfoText(professional.specialty)
                            .setNetworkId(professional.id)
                            .setResourceTypeCode(FadResouceTypeCodeConfig.professional);
                          // .setLink(professional.specialty, '/fad/doctor-profile');
                          doctorsList.options.push(doctorNameOption);
                        });
                      }

                      if (response.facilities) {
                        response.facilities.map((facility) => {
                          const facilityNameOption: FadAutoCompleteComplexOptionInterface = new FadAutoCompleteComplexOption();
                          facilityNameOption.setContextText(facility.name)
                            .setInfoText(facility.specialty)
                            .setNetworkId(facility.id)
                            .setResourceTypeCode(FadResouceTypeCodeConfig.facility);
                          // .setLink(facility.specialty, '/fad/facility-profile');
                          facilityList.options.push(facilityNameOption);
                        });
                      }

                      if (conditionList.options.length) {
                        this.autoCompleteOptionsForSearchText.push(conditionList);
                      }

                      if (doctorsList.options.length) {
                        this.autoCompleteOptionsForSearchText.push(doctorsList);
                      }

                      if (facilityList.options.length) {
                        this.autoCompleteOptionsForSearchText.push(facilityList);
                      }
                      if (this.autoCompleteOptionsForSearchText && this.autoCompleteOptionsForSearchText.length > 0) {
                        this.landingPageService.setCachedSearchTextLookupOptions(searchText,
                          Object.assign([], this.autoCompleteOptionsForSearchText));
                      }

                      this.filteredAutoCompleteSearchOptions = Observable.of(this.filterAutoCompleteSearchOptions(searchText));
                    } catch (exception) {
                      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
                        FadConstants.components.fadLandingPageComponent,
                        FadConstants.methods.ngOnInit);
                    }
                  },
                  error => {
                    this.bcbsmaErrorHandler.handleHttpError(error,
                      BcbsmaConstants.modules.fadModule,
                      FadConstants.services.landingPageService,
                      FadConstants.methods.getVitalsAutoCompleteSearchResponse);
                  },
                  () => {
                    this.landingPageService.showAutoCompleteDropDownSpinner = false;
                  });
            } else {
              this.autoCompleteOptionsForSearchText = this.defaultAutoCompleteSearchOption;
              this.filteredAutoCompleteSearchOptions = Observable.of(this.filterAutoCompleteSearchOptions(searchText));

            }
          } catch (exception) {
            this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
              FadConstants.components.fadLandingPageComponent,
              FadConstants.methods.ngOnInit);
          }
        }, error => {
          this.bcbsmaErrorHandler.handleHttpError(error,
            BcbsmaConstants.modules.fadModule,
            FadConstants.services.searchTypeAheadControl_valueChanges,
            FadConstants.methods.valueChanges);
        });

      this.filteredDependantsList = this.searchControls.dependantNameControl.valueChanges.pipe(
        startWith(''), delay(0),
        map(val => {
          try {
            let currentSelectedValue = '';
            if (this.dependantListTypeAheadTrigger) {
              clearInterval(this.dependantListTypeAheadTrigger);
              currentSelectedValue = val ? val : this.dependantListTypeAheadTrigger._element.nativeElement.value.trim();
            } else if (this.searchControls.dependantNameControl && this.searchControls.dependantNameControl.value) {
              currentSelectedValue = this.searchControls.dependantNameControl.value;
            }
            return this.dependantsList.filter(option => option.toLowerCase().indexOf(currentSelectedValue.toLowerCase()) !== -1);
          } catch (exception) {
            this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
              FadConstants.components.fadLandingPageComponent,
              FadConstants.methods.ngOnInit);
          }
        })
      );

    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadLandingPageComponent,
        FadConstants.methods.enhancedSearchAfterInitData);
    }
  }

  /**
   * @description update the zipcode field from local storage of application;
   */
  private UpdateZipCodeFieldFromApplicationStorage() {
    let cachedCityZip: FZCSRCity = <FZCSRCity>this.fadSearchResultsService.getLastSelectedZipCodeOption();

    // if (!cachedCityZip) {
    if (this.getLocalStorageZipCodeOption) {
      cachedCityZip = new FZCSRCity();
      // cachedCityZip.setZip(FadConstants.defaults.zipCode)
      // .setCity(FadConstants.defaults.city)
      // .setState_code(FadConstants.defaults.stateCode)
      // .setGeo(FadConstants.defaults.geo); // '42.242921,-71.009972');
      cachedCityZip.setZip(this.getLocalStorageZipCodeOption.zip)
        .setCity(this.getLocalStorageZipCodeOption.city)
        .setState_code(this.getLocalStorageZipCodeOption.state_code)
        .setGeo(this.getLocalStorageZipCodeOption.geo); // '42.242921,-71.009972');
      this.fadSearchResultsService.setLastSelectedZipCodeOption(cachedCityZip);

      const zipCodeText = `${cachedCityZip.getZip()} - ${cachedCityZip.getCity()}, ${cachedCityZip.getState_code()}`;
      this.searchControls.zipCodeTypeAheadControl.setValue(zipCodeText);
      this.zipCodeTypeAheadTrigger._element.nativeElement.value = zipCodeText;
      this.zipCodeOptions.push(cachedCityZip);
    }
  }

  /**
   * @description helps prepare a list of options to be displayed in the auto complete drop down list for the plan field
   * @param searchText :string
   * @return FadAutoCompleteOptionForSearchText[] - options used to display data in the auto complete drop down typeahead list
   * for the plan field
   */
  private filterAutoCompletePlanOptions(searchText: string): FadAutoCompleteOptionForSearchText[] {
    this.textToHighlightInPlanOption = searchText;
    // console.log("hightlight plan text", this.textToHighlightInPlanOption);
    if (!searchText) {
      this.isSearchButtonDisabled = true;
    } else if ((searchText && this.searchControls.searchTypeAheadControl.value &&
      this.searchControls.zipCodeTypeAheadControl.value) || (searchText && this.getLocalStorageZipCodeOption
        && this.searchControls.searchTypeAheadControl.value && this.searchControls.zipCodeTypeAheadControl.value)) {
      this.isSearchButtonDisabled = false;
    }
    let filteredOptions: FadAutoCompleteOptionForSearchText[] = [];
    try {

      if (searchText.trim().length && searchText.length > 2) {

        this.planOptions.map(autoCompleteOption => {

          const matchingOptionTexts = autoCompleteOption.options.filter(option => {
            return option.getSimpleText().toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
          });

          if (matchingOptionTexts.length) {
            const matchingOption: FadAutoCompleteOptionForSearchText = new FadAutoCompleteOptionForSearchText();
            matchingOption.category = autoCompleteOption.category;
            matchingOption.options = matchingOptionTexts;

            filteredOptions.push(matchingOption);
          }
        });

        if (this.isLogin) {
          filteredOptions.push((new FadAutoCompleteOptionForSearchText()).addOption((new FadAutoCompleteComplexOption())
            .setInfoText(FadConstants.plans.myCurrentPlanOption)
            .setContextText(this.userCurrentPlan.name)
            .setNetworkId(this.userCurrentPlan.id)
          ));
        } else {
          filteredOptions.push((new FadAutoCompleteOptionForSearchText()).addOption((new FadAutoCompleteComplexOption())
            .setInfoText(FadConstants.plans.dontKnowPlanOption)
            .setContextText(FadConstants.text.dontKnowPlan)
            .setNetworkId(FadConstants.plans.dontKnowPlanOptionId)
          ));
        }

      } else {
        filteredOptions = this.pushDefaultAutoCompletePlanOption(searchText);
      }
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadLandingPageComponent,
        FadConstants.methods.filterAutoCompleteSearchOptions);
    }

    return filteredOptions;
  }

  /**
   * @description helps prepare a list of options for defaulted plan option
   * @param searchText :string
   * @return FadAutoCompleteOptionForSearchText[] - options used to display data in the auto complete
   * drop down typeahead list
   * for the plan field
   */
  public pushDefaultAutoCompletePlanOption(searchText: string): FadAutoCompleteOptionForSearchTextInterface[] {
    const filteredOptions: FadAutoCompleteOptionForSearchText[] = [];
    const defaultPlanArrary = [FadConstants.plans.myCurrentPlanOption,
    FadConstants.plans.dontKnowPlanOption, FadConstants.plans.defaultOption];

    if (this.landingPageService.getCachedSearchControlState() &&
      this.searchControls.planControl.value && this.searchControls.planControl.value.profileId
      && !defaultPlanArrary.includes(this.searchControls.planControl.value.infoText)) {
      filteredOptions.push((new FadAutoCompleteOptionForSearchText()).addOption(this.searchControls.planControl.value));
    }

    if (this.isLogin) {
      filteredOptions.push((new FadAutoCompleteOptionForSearchText()).addOption((new FadAutoCompleteComplexOption())
        .setInfoText(FadConstants.plans.myCurrentPlanOption)
        .setContextText(this.userCurrentPlan.name).setNetworkId(this.userCurrentPlan.id)));
    } else {

      if (searchText.length > 0 || (this.searchControls.planControl && this.searchControls.planControl.value)) {
        filteredOptions.push((new FadAutoCompleteOptionForSearchText()).addOption((new FadAutoCompleteComplexOption())
          .setInfoText(FadConstants.plans.dontKnowPlanOption)
          .setContextText(FadConstants.text.dontKnowPlan).setNetworkId(FadConstants.plans.dontKnowPlanOptionId)));
      } else {
        filteredOptions.push((new FadAutoCompleteOptionForSearchText()).setCategory(FadConstants.text.dontSeePlan)
          .addOption((new FadAutoCompleteComplexOption()).setInfoText(FadConstants.plans.defaultOption)));
      }

    }

    return filteredOptions;
  }

  /**
   * @description  helps prepare a list of options to be displayed in the auto complete search results when user types
   * a minimum of 3 characters in the Search for a doctor/facility/provider field
   * @param searchText :string
   * @return FadAutoCompleteOptionForSearchText[] - options used to display data in the auto complete drop down typeahead list
   */
  private filterAutoCompleteSearchOptions(searchText: string): FadAutoCompleteOptionForSearchText[] {
    let filteredOptions: FadAutoCompleteOptionForSearchText[] = [];
    try {
      if (searchText && searchText.length > 2) {
        this.textToHighlightInSearchTextOption = searchText;
        this.autoCompleteOptionsForSearchText.map(autoCompleteOption => {
          if (autoCompleteOption.category ||
            (autoCompleteOption.category === '' && autoCompleteOption.options && autoCompleteOption.options.length > 0)) {
            filteredOptions.push(autoCompleteOption);
          } else {
            const matchingOptionTexts = autoCompleteOption.options.filter(option => {
              return option.getSimpleText().toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
            });

            if (matchingOptionTexts.length) {
              const matchingOption: FadAutoCompleteOptionForSearchText = new FadAutoCompleteOptionForSearchText();
              matchingOption.category = autoCompleteOption.category;
              matchingOption.options = matchingOptionTexts;

              filteredOptions.push(matchingOption);
            }
          }
        });
      }

      if (!filteredOptions.length) {
        filteredOptions = this.defaultAutoCompleteSearchOption;
      }
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadLandingPageComponent,
        FadConstants.methods.filterAutoCompleteSearchOptions);
    }
    return filteredOptions;
  }



  /**
   * @description get plan id from selected plan option
   */
  private getPlanIdFromPlanDetails() {
    return this.searchControls.planControl.value ? this.searchControls.planControl.value.profileId : null;
  }

  /**
   * @description display the selected plan option name on the search text
    */
  public displaySelectedPlanOptionName(state) {
    if (state) {
      // console.log('selected', state);
      return state.contextText || state.getSimpleText();
    }
  }

  /**
   * @description proceed with the auto complete option search
   */
  public async selectAutoCompleteSearchTextOption(optionObj: FadAutoCompleteComplexOption) {
    const searchCriteria = this.searchControls.getValues(this.fadSearchResultsService);

    searchCriteria.setSearchText(optionObj);
    this.fadSearchResultsService.setLastSelectedSearchTextOption(optionObj);
    this.fadSearchResultsService.setSearchCriteria(searchCriteria);

    if (this.searchControls.zipCodeTypeAheadControl.value && this.searchControls.zipCodeTypeAheadControl.value.trim()) {
      if (optionObj.getResourceTypeCode() === FadResouceTypeCodeConfig.professional) {

        const getDoctorProfileRequest: DoctorProfileSearchRequestModelInterface = new DoctorProfileSearchRequestModel();
        const selectedZipCodeOptions: FZCSRCity = this.searchControls.getValues(this.fadSearchResultsService).getZipCode();

        getDoctorProfileRequest.professionalid = optionObj.getNetworkId().toString();
        getDoctorProfileRequest.geo_location = selectedZipCodeOptions ? selectedZipCodeOptions.getGeo() : '';
        getDoctorProfileRequest.network_id = this.getPlanIdFromPlanDetails();

        this.doctorProfileService.doctorProfile = optionObj.getNetworkId();
        sessionStorage.setItem('professionalId', optionObj.getNetworkId().toString());
        this.router.navigate([FadConstants.urls.fadDoctorProfilePage]);

      } else if (optionObj.getResourceTypeCode() === FadResouceTypeCodeConfig.facility) {
        this.facilityProfileService.facilityProfile = optionObj.getNetworkId();
        sessionStorage.setItem('facilityProfileId', optionObj.getNetworkId().toString());
        this.router.navigate([FadConstants.urls.fadFacilityProfilePage]);
      }
    }
  }

  /**
   * @description proceed with the auto complete optgroup option search
   */
  public searchTypeOptLableClickHandler(e) {
    const optGroupParentElement: boolean = e.target.parentElement.classList.contains('clickable-label');
    if (optGroupParentElement && e.target.className.split(' ').indexOf('mat-optgroup-label') >= 0) {
      try {
        if (this.viewPortWidth < 993) {
          this.emboseSearchTextFieldOnScreen(false);
        }

        if (e.target && e.target.innerText && e.target.innerText.indexOf(FadConstants.text.allDoctorOptionText) === 0) {
          const searchControlValues: FadLandingPageSearchControlValues = this.searchControls.getValues(this.fadSearchResultsService);
          // let searchTextOption: FadAutoCompleteComplexOption = searchControlValues.getSearchText();
          // if (!searchTextOption) {
          //   searchTextOption = new FadAutoCompleteComplexOption();
          // }

          const searchTextOption = new FadAutoCompleteComplexOption();
          // searchTextOption.setSimpleText(e.target.innerText.replace(FadConstants.text.allDoctorOptionText, '').replace(/'/g, ''));
          searchTextOption.setSimpleText(e.target.innerText.trim());
          searchTextOption.setResourceTypeCode(FadResouceTypeCodeConfig.professional);

          searchControlValues.setSearchText(searchTextOption);

          this.fadSearchResultsService.setLastSelectedSearchTextOption(searchTextOption);
          this.searchControls.setValues(searchControlValues);
          this.doSearch();

        } else if (e.target && e.target.innerText && e.target.innerText.indexOf(FadConstants.text.allHospitalsOrFacilitiesText) === 0) {
          const searchControlValues: FadLandingPageSearchControlValues = this.searchControls.getValues(this.fadSearchResultsService);

          const searchTextOption = new FadAutoCompleteComplexOption();
          searchTextOption.setSimpleText(e.target.innerText.trim());
          // searchTextOption.setSimpleText(e.target.innerText.replace(FadConstants.text.allHospitalsOrFacilitiesText, '')
          // .replace(/'/g, ''));
          searchTextOption.setResourceTypeCode(FadResouceTypeCodeConfig.facility);

          searchControlValues.setSearchText(searchTextOption);

          this.fadSearchResultsService.setLastSelectedSearchTextOption(searchTextOption);
          this.searchControls.setValues(searchControlValues);
          this.doSearch();

        } else {
          setTimeout(() => {
            try {
              // this.searchControls.searchTypeAheadControl.setValue('');
              this.searchTextTypeAheadTrigger._onChange(this.searchControls.searchTypeAheadControl.value);
              this.searchTextTypeAheadTrigger.closePanel();
              if (this.searchControls.zipCodeTypeAheadControl.value && this.searchControls.zipCodeTypeAheadControl.value.trim()) {
                this.doSearch();
              }
            } finally {
              // IGNORE ERROR - IT WILL RESULT IN ANGULAR ERROR ON AUTOMATIC FOCUS TO SEARCH FIELD ON PAGE LOAD
            }
          }, 100);
        }


      } catch (exception) {
        this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
          FadConstants.components.fadLandingPageComponent,
          FadConstants.methods.searchTypeOptLableClickHandler);
      }
    }
  }

  //  To display error message if there is invalid input
  zipcodeValidator(zipText) {
    this.zipcodeResponseValidator();
    const validZipCodeRegxp = /^(?:[\d\s-]+|[a-zA-Z\s-]+)$/; // alphanumeric validator
    this.zipCodeValidationErrors.invalidZipCode.exists = (!zipText || (zipText && (zipText.trim() === ''
      || !validZipCodeRegxp.test(zipText))));
    if (this.zipCodeValidationErrors.invalidZipCode.exists === true) {
      this.zipCodeValidationErrors.invalidZipCode.display = true;
      this.zipCodeValidationErrors.noMatchFound.display = false;
      if (!zipText) {
        this.isSearchButtonDisabled = true;
      }
      else if ((zipText && this.searchControls.searchTypeAheadControl.value &&
        this.textToHighlightInPlanOption) || (zipText && this.searchControls.searchTypeAheadControl.value &&
          this.textToHighlightInPlanOption && this.getLocalStorageZipCodeOption)) {
        this.isSearchButtonDisabled = false;
      }
    }

  }

  removeZipCodeError() {
    this.zipCodeValidationErrors.invalidZipCode.display = false;
    this.zipCodeValidationErrors.noMatchFound.display = false;
    // this.isSearchButtonDisabled = false;
  }

  // public itemSelected() {
  //   console.log(this.planTypeAheadTrigger._element.nativeElement.value);
  //   console.log(this.searchControls.planControl.value);
  //   console.log('Do Search value')
  //   const searchCriteria = this.searchControls.getValues();
  //   console.log(searchCriteria);
  // }

  // To display error message if there is no match found in response
  private zipcodeResponseValidator() {
    const searchText = this.searchControls.zipCodeTypeAheadControl.value;
    // console.log('Zip code searchtext', searchText);
    const zipFrag = searchText ? searchText.trim().split('-') : '';
    const cachedZipCodeLookupOptions: FZCSRCity[] = this.landingPageService
      .getCachedZipCodeLookupOptions(zipFrag[0] ? zipFrag[0].trim() : '');
    const alphaNumericRegex: RegExp = new RegExp(/^[a-z0-9]+$/i); // alpha numeric
    this.zipCodeValidationErrors.noMatchFound.exists = (searchText && alphaNumericRegex.test(searchText) &&
      searchText.trim() !== '' && cachedZipCodeLookupOptions && cachedZipCodeLookupOptions.length === 0);
    if (alphaNumericRegex.test(searchText) && cachedZipCodeLookupOptions === undefined &&
      this.zipCodeValidationErrors.noMatchFound.exists === undefined) {
      this.zipCodeValidationErrors.noMatchFound.exists = true;
    }

    const cityFrag = zipFrag[1] ? zipFrag[1].trim().split(',') : '';
    // console.log("city frag", cityFrag);
    // console.log("zipCodeOptions", this.zipCodeOptions);
    if (cityFrag) {
      const zipCodeOptionsIndex = this.zipCodeOptions.findIndex(x => x.zip === zipFrag[0].trim() &&
        x.city === cityFrag[0] && x.state_code === cityFrag[1].trim());
      // console.log("zipCodeOptionsIndex", zipCodeOptionsIndex);
      if (zipCodeOptionsIndex !== -1) {
        this.zipCodeValidationErrors.invalidZipCode.exists = false;
        this.zipCodeValidationErrors.noMatchFound.exists = false;
        this.zipCodeValidationErrors.invalidZipCode.display = false;
        this.zipCodeValidationErrors.noMatchFound.display = false;
        if ((searchText && this.searchControls.searchTypeAheadControl.value && this.textToHighlightInPlanOption)
          || (searchText && this.getLocalStorageZipCodeOption && this.searchControls.searchTypeAheadControl.value
            && this.textToHighlightInPlanOption)) {
          this.isSearchButtonDisabled = false;
        }
      }
    }

    if (searchText && searchText.length >= 3 && cachedZipCodeLookupOptions && cachedZipCodeLookupOptions.length === 0 &&
      this.zipCodeValidationErrors.invalidZipCode.exists === false &&
      this.zipCodeValidationErrors.noMatchFound.exists === true) {
      this.zipCodeValidationErrors.noMatchFound.display = true;
      this.zipCodeValidationErrors.invalidZipCode.display = false;
      if (!searchText) {
        this.isSearchButtonDisabled = true;
      }

    }

  }

}





