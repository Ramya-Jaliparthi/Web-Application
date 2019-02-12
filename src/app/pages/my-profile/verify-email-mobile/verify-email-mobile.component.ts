import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertType } from '../../../shared/alerts/alertType.model';
import { AlertService } from '../../../shared/services/alert.service';
import { ConstantsService } from '../../../shared/services/constants.service';
import { GlobalService } from '../../../shared/services/global.service';
import { ValidationService } from '../../../shared/services/validation.service';
import { ProfileService } from '../../../shared/services/myprofile/profile.service';
import { AuthService } from '../../../shared/shared.module';
import { TitleCasePipe } from '@angular/common';

declare let $: any;

@Component({
  selector: 'app-verify-email-mobile',
  templateUrl: './verify-email-mobile.component.html',
  styleUrls: ['./verify-email-mobile.component.scss']
})
export class VerifyEmailMobileComponent implements OnInit, OnDestroy {

  @ViewChild('accesscode1') accesscode1: ElementRef;
  @ViewChild('accesscode2') accesscode2: ElementRef;
  @ViewChild('accesscode3') accesscode3: ElementRef;
  @ViewChild('accesscode4') accesscode4: ElementRef;
  @ViewChild('accesscode5') accesscode5: ElementRef;
  @ViewChild('accesscode6') accesscode6: ElementRef;
  verifyaccesscodeForm: FormGroup;
  errorMsg = false;
  accesscodeMask: Array<any>;
  isFormSubmitted = false;
  location: string;
  maskedVerifiable: string;
  codeMask: Object = { mask: this.validationService.numericMask, guide: false };
  verifyCategory = '';

  constructor(
    private alertService: AlertService,
    private fb: FormBuilder,
    private constants: ConstantsService,
    private globalService: GlobalService,
    private router: Router,
    private validationService: ValidationService,
    private profileService: ProfileService,
    private authService: AuthService,
    private titleCase: TitleCasePipe) {
    this.alertService.clearError();
    this.location = this.router.url.split('/')[1];
    this.verifyaccesscodeForm = this.fb.group({
      accesscode1: ['', [Validators.required]],
      accesscode2: ['', [Validators.required]],
      accesscode3: ['', [Validators.required]],
      accesscode4: ['', [Validators.required]],
      accesscode5: ['', [Validators.required]],
      accesscode6: ['', [Validators.required]],
    }, {
        validator: this.validationService.accessCodeValidator()
      });

    this.verifyaccesscodeForm.valueChanges.subscribe((accesscodes) => {
      Object.keys(accesscodes).forEach((key, index) => {
        const itemValue = (accesscodes[key] ? accesscodes[key] : '').toString();
        if (itemValue.length > 1) {
          let currentIndex = index;
          itemValue.split('').forEach((character) => {
            if (currentIndex < 6) {
              if (!accesscodes['accesscode' + (currentIndex + 1)] || index === currentIndex) {
                const accesscodekey = 'accesscode' + (currentIndex + 1);
                accesscodes[accesscodekey] = character;
                this.verifyaccesscodeForm.get(accesscodekey).setValue(character, { emitEvent: false });
                this[accesscodekey].nativeElement.focus();
              }
              currentIndex++;
            }
          });
        }
      });
    });
    this.accesscodeMask = this.validationService.accesscodeMask;
  }

  ngOnInit() {
    this.maskedVerifiable = sessionStorage.getItem('maskedVerify');
    this.verifyCategory = sessionStorage.getItem('maskedVerifyPhone') === 'Y' ? 'Mobile Number' : 'Email';
    if (this.profileService.getProfile() === null) {
      this.profileService.fetchProfileInfo().subscribe((res) => {
        this.profileService.setProfile(res);
      });
    }
  }

  maskEmailId(userId: string): string {
    const sentMailId = JSON.parse(sessionStorage.getItem('sendCodeRes'));
    userId = sentMailId && sentMailId['commChannel'] ? sentMailId['commChannel'] : userId;
    const maskedUserId = userId ? userId.replace(/^(.{3})(.*)(@.*)$/,
      (_, firstCharacter, charToMasked, domain) => {
        return `${firstCharacter}${charToMasked.replace(/./g, '*')}${domain}`;
      }) : userId;
    return maskedUserId;
  }

  maskPhoneNumber(userId: string): string {
    const regex = /^(.{3})(.{3})(.{4})(.*)/;
    let maskedUserId = userId ? userId.replace(/^(.*)(.{4})$/,
      (_, digitsToMasked, lastFourDigits) => {
        return `${digitsToMasked.replace(/./g, '*')}${lastFourDigits}`;
      }) : userId;
    const str = maskedUserId;
    const subst = `$1-$2-$3`;
    maskedUserId = str.replace(regex, subst);
    return maskedUserId;
  }

