import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
// Non-angular modules
import { Observable } from 'rxjs/Observable';
// Custom modules
import { AuthService } from '../../shared/services/auth.service';
import { GlobalService } from '../../shared/services/global.service';

@Injectable()
export class MyDedCoG1 implements CanActivate {
    hasAlegeusAccount: boolean = false;

    constructor(private router: Router,
        private authService: AuthService,
        private globalService: GlobalService) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        const desiredURL = state.url;
        const sourceURL = this.router.url;
        let scopename: string;
        console.warn(this.authService.authToken);
        scopename = this.authService.authToken ? this.authService.authToken.scopename : '';
        // TODO - move all these methods based on scopes to central if needed.
        switch (scopename) {
            case 'REGISTERED-NOT-VERIFIED':
            case 'REGISTERED-AND-VERIFIED':
                // dont allow but navigate them to notifications
                this.router.navigate(['/mypreferences/notifications']);
                return false;
            case 'ACTIVE-AUTHENTICATED-NOT-VERIFIED':
            case 'ACTIVE-AUTHENTICATED-AND-VERIFIED': {
                this.globalService.memberData$.subscribe(data => {
                    this.hasAlegeusAccount = Boolean(data.hasALG);
                });
                if (this.hasAlegeusAccount) {
                    return true;
                } else {
                    // dont allow but navigate them to notifications
                    this.router.navigate(['/mypreferences/notifications']);
                    return false;
                }
            }
            default: {
                return false;
            }
        }
    }
}


@Injectable()
export class MyDedCoG2 implements CanActivate {
    constructor(private router: Router, private authService: AuthService) {
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
            case 'ACTIVE-AUTHENTICATED-NOT-VERIFIED': {
                return false;
            }
            case 'ACTIVE-AUTHENTICATED-AND-VERIFIED': {
                return true;
            }
            default: {
                return false;
            }
        }
    }
}

@Injectable()
export class MyDedCoGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthService) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        if (this.authService && this.authService.authToken &&
            this.authService.authToken.HasActivePlan === "true") {
                return true;
            }
            this.router.navigate(['home']);
            return false;
    }
}

