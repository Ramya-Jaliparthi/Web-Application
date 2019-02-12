import { Component, OnDestroy, OnInit } from '@angular/core';
import { ValidationService } from '../../../shared/services/validation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertType } from '../../../shared/alerts/alertType.model';
import { MyAccountService } from '../my-account.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../shared/services/alert.service';
import { ConstantsService } from '../../../shared/services/constants.service';
import { GlobalService } from '../../../shared/services/global.service';
import * as moment from 'moment';
declare let $: any;
const UNAVAILABLE = 'Unavailable';
window['moment'] = moment;
@Component({
  selector: 'app-fpconfirmidentity',
  templateUrl: './fpconfirmidentity.component.html',
  styleUrls: ['./fpconfirmidentity.component.scss']
})
export class FpConfirmidentityComponent implements OnInit, OnDestroy {
  identityForm: FormGroup;
  dobMask: Array<any>;
  hintquesMessages = {
    'required': 'You must answer the security question.',
    'tralingspace': 'You must enter a valid hint answer'
  };
  dobMessages = {
    'required': 'Please enter a valid date of birth.',
    'invalidDate': 'Please enter a valid date of birth.',
    'invalidDob': 'Please enter a valid date of birth.'
  };

  constructor(private fb: FormBuilder,
    private myAccountService: MyAccountService,
    private router: Router,
    private globalService: GlobalService,
    private constants: ConstantsService,
    private alertService: AlertService,
    private validationService: ValidationService) {

    this.identityForm = this.fb.group({
      dob: ['', [Validators.required, this.validationService.dateValidator(), this.validationService.dobValidator()]],
      hintques: ['', [Validators.required, this.validationService.trailingSpaceValidator()]]
    });
    this.dobMask = this.validationService.dobMask;
    if (this.getHintQuestionText() === UNAVAILABLE) {
      this.identityForm.get('hintques').disable();
      this.identityForm.get('hintques').clearValidators();
      this.identityForm.get('hintques').updateValueAndValidity();
    }
  }

  ngOnDestroy() {
    this.alertService.clearError();
  }

  handleVerifiedResponse() {
    this.router.navigate(['./login']);
    this.alertService.setAlert('Please check your email account or mobile number for your username.',
      '', AlertType.Success);
    sessionStorage.clear();
  }

  getHintQuestionText() {
    if (this.myAccountService.hintQuestion !== null && this.myAccountService.hintQuestion !== undefined) {
      return this.myAccountService.hintQuestion + '*';
    } else {
      return UNAVAILABLE;
    }
  }

  onSubmit() {
    // moment(moment(this.identityForm.get('dob').value, 'MM/DD/YYYY')).format('YYYY-MM-DD')
    const request = {
      dob: this.globalService.getUTCDate(this.identityForm.get('dob').value),
      hintQuestionRequired: this.getHintQuestionText() === UNAVAILABLE ? 'false' : 'true',
      // hintQuestionRequired: this.getHintQuestionText() === UNAVAILABLE ? 'N' : 'Y',
      hintAnswer: this.identityForm.get('hintques').value
    };
    this.alertService.clearError();
    this.myAccountService.verifyUserAuth(request).subscribe(res => {
      const result = isNaN(res.original['result']) ? res.original['result'] : res.original['result'].toString();
      if (result !== '0' && result !== 0) {
        this.globalService.handleError(res.original, this.constants.displayMessage);
      } else {
        sessionStorage.setItem('otp', 'TRUE');
        this.router.navigate(['/account/verifyAccessCode', 'FPW']).then(() => {
          this.alertService.setAlert('Verification code sent.',
            '', AlertType.Success);
        });
      }
    });
  }

  ngOnInit() {
    $('.materialboxed').materialbox();
  }
}
