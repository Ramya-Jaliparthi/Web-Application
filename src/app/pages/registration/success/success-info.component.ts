import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertService} from '../../../shared/services/alert.service';
import {AlertType} from '../../../shared/alerts/alertType.model';
import {AuthService} from '../../../shared/services/auth.service';
import {ConstantsService} from '../../../shared/services/constants.service';
import {AuthHttp} from '../../../shared/services/authHttp.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-success-info',
  templateUrl: './success-info.component.html',
  styleUrls: ['./success-info.component.scss']
})
export class SuccessInfoComponent implements OnInit, OnDestroy {
  location: string;
  displayMessage: string;
  constructor(
              private alertService: AlertService,
              private authService: AuthService,
              private constants: ConstantsService,
              private http: AuthHttp,
              private router: Router) {

  }

  ngOnInit() {
    this.location = this.router.url.split('/')[1];
    this.alertService.setAlert(this.location === 'register' ? 'Congratulations! You now have full access to your account information.' : 'Your password has been updated', '' , AlertType.Success);
    this.displayMessage = this.location === 'register' ? 'Get Started.' : 'Your password is updated';
    // this.authService.clearSession();
    if (sessionStorage.getItem('userType')) {
      sessionStorage.removeItem('userType');
    }
  }

  login() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.alertService.clearError();
  }

  savePageUrl(url?: string) {
    if (url) {
      const requestPayload = {
        useridin: this.authService.useridin,
        linkinfo: url
      };
      this.http.post(this.constants.postdesinfoUrl,
        this.http.handleRequest(requestPayload)).subscribe((response) => {
          this.redirectToLoginPage();
        });
    }
    this.redirectToLoginPage();
  }

  redirectToLoginPage() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
