import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../../shared/services/validation.service';
import { MyAccountService } from '../my-account.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../shared/services/global.service';
import { ConstantsService } from '../../../shared/services/constants.service';
import { AlertService } from '../../../shared/services/alert.service';
import { AuthService } from '../../../shared/services/auth.service';
import { AlertType } from '../../../shared/alerts/alertType.model';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
import { MyAccountsConstants } from '../constants/my-accounts.constants';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  forgotPwdForm: FormGroup;
  dobMask: Array<any>;
  useridinMessages = {
    'required': 'Please enter a valid username.',
  };

  constructor(private fb: FormBuilder,
    private validationService: ValidationService,
    private globalService: GlobalService,
    private constants: ConstantsService,
    private authService: AuthService,
    private myAccountService: MyAccountService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private bcbsmaErrorHandler: BcbsmaerrorHandlerService) {
    try {
      this.forgotPwdForm = this.fb.group({
        useridin: ['', [Validators.required]],
      });
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.myAccountModule,
        MyAccountsConstants.components.forgotPasswordComponent,
        MyAccountsConstants.methods.constructor);
    }
  }

  ngOnInit() {
    try {
      this.route.params.subscribe(params => {
        let userId = params['user'];
        if (localStorage['login-user'] && userId === '') {
          userId = localStorage['login-user'];
        }
        this.forgotPwdForm.patchValue({
          useridin: userId
        });
      });
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.myAccountModule,
        MyAccountsConstants.components.forgotPasswordComponent,
        MyAccountsConstants.methods.ngOnInit);
    }
  }

  onSubmit() {
    try {
      this.getToken();
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.myAccountModule,
        MyAccountsConstants.components.forgotPasswordComponent,
        MyAccountsConstants.methods.constructor);
    }
  }

  verifyUser() {
    try {
      this.alertService.clearError();
      this.myAccountService.verifyUser(this.forgotPwdForm.getRawValue()).subscribe(res => {
        if (res.original['result'] !== '0' && res.original['result'] !== 0) {
          this.globalService.handleError(res.original, this.constants.displayMessage);
          // this.alertService.setAlert(res.original['displaymessage'], '', AlertType.Failure);
        } else {
          if (res.decrypted['isAuthenticated'] === true || res.decrypted['isAuthenticated'] === 'TRUE') {
            this.myAccountService.hintQuestion = res.decrypted['hintQuestion'];
            sessionStorage.setItem('isauthenticated', 'TRUE');
            this.router.navigate(['/account/fpconfirmidentity']);
          } else {
            sessionStorage.setItem('isauthenticated', 'FALSE');
            sessionStorage.setItem('otp', 'TRUE');
            this.router.navigate(['/account/verifyAccessCode', 'FPW']).then(() => {
              this.alertService.setAlert('Verification code sent.', '', AlertType.Success);
            });
          }
        }
      });
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.myAccountModule,
        MyAccountsConstants.components.forgotPasswordComponent,
        MyAccountsConstants.methods.verifyUser);
    }
  }

  getToken() {
    try {
      this.authService.getTokens().subscribe(token => {
        this.authService.cryptoToken = token;
        this.authService.persistSession();
        this.verifyUser();
      }, err => {
        console.log('Error in forgot username', err);
      });
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.myAccountModule,
        MyAccountsConstants.components.forgotPasswordComponent,
        MyAccountsConstants.methods.getToken);
    }
  }

  ngOnDestroy() {
    try {
      this.alertService.clearError();
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.myAccountModule,
        MyAccountsConstants.components.forgotPasswordComponent,
        MyAccountsConstants.methods.ngOnDestroy);
    }
  }


}
