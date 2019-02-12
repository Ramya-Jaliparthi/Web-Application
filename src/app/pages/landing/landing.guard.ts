import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {GlobalService} from '../../shared/services/global.service';
import {ConstantsService} from '../../shared/services/constants.service';
import {AuthService} from '../../shared/services/auth.service';
import {Injectable} from '@angular/core';
import {RegistrationService} from '../registration/registration.service';
import {AlertService} from '../../shared/services/alert.service';
import {AlertType} from '../../shared/alerts/alertType.model';

@Injectable()
export class LandingGuard implements CanActivate {
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
      case 'REGISTERED-AND-VERIFIED': {
        return true;
      }
      case 'AUTHENTICATED-NOT-VERIFIED': {
        sessionStorage.setItem('accesscode', 'true');
        this.router.navigate(['/register/verifyaccesscode']);
        return true;
      }
      case 'AUTHENTICATED-AND-VERIFIED': {
        this.router.navigate(['/myaccount']);
        return true;
      }

      default: {
        return false;
      }
    }
  }
}


@Injectable()
export class AllowAVOnlyGuard implements CanActivate {
  constructor(private router: Router,
              private authService: AuthService,
              private constants: ConstantsService,
              private registrationService: RegistrationService,
              private alertService: AlertService,
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
      case 'REGISTERED-AND-VERIFIED': {
        return true;
      }
      case 'AUTHENTICATED-NOT-VERIFIED': {
        if (this.authService.authToken.migrationtype !== 'NONE') {
          this.router.navigate(['member-migration']);
        } else {
          this.registrationService.redirectToVerification();
        }
        return false;
      }
      case 'AUTHENTICATED-AND-VERIFIED': {
        if (this.authService.authToken.migrationtype !== 'NONE') {
          // route to mgration flow
          this.router.navigate(['member-migration']);
          return false;
        } else {
          // ladning
          return true;
          // this.router.navigate(['/home']);
        }

      }
      default: {
        return false;
      }
    }
  }
}
