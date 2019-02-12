import { FadLandingPageComponentMode, FadResourceTypeCode } from '../types/fad.types';
import { FormControl } from '@angular/forms';
import { FZCSRCity } from '../fad-vitals-collection.model';
import { FadSearchResultsService } from '../../fad-search-results/fad-search-results.service';



export interface FadLandingPageCompInputInterface {
    componentMode: FadLandingPageComponentMode;
    fadBaseSearchModel: FadLandingPageSearchControlValuesInterface;
}

export interface FadLandingPageCompOutputInterface {
    searchCriteria: FadLandingPageSearchControlValuesInterface;
}

export interface FadAutoCompleteOptionForSearchTextInterface {
    category: string;
    options: FadAutoCompleteComplexOptionInterface[];

    setCategory(category: string): FadAutoCompleteOptionForSearchTextInterface;
    addOption(option: FadAutoCompleteComplexOptionInterface): FadAutoCompleteOptionForSearchTextInterface;
}

export interface FadAutoCompleteComplexOptionInterface {
    // simpleText: string;
    // contextText: string;
    // infoText: string;
    // link: FadLinkOptionInterface;
    // resourceCodeType: FadResourceTypeCode;
    // specialityId: string;

    getSimpleText(): string;
    setSimpleText(simpleText: string): FadAutoCompleteComplexOptionInterface;

    getContextText(): string;
    setContextText(contextText: string): FadAutoCompleteComplexOptionInterface;

    getInfoText(): string;
    setInfoText(infoText: string): FadAutoCompleteComplexOptionInterface;

    getLink(): FadLinkOptionInterface;
    setLink(text: string, href: string): FadAutoCompleteComplexOptionInterface;

    getResourceTypeCode(): FadResourceTypeCode;
    setResourceTypeCode(resourceCodeType: FadResourceTypeCode): FadAutoCompleteComplexOptionInterface;

    getSpecialityId(): number;
    setSpecialityId(specialityId: number): FadAutoCompleteComplexOptionInterface;

    getNetworkId(): number;
    setNetworkId(networkId: number): FadAutoCompleteComplexOptionInterface;
}

export interface FadLinkOptionInterface {
    text: string;
    href: string;
}

export interface FadLandingPageSearchControlsModelInterface {
    searchTypeAheadControl: FormControl;
    zipCodeTypeAheadControl: FormControl;
    dependantNameControl: FormControl;
    planControl: FormControl;

    getValues(fadSearchResultsService: FadSearchResultsService): FadLandingPageSearchControlValuesInterface;
    setValues(searchControlValues: FadLandingPageSearchControlValuesInterface): FadLandingPageSearchControlsModelInterface;
    setControls(searchControlValues: FadLandingPageSearchControlsModelInterface,
        fadSearchResultsService: FadSearchResultsService): FadLandingPageSearchControlsModelInterface;
}

export interface FadLandingPageSearchControlValuesInterface {
    // searchText: FadAutoCompleteComplexOptionInterface; // string
    // zipCode: FZCSRCity;
    // dependantName: string;
    // planName: FadAutoCompleteComplexOptionInterface;
    // specialityId: number;

    getSearchText(): FadAutoCompleteComplexOptionInterface;
    setSearchText(searchText: FadAutoCompleteComplexOptionInterface): FadLandingPageSearchControlValuesInterface;

    // getSpecialityId(): number;
    // setSpecialityId(specialityId: number): FadLandingPageSearchControlValuesInterface;

    getZipCode(): FZCSRCity;
    setZipCode(zipCode: FZCSRCity): FadLandingPageSearchControlValuesInterface;

    getDependantName(): string;
    setDependantName(dependantName: string): FadLandingPageSearchControlValuesInterface;

    getPlanName(): FadAutoCompleteComplexOptionInterface;
    setPlanName(planName: FadAutoCompleteComplexOptionInterface): FadLandingPageSearchControlValuesInterface;

    // getResourceTypeCode(): string;
    // setResourceTypeCode(resourceTypeCode: string): FadLandingPageSearchControlValuesInterface;
}

export interface LandingPageResponseCacheModelInterface {
    dependantsList: string[];
    planOptions: FadAutoCompleteOptionForSearchTextInterface[];

    getZipCodeOptions(): FZCSRCity[];
    setZipCodeOptions(zipCodeOptions: FZCSRCity[]): LandingPageResponseCacheModelInterface;
}
