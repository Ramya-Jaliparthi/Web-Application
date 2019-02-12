import { MyBlueGeneralAPIRequestModelInterface } from '../../../../shared/models/interfaces/generic-app-models.interface';

export interface BaseProfilesRequestModelInterface extends MyBlueGeneralAPIRequestModelInterface {
    scope?: string;
}

// tslint:disable-next-line:no-empty-interface
export interface MemberProfileGenericRequestModelInterface extends BaseProfilesRequestModelInterface {

}

export interface MemberProfileGenericResponseModelInterface {
    result: number;
    errormessage: string;
    displaymessage: string;
}

export interface MemberProfileGenericListEntityModelInterface {
    code: string; // code
    description: string; // value text
}

export interface BaseDemographicInfoModelInterface extends MyBlueGeneralAPIRequestModelInterface {
    agree: boolean; //     agree
    lastupdate_ts: string; //     lastupdate_ts
    race1: string; //     race1
    race2: string; //     race2
    ethnicity1: string; //     ethnicity1
    ethnicity2: string; //     ethnicity2
    latinoOrigin: string; //     latinoOrigin
    primaryLang: string; //     primaryLang
    memberId: string; //     Member Identifier
    subscriberId: string; //     Subscriber Identifier
    memberDOB: string; //     Member Date of birth
    memberGender: string; //     Member Gender
    memberFirstName: string; //     Member First Name
}
