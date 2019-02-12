import { GeneralError, MyBlueGeneralAPIRequestModel } from '../../../shared/models/generic-app.model';
import {
    EocPolicyInterface,
    RiderInterface,
    GetBenefitCoverageRequestModelInterface,
    GetBenefitCoverageResponseModelInterface,
    GetBenefitCoverageRowSetInterface
} from './interfaces/getBenefitCoverage-models.interface';

export class GetBenefitCoverageRequestModel extends MyBlueGeneralAPIRequestModel
    implements GetBenefitCoverageRequestModelInterface {
    planName: string; // *	string    example: Dental Blue Program 2    plan Name
    coveragePackageCode: string; // *	string    example: 106167    Coverage Package Code

    setUseridin(useridin: string): GetBenefitCoverageRequestModelInterface {
        super.setUseridin(useridin);
        return this;
    }


    setPlanName(planName: string): GetBenefitCoverageRequestModelInterface {
        this.planName = planName;
        return this;
    }

    setCoveragePackageCode(coveragePackageCode: string): GetBenefitCoverageRequestModelInterface {
        this.coveragePackageCode = coveragePackageCode;
        return this;
    }
}

export class GetBenefitCoverageResponseModel extends GeneralError
    implements GetBenefitCoverageResponseModelInterface {
    RowSet: GetBenefitCoverageRowSet;
}

export class GetBenefitCoverageRowSet implements GetBenefitCoverageRowSetInterface {
    eocPolicies: EocPolicyInterface[];
}

export class EocPolicy implements EocPolicyInterface {
    policyFormName: string; //        example: Preferred Blue PPO Deductible Schedule of Benefits        policy form name
    URL: string; // example: https://www.bcbsma.com/common/en_US/ContractAndRiderInformation/docs/hppodedG101SoB-0117.doc        URL Link
    riders: Rider[];
}

export class Rider implements RiderInterface {
    riderTitle: string; // example: Outpatient Copayment    Rider Title
    riderURL: string; // example: https://www.bcbsma.com/common/en_US/ContractAndRiderInformation/docs/hppodedG101SoB-0117.doc    URL Link
    riderDescription: string; // example: https://www.bcbsma.com/common/en_US/ContractAndRiderInformation/docs/hppodedG101SoB-0117.doc
    // Allowed charge to calculate out-of-network benefits
}
