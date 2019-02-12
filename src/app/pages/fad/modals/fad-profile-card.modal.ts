import {
    FadProfileCardComponentOutputModelInterface,
    FadProfileCardComponentInputModelInterface,
    FadFacilityCardComponentInputModelInterface,
    FadFacilityCardComponentOutputModelInterface
} from './interfaces/fad-profile-card.interface';

import { FadProfileCardComponentMode } from './types/fad.types';
import { FadProfessionalInterface } from './interfaces/getSearchByProfessional-models.interface';
import { FadFacilityInterface } from './interfaces/getSearchByFacility-models.interface';
// import { FVProSRProfessionalInSearchEntity } from './fad-vitals-professionals-search-response.model';

export class FadProfileCardComponentOutputModel implements FadProfileCardComponentOutputModelInterface {
    public professional: FadProfessionalInterface;
    public isSelected: boolean;
}

export class FadProfileCardComponentInputModel implements FadProfileCardComponentInputModelInterface {
    public mode: FadProfileCardComponentMode = 'ListItem';

    constructor(public professional: FadProfessionalInterface) {

    }
}


export class FadFacilityCardComponentOutputModel implements FadFacilityCardComponentOutputModelInterface {
    public facility: FadFacilityInterface;
    public isSelected: boolean;


}

export class FadFacilityCardComponentInputModel implements FadFacilityCardComponentInputModelInterface {
    public mode: FadProfileCardComponentMode = 'ListItem';

    constructor(public facility: FadFacilityInterface) {

    }
}