import { GetBenefitCoverageRequestModel } from './getBenefitCoverage.model';
import {
    GetBenefitTextRequestModelInterface,
    GetBenefitTextResponseModelInterface,
    LimitationTextInterface,
    ClaimFilingTextInterface,
    EligibilityTextInterface,
    COBTextInterface
} from './interfaces/getBenefitText-models.interface';
import { GeneralError } from '../../../shared/models/generic-app.model';

// tslint:disable-next-line:no-empty-interface
export class GetBenefitTextRequestModel extends GetBenefitCoverageRequestModel
    implements GetBenefitTextRequestModelInterface {
}

export class GetBenefitTextResponseModel extends GeneralError implements GetBenefitTextResponseModelInterface {
    eligibilityTextReply: EligibilityText[];
    claimFilingTextReply: ClaimFilingText[];
    COBTextReply: COBText[];
    limitationTextReply: LimitationText[];
}

export class LimitationText implements LimitationTextInterface {
    limitationTextHeader: string; // example: Blue Vision
    limitationTextValue: string; // example: Services that are furnished to all patients due to a facility's routine
}

export class ClaimFilingText implements ClaimFilingTextInterface {
    filingText: string; // example: A provider who has a payment agreement with Blue Cross Blue Shield of Massachusetts
}

export class EligibilityText implements EligibilityTextInterface {
    eligibilityTypeName: string; // example: Dependent Coverage
    eligibilityTextValue: string; // example: Unmarried dependent children are eligible for coverage until age 19.
}

export class COBText implements COBTextInterface {
    COBTextValue: string; // example: Standard COB provisions apply
}
