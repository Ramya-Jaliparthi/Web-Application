import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
// Non-angular modules
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../shared/services/auth.service';

@Injectable()
export class MyDoctorsPcpGuard implements CanActivate {
    constructor(private router: Router,
        private authService: AuthService) {
    }
    canActivate(
        // next: ActivatedRouteSnapshot,
        // state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        // const desiredURL = state.url;
        // const sourceURL = this.router.url;
        let scopename: string;
        scopename = this.authService.authToken ? this.authService.authToken.scopename : '';
        switch (scopename) {
            case 'REGISTERED-NOT-VERIFIED':
            case 'REGISTERED-AND-VERIFIED':
            case 'AUTHENTICATED-NOT-VERIFIED': {
                return false;
            }
            case 'AUTHENTICATED-AND-VERIFIED': {
                return true;
            }
            default: {
                return false;
            }
        }
    }
}
