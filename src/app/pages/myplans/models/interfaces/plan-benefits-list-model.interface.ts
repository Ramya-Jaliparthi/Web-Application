import {
    MyBlueGeneralAPIRequestModelInterface,
    GeneralErrorInterface
} from '../../../../shared/models/interfaces/generic-app-models.interface';

export interface PlanBenefitsListRequestModelInterface extends MyBlueGeneralAPIRequestModelInterface {
    effectiveDate: string;
}

export interface PlanBenefitsListResponseModelInterface extends GeneralErrorInterface {
    RowSet: PlanBenefitsListResponseRowSetModelInterface;
    fault?: PlanBenefitsErrorResponseModelInterface;
}

export interface MyPlansModuleRadioListInterface {
    value: string;
    text: string;
    checked: boolean;
}

export interface PlanBenefitsListResponseRowSetModelInterface {
    Rows: PlanBenefitsListResponseRowDataModelInterface[];
}

export interface PlanBenefitsListResponseRowDataModelInterface {
    groupName: string;
    groupNumber: string;
    groupAnniversaryDay: string;
    groupAnniversaryMonth: string;
    subscriberId: string;
    planEffectiveDt: string;
    osplinMembers: PlanBenefitsOsplinMembersModelInterface;
}

export interface PlanBenefitsOsplinMembersModelInterface {
    members: PlanBenefitsOsplinMemberModelInterface[];
}

export interface PlanBenefitsOsplinMemberModelInterface {
    firstName: string;
    lastName: string;
    memberId: string;
    uaCoverageCodes: PlanBenefitsUaCoverageCodesModelInterface;
    plans: PlanBenefitsPlansModelInterface;
}

export interface PlanBenefitsPlansModelInterface {
    plan: PlanBenefitsPlanModelInterface[];
}

export interface PlanBenefitsPlanModelInterface {
    planName: string;
    coveragePackageCode: string;
    foundFlag: boolean | string;
}

export interface PlanBenefitsUaCoverageCodesModelInterface {
    dentalCoverageUA: PlanBenefitsUaCoverageCodeModelInterface;
    drugCoverageUA: PlanBenefitsUaCoverageCodeModelInterface;
    medicalCoverageUA: PlanBenefitsUaCoverageCodeModelInterface;
    mentalCoverageUA: PlanBenefitsUaCoverageCodeModelInterface;
    visionCoverageUA: PlanBenefitsUaCoverageCodeModelInterface;
}

export interface PlanBenefitsUaCoverageCodeModelInterface {
    code: string;
    text: string;
}

export interface PlanBenefitsErrorResponseModelInterface {
    faultstring: string;
    detail: PlanBenefitsErrorDetailResponseModelInterface;
}

export interface PlanBenefitsErrorDetailResponseModelInterface {
    errorcode: string;
}


