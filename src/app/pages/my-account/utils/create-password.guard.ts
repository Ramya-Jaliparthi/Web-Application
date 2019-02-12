import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Injectable()
export class CreatePasswordGuard implements CanActivate {
    constructor(private router: Router) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        boolean | Observable<boolean> | Promise<boolean> {
        const isOTPSuccess = sessionStorage.getItem('otpsuccess');
        if (isOTPSuccess && isOTPSuccess === 'TRUE') {
            return true;
        } else {
            sessionStorage.clear();
            this.router.navigate(['login']);
            return false;
        }
    }
}
