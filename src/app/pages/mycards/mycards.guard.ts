import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';


@Injectable()
export class MyCardsGuard implements CanActivate {
  constructor(private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {

    const authTokenDetails = sessionStorage.getItem('authToken');
    if (authTokenDetails && authTokenDetails !== 'undefined') {
      const authTokenDetailsJson = JSON.parse(authTokenDetails);
      if (authTokenDetailsJson && authTokenDetailsJson.planTypes && authTokenDetailsJson.userType === 'MEMBER'
        && (authTokenDetailsJson.planTypes.medical === 'false'
          || authTokenDetailsJson.planTypes.medical === false)) {
        this.router.navigate(['orderreplacement']);
        return false;
      }
      if (authTokenDetailsJson && authTokenDetailsJson.HasActivePlan !== 'true') {
        this.router.navigate(['/home']);
        return false;
      }
    }
    return true;
  }
}
