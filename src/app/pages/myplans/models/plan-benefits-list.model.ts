import {
    PlanBenefitsUaCoverageCodeModelInterface, PlanBenefitsUaCoverageCodesModelInterface,
    PlanBenefitsPlanModelInterface, PlanBenefitsPlansModelInterface, PlanBenefitsOsplinMemberModelInterface,
    PlanBenefitsOsplinMembersModelInterface, PlanBenefitsListResponseRowDataModelInterface,
    PlanBenefitsListResponseRowSetModelInterface, PlanBenefitsListResponseModelInterface,
    PlanBenefitsListRequestModelInterface,
    MyPlansModuleRadioListInterface,
    PlanBenefitsErrorResponseModelInterface,
    PlanBenefitsErrorDetailResponseModelInterface
} from './interfaces/plan-benefits-list-model.interface';
import { MyBlueGeneralAPIRequestModel, GeneralError } from '../../../shared/models/generic-app.model';

export class PlanBenefitsListRequestModel extends MyBlueGeneralAPIRequestModel implements PlanBenefitsListRequestModelInterface {
    effectiveDate: string;
}

export class PlanBenefitsListResponseModel extends GeneralError implements PlanBenefitsListResponseModelInterface {
    RowSet: PlanBenefitsListResponseRowSetModel;
    fault: PlanBenefitsErrorResponseModel = null;
}

export class MyPlansModuleRadioList implements MyPlansModuleRadioListInterface {
    value: string;
    text: string;
    checked: boolean;
}

export class PlanBenefitsListResponseRowSetModel implements PlanBenefitsListResponseRowSetModelInterface {
    Rows: PlanBenefitsListResponseRowDataModel[] = [];
}

export class PlanBenefitsListResponseRowDataModel implements PlanBenefitsListResponseRowDataModelInterface {
    groupName: string;
    groupNumber: string;
    groupAnniversaryDay: string;
    groupAnniversaryMonth: string;
    subscriberId: string;
    planEffectiveDt: string;
    osplinMembers: PlanBenefitsOsplinMembersModel;
}

export class PlanBenefitsOsplinMembersModel implements PlanBenefitsOsplinMembersModelInterface {
    members: PlanBenefitsOsplinMemberModel[] = [];
}

export class PlanBenefitsOsplinMemberModel implements PlanBenefitsOsplinMemberModelInterface {
    firstName: string;
    lastName: string;
    memberId: string;
    uaCoverageCodes: PlanBenefitsUaCoverageCodesModel;
    plans: PlanBenefitsPlansModel;
}

export class PlanBenefitsPlansModel implements PlanBenefitsPlansModelInterface {
    plan: PlanBenefitsPlanModel[];
}

export class PlanBenefitsPlanModel implements PlanBenefitsPlanModelInterface {
    planName: string;
    coveragePackageCode: string;
    foundFlag: string;
}

export class PlanBenefitsUaCoverageCodesModel implements PlanBenefitsUaCoverageCodesModelInterface {
    dentalCoverageUA: PlanBenefitsUaCoverageCodeModel;
    drugCoverageUA: PlanBenefitsUaCoverageCodeModel;
    medicalCoverageUA: PlanBenefitsUaCoverageCodeModel;
    mentalCoverageUA: PlanBenefitsUaCoverageCodeModel;
    visionCoverageUA: PlanBenefitsUaCoverageCodeModel;
}

export class PlanBenefitsUaCoverageCodeModel implements PlanBenefitsUaCoverageCodeModelInterface {
    code: string;
    text: string;
}

export class PlanBenefitsErrorResponseModel implements PlanBenefitsErrorResponseModelInterface {
    faultstring: string = null;
    detail: PlanBenefitsErrorDetailResponseModel = null;
}

export class PlanBenefitsErrorDetailResponseModel implements PlanBenefitsErrorDetailResponseModelInterface {
    errorcode: string = null;
}
