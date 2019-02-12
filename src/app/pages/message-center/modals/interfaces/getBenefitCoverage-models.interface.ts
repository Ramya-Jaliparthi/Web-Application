import {
    GeneralErrorInterface,
    MyBlueGeneralAPIRequestModelInterface
} from '../../../../shared/models/interfaces/generic-app-models.interface';

export interface GetBenefitCoverageRequestModelInterface extends MyBlueGeneralAPIRequestModelInterface {
    planName: string; // *	string    example: Dental Blue Program 2    plan Name
    coveragePackageCode: string; // *	string    example: 106167    Coverage Package Code

    setUseridin(useridin: string): GetBenefitCoverageRequestModelInterface;
    setPlanName(planName: string): GetBenefitCoverageRequestModelInterface;
    setCoveragePackageCode(coveragePackageCode: string): GetBenefitCoverageRequestModelInterface;
}

export interface GetBenefitCoverageResponseModelInterface extends GeneralErrorInterface {
    RowSet: GetBenefitCoverageRowSetInterface;
}

export interface GetBenefitCoverageRowSetInterface {
    eocPolicies: EocPolicyInterface[];
}

export interface EocPolicyInterface {
    policyFormName: string; //        example: Preferred Blue PPO Deductible Schedule of Benefits        policy form name
    URL: string; // example: https://www.bcbsma.com/common/en_US/ContractAndRiderInformation/docs/hppodedG101SoB-0117.doc        URL Link
    riders: RiderInterface[];
}

export interface RiderInterface {
    riderTitle: string; // example: Outpatient Copayment    Rider Title
    riderURL: string; // example: https://www.bcbsma.com/common/en_US/ContractAndRiderInformation/docs/hppodedG101SoB-0117.doc    URL Link
    riderDescription: string; // example: https://www.bcbsma.com/common/en_US/ContractAndRiderInformation/docs/hppodedG101SoB-0117.doc
    // Allowed charge to calculate out-of-network benefits
}
