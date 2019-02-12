import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AuthService } from '../../../../shared/services/auth.service';
import { AuthHttp } from '../../../../shared/services/authHttp.service';
import { GlobalService } from '../../../../shared/services/global.service';
import { ValidationService } from '../../../../shared/services/validation.service';
// import { AlertService } from '../../../../shared/shared.module';
import { AlertService, ConstantsService } from '../../../../shared/shared.module';
import { DependentsResponseModel } from '../../../myclaims/models/dependants.model';
import { DependentsResponseModelInterface } from '../../../myclaims/models/interfaces/dependants-model.interface';
import { ChangePCPRequestModel, ChangePCPResponseModel } from '../../models/change-pcp-request.model';
import { GetCodeResponseModel, GetCodesRequestModel } from '../../models/get-codes-model';
import {
  GetMemberPlanDependentarrayResponseModel,
  GetMemberPlanDependentRequesteModel,
  GetMemberPlanDependentResponseModel
} from '../../models/get-member-plan-dependent-model';
import { GetMemberPlanInformation, GetMemPlanDependentsRequest } from '../../models/get-member-plan-info-model';
// tslint:disable-next-line:max-line-length
import { ChangePCPRequestModelInterface, ChangePCPResponseModelInterface } from '../../models/interfaces/change-pcp-request-model-interface';
import { GetCodeResponseModelInterface, GetCodesRequestModelInterface } from '../../models/interfaces/get-code-model-interface';
import {
  GetMemberPlanDependentRequesteModelInterface,
  GetMemberPlanDependentResponseModelInterface
} from '../../models/interfaces/get-member-plan-dependent-models.interface';
import {
  GetMemberPlanInformationInterface,
  GetMemPlanDependentsRequestInterface
} from '../../models/interfaces/get-member-plan-info-model.inteface';
import { ChangeReasonsConstants, MyDoctorsPcpConstants } from '../../mydoctors-pcp.constants';
import { MyDoctorsPcpService } from '../../mydoctors-pcp.service';
import { GetPCPInfoRequestModel, GetPCPInfoResponseModel } from '../../models/get-pcp-info-request.model';
// tslint:disable-next-line:max-line-length
import { GetPCPInfoRequestModelInterface, GetPCPInfoResponseModellInterface } from '../../models/interfaces/get-pcp-info-request-model-interface';
import { AlertType } from '../../../../shared/alerts/alertType.model';


@Component({
  selector: 'app-update-pcp',
  templateUrl: './update-pcp.component.html',
  styleUrls: ['./update-pcp.component.scss']
})
export class UpdatePcpComponent implements OnInit, OnDestroy {
  areYouPatientOfDoctor: MyDoctorsPcpConstants = MyDoctorsPcpConstants;
  updatePcpValidationForm: FormGroup;
  isFormSubmitted: boolean = false;
  dobMask: Array<any>;
  pcpId;
  hasDependents: boolean;
  isRtmsUpmode: boolean;
  dateOfservice;
  subscriber;
  effectiveDate;
  fullName;
  suffix;
  genderCode;
  DOB;
  planNamearray;
  planLength;
  groupNumber;
  depname = [];
  hasPlanDependents;
  loginUserId;
  isUserhasDependent;
  tieredNetworkIndicator;
  private currentDate: Date;
  changeReasonsList = ChangeReasonsConstants;
  focusOutUIErrorFlag = false;
  dependentList: DependentsResponseModelInterface = new DependentsResponseModel();
  memberPlanDetailsReqParam: GetMemberPlanInformationInterface = new GetMemberPlanInformation();
  memberPlanDependentsInfoReqParams: GetMemberPlanDependentResponseModelInterface = new GetMemberPlanDependentResponseModel();
  reasonForPCPChangeReqParams: GetCodeResponseModelInterface = new GetCodeResponseModel();
  updatePCPReqParams: ChangePCPResponseModelInterface = new ChangePCPResponseModel();
  newDependentList = [];
  loggedInUserDetails = [];
  memberList = [];
  selectedMember;
  memberInfo;
  pcpChangReason;
  currentProviderName;
  memberHasMultiplePlans = false;
  selectedPlan;
  tierInfo;
  currentProviderNumber;
  newEffectiveDate;
  patientIndicator;
  updatepcpresult;
  updatepcperrormessage;
  tierInfoUrl;
  // constructor() { }

