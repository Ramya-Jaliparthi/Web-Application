import {
    PlanBenefitsUaCoverageCodesModelInterface
} from '../../../myplans/models/interfaces/plan-benefits-list-model.interface';
import {
    MyBlueGeneralAPIRequestModelInterface,
    GeneralErrorInterface
} from '../../../../shared/models/interfaces/generic-app-models.interface';


export interface GetPlansBenefitsListRequestModelInterface extends MyBlueGeneralAPIRequestModelInterface {
    effectiveDate: string;
    setUseridin(useridin: string): GetPlansBenefitsListRequestModelInterface;
    setEffectiveDate(effectiveDate: string): GetPlansBenefitsListRequestModelInterface;
}

export interface GetPlansBenefitsListResponseModelInterface extends GeneralErrorInterface {
    RowSet: RowSetInterface;
}

export interface RowSetInterface {
    osplinPlans: OsplinPlansInterface;
}

export interface OsplinPlansInterface {
    plans: GetPlansBenefitsListPlanItemInterface[];
}

export interface GetPlansBenefitsListPlanItemInterface {
    planName: string;
    coveragePackageCode: string;
    foundFlag: string;
    pcpState: string;
    groupInfo: GetPlansBenefitsListGroupInfoInterface;
    osplinPlanMembers: GetPlansBenefitsListOsplinPlanMembersInterface;
}

export interface GetPlansBenefitsListGroupInfoInterface {
    group: GetPlansBenefitsListGroupInfoItemInterface[];
}

export interface GetPlansBenefitsListGroupInfoItemInterface {
    groupName: string;
    groupNumber: string;
    groupAnniversaryDay: string;
    groupAnniversaryMonth: string;
    subscriberId: string;
    planEffectiveDt: string;
}

export interface GetPlansBenefitsListOsplinPlanMembersInterface {
    members: GetPlansBenefitsListOsplinPlanMembersItemInterface[];
}

export interface GetPlansBenefitsListOsplinPlanMembersItemInterface {
    firstName: string;
    lastName: string;
    memberId: string;
    memberDOB: string;
    UACoverageCode: PlanBenefitsUaCoverageCodesModelInterface;
}
