import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {AuthService} from '../services/auth.service';
import { Router } from '@angular/router';
import {GlobalService} from '../services/global.service';


@Injectable()
export class AuthGuard implements CanActivate  {
  constructor(private router: Router,
              private authService: AuthService) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
   state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const isAuthenticated = this.authService.isAuthenticated();
    if (isAuthenticated) {
      // check if user needs registration
      /*return this.globalService.redirectionRoute()
        .then(
          redirectRoute => {
            return true;
          },
          redirectRoute => {
            // If current route matches with route to navigatge
            if (redirectRoute && !redirectRoute.endsWith(next['_routerState'].url)) {
              this.router.navigate([redirectRoute]);
              return false;
            } else {
              return true;
            }
          }
        );*/
        if (localStorage.getItem('targetRoute')) {
          localStorage.removeItem('targetRoute');
        }
        return true;
    } else {
      sessionStorage.clear();
      localStorage.setItem('targetRoute', state.url);
      this.router.navigate(['login']);
      return false;
    }
    // else if (next['_routerState'].url === '/register') {
    //   // ignore guard in this case
    //   return true;
    // }
  }
}
