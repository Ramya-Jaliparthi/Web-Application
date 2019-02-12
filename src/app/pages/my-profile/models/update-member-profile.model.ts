import {
    UpdateMemberProfileRequestModelInterface, UpdateMemberProfileResponseModelInterface
} from './interfaces/update-member-profile.interface';
import { MemberProfileGenericResponseModel } from './member-profile-generics.model';
import { MyBlueGeneralAPIRequestModel } from '../../../shared/models/generic-app.model';



export class UpdateMemberProfileRequestModel extends MyBlueGeneralAPIRequestModel implements UpdateMemberProfileRequestModelInterface {
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

export class UpdateAddressProfileRequestModel extends MyBlueGeneralAPIRequestModel {
    address1: string;  // address1
    address2: string;  // address2
    city: string;  // city
    state: string;  // state
    zip: string;  // zip
}

export class UpdatePhoneProfileRequestModel extends MyBlueGeneralAPIRequestModel {
    phoneNumber: string;  // phoneNumber
    phoneType: string;  // phoneType
}

export class UpdateEmailProfileRequestModel extends MyBlueGeneralAPIRequestModel {

    emailAddress: string;  // emailAddress
}

export class UpdateHandAProfileRequestModel extends MyBlueGeneralAPIRequestModel {

    hintQuestion: string;  // hintQuestion
    hintAnswer: string;  // hintAnswer
}

// tslint:disable-next-line:no-empty-interface
export class UpdateMemberProfileResponseModel extends MemberProfileGenericResponseModel
    implements UpdateMemberProfileResponseModelInterface {
}
