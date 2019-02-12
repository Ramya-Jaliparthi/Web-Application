// tslint:disable-next-line:max-line-length
import { GetMemberPlanDependentRequesteModelInterface, GetMemberPlanDependentResponseModelInterface } from './interfaces/get-member-plan-dependent-models.interface';

export class GetMemberPlanDependentRequesteModel implements GetMemberPlanDependentRequesteModelInterface {
    // tslint:disable-next-line:max-line-length
    useridin: string; // pattern: ^[\w-]+@([\w-]+\.)+[\w-]+$|^\d{10}$  example: foo@gmail.com  email id or phone number or alpha-numeric id
    groupNumber: string; // example: 004014984  Group the plan name belongs to
}

export class GetMemberPlanDependentResponseModel implements GetMemberPlanDependentResponseModelInterface {
    groupNumber: string; // example: 004014984  Group the plan name belongs to
    subscriberId: string; // example: 0741550530000  Subscriber Identifier for the plan
    dependents: GetMemberPlanDependentarrayResponseModel[];
}

export class GetMemberPlanDependentarrayResponseModel {
    fullName: string; // example: EMILY MEDEIROS  Dependent Full Name
    suffix: string; // example: 03  Dependent Suffix
    genderCode: string;  // example: M  Dependent Gender Code
    DOB: string; // ($date)  example: 1980-01-01  Dependent Date of Birth
}
