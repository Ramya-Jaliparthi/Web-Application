import {
    MyBlueGeneralAPIRequestModelInterface,
    GeneralErrorInterface
} from '../../../../shared/models/interfaces/generic-app-models.interface';

import { DeductiblesAccumsInterface } from './myded-co-info-model.interface';

// tslint:disable-next-line:no-empty-interface
export interface GetFamilyDeductiblesRequestInterface extends MyBlueGeneralAPIRequestModelInterface {

}

export interface GetFamilyDeductiblesResponseInterface extends GeneralErrorInterface {
    hasFamily: string;
    members: GetFamilyDeductiblesMembersInterface[];
    accums: DeductiblesAccumsInterface[];
}

export interface GetFamilyDeductiblesMembersInterface {
    name: string; // example: DEB DEVAUX
    userSuffix: string; // example: 00
    depSuffix: string; // example: 15
    memSuffix: string; // example: 00
    loggedinUserSuffix: string; // example: 15
    subscriberNo: string; // example: 078513145
    coverageType: string; // example: MEDICAL
    planName: string; // example: HMO BLUE NE
    planEffDate: string; // example: 2017 - 10 - 17 pattern: yyyy - MM - dd
    futureEffDate: string; // example: 2019 - 10 - 19 pattern: yyyy - MM - dd
    hasDependentsFlg: string; // example: True
    hasActivePLanFlg: string; // example: True
    cobundledPlanFlag: string;
    futureEffFlag: string;
}

