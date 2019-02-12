import {
    GeneralErrorInterface,
    MyBlueGeneralAPIRequestModelInterface
} from '../../../../shared/models/interfaces/generic-app-models.interface';

export interface DependentModelInterface {

    depId: number; // example: 123456786 Dependent ID
    firstName: string; // example: MAISIE
    lastName: string; // example: THOMAS
    middleInitial: string; // example: E
    relationship: string; // example: Spouse Member relation to the subscriber or logged in user Enum: Array [ 3 ]
    memNum: string; // example: 039800586000011 Member Number
    suffix: string; // example: 01 Member suffix
    cardId: string; // example: XXP03980058611 Member Curd Number with Suffix
}

export interface DependentsModelInterface extends GeneralErrorInterface {
    dependents: DependentInterimModelInterface[];
}

export interface DependentInterimModelInterface {
    dependent: DependentModelInterface;
}

// tslint:disable-next-line:no-empty-interface
export interface DependentsRequestModelInterface extends MyBlueGeneralAPIRequestModelInterface {

}

// tslint:disable-next-line:no-empty-interface
export interface DependentsRestrictedRequestModelInterface extends MyBlueGeneralAPIRequestModelInterface {

}

// tslint:disable-next-line:no-empty-interface
export interface DependentsResponseModelInterface extends DependentsModelInterface {

}

// tslint:disable-next-line:no-empty-interface
export interface DependentsRestrictedResponseModelInterface extends DependentsModelInterface {

}
