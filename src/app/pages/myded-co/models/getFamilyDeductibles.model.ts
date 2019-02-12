import {
    GetFamilyDeductiblesRequestInterface,
    GetFamilyDeductiblesResponseInterface,
    GetFamilyDeductiblesMembersInterface
} from './interfaces/getFamilyDeductibles-model.interface';
import { MyBlueGeneralAPIRequestModel, GeneralError } from '../../../shared/models/generic-app.model';
import { DeductiblesAccums } from './myded-co-info.model';


// tslint:disable-next-line:no-empty-interface
export class GetFamilyDeductiblesRequest extends MyBlueGeneralAPIRequestModel implements GetFamilyDeductiblesRequestInterface {

}

export class GetFamilyDeductiblesResponse extends GeneralError implements GetFamilyDeductiblesResponseInterface {
    members: GetFamilyDeductiblesMembers[];
    accums: DeductiblesAccums[];
    hasFamily: string;
}

export class GetFamilyDeductiblesMembers implements GetFamilyDeductiblesMembersInterface {
    cobundledPlanFlag: string;
    name: string; // example: DEB DEVAUX
    memSuffix: string;
    loggedinUserSuffix: string;
    userSuffix: string; // example: 00
    depSuffix: string; // example: 15
    subscriberNo: string; // example: 078513145
    coverageType: string; // example: MEDICAL
    planName: string; // example: HMO BLUE NE
    planEffDate: string; // example: 2017 - 10 - 17 pattern: yyyy - MM - dd
    futureEffDate: string; // example: 2019 - 10 - 19 pattern: yyyy - MM - dd
    hasDependentsFlg: string; // example: True
    hasActivePLanFlg: string; // example: True
    futureEffFlag: string;
}



