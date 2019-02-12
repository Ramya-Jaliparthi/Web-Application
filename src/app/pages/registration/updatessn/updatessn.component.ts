import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RegistrationService } from '../registration.service';
import { AlertService } from '../../../shared/shared.module';
import { ValidationService } from '../../../shared/services/validation.service';
import { GlobalService } from '../../../shared/services/global.service';
import { AlertType } from '../../../shared/alerts/alertType.model';
import { AuthService } from '../../../shared/services/auth.service';
import { ConstantsService } from '../../../shared/services/constants.service';
import { AuthHttp } from '../../../shared/services/authHttp.service';
import { RegistrationHelper } from '../registration-helper';
import { RegisterConstants } from '../register-detail.error.constants';

@Component({
  selector: 'app-updatessn',
  templateUrl: './updatessn.component.html',
  styleUrls: ['./updatessn.component.scss']
})
export class UpdatessnComponent implements OnInit, OnDestroy {
  updatessnForm: FormGroup;
  type: string;
  typePlaceholder: string;
  isFormSubmitted: boolean = false;
  showHide: boolean = false;
  ssnMask: Array<any>;
  studentIdMask: Array<any>;
  isMediCareUser: boolean = false;
  disableStudentId: boolean = false;
  disableSsn: boolean = false;
  ssnValidators = [Validators.required, this.validationService.ssnValidator()];
  studentIdValidators = [Validators.required];
  showSnnOptions: boolean = true;
  showLn: boolean = true;


  constructor(private alertService: AlertService,
    private fb: FormBuilder,
    private registrationService: RegistrationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private validationService: ValidationService,
    private globalService: GlobalService,
    private authService: AuthService,
    private authHttp: AuthHttp,
    private cdr: ChangeDetectorRef,
    private constants: ConstantsService) {

    this.type = 'password';
    this.typePlaceholder = 'Show';

    this.updatessnForm = this.fb.group({
      ssn: ['', this.ssnValidators],
      studentid: ['', this.studentIdValidators] // , this.validationService.studentIdValidator()
    });
    // setInterval(() => {
    //   this.cdr.detectChanges();
    // }, 1000);
    this.disabledControlAsUserTypeIn();
  }

  disabledControlAsUserTypeIn() {
    const ssnControl = this.updatessnForm.get('ssn');
    const studentIdControl = this.updatessnForm.get('studentid');
    ssnControl.valueChanges.subscribe((value) => {
      studentIdControl.clearValidators();
      if (value) {
        this.disableStudentId = true;
        studentIdControl.setErrors(null);
      } else {
        this.disableStudentId = false;
        studentIdControl.setValidators(this.studentIdValidators);
      }
    });
    studentIdControl.valueChanges.subscribe((value) => {
      ssnControl.clearValidators();
      if (value) {
        this.disableSsn = true;
        ssnControl.setErrors(null);
      } else {
        this.disableSsn = false;
        ssnControl.setValidators(this.ssnValidators);
      }
    });
  }

  get lexisNexisCountReached() {
    return (this.authService.memAuthInfo && this.authService.memAuthInfo.lnattemptscount === '2');
  }

  ngOnInit() {
    this.ssnMask = this.validationService.ssnMask;
    this.studentIdMask = this.validationService.studentIdMask;
    this.checkIsAccountLocked();
    sessionStorage.removeItem('BBS_REG_QUESTIONS');
  }

  checkIsAccountLocked() {
    // if (this.authService.memAuthInfo) {
    //   this.handleMemberAuthResponse(this.authService.memAuthInfo);
    // } else {
    this.showSnnOptions = false;
    this.getMemberAuthDetails();
    // }
  }

  getMemberAuthDetails() {
    const memberInfo = this.activatedRoute.snapshot.data.memberInfo;
    if (memberInfo) {
      RegistrationHelper.redirectToVerifyAccessCodeIfUserNotFound(memberInfo, this.router);
      const response = memberInfo['ROWSET'] && memberInfo['ROWSET'].ROWS;
      this.authService.memAuthInfo = response;
    }
    if (RegistrationHelper.isMemberDetailsInvalidandNotVerified(this.authService.memAuthInfo)) {
      this.router.navigate([RegistrationHelper.isMemberIdInValid(this.authService.memAuthInfo,
        this.validationService.API_INVALID_IDENTIFITERS.memberId)
        ? '../register/memberinfo' : '../register/register-detail']);
    }
    if (this.authService.memAuthInfo && this.authService.memAuthInfo.lastAuthFailtxt) {
      this.showLn = !(this.authService.memAuthInfo.lnattemptscount === '2' || this.authService.memAuthInfo.authAllowed === 'FALSE');
      this.handleMemberAuthResponse(this.authService.memAuthInfo);
    }
    if (this.authService.memAuthInfo && this.authService.memAuthInfo.authAllowed === 'FALSE') {
      this.showSnnOptions = false;
      this.alertService.setAlert(RegisterConstants.lockOutMsg, '', AlertType.Failure);
      this.authService.logout();
    }

    if (this.authService.memAuthInfo && this.authService.memAuthInfo.userType === 'MEDICARE' && this.authService.memAuthInfo.lnattemptscount === '2') {
      this.showSnnOptions = false;
      this.alertService.setAlert(RegisterConstants.lockOutMsg, '', AlertType.Failure);
      this.authService.logout();
    }

  }

