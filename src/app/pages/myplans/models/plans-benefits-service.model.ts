import { GeneralError, MyBlueGeneralAPIRequestModel } from '../../../shared/models/generic-app.model';
import {
    GetPlanBenefitServicesRequestModelInterface,
    GetPlanBenefitServicesResponseModelInterface,
    BenefitCategoryInterface,
    TemplateBenefitCategoryInterface,
    BenefitFeaturesInterface,
    TemplateBenefitFeatures,
    PlanBenefitFeatures
} from './interfaces/plans-benefits-service-model.interface';

export class GetPlanBenefitServicesRequestModel extends MyBlueGeneralAPIRequestModel
    implements GetPlanBenefitServicesRequestModelInterface {
    planName: string; // string    example: Dental Blue Program 2    plan Name
    coveragePackageCode: string; // string    example: 106167    Coverage Package Code
}

export class GetPlanBenefitServicesResponseModel extends GeneralError implements GetPlanBenefitServicesResponseModelInterface {
    planName: string; // example: Blue Plus PPO
    PlanBenefitFeatures: PlanBenefitFeatures;
    planBenefits: Array<any>;
}
export class TemplateBenefi implements TemplateBenefitFeatures {
    benefitFeatures: BenefitFeaturesInterface;
}
export class BenefitFeatures implements BenefitFeaturesInterface {
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

export class TemplateBenefitCategory implements TemplateBenefitCategoryInterface {
    templateBenefitCategory: BenefitCategoryInterface;
}

export class BenefitCategory implements BenefitCategoryInterface {
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
