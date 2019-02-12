import { Component, OnDestroy, OnInit } from '@angular/core';
import { ValidationService } from '../../../shared/services/validation.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertType } from '../../../shared/alerts/alertType.model';
import { MyAccountService } from '../my-account.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../shared/services/alert.service';
import { ConstantsService } from '../../../shared/services/constants.service';
import { GlobalService } from '../../../shared/services/global.service';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
import { MyAccountsConstants } from '../constants/my-accounts.constants';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
declare let $: any;

@Component({
  selector: 'app-confirmidentity',
  templateUrl: './confirmidentity.component.html',
  styleUrls: ['./confirmidentity.component.scss']
})

export class ConfirmidentityComponent implements OnInit, OnDestroy {
  identityForm: FormGroup;
  dobMask: Array<any>;
  dobMessages = {
    'required': 'Please enter a valid date of birth.',
  };

  constructor(private fb: FormBuilder,
    private myAccountService: MyAccountService,
    private router: Router,
    private globalService: GlobalService,
    private constants: ConstantsService,
    private alertService: AlertService,
    private validationService: ValidationService,
    private bcbsmaErrorHandler: BcbsmaerrorHandlerService) {
    try {
      this.identityForm = this.fb.group({
        dob: ['', [Validators.required, this.validationService.dateValidator(), this.validationService.dobValidator()]],
      });
      this.dobMask = this.validationService.dobMask;
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.myAccountModule,
        MyAccountsConstants.components.confirmIdentityComponent,
        MyAccountsConstants.methods.constructor);
    }
  }

  ngOnDestroy() {
  }

  handleVerifiedResponse() {
    try {
      sessionStorage.setItem('otp', 'TRUE');
      this.router.navigate(['/account/verifyAccessCode', 'FUN']).then(() => {
        this.alertService.setAlert('Verification code sent!',
          '', AlertType.Success);
      });
      // this.router.navigate(['/account/verifyAccessCode']);
      // sessionStorage.clear();
      // this.alertService.setAlert('Please check your email account or mobile number for your username.',
      //   'Success', AlertType.Success);
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.myAccountModule,
        MyAccountsConstants.components.confirmIdentityComponent,
        MyAccountsConstants.methods.handleVerifiedResponse);
    }
  }

  onSubmit() {
    try {
      const request = this.identityForm.value;
      this.alertService.clearError();
      this.myAccountService.confirmIdentity(request).subscribe(res => {
        if (res && (res['result'] === '0' || res['result'] === 0)) {
          this.handleVerifiedResponse();
        } else if (res['result'] < 0) {
          this.globalService.handleError(res, this.constants.displayMessage);
        }
      });
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.myAccountModule,
        MyAccountsConstants.components.confirmIdentityComponent,
        MyAccountsConstants.methods.onSubmit);
    }
  }

  ngOnInit() {
    try {
      this.alertService.clearError();

    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.myAccountModule,
        MyAccountsConstants.components.confirmIdentityComponent,
        MyAccountsConstants.methods.ngOnInit);
    }
  }
}