  handleMemberAuthResponse(memAuthInfo) {
    this.setSnnDisplayOptions(memAuthInfo.lastAuthFailtxt);
    this.setUserType(memAuthInfo.userType);
  }

  setUserType(userType: string) {
    this.isMediCareUser = userType === 'MEDICARE';
  }

  setSnnDisplayOptions(accountStatus: string) {
    if (accountStatus === 'LOCKED_OUT') {
      this.showSnnOptions = false;
      this.alertService.setAlert(RegisterConstants.lockOutMsg, '', AlertType.Failure);
      this.authService.logout();
    } else {
      this.showSnnOptions = true;
    }
  }

  ngOnDestroy() {
    this.alertService.clearError();
  }

  authenticateWithSsn() {
    if (this.updatessnForm.value.ssn.length === 4) {
      this.registrationService.authWithSSN(this.updatessnForm.value)
        .subscribe(response => {
          if (this.isAuthenticationSuccessfull(response)) {
            this.handleSuccessScenario();
          } else if (response && Number(response['result']) < 0) {
            this.handleSSNErrorScenario(Number(response['result']), response);
          }
        });
    }
  }

  isAuthenticationSuccessfull(response): boolean {
    let successResponse;
    if (response && response['result'] === 0) {
      successResponse = response['result'].toString() === '0';
    } else {
      successResponse = false;
    }
    return successResponse;
  }

  authenticateWithStudentId() {
    if (this.updatessnForm.value.studentid) {
      setTimeout(() => {
        this.registrationService.authStudentID(this.updatessnForm.value)
          .map(res => this.authHttp.handleDecryptedResponse(res))
          .subscribe(response => {
            if (this.isAuthenticationSuccessfull(response)) {
              this.handleSuccessScenario();
            } else if (Number(response['result']) < 0) {
              this.handleStudentIdErrorScenario(Number(response['result']), response, true);
            }
          });
      }, 100);
    }
  }

  onSubmit() {
    this.alertService.clearError();
    this.isFormSubmitted = true;
    this.globalService.markFormGroupTouched(this.updatessnForm);
    // this.validationService.focusFirstError();
    this.authenticateWithSsn();
    this.authenticateWithStudentId();
  }

  redirectToMemberInfoPage() {
    this.authService.memAuthInfo = null;
    this.router.navigate(['../register/memberinfo']).then(res => {
      this.alertService.setAlert(RegisterConstants.infoMismatchMsg, '', AlertType.Failure);
    });
  }

  redirectToRegisterDetailPage() {
    this.authService.memAuthInfo = null;
    this.router.navigate(['../register/register-detail']).then(res => {
      this.alertService.setAlert(RegisterConstants.infoMismatchMsg, '', AlertType.Failure);
    });
  }

  handleStudentIdErrorScenario(result, response, isStudentAuth: boolean = false) {
    switch (result) {
      case -1:
        this.redirectToMemberInfoPage();
        break;
      case -2:
        this.redirectToRegisterDetailPage();
        break;
      case -5:
        this.registrationService.handleError(response, this.constants.displayMessage);
        this.updatessnForm.controls.ssn.setValue('');
        break;
      case -50:
        this.alertService.setAlert(RegisterConstants.sidLockOutMsg, '', AlertType.Failure);
        this.updatessnForm.controls.ssn.setValue('');
        this.showSnnOptions = false;
        this.authService.logout();
        break;
      case -90632:
        this.alertService.setAlert(response['displaymessage'], '', AlertType.Failure);
        break;
      case -90624:
        this.alertService.setAlert(response['displaymessage'], '', AlertType.Failure);
        this.showSnnOptions = false;
        this.authService.logout();
        break;
      default:
        this.registrationService.handleError(response, this.constants.displayMessage);
        this.updatessnForm.controls.ssn.setValue('');
        break;
    }
    window.scrollTo(0, 0);
  }