  updatepcpidcustomMessages = {
    'required': 'New PCP ID is required',
    'invalidAlphaNumericString': 'Please enter a valid PCP ID',
  };
  dob = {
    'required': 'Effective date is required',
  };
  reasonchangepcpcustomMessage = {
    'required': 'Reason for change is required',
  };
  dobCustomMessage = {
    'required': 'Effective date is required',
    'ninetyDays': 'The date should not be more than 90 days from today',
  };
  checkCurrentPatientCustomMessage = {
    'required': 'Reason is required',
  };
  fpoTargetUrl: string;
  constructor(private validationService: ValidationService,
    private globalService: GlobalService,
    private alertService: AlertService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private myDoctorsPcpService: MyDoctorsPcpService,
    private http: AuthHttp,
    public memberPlanInfo: MyDoctorsPcpService,
    private constants: ConstantsService) {
    // this.memberHasMultiplePlans=true;
    if (!this.myDoctorsPcpService.selectedDoctor) {
      this.router.navigate(['/mydoctors']);
    }
    this.currentProviderName = this.myDoctorsPcpService.selectedDoctor.providerName;
    this.pcpId = this.myDoctorsPcpService.selectedDoctor
      && this.myDoctorsPcpService.selectedDoctor.pcpId ? this.myDoctorsPcpService.selectedDoctor.pcpId : '';

    this.hasDependents = this.myDoctorsPcpService && this.myDoctorsPcpService.memberInfo
      && this.myDoctorsPcpService.memberInfo.hasDependents ? true : false;

    this.dateOfservice = this.myDoctorsPcpService.selectedDoctor &&
    this.myDoctorsPcpService.selectedDoctor.dateOfservice ? this.myDoctorsPcpService.selectedDoctor.dateOfservice : '';
    this.effectiveDate = moment(this.dateOfservice).format('MM/DD/YYYY');

    let formGroup;
    formGroup = {
      updatepcpid: ['', [Validators.required, this.validationService.alphaNumericValidator()]],
      updatepcpchangereason: ['', [Validators.required]],
      dob: ['', [Validators.required, this.validationService.dateValidator(true),
      this.validationService.ninetyDaysValidator()]],
      planName: ['', [Validators.required]],
      patientIndicator: ['', [Validators.required]],
      memberInfo: [[], []]
    };
    this.updatePcpValidationForm = this.fb.group(formGroup);
    this.dobMask = this.validationService.dobMask;
    this.currentDate = new Date();
    this.fpoTargetUrl = this.constants.drupalPCPUrl;
    this.tierInfoUrl = this.constants.pcpTierInfoUrl;
    this.alertService.errors['pcpmessage'] = '';
    this.alertService.errors['pcperrorcode'] = '';
  }

  ngOnInit() {
    if (this.authService.getRtmsMode()) {
      this.isRtmsUpmode = true;
      this.setCurrentDateToDob();
      // this.formMemberInfoArray();
      this.getMemberPlanInfo();
      this.getReasonCodes();
    } else {
      this.isRtmsUpmode = false;
    }
  }

  getMemberPlanDependents(depinfos) {
    this.alertService.clearError();
    this.depname = [];
    const loginPerson = this.getLoggedInUserDetails();
    this.selectedMember = loginPerson;
    this.depname.push(loginPerson);
    if (!this.hasDependents) {
      this.getPCPInfo();
      return;
    }
    const memberPlanDependentsReqParams: GetMemberPlanDependentRequesteModelInterface = new GetMemberPlanDependentRequesteModel();
    // sending request params
    memberPlanDependentsReqParams.useridin = this.authService.useridin;
    memberPlanDependentsReqParams.groupNumber = this.selectedPlan.groupNumber;
    // console.log(depinfos.value);

    // getting response values
    this.memberPlanInfo.getMemberPlanDependentsInfo(memberPlanDependentsReqParams).subscribe(apiData => {
      if (apiData && Object.keys(apiData).length) {
        if (apiData['result'] && apiData['result'] < 0) {
          this.alertService.setAlert(apiData['displaymessage'], '', AlertType.Failure);
        } else {
          this.memberPlanDependentsInfoReqParams = apiData;
          console.log(apiData);

          // tslint:disable-next-line:max-line-length
          if (this.memberPlanDependentsInfoReqParams && this.memberPlanDependentsInfoReqParams.dependents && this.memberPlanDependentsInfoReqParams.dependents.length > 0) {
            this.updatePcpValidationForm.controls['planName'].setValidators(null);
            this.updatePcpValidationForm.controls['planName'].updateValueAndValidity();
            this.depname = this.depname.concat(this.memberPlanDependentsInfoReqParams.dependents);
            this.updateRelationShips(this.memberPlanDependentsInfoReqParams.dependents);
            this.getPCPInfo();
          }
          this.loginUserId = this.authService.useridin;
        }
      }
    });
  }

