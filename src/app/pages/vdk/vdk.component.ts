import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../login/login.service';
import { AlertService } from '../../shared/services/alert.service';
import { GlobalService } from '../../shared/services/global.service';
import { AuthService } from '../../shared/services/auth.service';
import { ValidationService } from '../../shared/services/validation.service';
import { DependantsService } from '../../shared/services/dependant.service';
import { ConstantsService } from '../../shared/services/constants.service';
import { AlertType } from '../../shared/alerts/alertType.model';
import { Router, RoutesRecognized } from '@angular/router';
declare let $: any;

@Component({
  selector: 'app-core-vdk',
  templateUrl: './vdk.component.html',
  styleUrls: ['./vdk.component.scss']
})

export class VdkComponent implements OnInit, OnDestroy {
  type: string;
  typePlaceholder: string;
  isFormSubmitted = false;
  loginForm: FormGroup;
  showOneTouch: boolean;
  showRegister: boolean;
  appStoreWebLink: boolean;
  temvariable: string;
  appStoreMebLink: boolean;
  useridCustomMessages = {};
  pwdCustomMessages = {};
  focusOutUIErrorFlag = false;
  constructor(private fb: FormBuilder,
    private loginService: LoginService,
    private alertService: AlertService,
    private dependantService: DependantsService,
    private constants: ConstantsService,
    private authService: AuthService,
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
      useridin: ['', [Validators.required, Validators.maxLength(100)]],
      passwordin: ['', [Validators.required]]
    });
    this.handleInitAlerts();
    this.useridCustomMessages = {
      'required': 'You must enter a valid username.'
    };
    this.pwdCustomMessages = {
      'required': 'You must enter a valid password.'
    };
  }

  handleInitAlerts() {
    this.router.events
      .filter(e => e instanceof RoutesRecognized)
      .pairwise()
      .subscribe((event: any[]) => {
        if (event[0].urlAfterRedirects === '/account/forgotusername') {
          // console.log(this.alertService.errors['component']);
          if (this.alertService.errors['component'] && this.alertService.errors['component'].message !==
            'Please check your email account or mobile number for your username.') {
            this.alertService.clearError();
          }
        }
      });
  }

  ngOnInit() {
    /*if (this.authService.isAuthenticated()) {
      return this.globalService.redirectionRoute()
      .then(
        redirectRoute => {
          return this.router.navigate([redirectRoute]);;
        },
        redirectRoute => {
            return this.router.navigate([redirectRoute]);
        }
      );
    }*/

    this.temvariable = '1-470-208-9417';

    if (localStorage['login-user']) {
      this.loginForm.patchValue({
        useridin: localStorage['login-user']
      });
    }
    this.handleCheckBox();
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
    const loginData = this.loginForm.value;
    this.globalService.markFormGroupTouched(this.loginForm);
    // this.validationService.focusFirstError();
    this.isFormSubmitted = true;
    if (this.loginForm.valid) {
      sessionStorage.setItem('key', this.loginForm.controls.useridin.value);
      this.alertService.clearError();
      this.loginService.login(loginData).subscribe(response => {
        // this.globalService.handleLogin(response);
        const scopename = this.authService.authToken.scopename;
        switch (scopename) {
          case 'REGISTERED-NOT-VERIFIED':
          case 'INACTIVE-AUTHENTICATED-AND-VERIFIED':
          case 'REGISTERED-AND-VERIFIED':
            this.globalService.memAuth().subscribe(memAuthResponse => {
              if (memAuthResponse['errormessage']) {
                this.authService.authRestartScreen = '/register/register-detail';
              } else {
                if (memAuthResponse['ROWSET']) {
                  if (memAuthResponse['ROWSET'].ROWS.memNum === null && memAuthResponse['ROWSET'].ROWS.lastName === 'null') {
                    this.authService.authRestartScreen = '/register/register-detail';
                  } else if (memAuthResponse['ROWSET'].ROWS.memNum === null && memAuthResponse['ROWSET'].ROWS.lastName !== 'null') {
                    this.authService.authRestartScreen = '/register/memberinfo';
                  } else if ((memAuthResponse['ROWSET'].ROWS.memNum !== 'null' && memAuthResponse['ROWSET'].ROWS.lastName !== 'null' &&
                    (memAuthResponse['ROWSET'].ROWS.lastAuthResult === null ||
                      memAuthResponse['ROWSET'].ROWS.lastAuthResult.indexOf('0') < 0))) {
                    this.authService.authRestartScreen = '/register/updatessn';
                  } else if ((memAuthResponse['ROWSET'].ROWS.memNum !== 'null' && memAuthResponse['ROWSET'].ROWS.lastName !== 'null' &&
                    memAuthResponse['ROWSET'].ROWS.lastAuthResult.indexOf('0') >= 0)) {
                    this.authService.authRestartScreen = '/register/verifyaccesscode';
                  }
                }
              }
            });
            this.router.navigate(['/home']);
            break;
          case 'AUTHENTICATED-NOT-VERIFIED': {
            // this.globalService.getMemberInfo();
            this.globalService.clearMemberData();
            this.globalService.fetchMemberData().subscribe(data => this.globalService.setMemberData(data));
            this.router.navigate(['/register/verifyaccesscode']);
            break;
          }
          case 'AUTHENTICATED-AND-VERIFIED': {
            // TODO: this should also be done in authentication success page.
            // this.globalService.getMemberInfo();
            this.globalService.clearMemberData();
            this.globalService.fetchMemberData().subscribe(data => this.globalService.setMemberData(data));
            this.dependantService.loadDependants();
            this.router.navigate(['/home']);
            break;
          }
          default: {
            // statements;
            this.router.navigate(['/home']);
            break;
          }
        }
      }, err => {
        // this.hideSpinnerLoading(); testingshashwat
        if (err.status >= 500) {
          $('#requestTimeoutError').modal('open');
        } else {
          this.globalService.handleError(err.error, this.constants.displayMessage);
          this.validationService.focusFirstError();
        }
      }
      );
    }
  }

  togglePasswordVisibility() {
    if (this.type === 'text') {
      this.type = 'password';
      this.typePlaceholder = 'Show';
    } else {
      this.type = 'text';
      this.typePlaceholder = 'Hide';
    }
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

  focusOutUIError() {
    window.setTimeout(() => {
      console.log('ngif is set 123');
      this.focusOutUIErrorFlag = true;
    }, 250);
  }
}
