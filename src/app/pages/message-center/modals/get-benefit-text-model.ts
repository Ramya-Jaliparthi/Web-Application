import { GetBenefitTextRequestModelInterface, GetBenefitTextResponseModelInterface } from './interfaces/get-benefit-text-interface';

export class GetBenefitTextRequestModel implements GetBenefitTextRequestModelInterface {
    useridin: string; // pattern: ^[\w-]+@([\w-]+\.)+[\w-]+$|^\d{10}$     example: meidcal123     input userID
    planName: string; // example: Dental Blue Program 2     plan Name
    coveragePackageCode: string; //   example: 106167    Coverage Package Code
}
export class GetBenefitTextResponseModel implements GetBenefitTextResponseModelInterface {
    eligibilityTextReply: EligibilityTextReplyResponseModel[];
    claimFilingTextReply: ClaimFillingTextReplyResponseModel[];
    COBTextReply: COBTextReplyResponseModel[];
    limitationTextReply: LimitationTextReplyResponseModel[];
}
export class EligibilityTextReplyResponseModel {
    eligibilityTypeName: string; // example: Dependent Coverage
    eligibilityTextValue: string; // example: Unmarried dependent children are eligible for coverage until age 19
}
export class ClaimFillingTextReplyResponseModel {
    filingText: string; // example: A provider who has a payment agreement with Blue Cross Blue Shield of Massachusetts
}
export class COBTextReplyResponseModel {
    COBTextValue: string; // example: Standard COB provisions apply
}
export class LimitationTextReplyResponseModel {
    limitationTextHeader: string; // example: Blue Vision 
    limitationTextValue: string; // example: Services that are furnished to all patients due to a facility's routine
}


