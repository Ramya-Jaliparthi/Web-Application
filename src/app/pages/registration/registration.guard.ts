import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {AuthService} from '../../shared/services/auth.service';
import {Router} from '@angular/router';
import {GlobalService} from '../../shared/services/global.service';
import { ValidationService } from '../../shared/services/validation.service';
import { RegistrationHelper } from './registration-helper';

@Injectable()
export class RegistrationGuard implements CanActivate {
  constructor(private router: Router,
    private globalService: GlobalService,
    private validationService: ValidationService,
    private authService: AuthService) {

  }

  SCOPE_NAME_WITH_URLS = {
    'AUTHENTICATED-AND-VERIFIED': 'home',
    'AUTHENTICATED-NOT-VERIFIED': 'register/verifyaccesscode'
  };

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot,): Observable<boolean> | Promise<boolean> | boolean {
    const authTokenDetails = sessionStorage.getItem('authToken');
    const sessionDetails = sessionStorage.getItem('registrationSuccessfull');
    if (sessionDetails && sessionDetails === 'true') {
      sessionStorage.removeItem('registrationSuccessfull');
      sessionStorage.setItem('registrationProcessCompleted', 'true');
      return true;
    }

    if (sessionStorage.getItem('updatessn') === 'true') {
      return true;
    }

    if (sessionStorage.getItem('accesscode') === 'true') {
      this.router.navigate(['register/verifyaccesscode']);
      return true;
    }

    if (this.isRegistrationProcessCompleted()) {
      return this.redirectToLoginPage();
    }
    if (authTokenDetails && authTokenDetails !== 'undefined') {
      const authTokenDetailsJson = JSON.parse(authTokenDetails);
      if (authTokenDetailsJson && authTokenDetailsJson.migrationtype === 'NONE') {
        return this.redirectToScopeNameUrl(authTokenDetailsJson, state);
      } else {
        return this.redirectToLoginPage();
      }
    } else {
      return this.redirectToLoginPage();
    }
    // return true;
  }

  isRegistrationProcessCompleted(): boolean {
    const isProcessCompleted = sessionStorage.getItem('registrationProcessCompleted');
    return isProcessCompleted && isProcessCompleted === 'true';
  }

  redirectToLoginPage(): boolean {
    this.router.navigate(['login']);
    return false;
  }

  redirectToScopeNameUrl(authTokenDetailsJson, state: RouterStateSnapshot): boolean {
    const scopeName = authTokenDetailsJson.scopename;
    if (scopeName && this.SCOPE_NAME_WITH_URLS[scopeName]
      && state.url !== `/${this.SCOPE_NAME_WITH_URLS[scopeName]}`) {
      this.router.navigate([this.SCOPE_NAME_WITH_URLS[scopeName]]);
      return false;
    }
    return this.redirectBasedUponLastMemResult(scopeName, state);
  }

  redirectBasedUponLastMemResult(scopeName: string, state: RouterStateSnapshot) {
    if (scopeName === 'REGISTERED-NOT-VERIFIED') {
      const isMemberInfoOrRegisterPage = state.url.indexOf('register-detail') > -1 || state.url.indexOf('memberinfo') > -1;
      this.fetchMemberAuthDetails(isMemberInfoOrRegisterPage);
    }
    return true;
  }

  fetchMemberAuthDetails(isMemberInfoOrRegisterPage: boolean) {
    // if (this.authService.memAuthInfo) {
    return this.checkMemberDetails(isMemberInfoOrRegisterPage);
    // }
    // return true;
  }

  // fetchMemberAuthDetailsFromService(isMemberInfoOrRegisterPage: boolean) {
  //   this.globalService.memAuth().subscribe(memAuthResponse => {
  //     const response = memAuthResponse['ROWSET'] && memAuthResponse['ROWSET'].ROWS;
  //     this.authService.memAuthInfo = response;
  //     return this.checkMemberDetails(isMemberInfoOrRegisterPage);
  //   });
  // }

  checkMemberDetails(isMemberInfoOrRegisterPage: boolean) {
    const memberDetails = this.authService.memAuthInfo;
    const isMemberDetailsValid = RegistrationHelper.isMemberDetailsValid(memberDetails);
    if (isMemberDetailsValid && isMemberInfoOrRegisterPage) {
      this.router.navigate(['register/updatessn']);
      return false;
    } else if (!isMemberDetailsValid && !isMemberInfoOrRegisterPage) {
      this.router.navigate([RegistrationHelper.isMemberIdInValid(memberDetails, this.validationService.API_INVALID_IDENTIFITERS.memberId)
        ? 'register/memberinfo' : 'register/register-detail']);
      return false;
    }
    return true;
  }
}
