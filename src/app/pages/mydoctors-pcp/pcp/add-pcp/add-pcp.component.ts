import { Component, OnInit, ElementRef } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationService } from '../../../../shared/services/validation.service';
import { AlertService } from '../../../../shared/shared.module';
import { AlertType } from '../../../../shared/alerts/alertType.model';
import { GlobalService } from '../../../../shared/services/global.service';
import { ConstantsService } from '../../../../shared/services/constants.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { MyDoctorsPcpService } from '../../mydoctors-pcp.service';
import * as moment from 'moment';
import { DependentsModelInterface, DependentsResponseModelInterface } from '../../../myclaims/models/interfaces/dependants-model.interface';
import { DependentsModel, DependentsResponseModel } from '../../../myclaims/models/dependants.model';
import { GetCodesRequestModelInterface, GetCodeResponseModelInterface } from '../../models/interfaces/get-code-model-interface';
import { GetCodesRequestModel, GetCodeResponseModel } from '../../models/get-codes-model';
// tslint:disable-next-line:max-line-length
import { ChangePCPRequestModelInterface, ChangePCPResponseModelInterface } from '../../models/interfaces/change-pcp-request-model-interface';
import {
  GetMemberPlanDependentRequesteModelInterface,
  GetMemberPlanDependentResponseModelInterface
} from '../../models/interfaces/get-member-plan-dependent-models.interface';
import {
  GetMemberPlanInformationInterface,
  GetMemPlanDependentsRequestInterface
} from '../../models/interfaces/get-member-plan-info-model.inteface';
import { GetPCPInfoRequestModel, GetPCPInfoResponseModel } from '../../models/get-pcp-info-request.model';
// tslint:disable-next-line:max-line-length
import { GetPCPInfoRequestModelInterface, GetPCPInfoResponseModellInterface } from '../../models/interfaces/get-pcp-info-request-model-interface';
import { GetMemberPlanInformation, GetMemPlanDependentsRequest } from '../../models/get-member-plan-info-model';
import {
  GetMemberPlanDependentarrayResponseModel,
  GetMemberPlanDependentRequesteModel,
  GetMemberPlanDependentResponseModel
} from '../../models/get-member-plan-dependent-model';
import { ChangePCPRequestModel, ChangePCPResponseModel } from '../../models/change-pcp-request.model';
import { MyDoctorsPcpConstants } from '../../mydoctors-pcp.constants';
@Component({
  selector: 'app-add-pcp',
  templateUrl: './add-pcp.component.html',
  styleUrls: ['./add-pcp.component.scss']
})

export class AddPcpComponent implements OnInit {
  areYouPatientOfDoctor: MyDoctorsPcpConstants = MyDoctorsPcpConstants;
  addPCPForm: FormGroup;
  isFormSubmitted: boolean = false;
  memberSelected: string;
  hasDependents: boolean;
  isRtmsUpmode: boolean;
  dobMask: Array<any>;
  pcpId = this.pcpId ? this.pcpId : '';
  memberInfo;
  private currentDate: Date;
  dobcustomMessages = {};
  dependentList: DependentsResponseModelInterface = new DependentsResponseModel();
  newDependentList = [];
  loggedInUserDetails = [];
  memberList = [];
  selectedMember;
  focusOutUIErrorFlag = false;
  reasonForPCPChangeReqParams: GetCodeResponseModelInterface = new GetCodeResponseModel();
  updatePCPReqParams: ChangePCPResponseModelInterface = new ChangePCPResponseModel();
  pcpChangReason;
  fullName;
  suffix;
  planNamearray;
  planLength;
  hasPlanDependents;
  selectedPlan;
  newEffectiveDate;
  providerName;
  tierInfo;
  providerNumber;
  patientIndicator;
  updatepcpresult;
  updatepcperrormessage;


  memberPlanDetailsReqParam: GetMemberPlanInformationInterface = new GetMemberPlanInformation();
  memberPlanDependentsInfoReqParams: GetMemberPlanDependentResponseModelInterface = new GetMemberPlanDependentResponseModel();


