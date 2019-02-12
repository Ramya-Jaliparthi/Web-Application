import {
    GetMemBasicInfoResponseModelInterface,
    GetMemBasicInfoRequestModelInterface,
    BasicMemInfoRxSummaryInterface
} from './interfaces/get-member-basic-info-model.interface';
import { DependantRelationShipType } from './types/my-medication.types';
import { GeneralError, MyBlueGeneralAPIRequestModel } from '../../../shared/models/generic-app.model';

export class GetMemBasicInfoRequestModel extends MyBlueGeneralAPIRequestModel implements GetMemBasicInfoRequestModelInterface {

}

export class GetMemBasicInfoResponseModel extends GeneralError implements GetMemBasicInfoResponseModelInterface {
    rxSummary: BasicMemInfoRxSummary;
}

export class BasicMemInfoRxSummary implements BasicMemInfoRxSummaryInterface {
    memFirstName: string; // memFirstNamestring example: DAN Requested member First Name
    memLastName: string; // memLastNamestring example: ANNE Requested member Last Name
    hasDependents: boolean; // hasDependentsboolean example: true Boolean indicator if the requested member has dependents
    memMiddleInitial: string; // hasDependentsboolean example: true Boolean indicator if the requested member has dependents
    relationship: DependantRelationShipType; // relationshipstring example: Spouse
    fullName: string; // API is not returning this field UI customized field
    filterName: string; // API is not returning this field UI customized field
    // Member relation  the subscriber Enum: [ Subscriber, Spouse, Dependent ]
}