  ngOnDestroy() {
    this.alertService.clearError();
  }

  onSubmit() {
    this.isFormSubmitted = true;
    this.alertService.clearError();
    const accessCode = this.verifyaccesscodeForm.value.accesscode1 + this.verifyaccesscodeForm.value.accesscode2 +
      this.verifyaccesscodeForm.value.accesscode3 + this.verifyaccesscodeForm.value.accesscode4 +
      this.verifyaccesscodeForm.value.accesscode5 + this.verifyaccesscodeForm.value.accesscode6;
    if (this.verifyaccesscodeForm.valid) {
      const currScope = this.authService.authToken ? this.authService.authToken.scopename : '';
      if (currScope === 'AUTHENTICATED-AND-VERIFIED' || currScope === 'REGISTERED-AND-VERIFIED') {
        this.profileService.VerifyCommChlAccCode(accessCode,
          sessionStorage.getItem('maskedVerifyPhone') === 'Y' ?
            '' : this.profileService.getProfile().emailAddress,
          sessionStorage.getItem('maskedVerifyPhone') === 'Y' ?
            this.profileService.getProfile().phoneNumber.replace(/\D/g, '') : '')
          .subscribe(response => {
            if (response['result'] === '0') {
              const isMobile = sessionStorage.getItem('maskedVerifyPhone') === 'Y' ? 'MOBILE' : 'EMAIL';
              let msg = 'Verified your mobile number successfully.';
              if (isMobile !== 'MOBILE') {
                msg = 'Verified your email successfully.';
              }
              this.sendNotification(isMobile !== 'MOBILE', isMobile === 'MOBILE', isMobile,
                sessionStorage.getItem('maskedVerifyPhone') === 'Y' ?
                  this.profileService.getProfile().phoneNumber.replace(/\D/g, '') :
                  this.profileService.getProfile().emailAddress);
              this.router.navigate(['myprofile']).then(() => {
                this.alertService.setAlert(msg, '', AlertType.Success);
              });
            } else {
              if (response['result'] === '-1') {
                this.alertService.setAlert('Your verification code has expired. Please request a new code.',
                  '', AlertType.Failure);
              } else if (response['result'] === '-2') {
                this.alertService.setAlert('We\'re currently experiencing technical difficulties. Please try again later, or call <a href=\'te:18887721722\'>1-888-772-1722 </a> for immediate assistance.',
                  '', AlertType.Failure);
              } else if (response['result'] === '-4') {
                this.alertService.setAlert('The access code you entered does not match our records. Please try again.',
                  '', AlertType.Failure);
              } else {
                if (response['displaymessage']) {
                  this.alertService.setAlert(response['displaymessage'],
                    '', AlertType.Failure);
                }
              }
              this.verifyaccesscodeForm.setValue({
                accesscode1: '', accesscode2: '', accesscode3: '', accesscode4: '', accesscode5: '', accesscode6: ''
              });
              this.validationService.focusFirstError();
            }
          });
      } else {
        this.profileService.VerifyAccessCode(accessCode,
          sessionStorage.getItem('maskedVerifyPhone') === 'Y' ? 'MOBILE' : 'EMAIL',
          sessionStorage.getItem('maskedVerifyPhone') === 'Y' ?
            this.profileService.getProfile().phoneNumber.replace(/\D/g, '') :
            this.profileService.getProfile().emailAddress)
          .subscribe(response => {
            if (response['result'] === '0') {
              sessionStorage.removeItem('sendCodeRes');
              const isMobile = sessionStorage.getItem('maskedVerifyPhone') === 'Y' ? 'MOBILE' : 'EMAIL';
              let msg = 'Verified your mobile number successfully.';
              if (isMobile !== 'MOBILE') {
                msg = 'Verified your email successfully.';
              }
              this.router.navigate(['myprofile']).then(() => {
                this.alertService.setAlert(msg, '', AlertType.Success);
              });
            } else {
              if (response['result'] === '-1') {
                this.alertService.setAlert(
                  'Your verification code has expired. Please request a new code.',
                  '', AlertType.Failure);
              } else if (response['result'] === '-2') {
                this.alertService.setAlert(
                  'We\'re currently experiencing technical difficulties. Please try again later, or call <a href=\'te:18887721722\'>1-888-772-1722 </a> for immediate assistance.',
                  '', AlertType.Failure);
              } else if (response['result'] === '-3') {
                this.alertService.setAlert(
                  'This feature is not currently available. Please try again later.',
                  '', AlertType.Failure);
              } else if (response['result'] === '-4') {
                this.alertService.setAlert(
                  'The access code you entered does not match our records. Please try again.',
                  '', AlertType.Failure);
              } else {
                if (response['displaymessage']) {
                  this.alertService.setAlert(response['displaymessage'],
                    '', AlertType.Failure);
                }
              }
              this.verifyaccesscodeForm.setValue({
                accesscode1: '', accesscode2: '', accesscode3: '', accesscode4: '', accesscode5: '', accesscode6: ''
              });
              this.validationService.focusFirstError();
            }
          });
      }
    }
  }

