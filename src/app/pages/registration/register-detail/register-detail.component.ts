import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {RegistrationService} from '../registration.service';
import {ValidationService} from '../../../shared/services/validation.service';
import {AlertService} from '../../../shared/shared.module';
import {GlobalService} from '../../../shared/services/global.service';
import {ConstantsService} from '../../../shared/services/constants.service';
import {AuthService} from '../../../shared/services/auth.service';
import {RegType} from '../../../shared/models/regType.enum';
import {RegistrationHelper} from '../registration-helper';
import {RegisterConstants} from '../register-detail.error.constants';

@Component({
  selector: 'app-register-detail',
  templateUrl: './register-detail.component.html',
  styleUrls: ['./register-detail.component.scss']
})
export class RegisterDetailComponent implements OnInit, OnDestroy {
  registerDetailForm: FormGroup;
  isFormSubmitted = false;
  showHide = false;
  message = '';
  phoneMask: Array<any>;
  dobMask: Array<any>;
  type: string;
  typePlaceholder: string;
  showForm = false;
  invalidFields = [];

  securityQuestionsOptions = [
    {label: 'Who was your favorite teacher?', value: 'value 1'},
    {label: 'Where did you meet your spouse?', value: 'value 2'},
    {label: 'What is your Mother’s middle name?', value: 'value 3'},
    {label: 'What is the name of your closest friend from childhood?', value: 'value 4'},
    {label: 'In what city or town does your nearest relative live?', value: 'value 5'},
    {label: 'What was the name of your elementary school?', value: 'value 6'},
    {label: 'What was the name of your first pet?', value: 'value 7'},
  ];

  phoneNumberTypeValues = [
    {label: 'Mobile', value: 'Mobile'},
    {label: 'Home', value: 'Home'},
    {label: 'Work', value: 'Work'}
  ];

  dobValidators = [Validators.required, this.validationService.dateValidator(),
    this.validationService.minAgeValidator(), this.validationService.dobValidator()];
  firstNameValidators = [Validators.required, this.validationService.alphaStringValidator()];
  lastNameValidators = [Validators.required, this.validationService.alphaStringValidator()];

  constructor(private alertService: AlertService,
              private constants: ConstantsService,
              private fb: FormBuilder,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private registrationService: RegistrationService,
              private globalService: GlobalService,
              private validationService: ValidationService,
              private authService: AuthService) {
    this.type = 'password';
    this.typePlaceholder = 'Show';

  }

  getDefaultPhoneNumberType(): string {
    if (this.authService.memAuthInfo && this.authService.memAuthInfo.phoneNumberType) {
      return this.authService.memAuthInfo.phoneNumberType;
    } else {
      return this.phoneNumberTypeValues && this.phoneNumberTypeValues.length > 0 ?
        this.phoneNumberTypeValues[0].value : 'Mobile';
    }
  }

  changeShowStatus() {
    this.showHide = !this.showHide;
    this.message = this.authService.userRegType === RegType.EMAIL ?
      'We need your phone number for serving you better.' : 'We need your email id for serving you better.';
  }

  get cssClass() {
    if (this.showHide) {
      return '';
    } else {
      return 'underline';
    }
  }

  get isUserEmail() {
    return this.authService.userRegType === RegType.EMAIL;
  }

  ngOnInit() {
    const memberInfo = this.activatedRoute.snapshot.data.memberInfo;
    if (memberInfo) {
      RegistrationHelper.redirectToVerifyAccessCodeIfUserNotFound(memberInfo, this.router);
      const response = memberInfo['ROWSET'] && memberInfo['ROWSET'].ROWS;
      this.authService.memAuthInfo = response;
    }
    this.redirectToSsnOnValidDetails();
    this.setInvalidFields();
    this.initializeRegistrationForm();
  }

  setInvalidFields() {
    const memberAuthInfoResponse = this.authService.memAuthInfo;
    if (memberAuthInfoResponse && memberAuthInfoResponse.lastMemResult) {
      this.invalidFields = memberAuthInfoResponse.lastMemResult.split('|').filter((field) => field);
    }
  }

  removeFieldFromInvalidFields(fieldIdentifier: string) {
    if (this.invalidFields) {
      this.invalidFields = this.invalidFields.filter((field) => field !== fieldIdentifier );
    }
  }

  initializeRegistrationForm() {
    let emailAdd = '';
    let firstName = '';
    let lastName = '';
    let mobilePhone = '';
    let DOB = '';
    let hintAnswer = '';
    let hintQuestion = '';
    if (this.authService.memAuthInfo && this.authService.memAuthInfo.memNum) {
      const memberInfo = this.authService.memAuthInfo;
      emailAdd = memberInfo.emailAdd;
      firstName = memberInfo.firstName;
      lastName = memberInfo.lastName;
      mobilePhone = memberInfo.mobilePhone;
      hintAnswer = memberInfo.hintAnswer;
      hintQuestion = memberInfo.hintQuestion;
      DOB = memberInfo.DOB;
      this.setValidatorsForInvalidFields();
    }

    const formGroup = {
      firstname: [firstName, this.firstNameValidators],
      lastname: [lastName, this.lastNameValidators],
      phoneNumberType: [this.getDefaultPhoneNumberType(), [Validators.required]],
      DOB: [DOB, this.dobValidators],
      hintQuestion: [hintQuestion, [Validators.required]],
      hintAnswer: [hintAnswer, [Validators.required, Validators.minLength(3), Validators.maxLength(30), this.validationService.trailingSpaceValidator()]]
    };

    if (!this.isUserEmail) {
      formGroup['email'] = [emailAdd, [Validators.required, this.validationService.emailValidator()]];
    } else {
      if (mobilePhone) {
        mobilePhone = mobilePhone.toString();
        mobilePhone = mobilePhone.length === 12 ? mobilePhone :
          mobilePhone.slice(0, 3) + '-' + mobilePhone.slice(3, 6) + '-' + mobilePhone.slice(6, 10);
      }
      formGroup['mobile'] = [mobilePhone,
        [Validators.required, this.validationService.mobileValidator(), this.validationService.phoneValidator()]];
    }
    this.registerDetailForm = this.fb.group(formGroup);
    this.subscribeToValueChangeEvents();
    this.dobMask = this.validationService.dobMask;
    this.phoneMask = this.validationService.phoneMask;
    this.showForm = true;
  }

