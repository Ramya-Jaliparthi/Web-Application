import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {GlobalService} from '../../shared/services/global.service';
import {AuthService} from '../../shared/services/auth.service';
import {Router, RoutesRecognized} from '@angular/router';

@Injectable()
export class RegistrationResolver implements Resolve<Observable<any>> {
  isUpdateSsn: boolean;

  constructor(private authService: AuthService,
              private router: Router,
              private globalService: GlobalService) {
  }

  resolve() {
    const authTokenDetails = sessionStorage.getItem('authToken');
    if (authTokenDetails && authTokenDetails !== 'undefined') {
      const authTokenDetailsJson = JSON.parse(authTokenDetails);
      if (authTokenDetailsJson && authTokenDetailsJson.scopename &&
        (authTokenDetailsJson.scopename === 'AUTHENTICATED-NOT-VERIFIED')) {
        return null;
      } else if (authTokenDetailsJson && authTokenDetailsJson.scopename &&
        authTokenDetailsJson.scopename === 'AUTHENTICATED-AND-VERIFIED') {
        this.router.navigate(['/home']);
        return null;
      }
    } else if (authTokenDetails === 'undefined' || authTokenDetails === undefined) {
      this.router.navigate(['/login']);
      return null;
    }
    this.router.events
      .filter(e => e instanceof RoutesRecognized)
      .pairwise()
      .subscribe((event: any[]) => {
        if (event[1].urlAfterRedirects === '/register/updatessn') {
          this.isUpdateSsn = true;
        }
      });
    if (this.isUpdateSsn) {
      this.authService.memAuthInfo = null;
    } else {
      this.isUpdateSsn = false;
    }
    return this.authService.memAuthInfo ? null : this.globalService.memAuth();
  }
}
