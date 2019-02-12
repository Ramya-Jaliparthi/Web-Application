import { DependantRelationShipType } from '../types/my-medication.types';
import {
    GeneralErrorInterface,
    MyBlueGeneralAPIRequestModelInterface
} from '../../../../shared/models/interfaces/generic-app-models.interface';

// tslint:disable-next-line:no-empty-interface
export interface GetMemBasicInfoRequestModelInterface extends MyBlueGeneralAPIRequestModelInterface {

}

export interface GetMemBasicInfoResponseModelInterface extends GeneralErrorInterface {
    rxSummary: BasicMemInfoRxSummaryInterface;
}

export interface BasicMemInfoRxSummaryInterface {
    memFirstName: string; // memFirstNamestring example: DAN Requested member First Name
    memLastName: string; // memLastNamestring example: ANNE Requested member Last Name
    memMiddleInitial: string; // memLastNamestring example: ANNE Requested member Last Name
    hasDependents: boolean; // hasDependentsboolean example: true Boolean indicator if the requested member has dependents
    relationship: DependantRelationShipType; // relationshipstring example: Spouse
    fullName: string; // API is not returning this field UI customized field
    filterName: string; // API is not returning this field UI customized field
    // Member relation  the subscriber Enum: [ Subscriber, Spouse, Dependent ]
}
