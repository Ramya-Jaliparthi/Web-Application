import { MemberProfileGenericRequestModelInterface } from './member-profile-generics.interface';

// tslint:disable-next-line:no-empty-interface
export interface GetMemberProfileRequestModelInterface extends MemberProfileGenericRequestModelInterface {

}

export interface GetMemberProfileResponseModelInterface {
    useridin: string; // pattern: ^[\w-]+@([\w-]+\.)+[\w-]+$|^\d{10}$ - emailid or phone number
    userState: string; // userState
    fullName: string; // fullName
    dob: string; // dob
    address1: string; // address1
    address2: string; // address2
    city: string; // city
    state: string; // state
    zip: string; // zip
    isEditableAddress: boolean; // isEditableAddress
    // isViewableAddress: boolean; // isViewableAddress
    emailAddress: string; // emailAddress
    phoneNumber: string; // phoneNumber
    phoneType: string; // phoneType
    isVerifiedEmail: boolean; // isVerifiedEmail
    isVerifiedMobile: boolean; // isVerifiedMobile
    isDirectPay: boolean; // isDirectPay
    hintQuestion: string; // hintQuestion
    hintAnswer: string; // hintAnswer
}
