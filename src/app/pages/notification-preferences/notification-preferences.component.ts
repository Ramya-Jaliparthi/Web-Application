import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationPreferencesService } from './notification-preferences.service';
import { AuthService } from '../../shared/services/auth.service';
import { CommStatusModel } from '../../shared/models/commStatusModel';
import { Router, ActivatedRoute } from '@angular/router';
import { ValidationService } from '../../shared/shared.module';
import { ProfileService } from '../../shared/services/myprofile/profile.service';
import { AlertService } from '../../shared/services/alert.service';
import { AlertType } from '../../shared/alerts/alertType.model';

@Component({
  selector: 'app-notification-preferences',
  templateUrl: './notification-preferences.component.html',
  styleUrls: ['./notification-preferences.component.scss']
})
export class NotificationPreferencesComponent implements OnInit, OnDestroy {
  preferenceInfo: any;
  preferenceEmailBackUp: boolean;
  preferenceMobileBackUp: boolean;
  disableSave: boolean = true;
  optInEmail: boolean = false;
  optInMobile: boolean = false;
  isVerifiedEmail: boolean = false;
  IsVerifiedMobile: boolean = false;
  verifiedMobile: string;
  verifiedEmail: string;
  verifyEmail: boolean;
  verifyMobileNumber: boolean;
  isMobileNumberAvail: string;


  constructor(private authService: AuthService,
    private commPreferenceService: NotificationPreferencesService,
    private art: ActivatedRoute,
    private router: Router,
    private validationService: ValidationService,
    private profileService: ProfileService,
    private alertService: AlertService) {
  }

  ngOnInit() {
    this.preferenceInfo = this.art.snapshot.data.commstatus.commstatus;
    // this.preferenceInfoBackUp=JSON.parse(JSON.stringify(this.preferenceInfo));
    this.isVerifiedEmail = this.getPreferenceValue('IsVerifiedEmail') === 'true';
    this.IsVerifiedMobile = this.getPreferenceValue('IsVerifiedMobile') === 'true';
    this.optInEmail = this.getPreferenceValue('EmailOptInStatus').toLowerCase() === 'true';
    this.optInMobile = this.getPreferenceValue('MobileOptInStatus').toLowerCase() === 'true';
    this.preferenceEmailBackUp = this.optInEmail;
    this.preferenceMobileBackUp = this.optInMobile;
    this.verifiedEmail = this.getPreferenceValue('MemEmailAddress');
    this.verifyEmail = this.verifiedEmail.length === 0;
    this.verifiedMobile = this.getPreferenceValue('MemPhoneNumber');
    this.isMobileNumberAvail = this.getPreferenceValue('MemPhoneNumber');
    this.verifyMobileNumber = this.verifiedMobile.length === 0;
  }

  ngOnDestroy() {
    this.alertService.clearError();
  }


  getCommStatus() {
    return this.commPreferenceService.getcommStatus();
  }

  updateCommStatus() {
    this.alertService.clearError();
    const preferences = [];
    preferences.push({ 'memKeyName': 'EmailOptInStatus', 'memKeyValue': this.optInEmail.toString() }),
      preferences.push({ 'memKeyName': 'EmailOptInSource', 'memKeyValue': 'WEB' });
    preferences.push({ 'memKeyName': 'MobileOptInStatus', 'memKeyValue': this.optInMobile.toString() }),
      preferences.push({ 'memKeyName': 'MobileOptInSource', 'memKeyValue': 'WEB' });


    this.commPreferenceService.updateCommStatus({ 'preferences': preferences }).subscribe((res) => {
      this.preferenceEmailBackUp = this.optInEmail;
      this.preferenceMobileBackUp = this.optInMobile;
      console.log('Profile Update Response', res);

      let message = '';
      message = this.disableSave ? 'Success! Notifications updated!' : message;

      // if (message) {
      //   this.alertService.setAlert(message, 'Success', AlertType.Success);
      // } else {
      //   this.alertService.setAlert(message, 'Success', AlertType.Success);
      // }
      if (res && (res['result'] === 0 || res['result'] === '0')) {
        this.alertService.setAlert(message, '', AlertType.Success);
      } else {
        this.alertService.setAlert(res['displaymessage'], '', AlertType.Failure);
      }
    });
  }

  onCancel() {
    this.commPreferenceService.editPhone = false;
    this.commPreferenceService.editEmail = false;
    this.router.navigate(['/myprofile']);
  }

  onSave() {
    if (!this.disableSave) {
      this.disableSave = true;
      this.updateCommStatus();
    }
  }

  onMobileChange() {
    this.optInMobile = !this.optInMobile;
    this.allowSaveOnChange();
  }

  onEmailChange() {
    this.optInEmail = !this.optInEmail;
    this.allowSaveOnChange();
  }

