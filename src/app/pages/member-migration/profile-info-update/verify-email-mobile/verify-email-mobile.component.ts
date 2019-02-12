import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertType } from '../../../../shared/alerts/alertType.model';
import { GlobalService } from '../../../../shared/services/global.service';
import { Router } from '@angular/router';
import { ConstantsService } from '../../../../shared/services/constants.service';
import { MyAccountService } from '../../../my-account/my-account.service';
import { ProfileService } from '../../../../shared/services/myprofile/profile.service';
import { AlertService } from '../../../../shared/services/alert.service';
import { ValidationService } from '../../../../shared/services/validation.service';
import { MigrationService } from '../../migration.service';
import { AuthService } from '../../../../shared/shared.module';
import { AuthHttp } from '../../../../shared/services/authHttp.service';

declare let $: any;

@Component({
  selector: 'app-verify-email-mobile',
  templateUrl: './verify-email-mobile.component.html',
  styleUrls: ['./verify-email-mobile.component.scss']
})
export class VerifyEmailMobileComponent implements OnInit {

  @ViewChild('accesscode1') accesscode1: ElementRef;
  @ViewChild('accesscode2') accesscode2: ElementRef;
  @ViewChild('accesscode3') accesscode3: ElementRef;
  @ViewChild('accesscode4') accesscode4: ElementRef;
  @ViewChild('accesscode5') accesscode5: ElementRef;
  @ViewChild('accesscode6') accesscode6: ElementRef;
  verifyaccesscodeForm: FormGroup;
  public verifyChannelForm: FormGroup;
  public showChannelForm: boolean = false;
  public userId: string;
  public isUserIdMobile: boolean = false;
  public isChannelEmail: boolean = true;
  public maskedUserId: string;
  mobileNumberRegex = new RegExp('^[0-9]{10}');
  errorMsg = false;
  accesscodeMask: Array<any>;
  isFormSubmitted = false;
  location: string;
  maskedVerifiable: string;
  codeMask: Object = { mask: this.validationService.numericMask, guide: false };

  constructor(private alertService: AlertService,
    private fb: FormBuilder,
    private constants: ConstantsService,
    private globalService: GlobalService,
    private router: Router,
    public migrationService: MigrationService,
    private validationService: ValidationService,
    private authService: AuthService,
    private profileService: ProfileService,
    private http: AuthHttp
  ) {
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
    const sentMailId = JSON.parse(sessionStorage.getItem('sendCodeRes'));
    this.maskedUserId = this.getMaskedUserId(sentMailId && sentMailId['commChannel']);
    this.isUserIdMobile = this.mobileNumberRegex.test(this.userId) || (sentMailId && sentMailId['commChannelType'] === 'MOBILE');
  }

  ngOnInit() {
  }

  getMaskedUserId(email: string): string {
    const userId = email ? email : sessionStorage.getItem('useridin');
    this.userId = userId;
    const numberRegEx = new RegExp('^[0-9]{10}');
    return numberRegEx.test(userId) ? this.maskPhoneNumber(userId) : this.maskEmailId(email || userId);
  }

