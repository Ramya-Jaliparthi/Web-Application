import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AlertType } from '../../../shared/alerts/alertType.model';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
import { AlertService } from '../../../shared/services/alert.service';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
import { ConstantsService } from '../../../shared/services/constants.service';
import { GlobalService } from '../../../shared/services/global.service';
import { ValidationService } from '../../../shared/services/validation.service';
import { RegistrationModuleConstants } from '../../registration/constants/registration-module.constants';
import { FormGroupControlsModel, VerifyAccessCodeInputValidationResultModel } from '../../registration/models/registrationModule.models';
import { RegistrationService } from '../../registration/registration.service';
import { MyAccountService } from '../my-account.service';
import { MyAccountConstants } from '../my-account.constants';


declare let $: any;

@Component({
  selector: 'app-verifyotpaccesscode',
  templateUrl: './verifyaccesscode.component.html',
  styleUrls: ['./verifyaccesscode.component.scss']
})
export class VerifyOTPaccesscodeComponent implements OnInit, OnDestroy {
  @ViewChild('accesscode1') accesscode1: ElementRef;
  @ViewChild('accesscode2') accesscode2: ElementRef;
  @ViewChild('accesscode3') accesscode3: ElementRef;
  @ViewChild('accesscode4') accesscode4: ElementRef;
  @ViewChild('accesscode5') accesscode5: ElementRef;
  @ViewChild('accesscode6') accesscode6: ElementRef;
  public verifyaccesscodeForm: FormGroup;
  public accesscodeMask: Array<any>;
  public isFormSubmitted = false;
  public location: string;
  public maskedUserId: string;
  public registrationModuleConstants;
  public verifyaccesscodeFormValidator: VerifyAccessCodeInputValidationResultModel = new VerifyAccessCodeInputValidationResultModel();
  private caller: any;
  private clearAlertOnDestroy: boolean = true;

