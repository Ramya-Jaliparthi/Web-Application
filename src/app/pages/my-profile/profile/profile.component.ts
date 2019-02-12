import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertType } from '../../../shared/alerts/alertType.model';
import { AlertService } from '../../../shared/services/alert.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ConstantsService } from '../../../shared/services/constants.service';
import { GlobalService } from '../../../shared/services/global.service';
import { ProfileService } from '../../../shared/services/myprofile/profile.service';
import { ValidationService } from '../../../shared/services/validation.service';
import { NotificationPreferencesService } from '../../notification-preferences/notification-preferences.service';
import { GetMemberProfileResponseModel } from '../models/get-member-profile-request.model';
import {AuthHttp} from '../../../shared/services/authHttp.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  profileEditForm: FormGroup;
  profile: GetMemberProfileResponseModel;
  typePlaceholder: string;
  canEdit: boolean = false;
  useridin: string = '';
  memProfile: any;
  dob: any;
  isUseridAPhone: boolean = false;
  isUseridAEmail: boolean = false;
  registeredUserOnly: boolean = false;
  addressIsBlank: boolean = true;
  securityQuestionSetUp: boolean = false;
  diplayEmailAdress: string = '';
  diplayUserID: string = '';
  editAddress: boolean;
  editEmail: boolean = this.commPreferenceService.editEmail ? this.commPreferenceService.editEmail : false;
  editPhone: boolean = this.commPreferenceService.editPhone ? this.commPreferenceService.editPhone : false;
  editHint: boolean;
  type: string;
  address3: string = '';
  fpoTargetUrl = this.constants.drupalTestUrl + '/page/myprofile';

  mask: Object = { mask: this.validationService.phoneMask, guide: false };
  zipMask: Object = { mask: this.validationService.zipMask, guide: false };
  contactus = this.constants.contactus + this.authService.authToken.scopename;
  statesList = [
    { label: 'Alabama', value: 'AL' },
    { label: 'Alaska', value: 'AK' },
    { label: 'Arizona', value: 'AZ' },
    { label: 'Arkansas', value: 'AR' },
    { label: 'California', value: 'CA' },
    { label: 'Colorado', value: 'CO' },
    { label: 'Connecticut', value: 'CT' },
    { label: 'Delaware', value: 'DE' },
    { label: 'District of Columbia', value: 'DC' },
    { label: 'Florida', value: 'FL' },
    { label: 'Georgia', value: 'GA' },
    { label: 'Hawaii', value: 'HI' },
    { label: 'Idaho', value: 'ID' },
    { label: 'Illinois', value: 'IL' },
    { label: 'Indiana', value: 'IN' },
    { label: 'Iowa', value: 'IA' },
    { label: 'Kansas', value: 'KS' },
    { label: 'Kentucky', value: 'KY' },
    { label: 'Louisiana', value: 'LA' },
    { label: 'Maine', value: 'ME' },
    { label: 'Maryland', value: 'MD' },
    { label: 'Massachusetts', value: 'MA' },
    { label: 'Michigan', value: 'MI' },
    { label: 'Minnesota', value: 'MN' },
    { label: 'Mississippi', value: 'MS' },
    { label: 'Missouri', value: 'MO' },
    { label: 'Montana', value: 'MT' },
    { label: 'Nebraska', value: 'NE' },
    { label: 'Nevada', value: 'NV' },
    { label: 'New Hampshire', value: 'NH' },
    { label: 'New Jersey', value: 'NJ' },
    { label: 'New Mexico', value: 'NM' },
    { label: 'New York', value: 'NY' },
    { label: 'North Carolina', value: 'NC' },
    { label: 'North Dakota', value: 'ND' },
    { label: 'Ohio', value: 'OH' },
    { label: 'Oklahoma', value: 'OK' },
    { label: 'Oregon', value: 'OR' },
    { label: 'Pennsylvania', value: 'PA' },
    { label: 'Rhode Island', value: 'RI' },
    { label: 'South Carolina', value: 'SC' },
    { label: 'South Dakota', value: 'SD' },
    { label: 'Tennessee', value: 'TN' },
    { label: 'Texas', value: 'TX' },
    { label: 'Utah', value: 'UT' },
    { label: 'Vermont', value: 'VT' },
    { label: 'Virginia', value: 'VA' },
    { label: 'Washington', value: 'WA' },
    { label: 'West Virginia', value: 'WV' },
    { label: 'Wisconsin', value: 'WI' },
    { label: 'Wyoming', value: 'WY' }
  ];

  phoneNumberTypeValues = [
    { label: 'Mobile', value: 'MOBILE' },
    { label: 'Home', value: 'HOME' },
    { label: 'Work', value: 'WORK' }
  ];

  securityQuestionsOptions = [
    {
      label: 'Who was your favorite teacher?',
      value: 'Who was your favorite teacher?'
    },
    {
      label: 'Where did you meet your spouse?',
      value: 'Where did you meet your spouse?'
    },
    {
      label: 'What is your Mother’s middle name?',
      value: 'What is your Mother’s middle name?'
    },
    {
      label: 'What is the name of your closest friend from childhood?',
      value: 'What is the name of your closest friend from childhood?'
    },
    {
      label: 'In what city or town does your nearest relative live?',
      value: 'In what city or town does your nearest relative live?'
    },
    {
      label: 'What was the name of your elementary school?',
      value: 'What was the name of your elementary school?'
    },
    {
      label: 'What was the name of your first pet?',
      value: 'What was the name of your first pet?'
    },
  ];
  addressMessages = {
    'required': 'You must enter a valid mailing address.',
    'invalidCharacters': 'You must enter a valid mailing address.'
  };
  cityMessages = {
    'required': 'You must enter the city.',
    'invalidCharacters': 'You must enter a valid city.'
  };
  stateMessages = {
    'required': 'State is required'
  };
  zipMessages = {
    'required': 'You must enter your ZIP code.',
    'minlength': 'You must enter a valid ZIP code.'
  };
  emailMessages = {
    'required': 'You must enter your email address.',
    'invalidEmail': 'You must enter a valid email address.'
  };
  mobileNumberMessages = {
    'required': 'You must enter a valid phone number.',
    'invalidNumber': 'You must enter a valid phone number.',
    'invalidMobile': 'You must enter a valid phone number.'
  };
  hintAnswercustomMessages = {
    'tralingspace': 'You must enter a valid hint answer',
    'required': 'You must answer the hint question.',
    // tslint:disable-next-line:max-line-length
    'invalidHintAnswer': 'Incorrect answer. Please try again. Remember that your answer can\'t contain any spaces or special characters.'
  };

  toolTipVisible: boolean = false;
  currentUserScope = '';

  constructor(private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private http: AuthHttp,
    private alertService: AlertService,
    private validationService: ValidationService,
    private constants: ConstantsService,
    private globalService: GlobalService,
    private profileService: ProfileService,
    private commPreferenceService: NotificationPreferencesService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private authService: AuthService) {
    console.log('Vivek -> ', this.router.url + 'profile', this.location.path(), window.location.origin);
    this.profile = Object.assign({}, this.activatedRoute.snapshot.data.profile);
    this.currentUserScope = this.authService.authToken ? this.authService.authToken.scopename : '';

    this.profileEditForm = this.fb.group({
      useridin: '',
      isEditableAddress: false,
      userState: '',
      isDirectPay: false,
      address1: ['', this.editAddress ? [Validators.required, this.validationService.specialCharactersValidator()] : []],
      address2: ['', this.editAddress ? [this.validationService.specialCharactersValidator()] : []],
      dob: ['', []],
      city: ['', this.editAddress ? [Validators.required, this.validationService.specialCharactersValidator()] : []],
      state: ['', this.editAddress ? [Validators.required] : []],
      zip: ['', this.editAddress ? [Validators.required, Validators.minLength(5)] : []],
      emailAddress: ['', this.editEmail ? [Validators.required, this.validationService.emailValidator()] : []],
      fullName: '',
      phoneType: [this.getDefaultOptionForPhoneNumberType(), this.editPhone ? [Validators.required] : []],
      phoneNumber: [this.editPhone ? [Validators.required, this.validationService.phoneValidator(),
      this.validationService.mobileValidator()] : []],
      hintQuestion: [this.getDefaultOptionForSecurityQuestions(), this.editHint ? [Validators.required] : []],
      hintAnswer: ['', this.editHint ? [Validators.required, Validators.minLength(3),  Validators.maxLength(30)] : []],
      isVerifiedEmail: false,
      isVerifiedMobile: false,
      isEmailOptedIn: false,
      isMobileOptedIn: false
    });
    this.memProfile = sessionStorage.getItem('memProfile') ? sessionStorage.getItem('memProfile') : '';
    this.dob = this.memProfile ? JSON.parse(this.memProfile).dob : '';
    this.dob = this.dob ? new Date(this.dob) : '';
    this.useridin = sessionStorage.getItem('useridin');
    const numberRegEx = new RegExp('^[0-9]{10}');
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.isUseridAPhone = numberRegEx.test(this.useridin) ? true : false;
    this.isUseridAEmail = emailRegex.test(this.useridin) ? true : false;
    this.diplayUserID = this.isUseridAPhone ? this.maskPhoneNumberId(this.useridin) : this.useridin;
    this.resetAllEdits();
    this.canEdit = this.profileService.authService.isSubscriber;

    this.mask = { mask: this.validationService.phoneMask, guide: false };
    this.type = 'password';
    this.typePlaceholder = 'Show';
  }

  maskPhoneNumberId(userId: string): string {
    const regex = /^(.{3})(.{3})(.{4})(.*)/;
    const subst = `$1-$2-$3`;
    const maskedUserId = userId ? userId.replace(regex, subst) : userId;
    return maskedUserId;
  }
  ngOnInit() {
    const scopename = this.authService.authToken ? this.authService.authToken.scopename : '';
    if (this.profile) {
      if (!this.profile.phoneType) {
        this.profile.phoneType = 'MOBILE';
      }
      this.diplayEmailAdress = this.profile.emailAddress;
      this.profile.phoneNumber = this.formatPhone(this.profile.phoneNumber);
      const userRole = this.profileService.getUserRole();
      this.registeredUserOnly = (userRole === 'REGISTERED-NOT-VERIFIED' || userRole === 'REGISTERED-AND-VERIFIED') ? true : false;
      this.address3 = '';
      this.address3 = this.profile.city ? this.address3 + this.profile.city + ', ' : this.address3;
      this.address3 = this.profile.state ? this.address3 + this.profile.state + ' ' : this.address3;
      this.address3 = this.profile.zip ? this.address3 + this.profile.zip : this.address3;
      this.securityQuestionSetUp = this.profile.hintQuestion && this.profile.hintQuestion !== '' ? true : false;
      this.profileEditForm.setValue(this.profile);
      this.profileService.setProfile(this.profile);
    }
  }

  ngOnDestroy() {
    this.alertService.clearError();
    this.commPreferenceService.editPhone = false;
    this.commPreferenceService.editEmail = false;
  }

  addressEdit() {
    this.resetAllEdits();
    this.editPhone = false;
    this.editEmail = false;
    this.editAddress = true;
    this.alertService.clearError();
    this.getFormDefinition();
  }

  emailEdit() {
    this.resetAllEdits();
    this.editPhone = false;
    this.editEmail = true;
    this.alertService.clearError();
    this.getFormDefinition();
  }

  phoneEdit() {
    this.resetAllEdits();
    this.editEmail = false;
    this.alertService.clearError();
    this.editPhone = true;
    this.getFormDefinition();
  }

  hintEdit() {
    this.resetAllEdits();
    this.editPhone = false;
    this.editEmail = false;
    this.alertService.clearError();
    this.editHint = true;
    this.getFormDefinition();
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

  cancel() {
    this.resetAllEdits();
    this.editEmail = false;
    this.editPhone = false;
    this.profileService.fetchProfileInfo().subscribe(profile => {
      const scopename = this.authService.authToken ? this.authService.authToken.scopename : '';
      this.canEdit = this.profileService.authService.isSubscriber;
      this.profile = Object.assign({}, profile);
      this.getDefaultOptionForPhoneNumberType();
      this.profileService.setProfile(this.profile);
      this.profileEditForm.setValue(this.profile);
    });
  }

  showEdit() {
    let rtnVal: boolean;
    rtnVal = this.profile.userState !== 'REGISTERED-NOT-VERIFIED';
    rtnVal = rtnVal && !this.profileService.authService.isSubscriber;
    rtnVal = rtnVal && this.profileEditForm.value.isEditableAddress;
    return rtnVal;
  }

  fetchProfileInfo() {
    this.profileService.fetchProfileInfo().subscribe(profile => {
      this.canEdit = this.profileService.authService.isSubscriber;
      this.profile = profile;
      this.profileService.setProfile(this.profile);
    });
  }

  onSubmit() {
    if (this.profileEditForm.value.phoneNumber) {
      this.profileEditForm.value.phoneNumber = (this.profileEditForm.value.phoneNumber + '').replace(/-/g, '');
    }
    let alertMessageFinal = '';
    let alertType = '';
    let resultCode = 0;
    this.profileService.updateProfile(this.profileEditForm.value,
      this.editAddress, this.editEmail, this.editPhone, this.editHint)
      .flatMap(result => {
        resultCode = result.result;
        if (resultCode === -90129) {
          alertType = 'success';
          alertMessageFinal = result.displaymessage;
        } else if (resultCode === -90124 || resultCode === -90126) {
          alertType = 'error';
          alertMessageFinal = result.displaymessage;
        } else if (result.displaymessage !== '') {
          alertMessageFinal = result.displaymessage;
          console.log('result.displaymessage=', result.displaymessage);
        }
        return this.profileService.fetchProfileInfo();
      })
      .subscribe(
        profile => {

          this.canEdit = this.profileService.authService.isSubscriber;
          this.profile = profile;
          this.profileEditForm.setValue(profile);
          this.profileService.setProfile(this.profile);

          let message = '';
          let addressSuccessMessage = '';
          if (resultCode === -90129) {
            addressSuccessMessage = alertMessageFinal;
            alertMessageFinal = '';
          } else if (this.editAddress && resultCode === 0) {
            alertMessageFinal = 'Your Mailing Address has been updated!';
          }
          if (alertMessageFinal === '') {
            message = this.editAddress ? addressSuccessMessage : message;
            message = this.editEmail ? 'Your Email Address has been updated!' : message;
            message = this.editPhone ? 'Your Phone number has been updated!' : message;
            message = this.editHint ? 'You have successfully updated your hint question and answer!' : message;
            if (this.editHint) {
              this.alertService.setAlert(message, '', AlertType.Success);
            } else {
              this.alertService.setAlert(message, '', AlertType.Success);
            }
            if (this.editEmail) {
              this.verifyEmail(this.profile.emailAddress);
            }
            if (this.editPhone && this.profileEditForm.value.phoneType && this.profileEditForm.value.phoneType.toUpperCase() === 'MOBILE') {
              this.verifyPhone(this.profile.phoneNumber);
            }
          } else {
            message = alertMessageFinal;
            this.alertService.setAlert(message, '', AlertType.Failure);
          }

          this.resetAllEdits();
        },
        err => {
          this.globalService.handleError(err.error, this.constants.displayMessage);
        }
      );
  }

  resetAllEdits() {
    this.editAddress = false;
    this.editEmail = this.commPreferenceService.editEmail ? this.commPreferenceService.editEmail : false;
    this.editPhone = this.commPreferenceService.editPhone ? this.commPreferenceService.editPhone : false;
    this.editHint = false;
  }

  getFormDefinition() {
    this.profile = this.profileService.getProfile();
    const defaultPhoneNumber = this.formatPhone('');
    console.log(this.profileEditForm);
    this.profileEditForm = this.fb.group({
      useridin: '',
      isEditableAddress: false,
      userState: '',
      isDirectPay: false,
      address1: ['', this.editAddress ? [Validators.required, this.validationService.specialCharactersValidator()] : []],
      address2: ['', this.editAddress ? [this.validationService.specialCharactersValidator()] : []],
      dob: ['', []],
      city: ['', this.editAddress ? [Validators.required, this.validationService.specialCharactersValidator()] : []],
      state: ['', this.editAddress ? [Validators.required, this.validationService.validateState()] : []],
      zip: ['', this.editAddress ? [Validators.required] : []],
      emailAddress: ['', this.editEmail ? [Validators.required, this.validationService.emailValidator()] : []],
      fullName: '',
      phoneType: [this.getDefaultOptionForPhoneNumberType(), this.editPhone ? [Validators.required] : []],
      phoneNumber: [defaultPhoneNumber, this.editPhone ?
        [Validators.required, this.validationService.phoneValidator(), this.validationService.mobileValidator()] : []],
      hintQuestion: [this.getDefaultOptionForSecurityQuestions(), this.editHint ? [Validators.required] : []],
      hintAnswer: ['', this.editHint ? [Validators.required, Validators.minLength(3), Validators.maxLength(30),
          this.validationService.trailingSpaceValidator()] : []],
      isVerifiedEmail: false,
      isVerifiedMobile: false,
      isEmailOptedIn: false,
      isMobileOptedIn: false
    });
    if (!this.profile.phoneType) {
      this.profile.phoneType = 'MOBILE';
    }
    this.profileEditForm.setValue(this.profile);
  }

  getDefaultOptionForPhoneNumberType() {
    if (this.profile) {
      this.profile.phoneType = 'MOBILE';
      return this.profile.phoneType;
    }
  }

  getDefaultOptionForPhoneNumber() {
    this.profile.phoneNumber = this.profile.phoneNumber !== '' ? this.profile.phoneNumber : '';
  }

  getDefaultOptionForSecurityQuestions(): string {
    if (this.profile) {
      this.profile.hintQuestion = (this.profile.hintQuestion && this.profile.hintQuestion === '') &&
        this.securityQuestionsOptions && this.securityQuestionsOptions.length > 0 ?
        this.securityQuestionsOptions[0].value : this.profile.hintQuestion;
      return this.profile.hintQuestion;
    }
  }

  formatPhone(inputPhoneNumber) {
    if (inputPhoneNumber !== undefined && inputPhoneNumber !== null && inputPhoneNumber !== '') {
      let phoneNumber: string = inputPhoneNumber;
      phoneNumber = phoneNumber.replace(/-/g, '');
      const areaCode = phoneNumber.slice(0, 3);
      const number = phoneNumber.slice(3);
      return areaCode + '-' + number.slice(0, 3) + '-' + number.slice(3);
    } else {
      return '';
    }
  }

  verifyEmail(emailId?: string) {

    this.alertService.clearError();
    const currScope = this.authService.authToken ? this.authService.authToken.scopename : '';
    if (currScope === 'AUTHENTICATED-AND-VERIFIED' || currScope === 'REGISTERED-AND-VERIFIED') {
      this.sendcommchlaccesscode(emailId ? emailId : this.diplayEmailAdress, '').subscribe(res => {
        if (res['result'] === '0') {
          console.log('sendaccesscode success', res);
          this.alertService.clearError();
          // only if success
          this.profileService.maskedVerify = this.maskEmailId(emailId ? emailId : this.diplayEmailAdress);
          sessionStorage.setItem('maskedVerifyPhone', 'N');
          sessionStorage.setItem('maskedVerify', this.profileService.maskedVerify);
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
      this.sendaccesscode('EMAIL', emailId ? emailId : this.diplayEmailAdress).subscribe(res => {
        if (res['result'] === '0') {
          const communicationChannel = this.http.handleDecryptedResponse(res);
          sessionStorage.setItem('sendCodeRes', JSON.stringify(communicationChannel));
          console.log('sendaccesscode success', res);
          this.alertService.clearError();
          // only if success
          const sentMailId = JSON.parse(sessionStorage.getItem('sendCodeRes'));
          const userId = sentMailId && sentMailId['commChannel'];
          this.profileService.maskedVerify = this.maskEmailId(emailId ? emailId : userId);
          sessionStorage.setItem('maskedVerifyPhone', 'N');
          sessionStorage.setItem('maskedVerify', this.profileService.maskedVerify);
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
  }

  verifyPhone(phoneNumber?: string) {

    this.alertService.clearError();
    const currScope = this.authService.authToken ? this.authService.authToken.scopename : '';
    if (currScope === 'AUTHENTICATED-AND-VERIFIED' || currScope === 'REGISTERED-AND-VERIFIED') {
      this.sendcommchlaccesscode('', phoneNumber ? phoneNumber : this.profile.phoneNumber.replace(/\D/g, '')).subscribe(res => {
        if (res['result'] === '0') {
          console.log('sendaccesscode success', res);
          this.alertService.clearError();
          // only if success
          this.profileService.maskedVerify = this.maskPhoneNumber(phoneNumber ? phoneNumber : this.profile.phoneNumber.replace(/\D/g, ''));
          sessionStorage.setItem('maskedVerify', this.profileService.maskedVerify);
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
      this.sendaccesscode('MOBILE', phoneNumber ? phoneNumber : this.profile.phoneNumber.replace(/\D/g, '')).subscribe(res => {
        if (res['result'] === '0') {
          const communicationChannel = this.http.handleDecryptedResponse(res);
          sessionStorage.setItem('sendCodeRes', JSON.stringify(communicationChannel));
          console.log('sendaccesscode success', res);
          this.alertService.clearError();
          // only if success
          const sentMailId = JSON.parse(sessionStorage.getItem('sendCodeRes'));
          const userId = sentMailId && sentMailId['commChannel'];
          this.profileService.maskedVerify =
            this.maskPhoneNumber(phoneNumber ? phoneNumber : userId);
          sessionStorage.setItem('maskedVerify', this.profileService.maskedVerify);
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

  showToolTip() {
    this.toolTipVisible = !this.toolTipVisible;
  }

  navigateToVerifyScreen() {
    this.router.navigate(['/myprofile/verify']).then(() => {
      this.alertService.setAlert('Verification code sent!.', '', AlertType.Success);
    });
  }

  addPhone(event) {
    this.phoneEdit();
  }

  isWebMigrated(): boolean {
    return (!this.isUseridAPhone && !this.isUseridAPhone &&
      !this.profileEditForm.value.phoneNumber);
  }

  navigateToNotificationPrefence() {
    this.router.navigate(['/notification-preferences']);
  }

  private sendaccesscode(
    commChannelType,
    commChannel) {
    return this.profileService.sendaccesscode(commChannelType, commChannel);
  }

  private sendcommchlaccesscode(email, mobile) {
    return this.profileService.sendcommchlaccesscode(
      email, mobile.replace(/\D/g, ''));
  }

}
