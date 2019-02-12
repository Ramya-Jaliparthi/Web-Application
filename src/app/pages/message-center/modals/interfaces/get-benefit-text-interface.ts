export interface GetBenefitTextRequestModelInterface {
    useridin: string; // pattern: ^[\w-]+@([\w-]+\.)+[\w-]+$|^\d{10}$     example: meidcal123     input userID
    planName: string; // example: Dental Blue Program 2     plan Name
    coveragePackageCode: string; //   example: 106167    Coverage Package Code
}
export interface GetBenefitTextResponseModelInterface {
    eligibilityTextReply: EligibilityTextReplyResponseModelInterface[];
    claimFilingTextReply: ClaimFillingTextReplyResponseModelInterface[];
    COBTextReply: COBTextReplyResponseModelInterface[];
    limitationTextReply: LimitationTextReplyResponseModelInterface[];
}
export interface EligibilityTextReplyResponseModelInterface {
    eligibilityTypeName: string; // example: Dependent Coverage
    eligibilityTextValue: string; // example: Unmarried dependent children are eligible for coverage until age 19
}
export interface ClaimFillingTextReplyResponseModelInterface {
    filingText: string; // example: A provider who has a payment agreement with Blue Cross Blue Shield of Massachusetts
}
export interface COBTextReplyResponseModelInterface {
    COBTextValue: string; // example: Standard COB provisions apply
}
export interface LimitationTextReplyResponseModelInterface {
    limitationTextHeader: string; // example: Blue Vision 
    limitationTextValue: string; // example: Services that are furnished to all patients due to a facility's routine
}