  addpcpidcustomMessages = {
    'required': 'PCP ID is required',
    'invalidAlphaNumericString': 'Please enter a valid PCP ID',
  };
  dob = {
    'required': 'Effective date is required',
    'ninetyDays': 'The date should not be more than 90 days from today',
  };
  reasonchangepcpcustomMessage = {
    'required': 'Reason for change is required',
  };
  dobCustomMessage = {
    'required': 'Effective date is required',
    'ninetyDays': 'The date should not be more than 90 days from today',
  };
  fpoTargetUrl: string;
  constructor(private alertService: AlertService,
    private constants: ConstantsService,
    private fb: FormBuilder,
    private router: Router,
    private globalService: GlobalService,
    private validationService: ValidationService,
    private authService: AuthService,
    private myDoctorsPcpService: MyDoctorsPcpService,
    public memberPlanInfo: MyDoctorsPcpService) {
    this.pcpId = this.myDoctorsPcpService.selectedDoctor
      && this.myDoctorsPcpService.selectedDoctor.pcpId ? this.myDoctorsPcpService.selectedDoctor.pcpId : '';

    this.hasDependents = this.myDoctorsPcpService && this.myDoctorsPcpService.memberInfo
      && this.myDoctorsPcpService.memberInfo.hasDependents ? true : false;
    this.providerNumber = this.myDoctorsPcpService.selectedDoctor && this.myDoctorsPcpService.selectedDoctor.providerNumber;

    let formGroup;
    formGroup = {
      pcpId: [this.pcpId, [Validators.required, this.validationService.alphaNumericValidator()]],
      updatepcpchangereason: ['', [Validators.required]],
      dob: ['', [Validators.required, this.validationService.dateValidator(true), this.validationService.ninetyDaysValidator()]],
      patientIndicator: ['', [Validators.required]],
      planName: ['', [Validators.required]],
      memberInfo: [[], []]
    };
    this.addPCPForm = this.fb.group(formGroup);
    this.dobMask = this.validationService.dobMask;
    this.currentDate = new Date();
    this.fpoTargetUrl = this.constants.drupalPCPUrl;
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

  public setCurrentDateToDob(): void {
    this.addPCPForm.controls['dob'].setValue(moment(this.currentDate).format('MM/DD/YYYY'));
  }


  getMemberPlanInfo() {
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
          this.planLength = this.memberPlanDetailsReqParam.plans.length;
          this.hasPlanDependents = this.memberPlanDetailsReqParam.plans;
          if (this.planLength === 1) {
            this.addPCPForm.controls['planName'].setValidators(null);
            this.addPCPForm.controls['planName'].updateValueAndValidity();
            this.selectedPlan = this.memberPlanDetailsReqParam.plans[0];
            this.getMemberPlanDependents({ value: this.selectedPlan.groupNumber });
          }
        }
        // console.log(this.planLength);
        // check whether planname is coming or not  - need to do
      }
    });
  }

  getMemberPlanDependents(depinfos) {
    this.memberList = [];
    const loginPerson=this.getLoggedInUserDetails();
    this.memberList.push(loginPerson);
    this.selectedMember = loginPerson;
    //If the member does not have any dependents, no need to call Plan Dependents API
    if(!this.hasDependents){
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
          this.alertService.setAlert( apiData['displaymessage'],'', AlertType.Failure);
        } else {

          this.memberPlanDependentsInfoReqParams = apiData;
          console.log(apiData);

          // tslint:disable-next-line:max-line-length
          if (this.memberPlanDependentsInfoReqParams && this.memberPlanDependentsInfoReqParams.dependents && this.memberPlanDependentsInfoReqParams.dependents.length > 0) {
            this.memberList = this.memberList.concat(this.memberPlanDependentsInfoReqParams.dependents);
            this.updateRelationShips(this.memberPlanDependentsInfoReqParams.dependents);
          }
          // this.loginUserId = this.authService.useridin;
        }
      }
    });
  }

  getLoggedInUserDetails(){
    const loginPerson: GetMemberPlanDependentarrayResponseModel = {
      fullName: this.memberPlanDetailsReqParam.fullName,
      suffix: this.memberPlanDetailsReqParam.suffix,
      genderCode: this.memberPlanDetailsReqParam.genderCode,
      DOB: this.memberPlanDetailsReqParam.DOB,
    };
    return loginPerson;
  }

  updateRelationShips(dependentList) {
    dependentList.forEach(dependent => dependent.fullName =
      dependent.fullName + this.getRelationShip(dependent.suffix));
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
        // tslint:disable-next-line:max-line-length
        name: (this.myDoctorsPcpService.memberInfo.memFistName || this.myDoctorsPcpService.memberInfo['memFirstName']) + ' ' + this.myDoctorsPcpService.memberInfo.memLastName,
        relationship: this.myDoctorsPcpService.memberInfo.relationship
      });

      this.memberList = this.loggedInUserDetails.concat(this.newDependentList);
      this.selectedMember = this.loggedInUserDetails[0];
    }
  }

  focusOutUIError() {
    window.setTimeout(() => {
      console.log('ngif is set 123');
      this.focusOutUIErrorFlag = true;
    }, 250);
  }

  getReasonCodes() {
    const changePCPReasonChangeParams: GetCodesRequestModelInterface = new GetCodesRequestModel();
    changePCPReasonChangeParams.useridin = this.authService.useridin;
    changePCPReasonChangeParams.name = 'PCPChangeMSS1';
    changePCPReasonChangeParams.sortOrder = 'T';

    this.memberPlanInfo.getChangePCPReasonInfo(changePCPReasonChangeParams).subscribe(apiData => {
      if (apiData && Object.keys(apiData).length) {
        if (apiData['result'] && apiData['result'] < 0) {
          this.alertService.setAlert(apiData['displaymessage'],'', AlertType.Failure);
        } else {

          this.reasonForPCPChangeReqParams = apiData;
          this.pcpChangReason = this.reasonForPCPChangeReqParams.codes;
        }
      }
    });

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
    changePCPRequestParams.providerNumber = this.addPCPForm.controls['pcpId'].value;
    // changePCPRequestParams.providerId = this.addPCPForm.controls['pcpId'].value;
    changePCPRequestParams.establishedPatientIndicator = this.addPCPForm.controls['patientIndicator'].value === 'Yes' ? true : false;
    changePCPRequestParams.changeReasonIndicator = this.addPCPForm.controls['updatepcpchangereason'].value;

    // this.myDoctorsPcpService.changePCPInfo(changePCPRequestParams);
    // this.router.navigate(['mydoctors/pcp-result']);
    this.alertService.errors['pcperrorcode']="";
    this.alertService.errors['pcpmessage']="";
    this.myDoctorsPcpService.changePCPInfo(changePCPRequestParams).subscribe(apiData => {
      if (apiData && Object.keys(apiData).length) {
        this.myDoctorsPcpService.previousPCPUrl='/mydoctors/add-pcp';
        this.updatePCPReqParams = apiData;
        if(this.updatePCPReqParams.displaymessage && this.updatePCPReqParams.displaymessage.length){
          this.updatepcpresult = this.updatePCPReqParams.result;
          this.alertService.errors['pcpmessage'] = this.updatePCPReqParams.displaymessage;
          if(this.updatepcpresult===-91860){
            this.alertService.errors['pcperrorcode'] = this.updatepcpresult;
            this.router.navigate(['mydoctors/pcp-result']);
          }else{
            this.router.navigate(['mydoctors/pcp-error']);
          }
        }else{
          this.alertService.errors['pcpmessage'] = apiData["confirmationNumber"];
          this.router.navigate(['mydoctors/pcp-result']);
        }
      }
    });
  }
  ngOnDestroy() {
    this.alertService.clearError();
  }
  openSsoUrl(url) {
    if (url) {
      window.open(url, '_blank');
    }
  }
  
}
