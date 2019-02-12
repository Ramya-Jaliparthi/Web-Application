import {
    PlanEntityInterface,
    PlanEntityMemberInterface
} from './interfaces/plan-benefits-page-adapted-data-model.inteface';
import { PlanTypeOrder, PlanEntityMemberType } from './types/myplans.types';
import { PlanBenefitsPlanModel } from './plan-benefits-list.model';

export class PlanEntity extends PlanBenefitsPlanModel implements PlanEntityInterface {
    planName: string;
    groupName: string;
    groupNumber: string;
    subscriberId: string;
    effectiveStartDate: string;
    effectiveEndDate: string;
    planType: PlanTypeOrder;
    members: PlanEntityMember[];
    pcpState: string;
}

export class PlanEntityMember implements PlanEntityMemberInterface {
    name: string;
    memberId: string;
    memberDOB: string;
    memberOrder: number;
    memberType: PlanEntityMemberType;
    pcpState?: string;
    UACoverageCode: Object;
}
