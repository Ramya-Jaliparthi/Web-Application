import {
    GeneralErrorInterface,
    MyBlueGeneralAPIRequestModelInterface
} from '../../../../shared/models/interfaces/generic-app-models.interface';

export interface GetPlanBenefitServicesRequestModelInterface extends MyBlueGeneralAPIRequestModelInterface {
    planName: string; // string    example: Dental Blue Program 2    plan Name
    coveragePackageCode: string; // string    example: 106167    Coverage Package Code
}

export interface GetPlanBenefitServicesResponseModelInterface extends GeneralErrorInterface {
    planName: string; // example: Blue Plus PPO
    PlanBenefitFeatures: PlanBenefitFeatures;
    planBenefits: PlanBenefitsInterface[];
}
export interface PlanBenefitFeatures {
    coinsuranceMaxText: NetworkTypeInterface;
    deductibleText: NetworkTypeInterface;
    lifetimeBenefitText: NetworkTypeInterface;
}
export interface NetworkTypeInterface {
    inNetwork?: string[];
    outOfNetwork?: string[];
    inNetworkAndOutOfNetworkCombined?: string[];
}
export interface PlanBenefitsInterface {
    planBenefitName: string;
    memberCostText?: MemberCostTextInterface;
    subcategory?: Array<MemberCostTextInterface>;
}
export interface MemberCostTextInterface {
    memberCostText: Array<NetworkTypeInterface>;
}
export interface TemplateBenefitFeatures {
    benefitFeatures: BenefitFeaturesInterface;
}
export interface BenefitFeaturesInterface {
    coinsuranceMaxHeading: string; //  example: Inpatient Medical & Surgical
    coinsuranceMaxTextNetwork: string;
    coinsuranceMaxText: string;
    combinedNetworkHeading: string;
    combinedNetworkNetwork: string;
    combinedNetworkText: string;
    deductibleHeading: string;
    deductibleTextNetwork: string;
    deductibleText: string;
    inNetworkHeading: string;
    inNetworkNetwork: string;
    inNetworkText: string;
    outNetworkHeading: string;
    outNetworkNetwork: string;
    outNetworkText: string;
    lifetimeBenefitHeading: string;
    lifetimeBenefitNetwork: string;
    lifetimeBenefitText: string;
}

export interface TemplateBenefitCategoryInterface {
    templateBenefitCategory: BenefitCategoryInterface;
}

export interface BenefitCategoryInterface {
    benefitCategoryName: string;   //    example: Inpatient Medical & Surgical
    benefitTierInfo: string;
    benefitLimitHeading: string;
    benefitLimitTextNetwork: string;
    benefitLimitText: string;
    coInsuranceHeading: string;
    coInsuranceTextNetwork: string;
    coInsuranceText: string;
    coPaymentHeading: string;
    coPaymentTextNetwork: string;
    coPaymentText: string;
    deductibleHeading: string;
    deductibleTextNetwork: string;
    deductibleText: string;
    memberCostHeading: string;
    memberCostTextNetwork: string;
    memberCostText: string;
}