  constructor(private alertService: AlertService, private fb: FormBuilder, private constants: ConstantsService,
    private registrationService: RegistrationService, private globalService: GlobalService,
    private router: Router, private validationService: ValidationService,
    private bcbsmaErrorHandlerService: BcbsmaerrorHandlerService,
    private myaccountservice: MyAccountService,
    private route: ActivatedRoute
  ) {
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
    this.route.params.subscribe((params: Params) => this.caller = params['caller']);
    this.registrationModuleConstants = RegistrationModuleConstants;
    const Form = JSON.stringify(this.verifyaccesscodeForm.value);
    this.maskedUserId = this.getMaskedUserId();
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

  public getMatFormClass(materialForm: FormGroup): VerifyAccessCodeInputValidationResultModel {
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

  getMaskedUserId(): string {
    const userId = this.getCommId();
    const numberRegEx = new RegExp('^[0-9]{10}');
    return numberRegEx.test(userId) ? this.maskPhoneNumber(userId) : this.maskEmailId(userId);
  }

  getCommId(): string {
    let commId;
    const funresponse = JSON.parse(sessionStorage.getItem('fun.funverifyuserResponse'));
    const fpresponse = JSON.parse(sessionStorage.getItem('fpw.fpverifyuserResponse'));
    const isValidRes = funresponse || fpresponse;
    if (isValidRes) {
      if (funresponse) {
        commId = funresponse.commType === 'MOBILE' ? sessionStorage.getItem('useridin') : funresponse.commValue;
      } else if (fpresponse) {
        commId = fpresponse.commType === 'MOBILE' ? sessionStorage.getItem('useridin') : fpresponse.commValue;
      } else {
        commId = sessionStorage.getItem('useridin');
      }
    } else {
      commId = sessionStorage.getItem('useridin');
    }
    return commId;
  }

  maskEmailId(userId: string): string {
    const maskedUserId = userId ? userId.replace(/^(.{3})(.*)(@.*)$/,
      (_, firstCharacter, charToMasked, domain) => {
        return `${firstCharacter}${charToMasked.replace(/./g, '*')}${domain}`;
      }) : userId;
    this.alertService.setAlert(MyAccountConstants.VerificationMsgSuccess, MyAccountConstants.Success, AlertType.Success);
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
    this.alertService.setAlert(MyAccountConstants.VerificationMsgSuccess, MyAccountConstants.Success, AlertType.Success);
    return maskedUserId;
  }

  ngOnDestroy() {
    if (this.clearAlertOnDestroy) {
      this.alertService.clearError();
    }
  }

  onSubmit() {
    this.isFormSubmitted = true;
    this.alertService.clearError();
    const accessCode =
      this.verifyaccesscodeForm.value.accesscode1 + this.verifyaccesscodeForm.value.accesscode2 +
      this.verifyaccesscodeForm.value.accesscode3 + this.verifyaccesscodeForm.value.accesscode4 +
      this.verifyaccesscodeForm.value.accesscode5 + this.verifyaccesscodeForm.value.accesscode6;

    if (this.verifyaccesscodeForm.valid) {
      const isPWD = !(this.caller === 'FUN');
      this.myaccountservice.VerifyAccessCode(accessCode, isPWD)
        .subscribe(response => {
          if (response['result'] === 0 || response['result'] === '0') {
            if (isPWD) {
              sessionStorage.setItem('otpsuccess', 'TRUE');
              this.router.navigate(['/account/createPassword']);
            } else {
              this.clearAlertOnDestroy = false;
              this.alertService.setAlert(MyAccountConstants.NotificationMsg, '', AlertType.Notification);
              this.myaccountservice.clearStorage();
              this.router.navigate(['/login']).then(() => {
                this.alertService.setAlert('Please check your email account or mobile number for your username.', '', AlertType.Success);
              });
            }
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

  sendAccessCode() {
    this.verifyaccesscodeForm.setValue({
      accesscode1: '',
      accesscode2: '',
      accesscode3: '',
      accesscode4: '',
      accesscode5: '',
      accesscode6: ''
    });
    this.location === 'register' ? this.regVerifyAccessCode() : this.sendAccessCodeFUN();
  }

  regVerifyAccessCode() {
    this.registrationService.sendaccesscode().subscribe(response => {
      this.verifyaccesscodeForm.setValue({
        accesscode1: '',
        accesscode2: '',
        accesscode3: '',
        accesscode4: '',
        accesscode5: '',
        accesscode6: ''
      });
      this.alertService.clearError();
      this.alertService.setAlert(MyAccountConstants.VerificationResentMsgSuccess, MyAccountConstants.Success, AlertType.Success);
      this.validationService.focusFirstError();
    });
  }

  sendAccessCodeFUN() {
    const isPWD = !(this.caller === 'FUN');
    this.myaccountservice.sendfunaccesscode(isPWD).subscribe((res) => {
      this.myaccountservice.hideSpinner();
      if (res['result'] === '0' || res['result'] === 0) {
        this.alertService.clearError();
        const userId = this.getCommId();
        const numberRegEx = new RegExp('^[0-9]{10}');
        return numberRegEx.test(userId) ? this.alertService.setAlert(MyAccountConstants.VerificationMsgSuccessForMobile,
          MyAccountConstants.Success, AlertType.Success) : this.alertService.setAlert(MyAccountConstants.VerificationResentMsgSuccess,
            MyAccountConstants.Success, AlertType.Success);
      } else {
        if (res['displaymessage']) {
          this.globalService.handleError(res, this.constants.displayMessage);
        } else if (res['errormessage']) {
          this.globalService.handleError(res, this.constants.displayMessage, true);
        } else {
          this.alertService.clearError();
          this.alertService.setAlert(MyAccountConstants.VerificationResentMsgSuccess, MyAccountConstants.Success, AlertType.Success);
        }
      }
    });
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

  isValidKeyPressed(event) {
    const key = event.key;
    return key === 'Backspace' || key === 'ArrowLeft' || key === 'ArrowRight' ||
      (event.keyCode >= 48 && event.keyCode <= 57) ||
      (event.keyCode >= 96 && event.keyCode <= 105) ? true : false;
  }
}
