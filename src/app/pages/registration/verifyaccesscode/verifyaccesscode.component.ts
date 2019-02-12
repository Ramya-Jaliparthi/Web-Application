import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors, Validators, FormControl} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {AlertType} from '../../../shared/alerts/alertType.model';
import {BcbsmaConstants} from '../../../shared/constants/bcbsma.constants';
import {AlertService} from '../../../shared/services/alert.service';
import {BcbsmaerrorHandlerService} from '../../../shared/services/bcbsmaerror-handler.service';
import {ConstantsService} from '../../../shared/services/constants.service';
import {GlobalService} from '../../../shared/services/global.service';
import {ProfileService} from '../../../shared/services/myprofile/profile.service';
import {ValidationService} from '../../../shared/services/validation.service';
import {RegistrationModuleConstants} from '../constants/registration-module.constants';
import {FormGroupControlsModel, VerifyAccessCodeInputValidationResultModel} from '../models/registrationModule.models';
import {RegistrationService} from '../registration.service';
import {AuthService} from '../../../shared/services/auth.service';
import {RegistrationHelper} from '../registration-helper';
import {RegisterConstants} from '../register-detail.error.constants';

declare let $: any;

@Component({
  selector: 'app-verifyaccesscode',
  templateUrl: './verifyaccesscode.component.html',
  styleUrls: ['./verifyaccesscode.component.scss']
})
export class VerifyaccesscodeComponent implements OnInit, OnDestroy {
  @ViewChild('accesscode1') accesscode1: ElementRef;
  @ViewChild('accesscode2') accesscode2: ElementRef;
  @ViewChild('accesscode3') accesscode3: ElementRef;
  @ViewChild('accesscode4') accesscode4: ElementRef;
  @ViewChild('accesscode5') accesscode5: ElementRef;
  @ViewChild('accesscode6') accesscode6: ElementRef;
  public verifyaccesscodeForm: FormGroup;
  public verifyChannelForm: FormGroup;
  public showChannelForm: boolean = false;
  public isChannelEmail: boolean = true;
  public accesscodeMask: Array<any>;
  public isFormSubmitted = false;
  public maskedUserId: string;
  public userId: string;
  public isUserIdMobile: boolean = false;
  public registrationModuleConstants;
  public verifyaccesscodeFormValidator: VerifyAccessCodeInputValidationResultModel = new VerifyAccessCodeInputValidationResultModel();
  mobileNumberRegex = new RegExp('^[0-9]{10}');
  phoneMask: Array<any>;

