import { PlanBenefitsPlanModelInterface } from './plan-benefits-list-model.interface';
import { PlanTypeOrder, PlanEntityMemberType } from '../types/myplans.types';

export interface PlanEntityInterface extends PlanBenefitsPlanModelInterface {
    planName: string;
    groupName: string;
    groupNumber: string;
    subscriberId: string;
    effectiveStartDate: string;
    effectiveEndDate: string;
    planType: PlanTypeOrder;
    members: PlanEntityMemberInterface[];
    pcpState: string;
}

export interface PlanEntityMemberInterface {
    name: string;
    memberId: string;
    memberDOB: string;
    memberOrder: number;
    memberType: PlanEntityMemberType;
    pcpState?: string;
    UACoverageCode: Object;
}