  handleSSNErrorScenario(result, response, isStudentAuth: boolean = false) {
    switch (result) {
      case -1:
        this.redirectToMemberInfoPage();
        break;
      case -2:
        this.redirectToRegisterDetailPage();
        break;
      case -5:
        this.alertService.setAlert(response['displaymessage'], '', AlertType.Failure);
        this.updatessnForm.controls.ssn.setValue('');
        break;
      case -50:
        this.alertService.setAlert(response['displaymessage'], '', AlertType.Failure);
        this.updatessnForm.controls.ssn.setValue('');
        this.showSnnOptions = false;
        this.authService.logout();
        break;
      case -90610:
        this.alertService.setAlert(response['displaymessage'], '', AlertType.Failure);
        break;
      case -90605:
        this.alertService.setAlert(response['displaymessage'], '', AlertType.Failure);
        this.updatessnForm.controls.ssn.setValue('');
        this.showSnnOptions = false;
        this.authService.logout();
        break;
      default:
        this.registrationService.handleError(response, this.constants.displayMessage);
        this.updatessnForm.controls.ssn.setValue('');
        break;
    }
    window.scrollTo(0, 0);
  }

  handleSuccessScenario() {
    this.registrationService.sendaccesscode().subscribe(res1 => {

      if (res1['result'] === '0' || res1['result'] === 0) {
        // If user is REgistered and verified , directly redirect to success page
        const scopename = this.authService.authToken ? this.authService.authToken.scopename : '';
        if (scopename === 'REGISTERED-AND-VERIFIED') {
          sessionStorage.setItem('registrationSuccessfull', 'true');
          this.router.navigate(['../register/success']);
        } else {
          const communicationChannel = this.authHttp.handleDecryptedResponse(res1);
          sessionStorage.setItem('sendCodeRes', JSON.stringify(communicationChannel));
          this.router.navigate(['../register/verifyaccesscode']).then(res => {
            sessionStorage.removeItem('updatessn');
            sessionStorage.setItem('accesscode', 'true');
            this.alertService.setAlert('Verification code sent!', '', AlertType.Success);
          });
        }


        // this.router.navigate(['../register/success']);
        // this.router.navigate(['../register/verifyaccesscode']).then(res => {
        // this.router.navigate(['../register/success']).then(res => {
        //   sessionStorage.removeItem('updatessn');
        //   // sessionStorage.setItem('accesscode', 'true');
        //   // this.alertService.setAlert('Verification code sent!', '', AlertType.Success);
        // });
      } else {
        sessionStorage.removeItem('updatessn');
        this.alertService.setAlert(res1['displaymessage'], '', AlertType.Failure);
      }


    });

  }

  togglePasswordVisibility() {
    const typeDetails = this.globalService.togglePasswordType(this.type);
    this.type = typeDetails.type;
    this.typePlaceholder = typeDetails.placeHolder;
  }

  navigateToLn() {
    this.alertService.clearError();
    this.registrationService.authWithLn()
      .map(res => this.authHttp.handleDecryptedResponse(res))
      .subscribe(response => {
        if (response) {
          if (response['displaymessage']) {
            this.handleLnError(Number(response['result']), response);
          } else {
            if (response['lnmessage']) {
              console.log('Auth With Ln Security Questions', response['lnmessage'].Products[0].QuestionSet.Questions);
              const questionsDetials = response['lnmessage'];
              sessionStorage.setItem('BBS_REG_QUESTIONS', JSON.stringify(questionsDetials));
              this.router.navigate(['/register/securityanswers']);
            }
          }
        }
      });
  }

  handleLnError(result, response) {
    switch (result) {
      case -1:
        this.redirectToMemberInfoPage();
        break;
      case -2:
        this.redirectToRegisterDetailPage();
        break;
      case -5:
        this.alertService.setAlert(response['displaymessage'], '', AlertType.Failure);
        this.updatessnForm.controls.ssn.setValue('');
        break;
      case -50:
        this.alertService.setAlert(response['displaymessage'], '', AlertType.Failure);
        this.updatessnForm.controls.ssn.setValue('');
        this.showSnnOptions = false;
        break;
      case -90649:
        this.alertService.setAlert(response['displaymessage'], '', AlertType.Failure);
        break;
      case -90651:
        this.alertService.setAlert(response['displaymessage'], '', AlertType.Failure);
        break;
      case -90652:
        this.alertService.setAlert(response['displaymessage'], '', AlertType.Failure);
        break;
      case -90650:
        this.alertService.setAlert(response['displaymessage'], '', AlertType.Failure);
        break;
      default:
        this.alertService.setAlert(response['displaymessage'], '', AlertType.Failure);
        break;
    }
    window.scrollTo(0, 0);
  }

}