  constructor(private alertService: AlertService, private fb: FormBuilder, private constants: ConstantsService,
              private registrationService: RegistrationService, private globalService: GlobalService,
              private router: Router, private validationService: ValidationService,
              private bcbsmaErrorHandlerService: BcbsmaerrorHandlerService,
              private profileService: ProfileService, private authService: AuthService, private activatedRoute: ActivatedRoute
  ) {
    this.checkRegistrationIsSuccessFull();
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
                this.verifyaccesscodeForm.get(accesscodekey).setValue(character, {emitEvent: false});
                this[accesscodekey].nativeElement.focus();
              }
              currentIndex++;
            }
          });
        }
      });
    });
    this.accesscodeMask = this.validationService.accesscodeMask;
    this.phoneMask = this.validationService.phoneMask;
  }

  ngOnInit() {
    this.registrationModuleConstants = RegistrationModuleConstants;
    const Form = JSON.stringify(this.verifyaccesscodeForm.value);
    const sentMailId = JSON.parse(sessionStorage.getItem('sendCodeRes'));
    this.maskedUserId = this.getMaskedUserId(sentMailId && sentMailId['commChannel']);
    this.isUserIdMobile = this.mobileNumberRegex.test(this.userId) || (sentMailId && sentMailId['commChannelType'] === 'MOBILE');
    // if (this.registrationService.isUsedIdValidEmailOrPhoneNumber()) {
    //   this.maskedUserId = this.getMaskedUserId(this.authService.useridin);
    // } else {
    //   this.registrationService.getMemberProfile().subscribe(profile => {
    //     this.maskedUserId = this.getMaskedUserId(profile.phoneNumber ? profile.phoneNumber : profile.emailAddress);
    //   });
    // }
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

  isValidKeyPressed(event) {
    const key = event.key;
    return key === 'Backspace' || key === 'ArrowLeft' || key === 'ArrowRight' ||
      (event.keyCode >= 48 && event.keyCode <= 57) ||
      (event.keyCode >= 96 && event.keyCode <= 105);
  }

  onSubmit() {
    if (this.registrationService.isUsedIdValidEmailOrPhoneNumber()) {
      this.isFormSubmitted = true;
      this.alertService.clearError();
      const requestedData = {
        accesscode: '' +
          this.verifyaccesscodeForm.value.accesscode1 + this.verifyaccesscodeForm.value.accesscode2 +
          this.verifyaccesscodeForm.value.accesscode3 + this.verifyaccesscodeForm.value.accesscode4 +
          this.verifyaccesscodeForm.value.accesscode5 + this.verifyaccesscodeForm.value.accesscode6,
        commChannel: this.authService.useridin,
        commChannelType: this.mobileNumberRegex.test(this.authService.useridin) ? 'MOBILE' : 'EMAIL'
      };
      this.callVerifyAccessCode(requestedData, false);
    } else {
      this.registrationService.getMemberProfile().subscribe(profile => {
        this.isFormSubmitted = true;
        this.alertService.clearError();
        const requestObj = {
          accesscode: '' +
            this.verifyaccesscodeForm.value.accesscode1 + this.verifyaccesscodeForm.value.accesscode2 +
            this.verifyaccesscodeForm.value.accesscode3 + this.verifyaccesscodeForm.value.accesscode4 +
            this.verifyaccesscodeForm.value.accesscode5 + this.verifyaccesscodeForm.value.accesscode6,
          commChannel: profile.emailAddress,
          commChannelType: 'EMAIL'
        };
        this.callVerifyAccessCode(requestObj, true);
      }, (err) => {
        this.globalService.handleError(err, this.constants.displayMessage);
      });
    }
  }

  callVerifyAccessCode(requestObj, isWebuser) {
    if (this.verifyaccesscodeForm.valid) {
      this.registrationService.VerifyAccessCode(requestObj, isWebuser)
        .subscribe(response => {
          if (response['result'] === '0' || response['result'] === 0) {
            sessionStorage.removeItem('accesscode');
            sessionStorage.removeItem('sendCodeRes');
            sessionStorage.setItem('registrationSuccessfull', 'true');
            this.router.navigate(['../register/success']);
          } else {
            if (response['displaymessage']) {
              this.globalService.handleError(response, this.constants.displayMessage);
              this.verifyaccesscodeForm.setValue({
                accesscode1: '', accesscode2: '', accesscode3: '', accesscode4: '', accesscode5: '', accesscode6: ''
              });
            }
            this.validationService.focusFirstError();
          }
        });
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
      if (!this.isChannelEmail) {
        this.userId = this.userId.toString().replace(/[-()]+/g, '');
      }
      console.log('mobile number', this.userId);
      const req = {
        'useridin': this.authService.useridin,
        'commChannel': this.userId,
        'commChannelType': this.isChannelEmail ? 'EMAIL' : 'MOBILE',
        'userIDToVerify': this.authService.useridin
      };
      sessionStorage.setItem('sendCodeRes', JSON.stringify({
        'commChannel': this.userId,
        'commChannelType': this.isChannelEmail ? 'EMAIL' : 'MOBILE'
      }));
      this.callSendAccessCodeService(req, false, true);

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

  //     } else {
  //       const disMsg = res.displaymessage ? res.displaymessage : 'Oops something went wrong. Please try again!';
  //       this.alertService.setAlert(disMsg, ' ', AlertType.Failure);
  //     }
  //   }
  //   );
  // }


  sendAccessCode() {
    this.showChannelForm = false;
    this.verifyaccesscodeForm.setValue({
      accesscode1: '',
      accesscode2: '',
      accesscode3: '',
      accesscode4: '',
      accesscode5: '',
      accesscode6: ''
    });
    if (this.registrationService.isUsedIdValidEmailOrPhoneNumber()) {
      const requestedData = {
        commChannel: this.authService.useridin
      };
      this.callSendAccessCodeService(requestedData, false, false);
    } else {
      this.registrationService.getMemberProfile().subscribe(profile => {
        this.callSendAccessCodeService(this.registrationService.getRequestedData(profile), true);
      }, (err) => {
        this.alertService.setAlert(err.message, '', AlertType.Failure);
      });
    }
  }

  callSendAccessCodeService(requestedData, isWebuser, resend?) {
    this.registrationService.sendaccesscode(requestedData,  isWebuser,  resend).subscribe(response => {
      this.verifyaccesscodeForm.setValue({
        accesscode1: '',
        accesscode2: '',
        accesscode3: '',
        accesscode4: '',
        accesscode5: '',
        accesscode6: ''
      });
      this.alertService.clearError();
      if (response && response['displaymessage']) {
        this.alertService.setAlert(response['displaymessage'], '', AlertType.Failure);
      } else {
        // tslint:disable-next-line:max-line-length
        this.isUserIdMobile ? this.alertService.setAlert('Verification code resent!', '', AlertType.Success) :
          this.alertService.setAlert(this.registrationModuleConstants.verficationCodeResentMsg, '', AlertType.Success);
      }
      this.validationService.focusFirstError();
    });
  }

  splitAndPlacePastedValues(event, materialForm): boolean {
    event.preventDefault();
    let pastedData: string = '';
    if (event.clipboardData) {
      pastedData = event.clipboardData.getData('text/plain');
    } else if (window['clipboardData']) {
      pastedData = window['clipboardData'].getData('Text');
    }

    pastedData = pastedData.replace(/\D/g, '');

    let pastedCharArr = pastedData.split('');

    if (pastedCharArr.length > 6) {
      pastedCharArr = pastedCharArr.splice(0, 6);
    }

    const accessCodeFields: NodeListOf<Element> = document.querySelectorAll('input.access-code');
    Object.keys(materialForm.controls).forEach((controlName, controlIndex) => {

      const pastedNumber: string = pastedCharArr[controlIndex];
      if (pastedNumber) {
        const formInputControl: FormControl = materialForm.get(controlName);
        // focus method does not work as such in ie11. hence requires a timeout block as fix/workaround for the same
        setTimeout(() => {
          (<HTMLInputElement>accessCodeFields[controlIndex]).focus();
          formInputControl.setValue(pastedNumber);
        }, 10);
      } else {
        return false;
      }
    });

    this.getMatFormClass(materialForm);
    return true;
  }

  getMatFormClass(materialForm: FormGroup): VerifyAccessCodeInputValidationResultModel {
    try {
      this.verifyaccesscodeFormValidator = new VerifyAccessCodeInputValidationResultModel();

      if (!materialForm) {
        throw new Error(RegistrationModuleConstants.errorMessages.invalidMaterialFormError);
      }

      const controls: FormGroupControlsModel = materialForm.controls;
      const _controls = RegistrationModuleConstants.controls;
      const accessCode_1_Control = controls[_controls.accessCode1];
      const accessCode_2_Control = controls[_controls.accessCode2];
      const accessCode_3_Control = controls[_controls.accessCode3];
      const accessCode_4_Control = controls[_controls.accessCode4];
      const accessCode_5_Control = controls[_controls.accessCode5];
      const accessCode_6_Control = controls[_controls.accessCode6];

      if (!(accessCode_1_Control && accessCode_2_Control && accessCode_3_Control &&
        accessCode_4_Control && accessCode_5_Control && accessCode_6_Control)) {
        return this.verifyaccesscodeFormValidator;
      }

      const controlErrors: ValidationErrors = (accessCode_1_Control.errors || accessCode_2_Control.errors ||
        accessCode_3_Control.errors || accessCode_4_Control.errors || accessCode_5_Control.errors || accessCode_6_Control.errors);

      const allTouched: boolean = accessCode_1_Control.touched && accessCode_2_Control.touched &&
        accessCode_3_Control.touched && accessCode_4_Control.touched && accessCode_5_Control.touched && accessCode_6_Control.touched;

      const errorFlag: boolean = controlErrors ? true : false || !allTouched;

      const hasRequiredErrorFlags: boolean =
        (accessCode_1_Control.errors && accessCode_1_Control.errors.required)
        || (accessCode_2_Control.errors && accessCode_2_Control.errors.required)
        || (accessCode_3_Control.errors && accessCode_3_Control.errors.required)
        || (accessCode_4_Control.errors && accessCode_4_Control.errors.required)
        || (accessCode_5_Control.errors && accessCode_5_Control.errors.required)
        || (accessCode_6_Control.errors && accessCode_6_Control.errors.required);

      this.verifyaccesscodeFormValidator.isError = errorFlag;
      this.verifyaccesscodeFormValidator.hasErrors = hasRequiredErrorFlags;

    } catch (exception) {
      this.bcbsmaErrorHandlerService.logError(exception, BcbsmaConstants.modules.registrationModule,
        RegistrationModuleConstants.components.verifyAccessCodeComponent,
        RegistrationModuleConstants.methods.getMatFormClass);
    } finally {
      return this.verifyaccesscodeFormValidator;
    }

  }

  onKeyUp(event, previousElement, nextElement, materialForm) {
    if (event && event.target['value'] === '' && !this.isValidKeyPressed(event)) {
      return false;
    }
    this.getMatFormClass(materialForm);
    if ((event.key === 'Backspace' || (event.which === 37) || event.key === 'ArrowLeft') && previousElement) {
      previousElement.focus();
    }
    if ((event.key === 'ArrowRight' || (event.which === 39) || (event.keyCode >= 48 && event.keyCode <= 57)
      || (event.keyCode >= 96 && event.keyCode <= 105)) && nextElement) {
      setTimeout(() => nextElement.focus(), 100);
    }
  }

  checkRegistrationIsSuccessFull() {
    const memberInfo = this.activatedRoute.snapshot.data.memberInfo;

    if (sessionStorage.getItem('updatessn') === 'true') {
      this.router.navigate(['register/updatessn']);
      return true;
    }
    if (sessionStorage.getItem('registrationProcessCompleted') === 'true') {
      this.router.navigate(['register/success']);
      return true;
    }
    if (memberInfo) {
      const response = memberInfo['ROWSET'] && memberInfo['ROWSET'].ROWS;
      const isUserNotFound = RegistrationHelper.isUserNotFound(memberInfo);
      if (isUserNotFound) {
        sessionStorage.removeItem('updatessn');
        sessionStorage.setItem('accesscode', 'true');
        this.router.navigate(['/register/verifyaccesscode']);
        return true;
      }
      const isMemberDetailsValid = RegistrationHelper.isMemberDetailsValid(response);
      if (memberInfo.errormessage && memberInfo.errormessage.includes('WEB_GET_MEM_AUTH_ENTRY_PR') && memberInfo.result === -1) {
        this.router.navigate(['/register/register-detail']);
      } else if (RegistrationHelper.isMemberDetailsInvalidandNotVerified(response)) {
        this.router.navigate([RegistrationHelper.isMemberIdInValidEMPTY(response,
          this.validationService.API_INVALID_IDENTIFITERS.memberId)
          ? '../register/memberinfo' : '../register/register-detail']);
      } else if (isMemberDetailsValid) {
        this.router.navigate(['/register/updatessn']);
        return true;
      }
      this.authService.memAuthInfo = response;
    }
  }

  ngOnDestroy() {
    this.alertService.clearError();
  }

  onCancel(e) {
    this.showChannelForm = false;
  }
}
