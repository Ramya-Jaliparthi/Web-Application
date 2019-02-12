import {
    GetMemberProfileRequestModelInterface,
    GetMemberProfileResponseModelInterface
} from './interfaces/get-member-profile-request.interface';
import { MemberProfileGenericRequestModel } from './member-profile-generics.model';

// tslint:disable-next-line:no-empty-interface
export class GetMemberProfileRequestModel extends MemberProfileGenericRequestModel
    implements GetMemberProfileRequestModelInterface {

}

export class GetMemberProfileResponseModel implements GetMemberProfileResponseModelInterface {
    useridin: string; // pattern: ^[\w-]+@([\w-]+\.)+[\w-]+$|^\d{10}$ - emailid or phone number
    userState: string; // userState
    fullName: string; // fullName
    dob: string; // dob
    address1: string; // address1
    address2: string; // address2
    city: string; // city
    isEmailOptedIn: boolean;
    isMobileOptedIn: boolean;
    state: string; // state
    zip: string; // zip
    isEditableAddress: boolean; // isEditableAddress
    // isViewableAddress: boolean = true; // isViewableAddress
    emailAddress: string; // emailAddress
    phoneNumber: string; // phoneNumber
    phoneType: string; // phoneType
    isVerifiedEmail: boolean; // isVerifiedEmail
    isVerifiedMobile: boolean; // isVerifiedMobile
    isDirectPay: boolean; // isDirectPay
    hintQuestion: string; // hintQuestion
    hintAnswer: string; // hintAnswer
}