  maskEmailId(userId: string): string {
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

  getMaskedValue() {
  }

  onSubmit() {
    // this.isFormSubmitted = true;
    // sessionStorage.removeItem('key');
    // this.router.navigate(['/login']);

    this.isFormSubmitted = true;
    this.alertService.clearError();
    const accessCode =
      this.verifyaccesscodeForm.value.accesscode1 + this.verifyaccesscodeForm.value.accesscode2 +
      this.verifyaccesscodeForm.value.accesscode3 + this.verifyaccesscodeForm.value.accesscode4 +
      this.verifyaccesscodeForm.value.accesscode5 + this.verifyaccesscodeForm.value.accesscode6;

    if (this.verifyaccesscodeForm.valid) {

      const currScope = this.authService.authToken ? this.authService.authToken.scopename : '';
      if (currScope === 'AUTHENTICATED-AND-VERIFIED') {
        this.migrationService.VerifyCommChlAccCode(accessCode)
          .subscribe(response => {

            if (response['result'] === '0') {
              sessionStorage.removeItem('sendCodeRes');
              this.router.navigate(['member-migration/success']);
            } else {
              if (response['result'] === '-1') {
                this.alertService.setAlert('Your verification code has expired. Please request a new code.',
                  '', AlertType.Failure);
              } else if (response['result'] === '-2') {
                // tslint:disable-next-line:max-line-length
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
        this.migrationService.VerifyAccessCode(accessCode)
          .subscribe(response => {

            if (response['result'] === '0') {
              sessionStorage.removeItem('sendCodeRes');
              this.sendNotification();
              this.router.navigate(['member-migration/success']);
            } else {
              if (response['result'] === '-1') {
                this.alertService.setAlert('Your verification code has expired. Please request a new code.',
                  '', AlertType.Failure);
              } else if (response['result'] === '-2') {
                // tslint:disable-next-line:max-line-length
                this.alertService.setAlert('We\'re currently experiencing technical difficulties. Please try again later, or call <a href=\'te:18887721722\'>1-888-772-1722 </a> for immediate assistance.',
                  '', AlertType.Failure);
              } else if (response['result'] === '-3') {
                this.alertService.setAlert('This feature is not currently available. Please try again later.',
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
      }
    }
  }

  onKeyUp(event, previousElement, nextElement) {
    // if (event && event.target['value'] === '') {
    //   return false;
    // }
    this.errorMsg = false;
    if ((event.key === 'Backspace' || (event.which === 37) || event.key === 'ArrowLeft') && previousElement) {
      previousElement.focus();
    }
    if ((event.key === 'ArrowRight' || (event.which === 39) || (event.keyCode >= 48 && event.keyCode <= 57)
      || (event.keyCode >= 96 && event.keyCode <= 105)) && nextElement) {
      nextElement.focus();
    }
  }

  showVerifyCommunicationChannel() {
    this.showChannelForm = !this.showChannelForm;
    const sendCodeRes = JSON.parse(sessionStorage.getItem('sendCodeRes'));
    if (this.userId) {
      if (this.isUserIdMobile) {
        this.isChannelEmail = false;
        const mobileNumber = this.userId.length === 12 ? this.userId :
          this.userId.slice(0, 3) + '-' + this.userId.slice(3, 6) + '-' + this.userId.slice(6, 10);
        this.verifyChannelForm = this.fb.group({
          mobile: [mobileNumber,
            [Validators.required, this.validationService.mobileValidator(), this.validationService.phoneValidator()]]
        });
      } else {
        this.isChannelEmail = true;
        this.verifyChannelForm = this.fb.group({
          email: [this.userId,
          [Validators.required, this.validationService.emailValidator()]]
        });
      }
    }
  }

  verifyCommunicationChannel() {
    this.showChannelForm = false;
    if (this.verifyChannelForm.valid) {
      this.userId = this.isChannelEmail ? this.verifyChannelForm.controls['email'].value : this.verifyChannelForm.controls['mobile'].value;

      const request = {
        'useridin': this.authService.useridin,
        'commChannel': this.userId,
        'commChannelType': this.isChannelEmail ? 'EMAIL' : 'MOBILE',
        'userIDToVerify': JSON.parse(sessionStorage.getItem('migrationReq'))['selectedUserId'] ? JSON.parse(sessionStorage.getItem('migrationReq'))['selectedUserId']
          : this.authService.useridin
      };
      sessionStorage.setItem('sendCodeRes', JSON.stringify({
        'commChannel': this.userId,
        'commChannelType': this.isChannelEmail ? 'EMAIL' : 'MOBILE'
      }));
      this.sendAccessCode(true, request);
      // let request = null;
      // if (this.isChannelEmail) {
      //   request = {
      //     'useridin': this.authService.useridin,
      //     'emailAddress': this.userId
      //   };
      // } else {
      //   request = {
      //     'useridin': this.authService.useridin,
      //     'phoneNumber': this.userId,
      //     'phoneType': 'MOBILE'
      //   };
      // }
      // this.updateMemberInfo(request);
    }
  }

  // updateMemberInfo(request) {
  //   this.profileService.updateProfile(request, false, this.isChannelEmail, !this.isChannelEmail, false).subscribe(res => {
  //     if (res && (res['result'] === 0)) {
  //       const request = {
  //         'useridin': this.authService.useridin,
  //         'commChannel': this.userId,
  //         'commChannelType': this.isChannelEmail ? 'EMAIL' : 'MOBILE',
  //         'userIDToVerify': this.authService.useridin
  //       };
  //       sessionStorage.setItem('sendCodeRes', JSON.stringify({
  //         'commChannel': this.userId,
  //         'commChannelType': this.isChannelEmail ? 'EMAIL' : 'MOBILE'
  //       }));
  //       this.sendAccessCode();
  //     } else {
  //       let disMsg = res.displaymessage ? res.displaymessage : 'Oops something went wrong. Please try again!';
  //       this.alertService.setAlert(disMsg, ' ', AlertType.Failure);
  //     }
  //   }
  //   );
  // }


  sendAccessCode(resend?, request?) {
    this.showChannelForm = false;
    this.verifyaccesscodeForm.setValue({
      accesscode1: '', accesscode2: '', accesscode3: '', accesscode4: '', accesscode5: '', accesscode6: ''
    });
    this.alertService.clearError();
    const currScope = this.authService.authToken ? this.authService.authToken.scopename : '';
    // const scopeHandleMap = {
    //  : this.sendcommchlaccesscode(this.migrationService.memacctmergerequest.emailAddress,
    //     this.migrationService.memacctmergerequest.selectedUserId),
    //   'AUTHENTICATED-NOT-VERIFIED':,
    //   '': this.currentScopeError
    // }
    // scopeHandleMap[currScope]; // map function called.
    const memacctmergerequest = this.migrationService.getMemacctmergerequest();
    if (currScope === 'AUTHENTICATED-AND-VERIFIED') {
      this.sendcommchlaccesscode(memacctmergerequest.emailAddress,
        memacctmergerequest.selectedUserId, resend);
    } else {
      memacctmergerequest.emailAddress = this.userId ? this.userId : memacctmergerequest.emailAddress;
      this.sendaccesscode(memacctmergerequest.emailAddress,
        memacctmergerequest.selectedUserId, resend, request);
    }
  }

  private sendaccesscode(emailAddress, selectedUserId, editAndResend?, request?): void {
    this.migrationService.sendaccesscode(emailAddress, selectedUserId, editAndResend, request).subscribe(res => {
      if (res['result'] === '0' || res['result'] === 0) {
        console.log('sendaccesscode success', res);
        const communicationChannel = this.http.handleDecryptedResponse(res);
        sessionStorage.setItem('sendCodeRes', JSON.stringify(communicationChannel));
        this.alertService.clearError();
        this.alertService.setAlert('', 'Verification code resent! You may need to check your spam folder.', AlertType.Success);
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

  private sendcommchlaccesscode(emailAddress, selectedUserId, editAndResend?): void {
    this.migrationService.sendcommchlaccesscode(emailAddress, selectedUserId, editAndResend).subscribe(res => {
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

  private sendNotification() {
    const getMemacctmergerequest = this.migrationService.getMemacctmergerequest();
    const notificationRequest = {
      'useridin': this.authService.useridin,
      'commChannel': getMemacctmergerequest.emailAddress,
      'commChannelType': 'EMAIL',
      'templateKeyword': 'UPDATENOTIFICATION_EMAIL',
      'notificationParms': [
        {
          'keyName': 'firstName',
          'keyValue': this.authService && this.authService.authToken && this.authService.authToken.firstName
            ? this.authService.authToken.firstName : ''
        },
        {
          'keyName': 'myProfileURL',
          'keyValue': window.location.origin + this.router.url,
        },
        {
          'keyName': 'updatedFields',
          'keyValue': ['email']
        }
      ]
    };
    console.log('notificationRequest=', notificationRequest);
    this.migrationService.sendUpdateNotification(notificationRequest).subscribe(res => {

    });

  }

  onCancel(e) {
    this.showChannelForm = false;
  }

}
