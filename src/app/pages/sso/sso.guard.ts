import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Injectable()
export class SsoGuard implements CanActivate {
  constructor(private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.isUserAuthenticated(state)) {
      return false;
    }
    let navigatedUrl = '';
    const isUserNotAuthenticatedAndVerified = this.isUserNotAuthenticatedAndVerified();
    switch (next.parent.routeConfig.path) {
      case 'fad':
        if (isUserNotAuthenticatedAndVerified) {
          navigatedUrl = 'https://myblue.bluecrossma.com/health-plan/find-doctor-provider-dentist';
          break;
        } else {
          return true;
        }
      case 'sso/alegeus':
        navigatedUrl = '/home'; // need to know if not authenticated to which we have to navigate
        break;
    }
    if (isUserNotAuthenticatedAndVerified && navigatedUrl) {
      if (navigatedUrl) {
        window.open(navigatedUrl, '_self');
      }
      return false;
    }
    return true;
// const authTokenDetails = sessionStorage.getItem('authToken');
// if (authTokenDetails && authTokenDetails !== 'undefined') {
// const authTokenDetailsJson = JSON.parse(authTokenDetails);
// if (authTokenDetailsJson && authTokenDetailsJson.scopename !== 'AUTHENTICATED-AND-VERIFIED') {
// this.router.navigate([navigatedUrl]);
// return false;
// }
// }
// return true;
  }

  isUserNotAuthenticatedAndVerified() {
    const authTokenDetails = sessionStorage.getItem('authToken');
    if (authTokenDetails && authTokenDetails !== 'undefined') {
      const authTokenDetailsJson = JSON.parse(authTokenDetails);
      if (authTokenDetailsJson && authTokenDetailsJson.scopename !== 'AUTHENTICATED-AND-VERIFIED') {
        return true;
      }
    } else {
      this.router.navigate(['/login']);
    }
    return false;
  }

  isUserAuthenticated(state) {
    const authTokenDetails = sessionStorage.getItem('authToken');
    if (!authTokenDetails || authTokenDetails === 'undefined' || authTokenDetails === 'null') {
      sessionStorage.clear();
      localStorage.setItem('targetRoute', state.url);
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }

}
