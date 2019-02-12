import {
    DependentModelInterface,
    DependentsRequestModelInterface,
    DependentsRestrictedRequestModelInterface,
    DependentsResponseModelInterface,
    DependentsRestrictedResponseModelInterface,
    DependentsModelInterface,
    DependentInterimModelInterface
} from './interfaces/dependants-model.interface';
import { GeneralError, MyBlueGeneralAPIRequestModel } from '../../../shared/models/generic-app.model';

export class DependentModel implements DependentModelInterface {

    depId: number; // example: 123456786 Dependent ID
    firstName: string; // example: MAISIE
    lastName: string; // example: THOMAS
    middleInitial: string; // example: E
    relationship: string; // example: Spouse Member relation to the subscriber or logged in user Enum: Array [ 3 ]
    memNum: string; // example: 039800586000011 Member Number
    suffix: string; //  example: 01 Member suffix
    cardId: string; // example: XXP03980058611 Member Curd Number with Suffix
}
export class DependentsModel extends GeneralError implements DependentsModelInterface {
    dependents: DependentInterimModel[] = [];
}

export class DependentInterimModel implements DependentInterimModelInterface {
    dependent: DependentModel;
}

export class DependentsRequestModel extends MyBlueGeneralAPIRequestModel implements DependentsRequestModelInterface {

}

export class DependentsRestrictedRequestModel extends MyBlueGeneralAPIRequestModel implements DependentsRestrictedRequestModelInterface {

}

export class DependentsResponseModel extends GeneralError implements DependentsResponseModelInterface {
    dependents: DependentInterimModel[] = [];
}

export class DependentsRestrictedResponseModel extends GeneralError implements DependentsRestrictedResponseModelInterface {
    dependents: DependentInterimModel[] = [];
}
