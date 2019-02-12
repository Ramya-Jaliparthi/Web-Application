import { Injectable } from '@angular/core';
import { SsoService } from './sso.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService, AlertService } from '../../shared/shared.module';
import { AuthHttp } from '../../shared/services/authHttp.service';
import { AlertType } from "../../shared/alerts/alertType.model";

@Injectable()
export class SsoResolver {

  constructor(private ssoService: SsoService, private authService: AuthService,
    private router: Router, private httpService: AuthHttp,
    private alertService: AlertService) {
  }

  resolve(routeInfo: ActivatedRouteSnapshot) {
    let ssoUrl;
    if (this.authService.authToken && this.authService.authToken.scopename === 'AUTHENTICATED-AND-VERIFIED') {
      ssoUrl = routeInfo && routeInfo.routeConfig && routeInfo.routeConfig.path ?
        routeInfo.routeConfig.path : '';
      ssoUrl = routeInfo && routeInfo.routeConfig && routeInfo.routeConfig.path === 'fad' ?
        'sso/vitals' : routeInfo.routeConfig.path;
    }
    console.log(ssoUrl);
    return ssoUrl ? this.ssoService.getSsoDetails(ssoUrl).map((response) => {
      console.warn(response);
      if (response && response.error) {
        this.router.navigate(['/home']).then(() => {
          this.httpService.showServiceErrorModalPopup('requestTimeoutError');
        });
      } else {
        if (response['result'] < 0) {
            this.router.navigate( [this.router.url] ).then(() => {
              this.alertService.setAlert(response['displaymessage'],
                '', AlertType.Failure);
            });
        } else {
          return response;
        }
      }
    }) : null;
  }

}

