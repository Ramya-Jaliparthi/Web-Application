export type FadLandingPageComponentMode = 'Normal' | 'Abstract';
export type FadProfileCardComponentMode = 'ListItem' | 'MapItem';
export type FadResourceTypeCode = 'F' | 'P';

export enum FadResouceTypeCodeConfig {
    professional = 'P',
    facility = 'F'
}

export enum FadMedicalIndexParamType {
    specialities = 'specialities',
    procedures = 'procedures'
}

export enum FadMedicalIndexPageTitle {
    allSpecialities = 'All Specialties',
    allProcedures = 'All Procedures'
}

export enum FadLandingPageFocusTracker {
    searchText = 'searchText',
    zipCode = 'zipCode',
    plan = 'plan',
    dependant = 'dependant'
}

export enum AuthRequestType {
    login = 'login',
    register = 'register',
    authenticate = 'authenticate'
}

