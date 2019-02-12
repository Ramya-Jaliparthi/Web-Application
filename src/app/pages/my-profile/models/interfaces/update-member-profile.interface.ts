import { MemberProfileGenericResponseModelInterface, BaseProfilesRequestModelInterface } from './member-profile-generics.interface';
import { MyBlueGeneralAPIRequestModelInterface } from '../../../../shared/models/interfaces/generic-app-models.interface';

export interface UpdateMemberProfileRequestModelInterface
    extends BaseProfilesRequestModelInterface {
    userState: string;  // userState
    address1: string;  // address1
    address2: string;  // address2
    city: string;  // city
    state: string;  // state
    zip: string;  // zip
    emailAddress: string;  // emailAddress
    phoneNumber: string;  // phoneNumber
    phoneType: string;  // phoneType
    hintQuestion: string;  // hintQuestion
    hintAnswer: string;  // hintAnswer
}

// tslint:disable-next-line:no-empty-interface
export interface UpdateMemberProfileResponseModelInterface extends MemberProfileGenericResponseModelInterface {
}