  getLoggedInUserDetails() {
    const loginPerson: GetMemberPlanDependentarrayResponseModel = {
      fullName: this.memberPlanDetailsReqParam.fullName,
      suffix: this.memberPlanDetailsReqParam.suffix,
      genderCode: this.memberPlanDetailsReqParam.genderCode,
      DOB: this.memberPlanDetailsReqParam.DOB,
    };
    return loginPerson;
  }
  getMemberPlanInfo() {
    this.alertService.clearError();
    const memPlanInfoReqParams: GetMemPlanDependentsRequestInterface = new GetMemPlanDependentsRequest();
    // sending request params
    memPlanInfoReqParams.useridin = this.authService.useridin;

    // getting response values
    this.memberPlanInfo.getMemberPlanInfo(memPlanInfoReqParams).subscribe(apiData => {
      if (apiData && Object.keys(apiData).length) {
        if (apiData['result'] && apiData['result'] < 0) {
          this.alertService.setAlert(apiData['displaymessage'], '', AlertType.Failure);
        } else {
          this.memberPlanDetailsReqParam = apiData;
          this.memberPlanDetailsReqParam.fullName += this.getRelationShip(this.memberPlanDetailsReqParam.suffix);
          this.fullName = this.memberPlanDetailsReqParam.fullName;
          this.suffix = this.memberPlanDetailsReqParam.suffix;
          this.planNamearray = this.memberPlanDetailsReqParam.plans;
          this.planLength = this.planNamearray ? this.planNamearray.length : 0;
          this.hasPlanDependents = this.memberPlanDetailsReqParam.plans;
          if (this.planLength === 1) {
            this.updatePcpValidationForm.controls['planName'].setValidators(null);
            this.updatePcpValidationForm.controls['planName'].updateValueAndValidity();
            this.selectedPlan = this.memberPlanDetailsReqParam.plans[0];
            this.getMemberPlanDependents({ value: this.selectedPlan.groupNumber });
          }
        }
      }
    });
  }

  updateRelationShips(dependentList) {
    dependentList.forEach(dependent => dependent.fullName = dependent.fullName + this.getRelationShip(dependent.suffix));
  }

  getRelationShip(suffix): string {
    let relationship = '';
    const relationShipCode = parseInt(suffix);
    if (relationShipCode === 0) {
      relationship = ' (Subscriber)';
    } else if (relationShipCode > 0 && relationShipCode <= 8) {
      relationship = ' (Spouse)';
    } else {
      relationship = ' (Dependent)';
    }
    return relationship;
  }

  // Get Change PCP reason values
  getReasonCodes() {
    const changePCPReasonChangeParams: GetCodesRequestModelInterface = new GetCodesRequestModel();
    changePCPReasonChangeParams.useridin = this.authService.useridin;
    changePCPReasonChangeParams.name = 'PCPChangeMSS1';
    changePCPReasonChangeParams.sortOrder = 'T';

    this.memberPlanInfo.getChangePCPReasonInfo(changePCPReasonChangeParams).subscribe(apiData => {
      if (apiData && Object.keys(apiData).length) {
        if (apiData['result'] && apiData['result'] < 0) {
          this.alertService.setAlert(apiData['displaymessage'], '', AlertType.Failure);
        } else {
          this.reasonForPCPChangeReqParams = apiData;
          this.pcpChangReason = this.reasonForPCPChangeReqParams.codes;
        }
      }
    });

  }

  public savePcpChanges(): void {
    this.router.navigate(['mydoctors/pcp-result']);
  }

  public setCurrentDateToDob(): void {
    this.updatePcpValidationForm.controls['dob'].setValue(moment(this.currentDate).format('MM/DD/YYYY'));
  }

  focusOutUIError() {
    window.setTimeout(() => {
      console.log('ngif is set 123');
      this.focusOutUIErrorFlag = true;
    }, 250);
  }

  public formMemberInfoArray(): void {
    if (this.hasDependents) {
      this.dependentList = this.authService.getDependentsList();
      console.log('dependentList', this.dependentList);
      if (this.dependentList) {
        this.dependentList.dependents.map(item => {
          return {
            name: `${item.dependent.lastName}, ${item.dependent.firstName}`, // item.MemName,
            relationship: item.dependent.relationship // depRelationsip
          };
        }).forEach(item => this.newDependentList.push(item));
      }

      this.loggedInUserDetails.push({
        name: this.myDoctorsPcpService.memberInfo.memFistName + ' ' + this.myDoctorsPcpService.memberInfo.memLastName,
        relationship: this.myDoctorsPcpService.memberInfo.relationship
      });

      this.memberList = this.loggedInUserDetails.concat(this.newDependentList);
      this.selectedMember = this.loggedInUserDetails[0].name;
    }
  }

