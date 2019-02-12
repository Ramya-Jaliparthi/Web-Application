import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Injectable()
export class ForgetPasswordFlowGuard implements CanActivate {
  constructor(private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    boolean | Observable<boolean> | Promise<boolean> {
    const isVerifiedUser = sessionStorage.getItem('isauthenticated');
    if (isVerifiedUser && isVerifiedUser === 'TRUE') {
      return true;
    } else {
      sessionStorage.clear();
      this.router.navigate(['login']);
      return false;
    }
  }
}
