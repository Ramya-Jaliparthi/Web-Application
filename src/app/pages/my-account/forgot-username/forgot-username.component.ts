import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../../shared/services/validation.service';
import { MyAccountService } from '../my-account.service';
import { ConstantsService } from '../../../shared/services/constants.service';
import { GlobalService } from '../../../shared/services/global.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../shared/services/alert.service';
import { AlertType } from '../../../shared/alerts/alertType.model';
import { AuthService } from '../../../shared/services/auth.service';
import { RegType } from '../../../shared/models/regType.enum';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
import { MyAccountsConstants } from '../constants/my-accounts.constants';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
import { AuthHttp } from '../../../shared/services/authHttp.service';

@Component({
  selector: 'app-forgot-username',
  templateUrl: './forgot-username.component.html',
  styleUrls: ['./forgot-username.component.scss']
})
export class ForgotUsernameComponent implements OnDestroy, OnInit {
  forgotUsernameForm: FormGroup;
  dobMask: Array<any>;
  phoneMask: Array<any>;
  mobileNumberMessages = {
    'required': 'Please enter a valid phone number.',
  };
  emailMessages = {
    'required': 'Please enter a valid email.',
  };

  constructor(private fb: FormBuilder,
    private myAccountService: MyAccountService,
    private globalService: GlobalService,
    private authService: AuthService,
    private authHttp: AuthHttp,
    private constants: ConstantsService,
    private alertService: AlertService,
    private router: Router,
    private validationService: ValidationService,
    private bcbsmaErrorHandler: BcbsmaerrorHandlerService) {
    try {
      this.forgotUsernameForm = this.fb.group({
        email: ['', [Validators.required, this.validationService.emailValidator()]],
        mobile: ['', [Validators.required, this.validationService.phoneValidator(), this.validationService.mobileValidator()]]

        // dob: ['', [this.validationService.dateValidator()]],
      });
      // this.dobMask = this.validationService.dobMask;
      this.phoneMask = this.validationService.phoneMask;
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.myAccountModule,
        MyAccountsConstants.components.forgotUsernameComponent,
        MyAccountsConstants.methods.constructor);
    }
  }


  showErrorMessage(regType: RegType, res) {
    try {
      this.authService.useridin = regType === RegType.MOBILE ?
        this.forgotUsernameForm.value.mobile : this.forgotUsernameForm.value.email;
      this.globalService.handleError(res, this.constants.displayMessage);
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.myAccountModule,
        MyAccountsConstants.components.forgotUsernameComponent,
        MyAccountsConstants.methods.showErrorMessage);
    }
  }

  handleVerificationResponse(regType: RegType, res, isVerifedUser: boolean) {
    try {
      if (isVerifedUser) {
        this.handleSuccessResponse(regType, res);
      } else {
        this.handleNonVerifiedResponse();
      }
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.myAccountModule,
        MyAccountsConstants.components.forgotUsernameComponent,
        MyAccountsConstants.methods.handleVerificationResponse);
    }
  }

  handleNonVerifiedResponse() {
    try {
      this.router.navigate(['./login']);
      this.alertService.setAlert('Please check your email account or mobile number for your username.',
        '', AlertType.Success);
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.myAccountModule,
        MyAccountsConstants.components.forgotUsernameComponent,
        MyAccountsConstants.methods.handleNonVerifiedResponse);
    }
  }

  handleSuccessResponse(regType: RegType, res) {
    try {
      sessionStorage.setItem('useridin', regType === RegType.MOBILE ?
        this.forgotUsernameForm.value.mobile :
        this.forgotUsernameForm.value.email);
      sessionStorage.setItem('isauthenticated', 'TRUE');
      this.router.navigate(['./account/confirmidentity']);
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.myAccountModule,
        MyAccountsConstants.components.forgotUsernameComponent,
        MyAccountsConstants.methods.handleSuccessResponse);
    }
  }

  handleNonAuthenticatedUserResponse(regType: RegType, res) {
    try {
      sessionStorage.setItem('useridin', regType === RegType.MOBILE ?
        this.forgotUsernameForm.value.mobile :
        this.forgotUsernameForm.value.email);
      sessionStorage.setItem('isauthenticated', 'FALSE');
      sessionStorage.setItem('otp', 'TRUE');
      this.router.navigate(['/account/verifyAccessCode', 'FUN']);
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.myAccountModule,
        MyAccountsConstants.components.forgotUsernameComponent,
        MyAccountsConstants.methods.handleNonAuthenticatedUserResponse);
    }
  }

  getToken() {
    try {
      // this.authService.cryptoToken = null; // Commenting because this causes calling gettoken all the time
      this.authService.getTokens().subscribe(token => {
        this.authService.cryptoToken = token;
        this.authService.persistSession();
        this.verifyIsUserValid();
      }, err => {
        console.log('Error in forgot username', err);
        this.authHttp.handleError(err);
      });
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.myAccountModule,
        MyAccountsConstants.components.forgotUsernameComponent,
        MyAccountsConstants.methods.getToken);
    }
  }

  verifyIsUserValid() {
    try {
      const request = this.forgotUsernameForm.value;
      request.mobile = request.mobile ? request.mobile.replace(/-/g, '') : request.mobile;
      request.email = request.email ? request.email.toLowerCase() : request.email;
      this.myAccountService.verifyUserValid(request).subscribe(res => {
        if (res) {
          const resultId = res['result'];
          const regType = res['commType'] === 'MOBILE' ? RegType.MOBILE : RegType.EMAIL;
          this.myAccountService.funverifyuserResponse = res;
          const isVerfiedUser = res['isAuthenticated'] === 'TRUE';
          if (resultId === null || resultId === undefined) {
            if (isVerfiedUser) {
              this.handleVerificationResponse(regType, res, isVerfiedUser);
            } else if (!isVerfiedUser) {
              this.handleNonAuthenticatedUserResponse(regType, res);
            }
          } else {
            sessionStorage.setItem('isauthenticated', 'FALSE');
            resultId === '-1' ? this.showErrorMessage(regType, res) :
              this.alertService.setError(res.displaymessage);
          }
        }
      }, error => {
        console.log('Error in forgot username', error);
        this.bcbsmaErrorHandler.handleHttpError(error,
          BcbsmaConstants.modules.messageCenterModule,
          MyAccountsConstants.services.myAccountService,
          MyAccountsConstants.methods.getDocumentViewData);
      });
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.myAccountModule,
        MyAccountsConstants.components.forgotUsernameComponent,
        MyAccountsConstants.methods.verifyIsUserValid);
    }
  }

  onSubmit() {
    try {
      this.alertService.clearError();
      this.getToken();
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.myAccountModule,
        MyAccountsConstants.components.forgotUsernameComponent,
        MyAccountsConstants.methods.onSubmit);
    }
  }

  ngOnDestroy() {
    this.alertService.clearError();
  }

  ngOnInit() {
    try {
      this.alertService.clearError();
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.myAccountModule,
        MyAccountsConstants.components.forgotUsernameComponent,
        MyAccountsConstants.methods.ngOnInit);
    }
  }
}
