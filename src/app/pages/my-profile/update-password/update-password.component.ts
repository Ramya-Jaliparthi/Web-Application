import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertType } from '../../../shared/alerts/alertType.model';
import { AlertService } from '../../../shared/services/alert.service';
import { ValidationService } from '../../../shared/shared.module';
import { ProfileService } from '../../../shared/services/myprofile/profile.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit, OnDestroy {
  typeCurrent: string;
  typePlaceholderCurrent: string;
  typeNew: string;
  typeReEnterNew: string;
  typePlaceholderNew: string;
  typePlaceholderReEnterNew: string;
  isFormSubmitted = false;
  updatePasswordForm: FormGroup;
  // added to resolve ng build --prod issue
  showPasswordErrors = false;
  showReEnterPasswordErrors = false;
  passwordcustomMessages = {
    required: 'You must enter a password.',
    invalidPassword: 'Your password does not match the minimum requirement. Please try again.',
    samePassword: 'Your new password can\'t be the same as your old password.',
    confirmPassword: 'Password doesn\'t match '
  };

  // yet to add validators for password fields
  constructor(private validationService: ValidationService,
    private fb: FormBuilder,
    private router: Router,
    private alertService: AlertService,
    private profileService: ProfileService) {
    this.typeCurrent = 'password';
    this.typePlaceholderCurrent = 'Show';
    this.typeNew = 'password';
    this.typePlaceholderNew = 'Show';
    this.updatePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', []],
      reEnterNewPassword: ['', []]
    });

    this.updatePasswordForm.controls['newPassword'].setValidators([Validators.required, Validators.minLength(8),
    this.validationService.invalidPasswordValidatorWrapper(),
    this.validationService.samePasswordValidator(this.updatePasswordForm.controls['currentPassword']),
    this.validationService.checkConfirmPasswordValidator(this.updatePasswordForm.controls['reEnterNewPassword'])

    ]);

    this.updatePasswordForm.controls['reEnterNewPassword'].setValidators([
      this.validationService.checkConfirmPasswordValidator(this.updatePasswordForm.controls['newPassword'], true)


    ]);

    this.alertService.clearError();
  }

  ngOnInit() {
    this.typeCurrent = 'password';
    this.typePlaceholderCurrent = 'Show';
    this.typeNew = 'password';
    this.typeReEnterNew = 'password';
    this.typePlaceholderNew = 'Show';
    this.typePlaceholderReEnterNew = 'Show';
  }


  ngOnDestroy() {
    this.alertService.clearError();
  }

  currentPasswordKeyUp() {
    this.updatePasswordForm.controls['newPassword'].setValue(this.updatePasswordForm.controls['newPassword'].value);
  }

  togglecurrentPasswordVisibility() {
    if (this.typeCurrent === 'text') {
      this.typeCurrent = 'password';
      this.typePlaceholderCurrent = 'Show';
    } else {
      this.typeCurrent = 'text';
      this.typePlaceholderCurrent = 'Hide';
    }
  }

  togglenewPasswordVisibility(confirmPassword?: boolean) {

    if (confirmPassword) {
      if (this.typeReEnterNew === 'text') {
        this.typeReEnterNew = 'password';
        this.typePlaceholderReEnterNew = 'Show';
      } else {
        this.typeReEnterNew = 'text';
        this.typePlaceholderReEnterNew = 'Hide';
      }

    } else {

      if (this.typeNew === 'text') {
        this.typeNew = 'password';
        this.typePlaceholderNew = 'Show';
      } else {
        this.typeNew = 'text';
        this.typePlaceholderNew = 'Hide';
      }

    }
  }

  onSubmit() {
    this.isFormSubmitted = true;
    this.alertService.clearError();
    /* TODO : API Calls */
    this.profileService.updatePassword(this.updatePasswordForm.value).subscribe(updatePasswordActionResp => {
      if (updatePasswordActionResp.result && updatePasswordActionResp.result < 0) {
        this.updatePasswordForm.controls.currentPassword.setValue('');
        this.alertService.setAlert(updatePasswordActionResp.displaymessage, '', AlertType.Failure);
        return;
      }
      console.log('RES=' + updatePasswordActionResp);
      this.router.navigate(['/myprofile']).then(() => {
        this.alertService.setAlert('Success! Your password has been changed!',
          '',
          AlertType.Success);
      });
    },
      error => {
        this.alertService.setAlert('Your password didn\'t match the minimum criteria listed below.Please try again',
          '', AlertType.Failure);
      });
    /* For error scenario */
    // this.alertService.setAlert("Your password didn't match the minimum criteria listed below. Please try again", '' , AlertType.Failure);
  }

  showErrorOnBlur(confirmPassword?: boolean) {
    if (confirmPassword) {
      this.showReEnterPasswordErrors = true;
    } else {
      this.showPasswordErrors = true;
    }


  }



}
