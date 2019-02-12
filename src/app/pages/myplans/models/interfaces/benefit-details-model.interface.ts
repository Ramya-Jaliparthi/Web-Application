import {
    GeneralErrorInterface
} from '../../../../shared/models/interfaces/generic-app-models.interface';
import { NetworkTypeInterface } from './plans-benefits-service-model.interface';

export interface LimitationHeaderInterface {
    limitationTextValue: string;
    limitationTextHeader: string;
}

export interface LimitationHeadersInterface {
    Rows: LimitationHeaderInterface[];
}

export interface LimitationResponseInterface extends GeneralErrorInterface {
    RowSet: LimitationHeadersInterface;
}

export interface AuthReferralResponseInterface extends GeneralErrorInterface {
    getAuthReferralResponse: GetAuthReferralResponse;
}

interface GetAuthReferralResponse {
    authReferralCategory: AuthReferralCategory[];
    state: State;
}

interface AuthReferralCategory {
    benefitCategoryName: string;
    authReferral: AuthReferral[];
}

interface AuthReferral {
    authReferralRequired: string;
    network: string;
}

interface State {
    stateName: string;
}

export interface BenefitDetailsResponseInterface extends GeneralErrorInterface {
    planName: string;
    coveragePackageCode: string;
    authRefIndicator: boolean;
    planBenefits: PlanBenefit[];
    serviceProviders: ServiceProvider[];
    coveredServicesText: string;
}

export interface PlanBenefit {
    benefitDetailsText?: NetworkTypeInterface[];
    memberCostText?: NetworkTypeInterface[];
    planBenefitName: string;
}

export interface ServiceProvider {
    network: string;
    value: string;
}



