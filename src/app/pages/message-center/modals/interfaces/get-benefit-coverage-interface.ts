export interface GetBenefitCoverageRequestModelInterface {
    useridin: string; // pattern: ^[\w-]+@([\w-]+\.)+[\w-]+$|^\d{10}$ example: meidcal123 input userID
    planName: string; // example: Dental Blue Program 2 plan Name
    coveragePackageCode: string; // example: 106167 Coverage Package Code
}

export interface GetBenefitCoverageResponseModelInterface {
    eocPolicies: EcopoliciesResponseModelInterface[];
}
export interface EcopoliciesResponseModelInterface {
    policyFormName: string; // example: Preferred Blue PPO Deductible Schedule of Benefits policy form name
    URL: string; // example: https://www.bcbsma.com/common/en_US/ContractAndRiderInformation/docs/hppodedG101SoB-0117.doc URL Link
    riders: RiderResponseModelInterface[];
}
export interface RiderResponseModelInterface {
    riderTitle: string; // example: Outpatient Copayment Rider Title
    riderURL: string; // example: https://www.bcbsma.com/common/en_US/ContractAndRiderInformation/docs/hppodedG101SoB-0117.doc URL Link
    riderDescription: string; // example: https://www.bcbsma.com/common/en_US/ContractAndRiderInformation/docs/hppodedG101SoB-0117.doc
}
