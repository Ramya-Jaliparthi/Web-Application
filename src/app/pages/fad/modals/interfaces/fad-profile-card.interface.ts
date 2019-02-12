import { FadProfileCardComponentMode } from '../types/fad.types';
import { FadProfessionalInterface } from './getSearchByProfessional-models.interface';
import { FadFacilityInterface } from './getSearchByFacility-models.interface';
// import { FVProSRProfessionalInSearchEntity } from '../fad-vitals-professionals-search-response.model';

export interface FadProfileCardComponentInputModelInterface {
    mode: FadProfileCardComponentMode;
    professional: FadProfessionalInterface;
}

export interface FadProfileCardComponentOutputModelInterface {
    professional: FadProfessionalInterface;
    isSelected: boolean;
    // selectedProfessionals: FVProSRProfessionalInSearchEntity[];
    // addSelectedProfessional(professional: FVProSRProfessionalInSearchEntity): FadProfileCardComponentOutputModelInterface;
    // removeSelectedProfessional(professional: FVProSRProfessionalInSearchEntity): FadProfileCardComponentOutputModelInterface;
}


export interface FadFacilityCardComponentInputModelInterface {
    mode: FadProfileCardComponentMode;
    facility: FadFacilityInterface;
}

export interface FadFacilityCardComponentOutputModelInterface {
    facility: FadFacilityInterface;
    isSelected: boolean;
    // selectedProfessionals: FVProSRProfessionalInSearchEntity[];
    // addSelectedProfessional(professional: FVProSRProfessionalInSearchEntity): FadProfileCardComponentOutputModelInterface;
    // removeSelectedProfessional(professional: FVProSRProfessionalInSearchEntity): FadProfileCardComponentOutputModelInterface;
}

