import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';
import { AuthHttp } from '../services/authHttp.service';
import { ConstantsService } from '../services/constants.service';

@Injectable()
export class ScopeGuard implements CanActivate {
  desiredURL: string;
  sourceURL;

  constructor(private router: Router,
    private authService: AuthService,
    private http: AuthHttp,
    private constants: ConstantsService) {
  }

  isAPIready = {
    'mycards': true,
    'myplans': true,
    'mydedco': true,
    'mydoctors': true,
    'myfinancial': false,
    'myprofile': true,
    'myclaims': true,
    'message-center': true,
    'mymedications': true,
    'request-estimate': true,
    'profile': false,
    'mypreferences': false,
    'message-center/messages': true,
    'message-center/documents/home': true,
    'message-center/uploads': true,
    'notification-preferences': true,
    'orderreplacement': true,
    'myplans/plandetails': true
  };

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    this.desiredURL = state.url;
    this.sourceURL = this.router.url;
    const apiReadyURL = this.desiredURL.substring(1, this.desiredURL.length);
    const scopename = this.setScopeForHardCodedUser(sessionStorage.getItem('key'));

    if (this.isAPIready[apiReadyURL] === false && (apiReadyURL === 'message-center' || apiReadyURL === 'message-center/messages'
      || apiReadyURL === 'message-center/documents/home' || apiReadyURL === 'message-center/uploads')) {
      this.router.navigate(['../pages/maintenance']);
      return false;
    } else if (this.isAPIready[apiReadyURL] === false && scopename === 'AUTHENTICATED-AND-VERIFIED') {
      this.router.navigate(['../pages/maintenance']);
      return false;
    }
    const rtnVal = this.getActionForScope(scopename);
    // console.log(rtnVal);
    return rtnVal;
  }

  private setScopeForHardCodedUser(username) {
    return this.authService.authToken ? this.authService.authToken.scopename : '';
  }

  private getActionForScope(scope) {

    switch (scope) {
      case 'REGISTERED-NOT-VERIFIED':
        return this.scope_RV_RNV(this.router);

      case 'INACTIVE-AUTHENTICATED-AND-VERIFIED':
        return this.scope_RV_RNV(this.router);

      case 'REGISTERED-AND-VERIFIED':
        return this.scope_RV_RNV(this.router);

      case 'AUTHENTICATED-NOT-VERIFIED':
        return this.scope_ANV(this.router);

      case 'AUTHENTICATED-AND-VERIFIED':
        return this.scope_AV(this.router);

      default:
        break;
    }
  }
  scope_RV_RNV(router) {
    if (this.desiredURL.startsWith('/myprofile') ||
      this.desiredURL.startsWith('/message-center')) { // fix for M30-591
      return true;
    } else {
      router.navigate(['/register/register-detail']);
      return false;
    }
  }

  scope_ANV(router) {
    // 1/2 of login for first login after successful migration is in redirectToSavedPage() method of login.cpmponent.ts
    if (this.authService.authToken.migrationtype !== 'NONE') {
      // route to mgration flow
      if (this.desiredURL === '/member-migration') {
        return true;
      } else {
        router.navigate(['member-migration']);
        return false;
      }
    } else {
      router.navigate(['/register/verifyaccesscode']);
      return false;
    }
  }

  scope_AV(router) {
    if (this.authService.authToken.migrationtype !== 'NONE') {
      if (this.desiredURL === '/member-migration') {
        return true;
      } else {
        router.navigate(['member-migration']);
        return false;
      }
    } else {
      return true;
    }
  }

  scope_MIG(router) {
    router.navigate(['member-migration']);
    return false;
  }
}
