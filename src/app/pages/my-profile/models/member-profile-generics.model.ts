import {
    MemberProfileGenericListEntityModelInterface,
    BaseDemographicInfoModelInterface,
    MemberProfileGenericResponseModelInterface,
    MemberProfileGenericRequestModelInterface
} from './interfaces/member-profile-generics.interface';
import { MyBlueGeneralAPIRequestModel } from '../../../shared/models/generic-app.model';

export class MemberProfileGenericRequestModel extends MyBlueGeneralAPIRequestModel implements MemberProfileGenericRequestModelInterface {

}

export class MemberProfileGenericResponseModel implements MemberProfileGenericResponseModelInterface {
    result: number;
    errormessage: string;
    displaymessage: string;
}

export class MemberProfileGenericListEntityModel implements MemberProfileGenericListEntityModelInterface {
    code: string; // code
    description: string; // value text
}

export class BaseDemographicInfoModel implements BaseDemographicInfoModelInterface {
    useridin: string; //     useridin
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
