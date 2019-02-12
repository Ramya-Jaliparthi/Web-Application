import {
    MemberProfileGenericResponseModelInterface,
    BaseProfilesRequestModelInterface
} from './member-profile-generics.interface';

export interface MemberProfileChangePasswordRequestModelInterface extends BaseProfilesRequestModelInterface {

    userState: string; // User State
    currentPassword: string; // current password
    newPassword: string; // New Password
}

// tslint:disable-next-line:no-empty-interface
export interface MemberProfileChangePasswordResponseModelInterface extends MemberProfileGenericResponseModelInterface {

}