  sendAccessCode() {
    this.verifyaccesscodeForm.setValue({
      accesscode1: '', accesscode2: '', accesscode3: '', accesscode4: '', accesscode5: '', accesscode6: ''
    });
    this.alertService.clearError();
    const currScope = this.authService.authToken ? this.authService.authToken.scopename : '';
    if (currScope === 'AUTHENTICATED-AND-VERIFIED' || currScope === 'REGISTERED-AND-VERIFIED') {
      this.sendcommchlaccesscode(
        sessionStorage.getItem('maskedVerifyPhone') === 'Y' ?
          '' : this.profileService.getProfile().emailAddress,
        sessionStorage.getItem('maskedVerifyPhone') === 'Y' ?
          this.profileService.getProfile().phoneNumber.replace(/\D/g, '') : '');
    } else {
      this.sendaccesscode(
        sessionStorage.getItem('maskedVerifyPhone') === 'Y' ? 'MOBILE' : 'EMAIL',
        sessionStorage.getItem('maskedVerifyPhone') === 'Y' ?
          this.profileService.getProfile().phoneNumber.replace(/\D/g, '') :
          this.profileService.getProfile().emailAddress);
    }
  }

  private sendaccesscode(
    commChannelType,
    commChannel): void {
    this.profileService.sendaccesscode(commChannelType, commChannel).subscribe(res => {
      if (res['result'] === '0' || res['result'] === 0) {
        console.log('sendaccesscode success', res);
        this.alertService.clearError();
        this.alertService.setAlert('Verification code resent! You may need to check your spam folder.', '', AlertType.Success);
      } else {
        if (res['displaymessage']) {
          this.alertService.setAlert(res['displaymessage'],
            '', AlertType.Failure);
        }
      }
    }, err => {
      console.log('error', err);
    });
  }

  private sendcommchlaccesscode(email, mobile): void {
    this.profileService.sendcommchlaccesscode(
      email, mobile.replace(/\D/g, '')).subscribe(res => {
        if (res['result'] === '0' || res['result'] === 0) {
          console.log('sendaccesscode success', res);
          this.alertService.clearError();
          // tslint:disable-next-line:max-line-length
          sessionStorage.getItem('maskedVerifyPhone') === 'Y' ? this.alertService.setAlert('Verification code resent!', '', AlertType.Success) :
            this.alertService.setAlert('Verification code resent! You may need to check your spam folder.', '', AlertType.Success);
        } else {
          if (res['displaymessage']) {
            this.alertService.setAlert(res['displaymessage'],
              '', AlertType.Failure);
          }
        }
      }, err => {
        console.log('error', err);
      });
  }

  onKeyUp(event, previousElement, nextElement) {
    this.errorMsg = false;
    if ((event.key === 'Backspace' || (event.which === 37) || event.key === 'ArrowLeft') && previousElement) {
      previousElement.focus();
    }
    if ((event.key === 'ArrowRight' || (event.which === 39) || (event.which >= 48 && event.which <= 57)
      || (event.which >= 96 && event.which <= 105)) && nextElement) {
      setTimeout(() => nextElement.focus(), 100);
    }
  }

  private sendNotification(isEmailEdit: boolean, isMobileEdit: boolean, commChannelType: string, commChannel: string) {
    const notificationRequest = {
      'useridin': this.authService.useridin,
      'commChannel': commChannel,
      'commChannelType': commChannelType,
      'templateKeyword': isEmailEdit ? 'UPDATENOTIFICATION_EMAIL' : 'UPDATENOTIFICATION_MOBILE',
      'notificationParms': [
        {
          'keyName': 'firstName',
          'keyValue': this.authService && this.authService.authToken && this.authService.authToken.firstName
            ? this.titleCase.transform(this.authService.authToken.firstName) : ''
        },
        {
          'keyName': 'myProfileURL',
          'keyValue': window.location.origin + '/myprofile',
        },
        {
          'keyName': 'updatedFields',
          'keyValue': isEmailEdit ? ['Email'] : ['Phone Number']
        }
      ]
    };
    console.log('notificationRequest=', notificationRequest);
    this.profileService.sendUpdateNotification(notificationRequest).subscribe(res => {

    });

  }
}
