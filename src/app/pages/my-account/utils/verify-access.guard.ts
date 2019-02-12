import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Injectable()
export class VerifyAccessGuard implements CanActivate {
    constructor(private router: Router) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        boolean | Observable<boolean> | Promise<boolean> {
        const isOTPSent = sessionStorage.getItem('otp');
        if (isOTPSent && isOTPSent === 'TRUE') {
            return true;
        } else {
            sessionStorage.clear();
            this.router.navigate(['login']);
            return false;
        }
    }
}