  btnsubmit() {
    const changePCPRequestParams: ChangePCPRequestModelInterface = new ChangePCPRequestModel();
    changePCPRequestParams.useridin = this.authService.useridin;
    changePCPRequestParams.groupNumber = this.selectedPlan.groupNumber;
    changePCPRequestParams.suffix = this.selectedMember.suffix;
    changePCPRequestParams.genderCode = this.selectedMember.genderCode;
    changePCPRequestParams.DOB = this.selectedMember.DOB;
    changePCPRequestParams.effectiveDate = moment(this.newEffectiveDate).format('YYYY-MM-DD');
    changePCPRequestParams.isTIR = this.selectedPlan.isTIR;
    changePCPRequestParams.isTRB = this.selectedPlan.isTRB;
    changePCPRequestParams.isNEHP = this.selectedPlan.isNEHP;
    changePCPRequestParams.currentProviderName = this.currentProviderName;
    changePCPRequestParams.currentProviderNumber = this.currentProviderNumber;
    changePCPRequestParams.providerNumber = this.updatePcpValidationForm.controls['updatepcpid'].value;

    // tslint:disable-next-line:max-line-length
    changePCPRequestParams.establishedPatientIndicator = this.updatePcpValidationForm.controls['patientIndicator'].value === 'Yes' ? true : false;
    changePCPRequestParams.changeReasonIndicator = this.updatePcpValidationForm.controls['updatepcpchangereason'].value;


    this.myDoctorsPcpService.changePCPInfo(changePCPRequestParams).subscribe(apiData => {
      this.alertService.errors['pcpmessage'] = '';
      this.alertService.errors['pcperrorcode'] = '';
      if (apiData && Object.keys(apiData).length) {
        this.myDoctorsPcpService.previousPCPUrl = '/mydoctors/update-pcp';
        this.updatePCPReqParams = apiData;
        if (this.updatePCPReqParams.displaymessage && this.updatePCPReqParams.displaymessage.length) {
          this.updatepcpresult = this.updatePCPReqParams.result;
          this.alertService.errors['pcpmessage'] = this.updatePCPReqParams.displaymessage;
          if (this.updatepcpresult === -91860) {
            this.alertService.errors['pcperrorcode'] = apiData.result;
          }
          this.router.navigate(['mydoctors/pcp-error']);
        } else {
          this.alertService.errors['pcpmessage'] = apiData['confirmationNumber'];
          this.router.navigate(['mydoctors/pcp-result']);
        }
      }
    });
  }

  ngOnDestroy() {
    this.alertService.clearError();
  }


  getPCPInfo() {
    const pcpInfoReqParams: GetPCPInfoRequestModelInterface = new GetPCPInfoRequestModel();
    // sending request params
    pcpInfoReqParams.useridin = this.authService.useridin;
    pcpInfoReqParams.groupNumber = this.selectedPlan.groupNumber;
    // pcpInfoReqParams.tieredNetworkIndicator = this.selectedPlan.tieredNetworkIndicator;
    pcpInfoReqParams.suffix = this.selectedMember.suffix;
    pcpInfoReqParams['isTIR'] = this.selectedPlan['isTIR'];
    pcpInfoReqParams['isTRB'] = this.selectedPlan['isTRB'];
    this.memberPlanInfo.getPCPInfo(pcpInfoReqParams).subscribe(apiData => {
      if (apiData) {
        if (apiData['result'] && apiData['result'] < 0) {
          this.alertService.setAlert(apiData['displaymessage'], '', AlertType.Failure);
          this.pcpId = '';
          this.effectiveDate = '';
          this.tierInfo = '';
          this.currentProviderNumber = '';
          this.currentProviderName = '';
        } else {
          this.pcpId = apiData.providerNumber;
          this.effectiveDate = moment(apiData.effectiveDate).format('MM/DD/YYYY');
          this.tierInfo = apiData.par;
          this.currentProviderNumber = apiData.providerNumber;
          this.currentProviderName = apiData.providerName;

        }
      }
    });
  }
  openSsoUrl(url) {
    if (url) {
      window.open(url, '_blank');
    }
  }
}
