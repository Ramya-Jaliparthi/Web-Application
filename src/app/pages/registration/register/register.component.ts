import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegType } from '../../../shared/models/regType.enum';
import { RegistrationService } from '../registration.service';
import { ValidationService } from '../../../shared/shared.module';
import { AlertService } from '../../../shared/services/alert.service';
import { GlobalService } from '../../../shared/services/global.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ConstantsService } from '../../../shared/services/constants.service';
import { AlertType } from '../../../shared/alerts/alertType.model';
import { RegisterConstants } from '../register-detail.error.constants';
declare let $: any;

@Component({
  selector: 'app-core-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  type: string;
  typePlaceholder: string;
  userType: RegType;
  subheading: string;
  userTypeChangeLabel: string;
  userTypeLabel: string;
  isFormSubmitted = false;
  phoneMask: Array<any>;
  mask: Object;
  maxLength: number = 100;
  showPasswordErrors = false;
  customMessages = {};
  formData;


  constructor(private alertService: AlertService,
    private fb: FormBuilder,
    private registrationService: RegistrationService,
    private validationService: ValidationService,
    private constants: ConstantsService,
    private globalService: GlobalService,
    private authService: AuthService) {

    this.initializeEmailForm();
    this.userType = RegType.EMAIL;
    this.type = 'password';
    this.typePlaceholder = 'Show';
    this.phoneMask = this.validationService.phoneMask;
    this.mask = { mask: false, guide: false };
    this.formData = sessionStorage.getItem('register.form');
    if (this.formData) {
      this.formData = JSON.parse(this.formData);
      this.userType = this.formData['userType'];
      this.maxLength = this.formData['maxLength'];
      this.typePlaceholder = this.formData['typePlaceholder'];
      this.type = this.formData['type'];
      this.showPasswordErrors = this.formData['showPasswordErrors'];
      this.isFormSubmitted = this.formData['isFormSubmitted'];
      if (this.userType === RegType.EMAIL) {
        this.initializeEmailForm();
        this.mask = { mask: false, guide: false };
      } else {
        this.initializeMobileForm();
        this.mask = { mask: this.phoneMask, guide: false };
      }
      this.registerForm.patchValue(this.formData);
      sessionStorage.removeItem('register.form');
    }
  }

  ngOnInit() {
    $('ul.tabs').tabs();
    $('.modal').modal();

    if (this.authService.isAuthenticated()) {
      this.authService.clearSession();
    }
  }

  getMessages() {
    return this.customMessages = {
      'required': this.userType === RegType.EMAIL ? 'You must enter a valid email address.' :
        'You must enter a valid mobile number.',
      'invalidEmail': 'You must enter a valid email address.',
      'invalidNumber': 'You must enter a valid phone number.',
      'invalidMobile': 'You must enter a valid phone number.',
      'invalidPassword': 'Your password does not meet the minimum requirement. Please try again.',
    };
  }

  getPasswordMessages() {
    return {
      'required': 'You must enter a valid password.',
      'minlength': 'Your password does not meet the minimum requirement. Please try again.',
      'invalidPassword': 'Your password does not meet the minimum requirement. Please try again.'
    };
  }

  initializeEmailForm() {
    this.userTypeLabel = 'Email* (This will be your username)';
    this.userTypeChangeLabel = 'Use your mobile number instead';
    this.subheading = '';
    this.registerForm = this.fb.group({
      useridin: ['', [Validators.required, this.validationService.emailValidator()]],
      passwordin: ['', [Validators.required, Validators.minLength(8), this.validationService.invalidPasswordValidator,
      this.validationService.spaceValidator()]],
      receiveinfo: [false],
    });
  }

  initializeMobileForm() {
    this.userTypeLabel = 'Mobile Number* (This will be your username)';
    this.userTypeChangeLabel = 'Use email instead';
    this.subheading = 'We\'ll send a text verification. Message and data rates may apply.';
    this.registerForm = this.fb.group({
      useridin: ['', [Validators.required,
      this.validationService.phoneValidator(), this.validationService.mobileValidator()
      ]
      ],
      passwordin: ['', [Validators.required, Validators.minLength(8), this.validationService.invalidPasswordValidator,
      this.validationService.spaceValidator()]],
      receiveinfo: [false],
    });
  }

  ngOnDestroy() {
    this.alertService.clearError();
  }

  saveState() {
    sessionStorage.setItem('register.form',
      JSON.stringify(Object.assign(this.registerForm.getRawValue(), {
        userType: this.userType,
        maxLength: this.maxLength,
        typePlaceholder: this.typePlaceholder,
        type: this.type,
        showPasswordErrors: this.showPasswordErrors,
        isFormSubmitted: this.isFormSubmitted
      })));
  }

  toggleUserType() {
    if (this.userType === RegType.EMAIL) {
      this.userType = RegType.MOBILE;
      this.alertService.clearError();
      this.resetForm();
      this.maxLength = 12;
      this.mask = { mask: this.phoneMask, guide: false };
      this.initializeMobileForm();
      this.showPasswordErrors = false;
    } else {
      this.userType = RegType.EMAIL;
      this.alertService.clearError();
      this.resetForm();
      this.maxLength = 100;
      this.mask = { mask: false, guide: false };
      this.initializeEmailForm();
      this.showPasswordErrors = false;
    }
    this.isFormSubmitted = false;
    this.globalService.markFormGroupUnTouched(this.registerForm);
  }

  showErrorOnBlur() {
    this.showPasswordErrors = true;
  }


  onSubmit() {
    this.isFormSubmitted = true;
    this.globalService.markFormGroupTouched(this.registerForm);
    // this.validationService.focusFirstError();
    if (this.registerForm.valid) {
      this.alertService.clearError();
      // it should be true or false in the new apis
      this.registerForm.value['receiveinfo'] = this.registerForm.controls.receiveinfo.value ? 'true' : 'false';
      this.registerForm.value['tandcagreed'] = 'true';
      this.registerForm.value['regtypein'] = RegType[this.userType];
      this.registerForm.value['useridin'] = this.transformUserId(this.registerForm.value.useridin, this.userType);
      this.registrationService.register(this.registerForm.value)
        .subscribe(response => {
          if (response['displaymessage']) {
            this.handleApiError(response);
            this.validationService.focusFirstFiled();
            this.registerForm.controls.passwordin.setValue('');
          } else {
            const generatedRequest = {
              useridin: this.registerForm.value.useridin,
              passwordin: this.registerForm.value.passwordin
            };
            this.globalService.login(generatedRequest);
          }

        }, err => {
          if (err.status >= 500) {
            $('#requestTimeoutError').modal('open');
          } else {
            this.globalService.handleError(err.error, this.constants.displayMessage);  // , true
            $('#requestTimeoutError').modal('open');
          }
        });
    }
  }

  handleApiError(response?) {
    let displayMessage;
    const errorMessage = response['errormessage'];
    if (errorMessage.indexOf('Exists') > 0 || errorMessage.indexOf('exist') > 0 || response['result'] === '-1') {
      /*tslint:disable:max-line-length*/
      // this.userType === RegType.EMAIL ?
      //   displayMessage = 'An account already exists with this email address. <a href="/login" class="link-error">Log in</a>  or try again with a new email.' :
      //   displayMessage = 'An account already exists with this mobile number.<a href="/login" class="link-error">Log in</a>  or try again with a new mobile number.';
      displayMessage = RegisterConstants.userMismatchMsg;
    } else {
      displayMessage = response['displaymessage'];
    }
    this.alertService.setAlert(displayMessage, '', AlertType.Failure);
  }


  togglePasswordVisibility() {
    const typeDetails = this.globalService.togglePasswordType(this.type);
    this.type = typeDetails.type;
    this.typePlaceholder = typeDetails.placeHolder;
  }

  resetForm() {
    this.registerForm.reset({
      'useridin': '',
      'passwordin': ''
    });
  }

  transformUserId(userId: string, registrationType: RegType): string {
    return userId && registrationType === RegType.MOBILE ? userId.replace(/-/g, '') : userId;
  }

}
