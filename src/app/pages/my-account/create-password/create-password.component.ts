import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../../shared/services/validation.service';
import { MyAccountService } from '../my-account.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../shared/services/alert.service';
import { GlobalService } from '../../../shared/services/global.service';
import { ConstantsService } from '../../../shared/services/constants.service';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
import { MyAccountsConstants } from '../constants/my-accounts.constants';

@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.component.html',
  styleUrls: ['./create-password.component.scss']
})
export class CreatePasswordComponent implements OnDestroy {
  createPasswordForm: FormGroup;
  type: string;
  typePlaceholder: string;
  showPasswordErrors = false;
  typeReEnterNew: string;
  typePlaceholderReEnterNew: string;

  passwordcustomMessages = {
    required: 'You must enter a valid password.',
    invalidPassword: 'Your password does not match the minimum requirement. Please try again.',
    confirmPassword: 'Password doesn\'t match '
  };

  constructor(private fb: FormBuilder,
    private accountService: MyAccountService,
    private router: Router,
    private alertService: AlertService,
    private constants: ConstantsService,
    private globalService: GlobalService,
    private validationService: ValidationService,
    private bcbsmaErrorHandler: BcbsmaerrorHandlerService) {
    try {
      this.type = 'password';
      this.typePlaceholder = 'Show';

      this.typeReEnterNew = 'password';
      this.typePlaceholderReEnterNew = 'Show';

      this.createPasswordForm = this.fb.group({
        passwordin: '',
        reEnterNewPassword: ''
      });

      this.createPasswordForm.controls['passwordin'].setValidators([Validators.required,
      Validators.minLength(8),
      this.validationService.invalidPasswordValidatorWrapper(),
      this.validationService.checkConfirmPasswordValidator(this.createPasswordForm.controls['reEnterNewPassword'])
      ]);

      this.createPasswordForm.controls['reEnterNewPassword'].setValidators([Validators.required,
      Validators.minLength(8),
      this.validationService.invalidPasswordValidatorWrapper(),
      this.validationService.checkConfirmPasswordValidator(this.createPasswordForm.controls['passwordin'], true)
      ]);

      this.alertService.clearError();

    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.myAccountModule,
        MyAccountsConstants.components.createPasswordComponent,
        MyAccountsConstants.methods.constructor);
    }
  }

  ngOnDestroy() {
    try {
      this.alertService.clearError();
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.myAccountModule,
        MyAccountsConstants.components.createPasswordComponent,
        MyAccountsConstants.methods.ngOnDestroy);
    }
  }

  onSubmit() {
    // this.router.navigate(['../login']);

    // for drop 1
    try {
      this.accountService.resetPassword(this.createPasswordForm.value).subscribe(res => {
        if (res['result'] !== '0' && res['result'] !== 0) {
          this.createPasswordForm.controls.passwordin.setValue('');
          this.globalService.handleError(res, this.constants.displayMessage);
        } else {
          this.accountService.clearStorage();
          this.router.navigate(['../login']);
        }
      });
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.myAccountModule,
        MyAccountsConstants.components.createPasswordComponent,
        MyAccountsConstants.methods.onSubmit);
    }
  }

  togglePasswordVisibility(confirmPassword?: boolean) {
    try {

      if (confirmPassword) {
        if (this.typeReEnterNew === 'text') {
          this.typeReEnterNew = 'password';
          this.typePlaceholderReEnterNew = 'Show';
        } else {
          this.typeReEnterNew = 'text';
          this.typePlaceholderReEnterNew = 'Hide';
        }

      } else {

        if (this.type === 'text') {
          this.type = 'password';
          this.typePlaceholder = 'Show';
        } else {
          this.type = 'text';
          this.typePlaceholder = 'Hide';
        }

      }



    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.myAccountModule,
        MyAccountsConstants.components.createPasswordComponent,
        MyAccountsConstants.methods.togglePasswordVisibility);
    }
  }

  showErrorOnBlur(confirmPassword?: boolean) {
    try {
      this.showPasswordErrors = true;
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.myAccountModule,
        MyAccountsConstants.components.createPasswordComponent,
        MyAccountsConstants.methods.showErrorOnBlur);
    }
  }

}
