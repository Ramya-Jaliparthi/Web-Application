import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ConstantsService } from '../../shared/services/constants.service';
import { DependantsService } from '../../shared/services/dependant.service';
import { GlobalService } from '../../shared/services/global.service';
import { ValidationService } from '../../shared/services/validation.service';
import { AlertService } from '../../shared/shared.module';
import { LoginService } from './login.service';
import { AuthHttp } from '../../shared/services/authHttp.service';
import { AlertType } from '../../shared/alerts/alertType.model';
declare let $: any;

@Component({
  selector: 'app-core-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy {
  type: string;
  typePlaceholder: string;
  isFormSubmitted = false;
  loginForm: FormGroup;
  showOneTouch: boolean;
  showRegister: boolean;
  appStoreWebLink: boolean;
  appStoreMebLink: boolean;
  useridCustomMessages = {};
  pwdCustomMessages = {};

  constructor(private fb: FormBuilder,
    private loginService: LoginService,
    private alertService: AlertService,
    private dependantService: DependantsService,
    private constants: ConstantsService,
    private authService: AuthService,
    private authHttp: AuthHttp,
    private router: Router,
    private validationService: ValidationService,
    private globalService: GlobalService) {
    this.type = 'password';
    this.typePlaceholder = 'Show';
    this.showOneTouch = false;
    this.showRegister = false;
    this.appStoreWebLink = false;
    this.appStoreMebLink = false;

    this.loginForm = this.fb.group({
      useridin: ['', [Validators.required, Validators.maxLength(100), this.validationService.noWhitespaceValidator]],
      passwordin: ['', [Validators.required, this.validationService.noWhitespaceValidator]]
    });
    this.useridCustomMessages = {
      'required': 'You must enter a valid username.',
      'whitespace': 'You must enter a valid username.'
    };
    this.pwdCustomMessages = {
      'required': 'You must enter a valid password.',
      'whitespace': 'You must enter a valid password.'
    };
  }

  ngOnInit() {
   // this.globalService.setAdobe();
    // login clears session. so always Anonymous
    if (!(<any>window)._waDataLayer) {
      (<any>window)._waDataLayer = new Object();
    }
    (<any>window)._waDataLayer.UID = 'Anonymous';

    if (localStorage['login-user']) {
      this.loginForm.patchValue({
        useridin: localStorage['login-user']
      });
    }
    this.handleCheckBox();
    this.authService.logout();
  }

  handleCheckBox() {
    if (localStorage['rememberMe'] === undefined) {
      localStorage['rememberMe'] = true;
      $('#remember-me').prop('checked', true);
    } else if (localStorage['rememberMe'] === 'true') {
      localStorage['rememberMe'] = true;
      $('#remember-me').prop('checked', true);
    } else if (localStorage['rememberMe'] === 'false') {
      localStorage['rememberMe'] = false;
      $('#remember-me').prop('checked', false);
    }

    if (localStorage['login-user']) {
      this.showOneTouch = localStorage['login-user'];
    }

    if (!localStorage['login-user']) {
      this.showRegister = true;
    }

    if (this.globalService.isMobile() && localStorage['login-user']) {
      this.appStoreMebLink = true;
    } else {
      this.appStoreWebLink = true;
    }
  }

  ngOnDestroy() {
    this.alertService.clearError();
  }

  onSubmit() {
    this.rememberMe();
    this.loginForm.value.useridin = this.loginForm && this.loginForm.value.useridin ?
      this.loginForm.value.useridin = this.loginForm.value.useridin.trim() : '';
    this.loginForm.value.passwordin = this.loginForm && this.loginForm.value.passwordin ?
      this.loginForm.value.passwordin = this.loginForm.value.passwordin.trim() : '';

    const loginData = this.loginForm.value;
    this.globalService.markFormGroupTouched(this.loginForm);
    // this.validationService.focusFirstError();
    this.isFormSubmitted = true;
    if (this.loginForm.valid) {
      sessionStorage.setItem('key', this.loginForm.controls.useridin.value);
      this.alertService.clearError();
      this.loginService.login(loginData).subscribe(response => {
        // redirect to targetRoute if needed
        const tr = localStorage.getItem('targetRoute');
        this.globalService.setAdobe();
        if (tr) {
          this.router.navigate([tr]);
        } else {
          this.redirectToSavedPage(response);
        }
      }, err => {
        if (err.status >= 500) {
          this.authHttp.hideSpinnerLoading();
          let message = 'Oops Something went wrong. Please try again!';
          if (err && err.error && err.error.result) {
            message = message + ' (' + err.error.result + ')';
            this.authHttp.CaptureAPIErrorInAdobe(err.status, err.error.result, message);
          }
          $('#requestTimeoutError').modal('open');
          $('#timeOutErrorText')[0].innerHTML = message;
        } else if (err.status === 404) {
          this.authHttp.handleError(err);
        } else {
          this.globalService.handleError(err.error, this.constants.displayMessage);
          this.validationService.focusFirstError();
        }
      });
    }
  }


  redirectToSavedPage(response?) {
    if (response && response.destinationURL && response.migrationtype === 'NONE') {
      if (response.scopename === 'AUTHENTICATED-NOT-VERIFIED') {
        this.router.navigate(['/home']);
      } else {
        this.router.navigate([response.destinationURL]);
      }
    } else {
      this.router.navigate(['/home']);
    }
  }

  togglePasswordVisibility() {
    const typeDetails = this.globalService.togglePasswordType(this.type);
    this.type = typeDetails.type;
    this.typePlaceholder = typeDetails.placeHolder;
  }

  rememberMe() {
    localStorage['rememberMe'] = $('#remember-me').is(':checked');
    if (localStorage['rememberMe'] === 'true') {
      localStorage['login-user'] = this.loginForm.value.useridin;
      localStorage['rememberMe'] = $('#remember-me').is(':checked');
    } else {
      localStorage.clear();
      localStorage['rememberMe'] = false;
    }
  }
}
