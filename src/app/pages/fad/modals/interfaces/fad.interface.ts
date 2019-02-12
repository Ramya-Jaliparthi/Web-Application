import { FadLandingPageCompInputInterface } from './fad-landing-page.interface';
import {
    FadSearchFilterComponentOutputModelInterface,
    FadSearchFilterComponentInputModelInterface,
    FadSearchFilterResponseModelInterface
} from './fad-search-filter.interface';
import { FadNoDocsPageInputDataModelInterface } from './fad-no-docs-page.interface';
import { FadSearchListComponentOutputModelInterface, FadSearchListComponentInputModelInterface } from './fad-search-list.interface';
import {
    FadProfileCardComponentInputModelInterface,
    FadProfileCardComponentOutputModelInterface,
    FadFacilityCardComponentInputModelInterface,
    FadFacilityCardComponentOutputModelInterface
} from './fad-profile-card.interface';
import { FadProfessionalInterface } from './getSearchByProfessional-models.interface';
import { FadFacilityInterface } from './getSearchByFacility-models.interface';

export interface FadLandingPageConsumer {
    miniSearchBarData: FadLandingPageCompInputInterface;
}

export interface FadSearchFilterConsumer {
    searchFilterComponentInput: FadSearchFilterComponentInputModelInterface;
    mobileHideByFilterOverlay: boolean;
    onSearchFilterComponentInteraction(fadSearchFilterComponentOutput: FadSearchFilterComponentOutputModelInterface): void;
    createSearchCriteriaForFilterSection(): FadSearchFilterResponseModelInterface;
}

export interface FadNoSearchResultsPageConsumer {
    noSearchResultsPageData: FadNoDocsPageInputDataModelInterface;
    isNoSearchResults: boolean;
}

export interface FadSearchListConsumer {
    searchListComponentInput: FadSearchListComponentInputModelInterface;
    onSearchListComponentInteraction(fadSeachListComponentOutput: FadSearchListComponentOutputModelInterface): void;
}

// tslint:disable-next-line:no-empty-interface
export interface StarRatingComponentConsumer {

}

export interface FadProfileCardConsumer {
    getProfileCardInput(professional: FadProfessionalInterface): FadProfileCardComponentInputModelInterface;
    onProfileCardComponentInteraction(profileCardCompOutput: FadProfileCardComponentOutputModelInterface): void;
}

export interface FadFacilityCardConsumer {
    getProfileCardInput(facility: FadFacilityInterface): FadFacilityCardComponentInputModelInterface;
    onProfileCardComponentInteraction(facilityCardCompOutput: FadFacilityCardComponentOutputModelInterface): void;
}

