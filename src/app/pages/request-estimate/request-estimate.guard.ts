import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
// Non-angular modules
import { Observable } from 'rxjs/Observable';
// Custom modules
import { AuthService } from '../../shared/services/auth.service';
import { GlobalService } from '../../shared/services/global.service';
import { ConstantsService } from '../../shared/services/constants.service';

@Injectable()
export class RequestEstimateGuard implements CanActivate {
    constructor(private router: Router,
        private authService: AuthService,
        private constants: ConstantsService,
        private globalService: GlobalService) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        const desiredURL = state.url;
        const sourceURL = this.router.url;
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

