import { MyBlueGeneralAPIRequestModel, GeneralError } from '../../../shared/models/generic-app.model';
import {
    GetPlansBenefitsListRequestModelInterface,
    GetPlansBenefitsListResponseModelInterface,
    RowSetInterface,
    OsplinPlansInterface,
    GetPlansBenefitsListPlanItemInterface,
    GetPlansBenefitsListGroupInfoInterface,
    GetPlansBenefitsListGroupInfoItemInterface,
    GetPlansBenefitsListOsplinPlanMembersInterface,
    GetPlansBenefitsListOsplinPlanMembersItemInterface
} from './interfaces/get-plans-benefits-list-models.interface';
import { PlanBenefitsUaCoverageCodesModel } from '../../myplans/models/plan-benefits-list.model';

export class GetPlansBenefitsListRequestModel extends MyBlueGeneralAPIRequestModel
    implements GetPlansBenefitsListRequestModelInterface {
    effectiveDate: string;

    setUseridin(useridin: string): GetPlansBenefitsListRequestModel {
        super.setUseridin(useridin);
        return this;
    }

    setEffectiveDate(effectiveDate: string): GetPlansBenefitsListRequestModel {
        this.effectiveDate = effectiveDate;
        return this;
    }
}

export class GetPlansBenefitsListResponseModel extends GeneralError
    implements GetPlansBenefitsListResponseModelInterface {
    RowSet: RowSet;
}

export class RowSet implements RowSetInterface {
    osplinPlans: OsplinPlans;
}

export class OsplinPlans implements OsplinPlansInterface {
    plans: GetPlansBenefitsListPlanItem[];
}

export class GetPlansBenefitsListPlanItem implements GetPlansBenefitsListPlanItemInterface {
    planName: string;
    coveragePackageCode: string;
    foundFlag: string;
    pcpState: string;
    groupInfo: GetPlansBenefitsListGroupInfo;
    osplinPlanMembers: GetPlansBenefitsListOsplinPlanMembers;
}

export class GetPlansBenefitsListGroupInfo implements GetPlansBenefitsListGroupInfoInterface {
    group: GetPlansBenefitsListGroupInfoItem[];
}

export class GetPlansBenefitsListGroupInfoItem implements GetPlansBenefitsListGroupInfoItemInterface {
    groupName: string;
    groupNumber: string;
    groupAnniversaryDay: string;
    groupAnniversaryMonth: string;
    subscriberId: string;
    planEffectiveDt: string;
}

export class GetPlansBenefitsListOsplinPlanMembers implements GetPlansBenefitsListOsplinPlanMembersInterface {
    members: GetPlansBenefitsListOsplinPlanMembersItem[];
}

export class GetPlansBenefitsListOsplinPlanMembersItem implements GetPlansBenefitsListOsplinPlanMembersItemInterface {
    firstName: string;
    lastName: string;
    memberId: string;
    memberDOB: string;
    UACoverageCode: PlanBenefitsUaCoverageCodesModel;
}