  setValidatorsForInvalidFields() {
    if (this.isDateOfBirthInValid()) {
      this.dobValidators = [...this.dobValidators, this.validationService.inCorrectDynamicDateValidator()];
    }
    if (this.isFirstNameInvalid()) {
      this.firstNameValidators = [...this.firstNameValidators, this.validationService.inCorrectDynamicFirstNameValidator()];
    }
    if (this.isLastNameInvalid()) {
      this.lastNameValidators = [...this.lastNameValidators, this.validationService.inCorrectDynamicLastNameValidator()];
    }
  }

  subscribeToValueChangeEvents() {
    if (this.isDateOfBirthInValid()) {
      this.validationService.clearApiErrorOnChange(this.registerDetailForm.get('DOB'), 'incorrectDob', this.dobValidators);
      this.removeFieldFromInvalidFields(this.validationService.API_INVALID_IDENTIFITERS.dateOfBirth);
      // const phoneNumberControl = this.registerDetailForm.get('mobile');
      // phoneNumberControl.markAsTouched();
    }
    if (this.isFirstNameInvalid()) {
      this.validationService.clearApiErrorOnChange(this.registerDetailForm.get('firstname'),
       'incorrectFirstName', this.firstNameValidators);
      this.removeFieldFromInvalidFields(this.validationService.API_INVALID_IDENTIFITERS.firstName);
    }
    if (this.isLastNameInvalid()) {
      this.validationService.clearApiErrorOnChange(this.registerDetailForm.get('lastname'), 'incorrectLastName', this.lastNameValidators);
      this.removeFieldFromInvalidFields(this.validationService.API_INVALID_IDENTIFITERS.lastName);
    }
    this.clearHintQuestionValueOnQuestionChange();
  }

  isDateOfBirthInValid() {
    return (this.authService.memAuthInfo && this.authService.memAuthInfo.lastAuthFailtxt === 'DOB_NOT_FOUND')
      || this.isValidField(this.validationService.API_INVALID_IDENTIFITERS.dateOfBirth);
  }

  isFirstNameInvalid() {
    return this.isValidField(this.validationService.API_INVALID_IDENTIFITERS.firstName);
  }

  isLastNameInvalid() {
    return this.isValidField(this.validationService.API_INVALID_IDENTIFITERS.lastName);
  }

  isValidField(fieldIndentifier: string) {
    return this.invalidFields && this.invalidFields.includes(fieldIndentifier);
  }

  clearHintQuestionValueOnQuestionChange() {
    const hintQuestionControl = this.registerDetailForm.get('hintQuestion');
    const hintAnswerControl = this.registerDetailForm.get('hintAnswer');
    hintQuestionControl.valueChanges.subscribe((e) => {
      if (hintAnswerControl.value) {
        hintAnswerControl.setValue('');
        hintAnswerControl.updateValueAndValidity();
        hintAnswerControl.markAsUntouched();
      }
    });
  }

  ngOnDestroy() {
    this.alertService.clearError();
  }

  onSubmit() {
    this.isFormSubmitted = true;
    this.globalService.markFormGroupTouched(this.registerDetailForm);
    this.validationService.focusFirstError();
    if (this.registerDetailForm.valid) {
      this.alertService.clearError();
      this.registerDetailForm.value['phoneNumberType'] = 'MOBILE';
      const request = this.registerDetailForm.value;
      // console.log('register details before', request);
      if (request.firstname) {
        request.firstname = request.firstname.trim();
      }
      if (request.lastname) {
        request.lastname = request.lastname.trim();
      }
      if (this.authService.userRegType === 'EMAIL') {
        request.mobile = request.mobile.toString().replace(/[-()]+/g, '');
        request.email = this.authService.useridin;
      } else {
        request.mobile = this.authService.useridin;
      }
      // console.log('register details', request);
      this.updateMemberInfo(request);
    }
  }


  updateMemberInfo(request) {
    this.registrationService.updateMemAuthInfo(request)
      .subscribe(response => {
        if (response) {
          if (response['errormessage'] || response['result'] < 0) {
            this.alertService.setError(RegisterConstants.errorMessage(response['result'], 'registerDetail', response));
          } else if (response['fault'] && response['fault'].faultstring) {
            return;
          } else if (response['result'].toString() === '0') {
            this.router.navigate(['../register/memberinfo']);
          }
        }
      });
  }

  togglePasswordVisibility() {
    const typeDetails = this.globalService.togglePasswordType(this.type);
    this.type = typeDetails.type;
    this.typePlaceholder = typeDetails.placeHolder;
  }

  redirectToSsnOnValidDetails() {
    if (RegistrationHelper.isScopeNameRegistrationAndNotVerified()) {
      return this.checkMemberDetails();
    }
  }

  checkMemberDetails() {
    if (RegistrationHelper.isMemberDetailsValid(this.authService.memAuthInfo)) {
      this.router.navigate(['register/updatessn']);
    }
  }
}
