import { MemberProfileGenericResponseModel } from './member-profile-generics.model';
import {
    MemberProfileChangePasswordResponseModelInterface,
    MemberProfileChangePasswordRequestModelInterface
} from './interfaces/member-profile-change-password.interface';
import { MyBlueGeneralAPIRequestModel } from '../../../shared/models/generic-app.model';

export class MemberProfileChangePasswordRequestModel extends MyBlueGeneralAPIRequestModel
    implements MemberProfileChangePasswordRequestModelInterface {
    userState: string; // User State
    currentPassword: string; // current password
    newPassword: string; // New Password
}

// tslint:disable-next-line:no-empty-interface
export class MemberProfileChangePasswordResponseModel extends MemberProfileGenericResponseModel
    implements MemberProfileChangePasswordResponseModelInterface {

}
