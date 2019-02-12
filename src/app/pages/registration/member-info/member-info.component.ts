import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RegistrationService } from '../registration.service';
import { AlertService } from '../../../shared/shared.module';
import { ValidationService } from '../../../shared/services/validation.service';
import { GlobalService } from '../../../shared/services/global.service';
import { AuthService } from '../../../shared/services/auth.service';
import { AlertType } from '../../../shared/alerts/alertType.model';
import {RegistrationHelper} from '../registration-helper';
import {RegisterConstants} from '../register-detail.error.constants';
declare let $: any;

@Component({
  selector: 'app-member-info',
  templateUrl: './member-info.component.html',
  styleUrls: ['./member-info.component.scss']
})
export class MemberInfoComponent implements OnInit, OnDestroy {
  memberinfoForm: FormGroup;
  isFormSubmitted = false;
  memIdMask: Array<any>;
  showForm = false;
  suffixMask: Array<any>;
  @ViewChild('memberid1') memberid1Field;
  memberIdMask: Object = { mask: this.validationService.memIdMask, guide: false };
  validatorsForMemberId = [Validators.required, Validators.minLength(12)];
  constructor(private fb: FormBuilder,
    private registrationService: RegistrationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private validationService: ValidationService,
    private authService: AuthService,
    private globalService: GlobalService,
    private alertService: AlertService) {
    const memberInfo = this.activatedRoute.snapshot.data && this.activatedRoute.snapshot.data.memberInfo;
    if (memberInfo) {
      console.log('memberInfo', memberInfo);
      if (RegistrationHelper.isUserNotFound(memberInfo)) {
        this.router.navigate(['register/verifyaccesscode']);
      }
    }
  }

  initializeMemberInfoForm() {
    let memid = '';
    let memberIdValidators = this.validatorsForMemberId;
    if (this.validateMemberIdOnLoad()) {
      memid = this.authService.memAuthInfo.memNum;
      if (this.isMemberIdInvalidOnLoad(this.authService.memAuthInfo)) {
        memberIdValidators = [ ...this.validatorsForMemberId,
          this.validationService.incorrectMemberIdValidator()];
      }
    }

    this.memberinfoForm = this.fb.group({
      'memberid': [memid, memberIdValidators],
    });
    this.subscribeToValueChangeEvents();
    this.memIdMask = this.validationService.memIdMask;
    this.suffixMask = this.validationService.suffixMask;
    this.showForm = true;
  }

  validateMemberIdOnLoad() {
    return this.authService.memAuthInfo && this.authService.memAuthInfo.memNum
     && this.authService.memAuthInfo.memNum !== 'null';
  }

  isMemberIdInvalidOnLoad(memberDetails) {
    const invalidFields = memberDetails.lastMemResult;
    const invalidMemberID = invalidFields && invalidFields.indexOf(this.validationService.API_INVALID_IDENTIFITERS.memberId) > -1;
    return  invalidMemberID ||  memberDetails.lastAuthFailtxt === 'MEMBER_NOT_FOUND';
  }


  subscribeToValueChangeEvents() {
    if (this.validateMemberIdOnLoad()) {
      // Assuming here that if member id is there it is invalid
      const memeberIdControl = this.memberinfoForm.get('memberid');
      memeberIdControl.markAsTouched();
      this.validationService.clearApiErrorOnChange(memeberIdControl, 'incorrectMemberId',
        this.validatorsForMemberId);
    }

    this.memberinfoForm.get('memberid').valueChanges.subscribe(e => {
      const upperCase = e.toUpperCase();
      const memberIdControl = this.memberinfoForm.get('memberid');
      memberIdControl.setValue(upperCase, { emitEvent: false });
    });
  }

  ngOnInit() {
    $('.materialboxed').materialbox();
    const memberInfo = this.activatedRoute.snapshot.data.memberInfo;
    if (memberInfo) {
      RegistrationHelper.redirectToVerifyAccessCodeIfUserNotFound(memberInfo, this.router);
      const response = memberInfo['ROWSET'] && memberInfo['ROWSET'].ROWS;
      this.authService.memAuthInfo = response;
    }

    this.redirectToSsnOnValidDetails();
    this.initializeMemberInfoForm();
  }

  ngOnDestroy() {
    this.alertService.clearError();
  }

  onSubmit() {
    this.globalService.markFormGroupTouched(this.memberinfoForm);
    this.isFormSubmitted = true;
    this.validationService.focusFirstError();
    // this.memberinfoForm.value.suffix = '00';
    this.memberinfoForm.value.memberid = '' + this.memberinfoForm.value.memberid; // + this.memberinfoForm.value.memberid1
    this.updateMemberInfo();
  }

  updateMemberInfo() {
    if (this.memberinfoForm.valid) {
      this.registrationService.updateMemAuthInfo(this.memberinfoForm.value)
        .subscribe(response => {
          this.handleUpdateMemberInfoResponse(response);
        });
    }
  }

  handleUpdateMemberInfoResponse(response) {
    if (response) {
      if (response['displaymessage']) {
        const displayMessage = response['displaymessage'];
        let errorHandled = false;
        errorHandled = this.isDuplicateRecord(displayMessage);
        if (!errorHandled) {
          errorHandled = this.isMemberIdInvalid(displayMessage);
        }
        if (!errorHandled) {
          this.authService.memAuthInfo = null;
          this.router.navigate(['../register/register-detail']).then(res => {
            this.alertService.setAlert(RegisterConstants.infoMismatchMsg, '', AlertType.Failure);
          });
        }
      } else if (response['fault'] && response['fault'].faultstring) {
        return;
      } else {
        this.authService.memAuthInfo = null;
        sessionStorage.setItem('updatessn',  'true');
        sessionStorage.setItem('userType', response['usertype']);
        this.router.navigate(['../register/updatessn']);
      }
    }
  }

  isMemberIdInvalid(response): boolean {
    if (response.indexOf(this.validationService.API_INVALID_IDENTIFITERS.memberId) > -1) {
      this.showIncorrectMemberIdError();
      return true;
    }
    return false;
  }

  isDuplicateRecord(response): boolean {
    if (response === 'Card Number Exisits') {
      const memberIdControl = this.memberinfoForm.get('memberid');
      memberIdControl.clearValidators();
      memberIdControl.setErrors(null);
      this.memberinfoForm.disable();
      this.memberinfoForm.markAsUntouched();
      this.alertService.setAlert(RegisterConstants.memIdMsg, '', AlertType.Failure);
      this.authService.clearSession();
      window.scrollTo(0, 0);
      return true;
    }
    if (response === 'REQUEST TIMED OUT') {
      this.alertService.setAlert(response, '', AlertType.Failure);
      return true;
    }
    return false;
  }

  showIncorrectMemberIdError() {
    const memberIdControl = this.memberinfoForm.get('memberid');
    memberIdControl.setErrors({ incorrectMemberId: { value: true } });
    this.alertService.setAlert(RegisterConstants.infoMismatchMsg, '', AlertType.Failure);
    window.scrollTo(0, 0);
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
