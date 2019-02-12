import { ErrorMessage } from '../../shared/app-control-messages/error-messages';
export class RegistrationHelper {
    static isScopeNameRegistrationAndNotVerified(): boolean {
        const authTokenDetails = sessionStorage.getItem('authToken');
        if (authTokenDetails && authTokenDetails !== 'undefined') {
            const authTokenDetailsJson = JSON.parse(authTokenDetails);
            if (authTokenDetailsJson && authTokenDetailsJson.migrationtype === 'NONE'
                && authTokenDetailsJson.scopename === 'REGISTERED-NOT-VERIFIED') {
                return true;
            }
        }
        return false;
    }

    static isMemberIdInValid(memberDetails, memberIdInvalidIdenfitier): boolean {
      return memberDetails && memberDetails.firstName && memberDetails.lastName
        && memberDetails.DOB && memberDetails.lastMemResult && memberDetails.lastMemResult && memberDetails.lastMemResult !== 'null' &&
        memberDetails.lastMemResult.toString().indexOf(memberIdInvalidIdenfitier) > - 1 ? true : false;
    }

    static isMemberIdInValidEMPTY(memberDetails, memberIdInvalidIdenfitier): boolean {
      return memberDetails && memberDetails.firstName && memberDetails.lastName
        && memberDetails.DOB && memberDetails.lastMemResult &&
        (memberDetails.memNum === 'null' || memberDetails.lastMemResult.toString().indexOf(memberIdInvalidIdenfitier) > - 1) ? true : false;
    }

    static isMemberDetailsValid(memberDetails): boolean {
      return memberDetails && memberDetails.firstName && memberDetails.lastName && memberDetails.DOB && memberDetails.memNum !== 'null'
        && (!memberDetails.lastMemResult || memberDetails.lastMemResult === 'null') ? true : false;
    }

    static isMemberDetailsInvalidandNotVerified(memberDetails) {
      if (this.isScopeNameRegistrationAndNotVerified()) {
        return !this.isMemberDetailsValid(memberDetails);
      }
      return false;
    }

    static isUserNotFound(memberDetails): boolean {
      return memberDetails && memberDetails.errormessage === 'User Not Found' ? true : false;
    }

    static redirectToVerifyAccessCodeIfUserNotFound(memberDetails, route) {
      if (this.isUserNotFound(memberDetails)) {
        route.navigate(['../register/verifyaccesscode']);
      }
    }
}