  goToVerifyEmail(emailId?: string) {
    if (this.verifiedEmail && this.verifiedEmail !== '') {
      this.alertService.clearError();
      const currScope = this.authService.authToken ? this.authService.authToken.scopename : '';
      if (currScope === 'AUTHENTICATED-AND-VERIFIED' || currScope === 'REGISTERED-AND-VERIFIED') {
        this.sendcommchlaccesscode(emailId ? emailId : this.verifiedEmail, '').subscribe(res => {
          if (res['result'] === '0') {
            console.log('sendaccesscode success', res);
            this.alertService.clearError();
            this.commPreferenceService.maskedVerify = this.maskEmailId(emailId ? emailId : this.verifiedEmail);
            sessionStorage.setItem('maskedVerifyPhone', 'N');
            sessionStorage.setItem('maskedVerify', this.commPreferenceService.maskedVerify);
            this.navigateToVerifyScreen();
          } else {
            if (res['displaymessage']) {
              this.alertService.setAlert(res['displaymessage'],
                '', AlertType.Failure);
            }
          }
        }, err => {
          console.log('error', err);
        });
      } else {
        this.sendaccesscode('EMAIL', emailId ? emailId : this.verifiedEmail ).subscribe(res => {
          if (res['result'] === '0') {
            console.log('sendaccesscode success', res);
            this.alertService.clearError();
            this.commPreferenceService.maskedVerify = this.maskEmailId(emailId ? emailId : this.verifiedEmail);
            sessionStorage.setItem('maskedVerifyPhone', 'N');
            sessionStorage.setItem('maskedVerify', this.commPreferenceService.maskedVerify);
            this.navigateToVerifyScreen();
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
    } else {
      this.alertService.setAlert('You cannot enable any email notifications until you add an email address.', '', AlertType.Failure);
    }
  }

  goToVerifyMobile(phoneNumber?: string) {
    if (this.verifiedMobile && this.verifiedMobile !== '') {
      this.alertService.clearError();
      const currScope = this.authService.authToken ? this.authService.authToken.scopename : '';
      if (currScope === 'AUTHENTICATED-AND-VERIFIED' || currScope === 'REGISTERED-AND-VERIFIED') {
        this.sendcommchlaccesscode('', phoneNumber ? phoneNumber : this.verifiedMobile.replace(/\D/g, '')).subscribe(res => {
          if (res['result'] === '0') {
            console.log('sendaccesscode success', res);
            this.alertService.clearError();
            this.commPreferenceService.maskedVerify = this.maskPhoneNumber(phoneNumber ? phoneNumber : this.verifiedMobile.replace(/\D/g, ''));
            sessionStorage.setItem('maskedVerify', this.commPreferenceService.maskedVerify);
            sessionStorage.setItem('maskedVerifyPhone', 'Y');
            this.navigateToVerifyScreen();
          } else {
            if (res['displaymessage']) {
              this.alertService.setAlert(res['displaymessage'],
                '', AlertType.Failure);
            }
          }
        }, err => {
          console.log('error', err);
        });
      } else {
        this.sendaccesscode('MOBILE', phoneNumber ? phoneNumber : this.verifiedMobile.replace(/\D/g, '')).subscribe(res => {
          if (res['result'] === '0') {
            console.log('sendaccesscode success', res);
            this.alertService.clearError();
            this.commPreferenceService.maskedVerify = this.maskPhoneNumber(phoneNumber ? phoneNumber : this.verifiedMobile.replace(/\D/g, ''));
            sessionStorage.setItem('maskedVerify', this.commPreferenceService.maskedVerify);
            sessionStorage.setItem('maskedVerifyPhone', 'Y');
            this.navigateToVerifyScreen();
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
    } else {
      this.alertService.setAlert('You cannot enable any text notifications until you add a mobile phone number.', '', AlertType.Failure);
    }
  }

  navigateToVerifyScreen() {
    this.router.navigate(['/myprofile/verify']).then( () => {
      this.alertService.setAlert('Verification code sent!.', '', AlertType.Success);
    });
  }

  allowSaveOnChange() {
    if (this.preferenceMobileBackUp !== this.optInMobile || this.preferenceEmailBackUp !== this.optInEmail) {
      this.disableSave = false;
    } else {
      this.disableSave = true;
    }
  }

  emailEdit() {
    this.commPreferenceService.editPhone = false;
    this.commPreferenceService.editEmail = true;
    this.router.navigate(['/myprofile']);
  }

  phoneEdit() {
    this.commPreferenceService.editEmail = false;
    this.commPreferenceService.editPhone = true;
    this.router.navigate(['/myprofile']);
  }

  getPreferenceValue(keyName) {
    const preferenceItem = this.preferenceInfo.preferences.filter((item) => {
      return item['memKeyName'] === keyName;
    });
    return preferenceItem && preferenceItem[0] ? preferenceItem[0]['memKeyValue'] : '';
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


  private sendaccesscode(
    commChannelType,
    commChannel) {
    return this.commPreferenceService.sendaccesscode(commChannelType, commChannel);  }

  private sendcommchlaccesscode(email, mobile) {
    return this.commPreferenceService.sendcommchlaccesscode(
      email, mobile.replace(/\D/g, ''));
  }

}
