import {
  FadLandingPageCompInputInterface,
  FadAutoCompleteOptionForSearchTextInterface,
  FadAutoCompleteComplexOptionInterface,
  FadLinkOptionInterface,
  FadLandingPageSearchControlsModelInterface,
  FadLandingPageSearchControlValuesInterface,
  FadLandingPageCompOutputInterface,
  LandingPageResponseCacheModelInterface
} from './interfaces/fad-landing-page.interface';
import { FadLandingPageComponentMode, FadResourceTypeCode } from './types/fad.types';
import { FormControl } from '@angular/forms';
import { FZCSRCity } from './fad-vitals-collection.model';
import { FadSearchResultsService } from '../fad-search-results/fad-search-results.service';
import { FadConstants } from '../constants/fad.constants';

export class FadLandingPageCompInput implements FadLandingPageCompInputInterface {
  componentMode: FadLandingPageComponentMode;
  fadBaseSearchModel: FadLandingPageSearchControlValues;
}

export class FadLandingPageCompOutput implements FadLandingPageCompOutputInterface {
  public searchCriteria: FadLandingPageSearchControlValues;
}

export class FadAutoCompleteOptionForSearchText implements FadAutoCompleteOptionForSearchTextInterface {
  public category: string = '';
  public options: FadAutoCompleteComplexOptionInterface[] = [];

  public setCategory(category: string): FadAutoCompleteOptionForSearchTextInterface {
    this.category = category;
    return this;
  }
  public addOption(option: FadAutoCompleteComplexOptionInterface): FadAutoCompleteOptionForSearchTextInterface {
    this.options.push(option);
    return this;
  }
}

export class FadAutoCompleteComplexOption implements FadAutoCompleteComplexOptionInterface {
  private simpleText: string = '';
  private contextText: string = '';
  private infoText: string = '';
  private link: FadLinkOption;
  private resourceTypeCode: FadResourceTypeCode;
  private specialityId: number;
  private networkId: number;

  public getSimpleText(): string {
    return this.simpleText;
  }

  public setSimpleText(simpleText: string): FadAutoCompleteComplexOption {
    this.simpleText = simpleText;
    return this;
  }

  public getContextText(): string {
    return this.contextText;
  }

  public setContextText(contextText: string): FadAutoCompleteComplexOption {
    this.contextText = contextText;
    return this;

  }

  public getInfoText(): string {
    return this.infoText;
  }

  public setInfoText(infoText: string): FadAutoCompleteComplexOption {
    this.infoText = infoText;
    return this;

  }

  public getLink(): FadLinkOption {
    return Object.assign(new FadLinkOption(), this.link);
  }

  public setLink(text: string, href: string): FadAutoCompleteComplexOption {
    this.link = new FadLinkOption();
    this.link.text = text;

    this.link.href = href;
    return this;
  }

  public getResourceTypeCode(): FadResourceTypeCode {
    return this.resourceTypeCode;
  }

  public setResourceTypeCode(resourceTypeCode: FadResourceTypeCode): FadAutoCompleteComplexOption {
    this.resourceTypeCode = resourceTypeCode;
    return this;
  }

  public getSpecialityId(): number {
    return this.specialityId;
  }
  public setSpecialityId(specialityId: number): FadAutoCompleteComplexOption {
    this.specialityId = specialityId;
    return this;
  }

  public getNetworkId(): number {
    return this.networkId;
  }
  public setNetworkId(networkId: number): FadAutoCompleteComplexOption {
    this.networkId = networkId;
    return this;
  }
}

class FadLinkOption implements FadLinkOptionInterface {
  public text: string = '';
  public href: string = '';
}

export class FadLandingPageSearchControlsModel implements FadLandingPageSearchControlsModelInterface {
  public searchTypeAheadControl: FormControl;
  public zipCodeTypeAheadControl: FormControl;
  public dependantNameControl: FormControl;
  public planControl: FormControl;

  private searchControlValues: FadLandingPageSearchControlValues;

  constructor() {
    this.searchTypeAheadControl = new FormControl();
    this.zipCodeTypeAheadControl = new FormControl();
    this.dependantNameControl = new FormControl();
    this.planControl = new FormControl();
  }

