import { GetBenefitCoverageRequestModelInterface } from './getBenefitCoverage-models.interface';
import { GeneralErrorInterface } from '../../../../shared/models/interfaces/generic-app-models.interface';

// tslint:disable-next-line:no-empty-interface
export interface GetBenefitTextRequestModelInterface extends GetBenefitCoverageRequestModelInterface {
}

export interface GetBenefitTextResponseModelInterface extends GeneralErrorInterface {
    eligibilityTextReply: EligibilityTextInterface[];
    claimFilingTextReply: ClaimFilingTextInterface[];
    COBTextReply: COBTextInterface[];
    limitationTextReply: LimitationTextInterface[];
}

export interface LimitationTextInterface {
    limitationTextHeader: string; // example: Blue Vision
    limitationTextValue: string; // example: Services that are furnished to all patients due to a facility's routine
}

export interface ClaimFilingTextInterface {
    filingText: string; // example: A provider who has a payment agreement with Blue Cross Blue Shield of Massachusetts
}

export interface EligibilityTextInterface {
    eligibilityTypeName: string; // example: Dependent Coverage
    eligibilityTextValue: string; // example: Unmarried dependent children are eligible for coverage until age 19.
}

export interface COBTextInterface {
    COBTextValue: string; // example: Standard COB provisions apply
}