  public getValues(fadSearchResultsService: FadSearchResultsService): FadLandingPageSearchControlValues {
    // if (!this.searchControlValues) {
    //   this.searchControlValues = new FadLandingPageSearchControlValues();
    //   const cachedControlValues: FadLandingPageSearchControlValues =
    //     <FadLandingPageSearchControlValues>JSON.parse(sessionStorage.getItem('FadLandingPageSearchCriteria'));
    //   if (cachedControlValues) {
    //     this.searchControlValues.setSearchText(cachedControlValues.getSearchText());
    //     this.searchControlValues.setZipCode(cachedControlValues.getZipCode());
    //     this.searchControlValues.dependantName = cachedControlValues.dependantName;
    //     this.searchControlValues.setPlanName(cachedControlValues.getPlanName());
    //     this.searchControlValues.specialityId = cachedControlValues.specialityId;
    //     return this.searchControlValues;
    //   }
    // }

    if (!this.searchControlValues) {
      this.searchControlValues = new FadLandingPageSearchControlValues();
    }

    const lastSelectedSearchTextOption: FadAutoCompleteComplexOption = fadSearchResultsService.getLastSelectedSearchTextOption();
    const lastSelectedZipCodeOption: FZCSRCity = fadSearchResultsService.getLastSelectedZipCodeOption();

    const searchTextFieldValue = this.searchTypeAheadControl.value;
    if (lastSelectedSearchTextOption && lastSelectedSearchTextOption.getSimpleText) {
      const _lastSelectedSearchText = lastSelectedSearchTextOption.getSimpleText();
      if (_lastSelectedSearchText && searchTextFieldValue
        && searchTextFieldValue.trim().toUpperCase() === _lastSelectedSearchText.toUpperCase()) {
        this.searchControlValues.setSearchText(lastSelectedSearchTextOption);
      } else if (_lastSelectedSearchText.indexOf(FadConstants.text.allDoctorOptionText) >= 0) {
        // when the last selected value corresponds to a all doctors option, persist the selection
        const searchTextInContext = lastSelectedSearchTextOption.getSimpleText()
          .replace(FadConstants.text.allDoctorOptionText, '').replace(/["']/g, '');
        if (searchTextInContext.toUpperCase() === searchTextFieldValue.toUpperCase()) {
          this.searchControlValues.setSearchText(lastSelectedSearchTextOption);
        }
      } else if (_lastSelectedSearchText.indexOf(FadConstants.text.allHospitalsOrFacilitiesText) >= 0) {
        // when the last selected value corresponds to a all facilities option, persist the selection
        const searchTextInContext = _lastSelectedSearchText
          .replace(FadConstants.text.allHospitalsOrFacilitiesText, '').replace(/["']/g, '');
        if (searchTextInContext.toUpperCase() === searchTextFieldValue.toUpperCase()) {
          this.searchControlValues.setSearchText(lastSelectedSearchTextOption);
        }
      }

    } else {
      const searchTextOption: FadAutoCompleteComplexOption = new FadAutoCompleteComplexOption();
      searchTextOption.setSimpleText(searchTextFieldValue ? searchTextFieldValue.trim() : '');
      this.searchControlValues.setSearchText(searchTextOption);
    }


    this.searchControlValues.setZipCode(lastSelectedZipCodeOption);

    // this.searchControlValues.setZipCode(this.zipCodeTypeAheadControl.value);
    this.searchControlValues.dependantName = this.dependantNameControl.value;
    this.searchControlValues.setPlanName(this.planControl.value);
    // this.searchControlValues.setResourceTypeCode(fadSearchResultsService.getSearchCriteria().getResourceTypeCode())

    return this.searchControlValues;
  }

  public setValues(searchControlValues: FadLandingPageSearchControlValues): FadLandingPageSearchControlsModelInterface {
    if (!searchControlValues) {
      searchControlValues = new FadLandingPageSearchControlValues();
    }
    this.searchControlValues = searchControlValues;
    try {
      this.searchTypeAheadControl.setValue(searchControlValues.getSearchText().getSimpleText());

      const zipCodeOption = searchControlValues.getZipCode();
      let zipCodeText = `${zipCodeOption.getZip()} - ${zipCodeOption.getCity()}, ${zipCodeOption.getState_code()}`;
      if (zipCodeText === ' - , ') {
        zipCodeText = '';
      }

      this.zipCodeTypeAheadControl.setValue(zipCodeText);

      this.dependantNameControl.setValue(searchControlValues.dependantName);
      this.planControl.setValue(searchControlValues.getPlanName());

    } catch (ignoreException) {
      // if the controls are valid and alive, update their values, else ignore

    }
    return this;
  }

  public setControls(searchControl: FadLandingPageSearchControlsModelInterface,
    fadSearchResultsService: FadSearchResultsService): FadLandingPageSearchControlsModelInterface {
    if (!searchControl) {
      searchControl = new FadLandingPageSearchControlsModel();
    }
    this.searchTypeAheadControl = searchControl.searchTypeAheadControl;
    this.planControl = searchControl.planControl;
    this.zipCodeTypeAheadControl = searchControl.zipCodeTypeAheadControl;
    this.dependantNameControl = searchControl.dependantNameControl;

    this.searchControlValues = new FadLandingPageSearchControlValues();

    // set SearchTextOption value
    // this.searchControlValues.setSearchText(searchControl.searchTypeAheadControl.value);
    const lastSelectedSearchTextOption: FadAutoCompleteComplexOption = fadSearchResultsService.getLastSelectedSearchTextOption();
    const searchTextFieldValue = this.searchTypeAheadControl.value;
    if (lastSelectedSearchTextOption && lastSelectedSearchTextOption.getSimpleText()
      && searchTextFieldValue && searchTextFieldValue.trim().toUpperCase() === lastSelectedSearchTextOption.getSimpleText().toUpperCase()) {
      this.searchControlValues.setSearchText(lastSelectedSearchTextOption);
    } else {
      const searchTextOption: FadAutoCompleteComplexOption = new FadAutoCompleteComplexOption();
      searchTextOption.setSimpleText(searchTextFieldValue ? searchTextFieldValue.trim() : '');
      this.searchControlValues.setSearchText(searchTextOption);
    }

    // set ZipCodeOption value
    // this.searchControlValues.setZipCode(searchControl.zipCodeTypeAheadControl.value);
    const lastSelectedZipCodeOption: FZCSRCity = fadSearchResultsService.getLastSelectedZipCodeOption();
    const zipCodeText = this.zipCodeTypeAheadControl.value;
    if (lastSelectedZipCodeOption) {
      const zipEntities = zipCodeText.split('-');
      if (zipEntities[1] && zipEntities[0].trim() === lastSelectedZipCodeOption.getZip()) {
        const cityStatecode = zipEntities[1].split(',');
        if (cityStatecode[1] &&
          cityStatecode[0].trim().toUpperCase() === lastSelectedZipCodeOption.getCity().toUpperCase() &&
          cityStatecode[1].trim().toUpperCase() === lastSelectedZipCodeOption.getState_code().toUpperCase()) {
          this.searchControlValues.setZipCode(lastSelectedZipCodeOption);
        }
      }
    } else {
      this.searchControlValues.setZipCode((new FZCSRCity()).setZip(zipCodeText));
    }

    this.searchControlValues.dependantName = searchControl.dependantNameControl.value;
    this.searchControlValues.setPlanName(searchControl.planControl.value);

    return this;
  }
}

export class FadLandingPageSearchControlValues implements FadLandingPageSearchControlValuesInterface {
  private zipCode: FZCSRCity = new FZCSRCity();
  private planName: FadAutoCompleteComplexOption;

  private searchText: FadAutoCompleteComplexOption; // string = '';
  public dependantName: string = '';
  // public specialityId: number;
  // private resourceTypeCode : string;

  public getSearchText(): FadAutoCompleteComplexOption {
    return Object.assign(new FadAutoCompleteComplexOption(), this.searchText);
  }
  public setSearchText(searchText: FadAutoCompleteComplexOption): FadLandingPageSearchControlValues {
    this.searchText = searchText;
    return this;
  }

  // public getSpecialityId(): number {
  //   return this.specialityId;
  // }
  // public setSpecialityId(specialityId: number): FadLandingPageSearchControlValues {
  //   this.specialityId = specialityId;
  //   return this;
  // }


  public getZipCode(): FZCSRCity {
    return Object.assign(new FZCSRCity(), this.zipCode);
  }
  public setZipCode(zipCode: FZCSRCity): FadLandingPageSearchControlValues {
    this.zipCode = zipCode;
    return this;
  }

  public getDependantName(): string {
    return this.dependantName;
  }
  public setDependantName(dependantName: string): FadLandingPageSearchControlValues {
    this.dependantName = dependantName;
    return this;
  }

  public getPlanName(): FadAutoCompleteComplexOption {
    return Object.assign(new FadAutoCompleteComplexOption(), this.planName);
  }

  public setPlanName(planName: FadAutoCompleteComplexOption): FadLandingPageSearchControlValues {
    this.planName = planName;
    return this;
  }

  // public getResourceTypeCode(): string {
  //   return this.resourceTypeCode;
  // }
  // public setResourceTypeCode(resourceTypeCode: string): FadLandingPageSearchControlValues {
  //   this.resourceTypeCode = resourceTypeCode;
  //   return this;
  // }
}

export class LandingPageResponseCacheModel implements LandingPageResponseCacheModelInterface {
  public dependantsList: string[] = null;
  public planOptions: FadAutoCompleteOptionForSearchText[] = null;
  private zipCodeOptions: FZCSRCity[] = [];

  public getZipCodeOptions(): FZCSRCity[] {
    if (!this.zipCodeOptions) {
      this.zipCodeOptions = <FZCSRCity[]>JSON.parse(sessionStorage.getItem('FadZipCodeOptions'));
    }
    return this.zipCodeOptions;
  }

  setZipCodeOptions(zipCodeOptions: FZCSRCity[]): LandingPageResponseCacheModel {
    this.zipCodeOptions = zipCodeOptions;
    sessionStorage.setItem('FadZipCodeOptions', JSON.stringify(zipCodeOptions));
    return this;
  }
}
