import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertType } from '../../../shared/alerts/alertType.model';
import { MemberInfo } from '../../../shared/models/memberInfo.model';
import { AlertService } from '../../../shared/services/alert.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ValidationService } from '../../../shared/services/validation.service';
import { RequestEstimateConstants } from '../request-estimate.constant';
import { ProfileService } from '../../../shared/services/myprofile/profile.service';
import { GetMemberProfileResponseModel } from '../../my-profile/models/get-member-profile-request.model';
import {
  DependentsResponseModelInterface, DependentInterimModelInterface, DependentModelInterface
} from '../../myclaims/models/interfaces/dependants-model.interface';
import { DependentsResponseModel } from '../../myclaims/models/dependants.model';
import { RequestEstimateService } from '../request-estimate.service';
import {
  GetMemBasicInfoResponseModelInterface, BasicMemInfoRxSummaryInterface
} from '../../medications/models/interfaces/get-member-basic-info-model.interface';
import { GetMemBasicInfoResponseModel } from '../../medications/models/get-member-basic-info.model';
import { GetRecentVisitsResponseModelInterface } from '../../mydoctors-pcp/models/interfaces/get-recent-visits-models.interface';
// tslint:disable-next-line:max-line-length
import { GetDependentRecentVisitsResponseModelInterface } from '../../mydoctors-pcp/models/interfaces/get-dependent-recent-visits-model.interface';
import { GetRequestEstimateDetailsResponseModelInterface } from '../models/interfaces/get-request-estimate-details-models.interface';
import { GetDependentRecentVisitsResponseModel } from '../../mydoctors-pcp/models/get-dependent-recent-visits.model';
import { DependantsService } from '../../../shared/services/dependant.service';
import { Observable } from 'rxjs/Observable';
import {
  PatientListModelInterface,
  ProviderListItemModelInterface
} from '../models/interfaces/request-estimate-common-models.interface';
import {
  PatientListModel,
  ProviderListItemModel
} from '../models/request-estimate-common.model';
import { RxSummaryInterface } from '../../medications/models/interfaces/my-medications-generic-models.interface';
import { SubmitRequestEstimateDetailsRequestModel } from '../models/submit-request-estimate-details.model';
import { SubmitRequestEstimateDetailsRequestModelInterface } from '../models/interfaces/submit-request-estimate-details-models.inteface';
import { VisitsResponseInterface } from '../../mydoctors-pcp/models/interfaces/my-doctor-module-common-models.interface';
import { environment } from '../../../../environments/environment';
import { ConstantsService } from '../../../shared/shared.module';
import { FpocontentService } from '../../../shared/services/fpocontent.service';

@Component({
  selector: 'app-request-estimate',
  templateUrl: './request-estimate.component.html',
  styleUrls: ['./request-estimate.component.scss']
})
export class RequestEstimateComponent implements OnInit, OnDestroy {
  public requestEstimateConstants: RequestEstimateConstants = RequestEstimateConstants;
  public requestEstimateForm: FormGroup;
  public ismobile: any;
  mobileViewPort = 992;
  public rawFormFromStorage;
  public patientList: PatientListModelInterface[] = [];
  public providerList: VisitsResponseInterface[] = [];
  public refinedProviderList: ProviderListItemModelInterface[] = [];
  public providerTempList = [];
  public specialFormat = [];
  public dependentList: DependentsResponseModelInterface = new DependentsResponseModel();
  public procedureDiagnosisArray: Array<any> = [];
  public procedureDiagnosisCounter: number = 1;
  public profile: GetMemberProfileResponseModel; // Profile;
  public tooltip: Object;
  public hasDependents: boolean;
  public submitAction: boolean;
  public isEligible: boolean;
  public isFacility: boolean;
  public isNPI: boolean;
  sideNavStatus: string;
  public isProcedureCode: boolean;
  public memberInfo: BasicMemInfoRxSummaryInterface;
  public phoneMask: Object = { mask: this.validationService.phoneMask, guide: false };
  public zipMask: Object = { mask: this.validationService.zipMask, guide: false };
  public numeric5DigitMask: Object = { mask: this.validationService.numeric5Mask, guide: false };
  public numeric10DigitMask: Object = { mask: this.validationService.numeric10Mask, guide: false };
  public procedureAndDiagnosisCodeList: Object = {};
  public DiagnosisCodedrupalTargetUrl: string;
  public faclityNPIdrupalTargetUrl: string;
  public serviceProviderNPIdrupalTargetUrl: string;
  public DiagnosisCodedrupalTargetUrlData: object;
  public faclityNPIdrupalTargetUrlData: object;
  public serviceProviderNPIdrupalTargetUrlData: object;

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

  fpoTargetUrl = environment.privacyUrl + 'request-written-estimate-default-screen';

  public customMessages = {
    patient: {
      required: 'Please select the member',
    },
    contactPhoneNumber: {
      required: 'You must enter a valid phone number.',
      invalidMobile: 'Please use the following format:###-###-####.',
      invalidNumber: 'Invalid phone number. Please try again.'
    },
    phoneNumber: {
      invalidMobile: 'Please use the following format:###-###-####.',
      invalidNumber: 'Invalid phone number. Please try again.'
    },
    zipCode: {
      required: 'You must enter the ZIP code.',
      minlength: 'You must enter a valid ZIP code.'
    },
    deliveryCity: {
      required: 'You must enter the city.',
    },
    deliveryState: {
      required: 'You must select a State.',
    },
    deliveryEmail: {
      required: 'You must enter a valid email address.',
      invalidEmail: 'You must enter a valid email address.'
    },
    deliveryAddress1: {
      required: 'You must enter a valid mailing address.'
    },
    provider: {
      required: 'Please select a provider.'
    },
    providerName: {
      required: 'You must enter the name of the performing doctor or provider.'
    },
    providerPhoneNumber: {
      required: 'You must enter the doctor\'s phone number.',
      invalidMobile: 'You must enter a valid phone number.',
      invalidNumber: 'Please use the following format: ###-###-####.'
    },
    facilityName: {
      required: 'You must enter the name of the facility.'
    },
    facilityAddress: {
      required: 'You must enter the facility\'s address.'
    },
    facilityCity: {
      required: 'You must enter the facility\'s location.'
    },
    facilityZipCode: {
      required: 'You must enter the ZIP code.',
      minlength: 'You must enter a valid ZIP code.'
    },
    facilityPhoneNumber: {
      required: 'You must enter the facility\'s phone number.',
      invalidMobile: 'Please use the following format:###-###-####.',
      invalidNumber: 'Invalid phone number. Please try again.'
    },
    providerNPI: {
      minlength: 'You must enter a valid 10-digit NPI code.'
    },
    facilityNPI: {
      minlength: 'You must enter a valid 10-digit NPI code.'
    },
    procedureCode: {
      minlength: 'You must enter a valid 5-digit procedure code.',
      duplicateCombination: 'Combination Already Exists'
    },
    diagnosisCode: {
      minlength: 'You must enter a valid 5-digit diagnosis code.',
      duplicateCombination: 'Combination Already Exists'
    },

  };

  public requestEstimateData: GetRequestEstimateDetailsResponseModelInterface = null;

  private basicMemInfo: GetMemBasicInfoResponseModelInterface = null;
  private dependentsData: DependentsResponseModelInterface = null;
  private recentVisits: GetRecentVisitsResponseModelInterface = null;
  private dependentRecentVisits: GetDependentRecentVisitsResponseModelInterface = null;
  private estimateDataToSubmit: SubmitRequestEstimateDetailsRequestModelInterface = new SubmitRequestEstimateDetailsRequestModel();
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth <= this.mobileViewPort) {
      this.ismobile = true;
    } else {
      this.ismobile = false;
      this.sideNavStatus = 'in';

    }
  }
  constructor(private dependantsService: DependantsService,
    private fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private alertService: AlertService,
    private validationService: ValidationService,
    private profileService: ProfileService,
    private constants: ConstantsService,
    private fpocontentService: FpocontentService,
    private requestEstimateService: RequestEstimateService) {
    console.log(this.route.snapshot.data);
    this.memberInfo = (this.route.snapshot.data.memberInfo instanceof Array) ?
      this.route.snapshot.data.memberInfo[0].rxSummary : this.route.snapshot.data.memberInfo.rxSummary;
    this.requestEstimateForm = this.fb.group({
      estimateEligibility: ['', [Validators.required]],
      patient: ['', [Validators.required]],
      contactPhoneNumber: ['', [Validators.required, this.validationService.mobileValidator(), this.validationService.phoneValidator()]],
      deliveryFormGroup: this.fb.group({
        deliveryEmail: ['', [this.validationService.emailValidator()]],
        deliveryAddress1: [''],
        deliveryAddress2: [''],
        deliveryState: [''],
        deliveryCity: ['', [Validators.required]],
        deliveryZipCode: ['', [Validators.minLength(5)]],
        deliveryOption: ['', [Validators.required]],
      }),
      materialRequirements: [''],
      materialProcedureDesc: [''],
      provider: ['', [Validators.required]],
      providerName: ['', [Validators.required]],
      providerPhoneNumber: ['', [Validators.required, this.validationService.phoneValidator(), this.validationService.mobileValidator()]],
      facilityFormGroup: this.fb.group({
        facilityIndicator: [null],
        facilityName: [''],
        facilityAddress: [''],
        facilityCity: [''],
        facilityState: [''],
        facilityZipCode: ['', [Validators.minLength(5)]],
        facilityPhoneNumber: ['', []],
      }),
      npiIndicator: [null],
      providerNPI: ['', [Validators.minLength(10)]],
      facilityNPI: ['', [Validators.minLength(10)]],
      procedureCodeIndicator: [null],
      procedureCode1: ['', { validators: [Validators.minLength(5)], updateOn: 'blur' }],
      procedureCode2: ['', { validators: [Validators.minLength(5)], updateOn: 'blur' }],
      procedureCode3: ['', { validators: [Validators.minLength(5)], updateOn: 'blur' }],
      procedureCode4: ['', { validators: [Validators.minLength(5)], updateOn: 'blur' }],
      procedureCode5: ['', { validators: [Validators.minLength(5)], updateOn: 'blur' }],
      procedureCode6: ['', { validators: [Validators.minLength(5)], updateOn: 'blur' }],
      procedureCode7: ['', { validators: [Validators.minLength(5)], updateOn: 'blur' }],
      procedureCode8: ['', { validators: [Validators.minLength(5)], updateOn: 'blur' }],
      procedureCode9: ['', { validators: [Validators.minLength(5)], updateOn: 'blur' }],
      procedureCode10: ['', { validators: [Validators.minLength(5)], updateOn: 'blur' }],
      diagnosisCode1: ['', { validators: [Validators.minLength(5)], updateOn: 'blur' }],
      diagnosisCode2: ['', { validators: [Validators.minLength(5)], updateOn: 'blur' }],
      diagnosisCode3: ['', { validators: [Validators.minLength(5)], updateOn: 'blur' }],
      diagnosisCode4: ['', { validators: [Validators.minLength(5)], updateOn: 'blur' }],
      diagnosisCode5: ['', { validators: [Validators.minLength(5)], updateOn: 'blur' }],
      diagnosisCode6: ['', { validators: [Validators.minLength(5)], updateOn: 'blur' }],
      diagnosisCode7: ['', { validators: [Validators.minLength(5)], updateOn: 'blur' }],
      diagnosisCode8: ['', { validators: [Validators.minLength(5)], updateOn: 'blur' }],
      diagnosisCode9: ['', { validators: [Validators.minLength(5)], updateOn: 'blur' }],
      diagnosisCode10: ['', { validators: [Validators.minLength(5)], updateOn: 'blur' }]
    });
    this.dependentList = this.authService.getDependentsList();
    if (this.memberInfo) {
      this.hasDependents = this.memberInfo.hasDependents && this.dependentList && !!this.dependentList.dependents.length;
    }
    // this.generatePatientAndProviderList();

    this.refinedProviderList.push((new ProviderListItemModel()).setLabel('Other').setValue('Other'));
    // this.providerList = [
    //   {
    //     label: 'Other',
    //     value: RequestEstimateConstants.OTHER,
    //     fullName: '',
    //     phoneNumber: ''
    //   }
    // ];
    this.profile = this.profileService.getProfile();
    this.defaultProfile();
    this.defaultTooltipState();
    // this.rawFormFromStorage = sessionStorage.getItem('requestEstimate.form');
    if (this.rawFormFromStorage && JSON.parse(this.rawFormFromStorage)['useridin'] === this.authService.useridin) {
      const rawData = JSON.parse(this.rawFormFromStorage);
      this.isEligible = rawData['isEligible'];
      this.isFacility = rawData['isFacility'];
      this.isNPI = rawData['isNPI'];
      this.isProcedureCode = rawData['isProcedureCode'];
      this.requestEstimateForm.patchValue(rawData);
      this.eligibilityChanged({});
      this.deliveryOptionChanged({});
      this.facilityIndicatorChanged({});
      this.patientChanged(null, true);
      this.npiIndicatorChanged({});
      this.procedureCodeIndicatorChanged({});
    } else {
      this.patientChanged();
    }
  }

  ngOnInit() {

    this.estimateDataToSubmit.useridin = this.authService.useridin;
    this.addValueChangeEventForProcedureAndDiagnosisCode();
    this.DiagnosisCodedrupalTargetUrl = this.constants.drupalDedCoDiagnosisCodeUrl;
    this.faclityNPIdrupalTargetUrl = this.constants.drupalDedCofaclityNPIUrl;
    this.serviceProviderNPIdrupalTargetUrl = this.constants.drupalDedCoserviceProviderNPItUrl;
    this.getTooltipData();
  }

  getTooltipData() {
    this.fpocontentService.fetchContent(this.constants.drupalDedCoDiagnosisCodeUrl).subscribe((response) => {
      this.DiagnosisCodedrupalTargetUrlData = response;
    });
    this.fpocontentService.fetchContent(this.constants.drupalDedCofaclityNPIUrl).subscribe((response) => {
      this.faclityNPIdrupalTargetUrlData = response;
    });
    this.fpocontentService.fetchContent(this.constants.drupalDedCoserviceProviderNPItUrl).subscribe((response) => {
      this.serviceProviderNPIdrupalTargetUrlData = response;
    });
  }

  ngOnDestroy() {
    // if (!this.submitAction) {
    //   const rawData = this.requestEstimateForm.getRawValue();
    //   rawData['isEligible'] = this.isEligible;
    //   rawData['isFacility'] = this.isFacility;
    //   rawData['isNPI'] = this.isNPI;
    //   rawData['isProcedureCode'] = this.isProcedureCode;
    //   rawData['useridin'] = this.authService.useridin;
    //   sessionStorage.setItem('requestEstimate.form', JSON.stringify(rawData));
    // } else {
    //   sessionStorage.removeItem('requestEstimate.form');
    // }
    this.alertService.clearError('estimate-form-scope');
  }

  getSubscriberPatientListItem(): PatientListModelInterface {
    const subscriber: PatientListModelInterface = new PatientListModel();
    subscriber.isSubscriber = true;
    subscriber.subscriber = Object.assign({}, this.memberInfo);
    subscriber.name = (this.memberInfo && (this.memberInfo.memFirstName || this.memberInfo.memLastName))
      ? `${this.memberInfo.memFirstName} ${this.memberInfo.memLastName}` : '';
    return subscriber;
  }

  generatePatientAndProviderList() {
    const patientList = [];
    // let providerCounter = 0;
    // patientList.push({
    //   label: this.memberInfo.fullName + ' (' + this.memberInfo.relationship + ')',
    //   value: this.memberInfo.fullName
    // });

    patientList.push(this.getSubscriberPatientListItem());
    this.requestEstimateForm.get('patient').setValue(patientList[0].name);
    // ++providerCounter;
    this.providerTempList = [];
    // this.providerTempList.push(
    //   {
    //     label: 'Healthcare Provider ' + providerCounter,
    //     value: 'Healthcare Provider ' + providerCounter,
    //     fullName: 'Healthcare Provider ' + providerCounter,
    //     phoneNumber: '345-345-1234',
    //     mem_name: this.memberInfo.fullName
    //   }
    // );

    if (this.dependentList && this.dependentList.dependents) {
      const interimDependents: DependentInterimModelInterface[] = this.dependentList.dependents;
      for (let i = 0; i < interimDependents.length; i++) {
        const currDependent: DependentModelInterface = interimDependents[i].dependent;
        if (currDependent.relationship.toLowerCase().indexOf('spouse') < 0 &&
          currDependent.relationship.toLowerCase().indexOf('partner') < 0) {

          const currMemName = `${currDependent.firstName} ${currDependent.lastName}`;

          patientList.push({
            label: `${currMemName} (${currDependent.relationship})`,
            value: currMemName
          });
          // ++providerCounter;
          // this.providerTempList.push(
          //   {
          //     label: 'Healthcare Provider ' + providerCounter,
          //     value: 'Healthcare Provider ' + providerCounter,
          //     fullName: 'Healthcare Provider ' + providerCounter,
          //     phoneNumber: '345-345-1234',
          //     mem_name: currMemName
          //   }
          // );
        }
      }
    }
    this.patientList = patientList;
  }

  defaultProvider(): void {
    this.requestEstimateForm.controls['provider'].setValue('');
    this.providerChanged();
  }

  defaultProfile(): void {
    if (this.profile) {
      this.patchProfileInfo();
      this.providerChanged();
    } else {
      this.fetchProfileInfo();
    }
  }

  fetchProfileInfo() {
    this.profileService.fetchProfileInfo().subscribe(profile => {
      this.profile = profile;
      this.patchProfileInfo();
      this.providerChanged();
      this.profileService.setProfile(this.profile);
    });
  }

  patchProfileInfo(): void {
    this.requestEstimateForm.patchValue({
      contactPhoneNumber: this.validationService.formatPhone(this.profile.phoneNumber), // mobileNumber),
      deliveryFormGroup: {
        deliveryEmail: this.profile.emailAddress,
        deliveryAddress1: this.profile.address1, // address,
        deliveryAddress2: this.profile.address2,
        deliveryState: this.profile.state,
        deliveryCity: this.profile.city,
        deliveryZipCode: this.profile.zip,
        deliveryOption: ''
      }
    });
  }

  eligibilityChanged(event: MatRadioChange | Object): void {
    switch (this.requestEstimateForm.controls['estimateEligibility'].value) {
      case RequestEstimateConstants.YES:
        this.requestEstimateForm.get('facilityFormGroup').get('facilityIndicator').setValue(this.requestEstimateConstants['NO']);
        this.requestEstimateForm.get('npiIndicator').setValue(this.requestEstimateConstants['NO']);
        this.requestEstimateForm.get('procedureCodeIndicator').setValue(this.requestEstimateConstants['NO']);
        this.basicMemInfo = this.route.snapshot.data.memberInfo instanceof Array ?
          this.route.snapshot.data.memberInfo[0] : this.route.snapshot.data.memberInfo;
        this.patientList = [];
        this.patientList.push(this.getSubscriberPatientListItem());
        this.requestEstimateService.getRecentVisits().subscribe(recentVisits => {
          this.recentVisits = <GetRecentVisitsResponseModelInterface>recentVisits;
          this.requestEstimateForm.get('patient').setValue(this.patientList[0].name);
          this.setProviderListForSubscriber();
        });
        const dependentsData = this.route.snapshot.data.memberInfo[1];
        // tslint:disable-next-line:max-line-length
        if (this.basicMemInfo && this.basicMemInfo.rxSummary && this.basicMemInfo.rxSummary.hasDependents && dependentsData && dependentsData.dependents) {
          this.dependentsData = <DependentsResponseModelInterface>dependentsData;
          this.dependentsData.dependents.map(currDependent => {
            const dependentPatient: PatientListModelInterface = new PatientListModel();
            dependentPatient.dependant = Object.assign({}, currDependent);
            dependentPatient.name = `${currDependent.dependent.firstName} ${currDependent.dependent.lastName}`;
            this.patientList.push(dependentPatient);
          });
        }

        this.requestEstimateService.getRequestEstimate().subscribe(requestEstimateData => {
          this.requestEstimateData = <GetRequestEstimateDetailsResponseModelInterface>requestEstimateData;

          this.estimateDataToSubmit.submitterAddress1 = this.requestEstimateData.address1;
          this.estimateDataToSubmit.submitterAddress2 = this.requestEstimateData.address2;
          this.estimateDataToSubmit.submitterCity = this.requestEstimateData.city;
          this.estimateDataToSubmit.submitterEmailAddress = this.requestEstimateData.emailAddress;
          this.estimateDataToSubmit.isEmployee = this.requestEstimateData.isEmployee;
          this.estimateDataToSubmit.submitterPhoneNumber = this.requestEstimateData.phoneNumber;
          this.estimateDataToSubmit.submitterState = this.requestEstimateData.state;
          this.estimateDataToSubmit.subscriberId = this.requestEstimateData.subscriberId;
          this.estimateDataToSubmit.submitterZip = this.requestEstimateData.zip;
        });

        this.alertService.clearError('eligibility-scope');
        this.isEligible = true;
        break;

      case RequestEstimateConstants.NO:
        this.alertService.setAlert(RequestEstimateConstants.NON_ELIGIBLE_MSG, RequestEstimateConstants.SORRY,
          AlertType.Failure, 'eligibility-scope');
        this.alertService.clearError('estimate-form-scope');
        this.requestEstimateForm.controls['providerName'].reset();
        this.requestEstimateForm.controls['providerPhoneNumber'].reset();
        this.isEligible = false;
        break;
    }
  }

  deliveryOptionChanged(event: MatRadioChange | Object): void {
    switch (this.requestEstimateForm.get('deliveryFormGroup').get('deliveryOption').value) {
      case RequestEstimateConstants.EMAIL:
        this.removeReadonlyPropFromControls(['deliveryEmail'], 'deliveryFormGroup');
        this.addReadonlyPropToControls(['deliveryAddress1', 'deliveryAddress2', 'deliveryZipCode'], 'deliveryFormGroup');
        this.requestEstimateForm.get('deliveryFormGroup').get('deliveryEmail').setValidators([Validators.required,
        this.validationService.emailValidator()]);
        this.requestEstimateForm.get('deliveryFormGroup').get('deliveryAddress1').clearValidators();
        this.requestEstimateForm.get('deliveryFormGroup').get('deliveryZipCode').clearValidators();
        break;
      case RequestEstimateConstants.MAIL:
        this.removeReadonlyPropFromControls(['deliveryAddress1', 'deliveryAddress2', 'deliveryZipCode'], 'deliveryFormGroup');
        this.addReadonlyPropToControls(['deliveryEmail'], 'deliveryFormGroup');
        this.requestEstimateForm.get('deliveryFormGroup').get('deliveryAddress1').setValidators([Validators.required]);
        this.requestEstimateForm.get('deliveryFormGroup').get('deliveryZipCode').setValidators([Validators.required,
        Validators.minLength(5)]);
        this.requestEstimateForm.get('deliveryFormGroup').get('deliveryEmail').clearValidators();
        break;
    }
    this.requestEstimateForm.get('deliveryFormGroup').get('deliveryAddress1').updateValueAndValidity();
    this.requestEstimateForm.get('deliveryFormGroup').get('deliveryZipCode').updateValueAndValidity();
    this.requestEstimateForm.get('deliveryFormGroup').get('deliveryEmail').updateValueAndValidity();
  }

  getPatientListItem(selectedPatient) {
    return this.patientList.find((patient) => patient.name === selectedPatient);
  }

  setProviderListForSubscriber() {
    this.refinedProviderList = [];
    this.providerList = [];
    if (this.recentVisits && this.recentVisits.recentVisits && this.recentVisits.recentVisits.length > 0) {
      this.recentVisits.recentVisits.map(visitItem => {
        const providerListItem: ProviderListItemModelInterface = new ProviderListItemModel();
        providerListItem.setLabel(visitItem.providerName).setValue(visitItem.providerName);
        this.refinedProviderList.push(providerListItem);
        this.providerList.push(visitItem);
      });
    }
    this.refinedProviderList.push((new ProviderListItemModel()).setLabel('Other').setValue('Other'));
  }

  patientChanged(event?, dontClearProvider?: boolean): void {
    this.refinedProviderList = [];
    this.providerList = [];
    const selectedPatient: PatientListModel = event ? this.getPatientListItem(event.value) : null;

    if (!selectedPatient || selectedPatient.isSubscriber) {
      this.setProviderListForSubscriber();
    } else {
      this.requestEstimateService.getDependentRecentVisits(selectedPatient.dependant).subscribe(dependentRecentVisits => {
        if (dependentRecentVisits && dependentRecentVisits.result && dependentRecentVisits.result === -1) {
          this.dependentRecentVisits = null;
          this.refinedProviderList.push((new ProviderListItemModel()).setLabel('Other').setValue('Other'));
        } else {
          this.dependentRecentVisits = <GetDependentRecentVisitsResponseModel>dependentRecentVisits;
          if (this.dependentRecentVisits && this.dependentRecentVisits.recentVisits) {
            this.dependentRecentVisits.recentVisits.map(visitItem => {
              const providerListItem: ProviderListItemModelInterface = new ProviderListItemModel();
              providerListItem.setLabel(visitItem.providerName).setValue(visitItem.providerName);
              this.refinedProviderList.push(providerListItem);
              this.providerList.push(visitItem);
            });
          }
          this.refinedProviderList.push((new ProviderListItemModel()).setLabel('Other').setValue('Other'));
        }
      });

      if (selectedPatient) {
        if (selectedPatient.isSubscriber) {
          this.estimateDataToSubmit.patientName = selectedPatient.name; // have to check - kalagi01
        } else {
          this.estimateDataToSubmit.patientName = selectedPatient.name; // have to check - kalagi01
        }
      }
    }

    // for (let i = 0; i < this.providerTempList.length; i++) {
    //   if (this.requestEstimateForm.controls['patient'].value === this.providerTempList[i].mem_name) {
    //     this.providerList.push(this.providerTempList[i]);
    //   }
    // }


    if (!dontClearProvider) {
      this.requestEstimateForm.controls['provider'].setValue('');
    }
    // this.providerList = this.providerList.slice(0);
    this.providerChanged();
  }

  getSelectedProvider(selectedProviderName: string): VisitsResponseInterface {
    return this.providerList.find((provider) => provider.providerName === selectedProviderName);
  }

  providerChanged(): void {
    const selectedProviderName = this.requestEstimateForm.controls['provider'].value;
    if (selectedProviderName) {
      const providerFound = this.getSelectedProvider(selectedProviderName);
      if (providerFound) {
        this.requestEstimateForm.controls['providerName'].setValue(providerFound['providerName']);
        this.requestEstimateForm.controls['providerPhoneNumber'].setValue(providerFound['providerPhone']);
      }
      if (selectedProviderName === RequestEstimateConstants.OTHER) {
        this.clearProviderNameandNumber();
      } else {
        this.addReadonlyPropToControls(['providerName', 'providerPhoneNumber']);
      }
    } else {
      this.clearProviderNameandNumber();
    }
  }

  clearProviderNameandNumber() {
    this.requestEstimateForm.controls['providerName'].setValue('');
    this.requestEstimateForm.controls['providerPhoneNumber'].setValue('');
    this.removeReadonlyPropFromControls(['providerName', 'providerPhoneNumber']);
  }

  // M30-2590 defect fix changes
  facilityIndicatorChanged(event: MatRadioChange | Object): void {
    switch (this.requestEstimateForm.get('facilityFormGroup').get('facilityIndicator').value) {
      case RequestEstimateConstants.YES:
        this.isFacility = true;
        this.requestEstimateForm.get('facilityFormGroup').get('facilityName').setValidators([Validators.required]);
        this.requestEstimateForm.get('facilityFormGroup').get('facilityAddress').setValidators([Validators.required]);
        this.requestEstimateForm.get('facilityFormGroup').get('facilityCity').setValidators([Validators.required]);
        this.requestEstimateForm.get('facilityFormGroup').get('facilityPhoneNumber').setValidators([Validators.required,
        this.validationService.mobileValidator(), this.validationService.phoneValidator()]);
        this.requestEstimateForm.get('facilityFormGroup').get('facilityZipCode').setValidators([Validators.required,
        Validators.minLength(5)]);
        break;
      case RequestEstimateConstants.NO:
        this.isFacility = false;
        this.requestEstimateForm.get('facilityFormGroup').get('facilityName').clearValidators();
        this.requestEstimateForm.get('facilityFormGroup').get('facilityAddress').clearValidators();
        this.requestEstimateForm.get('facilityFormGroup').get('facilityPhoneNumber').clearValidators();
        this.requestEstimateForm.get('facilityFormGroup').get('facilityCity').clearValidators();
        this.requestEstimateForm.get('facilityFormGroup').get('facilityZipCode').clearValidators();
        this.requestEstimateForm.get('facilityFormGroup').get('facilityName').reset();
        this.requestEstimateForm.get('facilityFormGroup').get('facilityAddress').reset();
        this.requestEstimateForm.get('facilityFormGroup').get('facilityPhoneNumber').reset();
        this.requestEstimateForm.get('facilityFormGroup').get('facilityCity').reset();
        this.requestEstimateForm.get('facilityFormGroup').get('facilityZipCode').reset();
        break;
    }
    this.requestEstimateForm.get('facilityFormGroup').get('facilityName').updateValueAndValidity();
    this.requestEstimateForm.get('facilityFormGroup').get('facilityAddress').updateValueAndValidity();
    this.requestEstimateForm.get('facilityFormGroup').get('facilityPhoneNumber').updateValueAndValidity();
    this.requestEstimateForm.get('facilityFormGroup').get('facilityZipCode').updateValueAndValidity();
  }

  // M30-2590 defect fix changes
  npiIndicatorChanged(event: MatRadioChange | Object): void {
    switch (this.requestEstimateForm.controls['npiIndicator'].value) {
      case RequestEstimateConstants.YES:
        this.isNPI = true;
        this.requestEstimateForm.get('facilityNPI').setValidators([Validators.required]);
        this.requestEstimateForm.get('providerNPI').setValidators([Validators.required]);
        break;
      case RequestEstimateConstants.NO:
        this.isNPI = false;
        this.requestEstimateForm.get('facilityNPI').reset();
        this.requestEstimateForm.get('providerNPI').reset();
        this.requestEstimateForm.get('facilityNPI').clearValidators();
        this.requestEstimateForm.get('providerNPI').clearValidators();
        break;
    }
    this.requestEstimateForm.get('facilityNPI').updateValueAndValidity();
    this.requestEstimateForm.get('providerNPI').updateValueAndValidity();
    // switch (this.requestEstimateForm.controls['npiIndicator'].value) {
    //   case RequestEstimateConstants.YES:
    //     this.isNPI = true;
    //     break;
    //   case RequestEstimateConstants.NO:
    //     this.isNPI = false;
    //     break;
    // }
  }

  procedureCodeIndicatorChanged(event: MatRadioChange | Object): void {
    switch (this.requestEstimateForm.controls['procedureCodeIndicator'].value) {
      case RequestEstimateConstants.YES:
        this.isProcedureCode = true;
        if (this.requestEstimateForm.controls['procedureCode1']) {
          this.requestEstimateForm.get('procedureCode1').setValidators([Validators.required]);
          this.requestEstimateForm.get('diagnosisCode1').setValidators([Validators.required]);
        }
        break;
      case RequestEstimateConstants.NO:
        this.isProcedureCode = false;
        this.resetProcedureAndDiagnosisCode();

        break;
    }
    this.requestEstimateForm.get('procedureCode1').updateValueAndValidity();
    this.requestEstimateForm.get('diagnosisCode1').updateValueAndValidity();
  }

  resetProcedureAndDiagnosisCode() {
    for (let i = 1; i <= 10; i++) {
      this.requestEstimateForm.controls['procedureCode' + i].setValue('');
      this.requestEstimateForm.controls['diagnosisCode' + i].setValue('');
      this.requestEstimateForm.controls['procedureCode' + i].reset();
      this.requestEstimateForm.controls['diagnosisCode' + i].reset('');
      this.requestEstimateForm.controls['procedureCode' + i].clearValidators();
      this.requestEstimateForm.controls['diagnosisCode' + i].clearValidators();
    }
  }

  addValueChangeEventForProcedureAndDiagnosisCode() {
    for (let i = 1; i <= 10; i++) {
      this.requestEstimateForm.controls['procedureCode' + i].valueChanges.subscribe((procedureCode) => {
        this.validateProcAndDiagCombination(i, true);
      });
      this.requestEstimateForm.controls['diagnosisCode' + i].valueChanges.subscribe((diagnosisCode) => {
        this.validateProcAndDiagCombination(i, false);
      });
    }
  }

  validateProcAndDiagCombination(index, isProcedureCode) {
    const procedureCode = this.requestEstimateForm.controls['procedureCode' + index].value;
    const diagnosisCode = this.requestEstimateForm.controls['diagnosisCode' + index].value;
    if (procedureCode && diagnosisCode) {
      const combinedValue = procedureCode + diagnosisCode;
      if (!this.checkProcAndDiagCombinationExits(index, combinedValue)) {
        this.procedureAndDiagnosisCodeList[index] = combinedValue;
        this.requestEstimateForm.get('procedureCode' + index).clearValidators();
        this.requestEstimateForm.get('diagnosisCode' + index).clearValidators();
        this.requestEstimateForm.get('procedureCode' + index).setValidators([Validators.minLength(5)]);
        this.requestEstimateForm.get('diagnosisCode' + index).setValidators([Validators.minLength(5)]);
        this.validationService.clearErrorInControl(this.requestEstimateForm.get('procedureCode' + index), 'duplicateCombination');
        this.validationService.clearErrorInControl(this.requestEstimateForm.get('diagnosisCode' + index), 'duplicateCombination');
      } else {
        console.error('error');
        const controlId = isProcedureCode ? 'procedureCode' + index : 'diagnosisCode' + index;
        this.requestEstimateForm.get('procedureCode' + index).clearValidators();
        this.requestEstimateForm.get('diagnosisCode' + index).clearValidators();
        this.requestEstimateForm.get(controlId).setValidators([Validators.minLength(5),
        this.validationService.duplicateProcedureAndDiagnosisCodeValidator()]);
        this.requestEstimateForm.get(controlId).setErrors({ duplicateCombination: { value: true } })
      }
    }
  }

  checkProcAndDiagCombinationExits(index, value) {
    if (this.procedureAndDiagnosisCodeList) {
      for (const key in this.procedureAndDiagnosisCodeList) {
        if (key != index && this.procedureAndDiagnosisCodeList[key] === value) {
          return true
        }
      }
    }
    return false;
  }

  addProcedure(event: any): void {
    if (event) {
      event.preventDefault();
    }
    ++this.procedureDiagnosisCounter;
    this.procedureDiagnosisArray.push({
      index: this.procedureDiagnosisCounter,
      procedureId: 'procedureCode' + this.procedureDiagnosisCounter,
      procedureControl: this.requestEstimateForm.controls['procedureCode' + this.procedureDiagnosisCounter],
      diagnosisId: 'diagnosisCode' + this.procedureDiagnosisCounter,
      diagnosisControl: this.requestEstimateForm.controls['diagnosisCode' + this.procedureDiagnosisCounter]
    });
    this.procedureDiagnosisArray = this.procedureDiagnosisArray.slice(0);
  }

  deliveryZipCodeChange($event): void {
    if (this.requestEstimateForm.get('deliveryFormGroup').get('deliveryZipCode').valid) {
      this.requestEstimateForm.get('deliveryFormGroup').get('deliveryCity').setValue('Boston');
    } else {
      this.requestEstimateForm.get('deliveryFormGroup').get('deliveryCity').setValue('');
    }
  }

  facilityZipCodeChange($event): void {
    if (this.requestEstimateForm.get('facilityFormGroup').get('facilityZipCode').valid) {
      this.requestEstimateForm.get('facilityFormGroup').get('facilityCity').setValue('Boston');
    } else {
      this.requestEstimateForm.get('facilityFormGroup').get('facilityCity').setValue('');
    }
  }

  onSubmit(): void {
    this.alertService.clearError('estimate-form-scope');
    this.validateForm();
    if (this.requestEstimateForm.valid) {
      this.submitAction = true;

      if (this.basicMemInfo.rxSummary && (this.basicMemInfo.rxSummary.memFirstName || this.basicMemInfo.rxSummary.memLastName
        || this.basicMemInfo.rxSummary.memMiddleInitial)) {
        this.estimateDataToSubmit.submitterFullName = (this.basicMemInfo.rxSummary.memFirstName + ' ')
          + (this.basicMemInfo.rxSummary.memMiddleInitial ? this.basicMemInfo.rxSummary.memMiddleInitial + ' ' : '')
          + (this.basicMemInfo.rxSummary.memLastName);
      }
      // tslint:disable-next-line:max-line-length
      this.estimateDataToSubmit.patientName = this.requestEstimateForm.get('patient').value;
      if (this.requestEstimateForm.get('deliveryFormGroup') && this.requestEstimateForm.get('deliveryFormGroup')['controls']) {
        // "EMAIL" | "MAIL";
        // tslint:disable-next-line:max-line-length
        this.estimateDataToSubmit.deliveryPreference = this.requestEstimateForm.get('deliveryFormGroup').get('deliveryOption').value;
      }
      if (this.requestEstimateForm.get('deliveryFormGroup') && this.requestEstimateForm.get('deliveryFormGroup')['controls']) {
        this.estimateDataToSubmit.submitterEmailAddress = this.requestEstimateForm.get('deliveryFormGroup').get('deliveryEmail').value;
        this.estimateDataToSubmit.submitterAddress1 = this.requestEstimateForm.get('deliveryFormGroup').get('deliveryAddress1').value;
        this.estimateDataToSubmit.submitterAddress2 = this.requestEstimateForm.get('deliveryFormGroup').get('deliveryAddress2').value;
        this.estimateDataToSubmit.submitterState = this.requestEstimateForm.get('deliveryFormGroup').get('deliveryState').value;
        this.estimateDataToSubmit.submitterCity = this.requestEstimateForm.get('deliveryFormGroup').get('deliveryCity').value;
        this.estimateDataToSubmit.submitterZip = this.requestEstimateForm.get('deliveryFormGroup').get('deliveryZipCode').value;
      }
      if (this.requestEstimateForm.get('facilityFormGroup') && this.requestEstimateForm.get('facilityFormGroup')['controls']) {
        this.estimateDataToSubmit.facilityName = this.requestEstimateForm.get('facilityFormGroup').get('facilityName').value;
        // tslint:disable-next-line:max-line-length
        this.estimateDataToSubmit.facilityPhoneNumber = this.requestEstimateForm.get('facilityFormGroup').get('facilityPhoneNumber').value;
        this.estimateDataToSubmit.facilityAddress = this.requestEstimateForm.get('facilityFormGroup').get('facilityAddress').value;
        this.estimateDataToSubmit.facilityCity = this.requestEstimateForm.get('facilityFormGroup').get('facilityCity').value;
        this.estimateDataToSubmit.facilityState = this.requestEstimateForm.get('facilityFormGroup').get('facilityState').value;  // 'MA';
        this.estimateDataToSubmit.facilityZip = this.requestEstimateForm.get('facilityFormGroup').get('facilityZipCode').value;
        // tslint:disable-next-line:max-line-length
        this.estimateDataToSubmit.facilityServiceAvailable = this.requestEstimateForm.get('facilityFormGroup').get('facilityIndicator').value;
      }
      this.estimateDataToSubmit.specialFormat = [];
      if (this.requestEstimateForm.get('materialRequirements')) {
        this.estimateDataToSubmit.specialFormat = this.requestEstimateForm.get('materialRequirements').value.split(',')
          .map(matReq => matReq.trim());
      }

      if (this.requestEstimateForm.controls) {
        this.estimateDataToSubmit.submitterPhoneNumber = this.requestEstimateForm.controls['contactPhoneNumber'].value;
        this.estimateDataToSubmit.providerAndOrFacilityNPIAvailable = this.requestEstimateForm.controls['npiIndicator'].value;
        this.estimateDataToSubmit.procedureDescription = this.requestEstimateForm.controls['materialProcedureDesc'].value;
        this.estimateDataToSubmit.procedureAndDiagnosisCodesAvailable = this.requestEstimateForm.controls['procedureCodeIndicator'].value;

        this.estimateDataToSubmit.providerName = this.requestEstimateForm.controls['providerName'].value;
        this.estimateDataToSubmit.facilityNPI = this.requestEstimateForm.controls['facilityNPI'].value;
        this.estimateDataToSubmit.providerNPI = this.requestEstimateForm.controls['providerNPI'].value;
        this.estimateDataToSubmit.providerPhoneNumber = this.requestEstimateForm.controls['providerPhoneNumber'].value;
        if (this.requestEstimateForm.controls['procedureCode1']) {
          this.estimateDataToSubmit.procedureCode1 = this.requestEstimateForm.controls['procedureCode1'].value;
          this.estimateDataToSubmit.diagnosisCode1 = this.requestEstimateForm.controls['diagnosisCode1'].value;
        }
        if (this.requestEstimateForm.controls['procedureCode2']) {
          this.estimateDataToSubmit.procedureCode2 = this.requestEstimateForm.controls['procedureCode2'].value;
          this.estimateDataToSubmit.diagnosisCode2 = this.requestEstimateForm.controls['diagnosisCode2'].value;
        }
        if (this.requestEstimateForm.controls['procedureCode3']) {
          this.estimateDataToSubmit.procedureCode3 = this.requestEstimateForm.controls['procedureCode3'].value;
          this.estimateDataToSubmit.diagnosisCode3 = this.requestEstimateForm.controls['diagnosisCode3'].value;
        }
        if (this.requestEstimateForm.controls['procedureCode4']) {
          this.estimateDataToSubmit.procedureCode4 = this.requestEstimateForm.controls['procedureCode4'].value;
          this.estimateDataToSubmit.diagnosisCode4 = this.requestEstimateForm.controls['diagnosisCode4'].value;
        }
        if (this.requestEstimateForm.controls['procedureCode5']) {
          this.estimateDataToSubmit.procedureCode5 = this.requestEstimateForm.controls['procedureCode5'].value;
          this.estimateDataToSubmit.diagnosisCode5 = this.requestEstimateForm.controls['diagnosisCode5'].value;
        }
        if (this.requestEstimateForm.controls['procedureCode6']) {
          this.estimateDataToSubmit.procedureCode6 = this.requestEstimateForm.controls['procedureCode6'].value;
          this.estimateDataToSubmit.diagnosisCode6 = this.requestEstimateForm.controls['diagnosisCode6'].value;
        }
        if (this.requestEstimateForm.controls['procedureCode7']) {
          this.estimateDataToSubmit.procedureCode7 = this.requestEstimateForm.controls['procedureCode7'].value;
          this.estimateDataToSubmit.diagnosisCode7 = this.requestEstimateForm.controls['diagnosisCode7'].value;
        }
        if (this.requestEstimateForm.controls['procedureCode8']) {
          this.estimateDataToSubmit.procedureCode8 = this.requestEstimateForm.controls['procedureCode8'].value;
          this.estimateDataToSubmit.diagnosisCode8 = this.requestEstimateForm.controls['diagnosisCode8'].value;
        }
        if (this.requestEstimateForm.controls['procedureCode9']) {
          this.estimateDataToSubmit.procedureCode9 = this.requestEstimateForm.controls['procedureCode9'].value;
          this.estimateDataToSubmit.diagnosisCode9 = this.requestEstimateForm.controls['diagnosisCode9'].value;
        }
        if (this.requestEstimateForm.controls['procedureCode10']) {
          this.estimateDataToSubmit.procedureCode10 = this.requestEstimateForm.controls['procedureCode10'].value;
          this.estimateDataToSubmit.diagnosisCode10 = this.requestEstimateForm.controls['diagnosisCode10'].value;
        }
      }

      this.requestEstimateService.submitrequestestimatedetails(this.estimateDataToSubmit).subscribe(response => {
        this.router.navigate(['/request-estimate/success']);
      });
    } else {
      this.alertService.setAlert(RequestEstimateConstants.REQUIRED_FIELD_MSG,
        RequestEstimateConstants.ERROR, AlertType.Failure, 'estimate-form-scope');
      window.scrollTo(0, 250);
    }
  }

  cancel(): void {
    this.isEligible = false;
    this.isFacility = false;
    this.isNPI = false;
    this.isProcedureCode = false;
    this.procedureDiagnosisCounter = 1;
    this.procedureDiagnosisArray = [];
    this.alertService.clearError('estimate-form-scope');
    this.alertService.clearError('eligibility-scope');
    this.defaultTooltipState();
    this.requestEstimateForm.reset();
    // this.generatePatientAndProviderList();
    this.defaultProvider();
    this.defaultProfile();
  }

  cancelClick(event: Event): void {
    this.cancel();
  }

  removeReadonlyPropFromControls(controls: Array<string>, formGroup?: string): void {
    if (formGroup) {
      switch (formGroup) {
        case 'deliveryFormGroup':
          for (let i = 0; i < controls.length; i++) {
            this.requestEstimateForm.get('deliveryFormGroup')['controls'][controls[i]]['readonly'] = false;
          }
          break;
        case 'facilityFormGroup':
          for (let i = 0; i < controls.length; i++) {
            this.requestEstimateForm.get('facilityFormGroup')['controls'][controls[i]]['readonly'] = false;
          }
          break;
      }
    } else {
      for (let i = 0; i < controls.length; i++) {
        this.requestEstimateForm.controls[controls[i]]['readonly'] = false;
      }
    }
  }

  addReadonlyPropToControls(controls: Array<string>, formGroup?: string): void {
    if (formGroup) {
      switch (formGroup) {
        case 'deliveryFormGroup':
          for (let i = 0; i < controls.length; i++) {
            this.requestEstimateForm.get('deliveryFormGroup')['controls'][controls[i]]['readonly'] = true;
          }
          break;
        case 'facilityFormGroup':
          for (let i = 0; i < controls.length; i++) {
            this.requestEstimateForm.get('facilityFormGroup')['controls'][controls[i]]['readonly'] = true;
          }
          break;
      }
    } else {
      for (let i = 0; i < controls.length; i++) {
        this.requestEstimateForm.controls[controls[i]]['readonly'] = true;
      }
    }
  }

  validateForm(): void {
    for (const i in this.requestEstimateForm.controls) {
      if (this.requestEstimateForm.controls.hasOwnProperty(i)) {
        this.requestEstimateForm.controls[i].markAsDirty();
        this.requestEstimateForm.controls[i].markAsTouched();
        if (!this.requestEstimateForm.controls[i].enabled) {
          this.requestEstimateForm.controls[i].clearValidators();
        }
        this.requestEstimateForm.controls[i].updateValueAndValidity();
      }
    }
    if (this.isFacility) {
      this.requestEstimateForm.get('facilityFormGroup').get('facilityName').markAsDirty();
      this.requestEstimateForm.get('facilityFormGroup').get('facilityAddress').markAsDirty();
      this.requestEstimateForm.get('facilityFormGroup').get('facilityPhoneNumber').markAsDirty();
      this.requestEstimateForm.get('facilityFormGroup').get('facilityZipCode').markAsDirty();
      this.requestEstimateForm.get('facilityFormGroup').get('facilityName').markAsTouched();
      this.requestEstimateForm.get('facilityFormGroup').get('facilityAddress').markAsTouched();
      this.requestEstimateForm.get('facilityFormGroup').get('facilityPhoneNumber').markAsTouched();
      this.requestEstimateForm.get('facilityFormGroup').get('facilityZipCode').markAsTouched();
    }
    this.requestEstimateForm.get('deliveryFormGroup').get('deliveryOption').markAsDirty();
    this.requestEstimateForm.get('deliveryFormGroup').get('deliveryOption').markAsTouched();
    switch (this.requestEstimateForm.get('deliveryFormGroup').get('deliveryOption').value) {
      case RequestEstimateConstants.EMAIL:
        this.requestEstimateForm.get('deliveryFormGroup').get('deliveryEmail').markAsDirty();
        this.requestEstimateForm.get('deliveryFormGroup').get('deliveryEmail').markAsTouched();
        break;
      case RequestEstimateConstants.MAIL:
        this.requestEstimateForm.get('deliveryFormGroup').get('deliveryAddress1').markAsDirty();
        this.requestEstimateForm.get('deliveryFormGroup').get('deliveryAddress2').markAsDirty();
        this.requestEstimateForm.get('deliveryFormGroup').get('deliveryState').markAsDirty();
        this.requestEstimateForm.get('deliveryFormGroup').get('deliveryZipCode').markAsDirty();
        this.requestEstimateForm.get('deliveryFormGroup').get('deliveryAddress1').markAsTouched();
        this.requestEstimateForm.get('deliveryFormGroup').get('deliveryAddress2').markAsTouched();
        this.requestEstimateForm.get('deliveryFormGroup').get('deliveryState').markAsTouched();
        this.requestEstimateForm.get('deliveryFormGroup').get('deliveryZipCode').markAsTouched();
        break;
    }
    this.requestEstimateForm.updateValueAndValidity();
    console.log(this.requestEstimateForm);
  }

  defaultTooltipState(): void {
    this.tooltip = {
      providerNPIToolTipVisible: false,
      facilityNPIToolTipVisible: false,
      diagnosisCode1ToolTipVisible: false
    };
  }

  showToolTip(type: string) {
    switch (type) {
      case 'providerNPI':
        this.tooltip = Object.assign(this.tooltip, {
          providerNPIToolTipVisible: !this.tooltip['providerNPIToolTipVisible']
        });
        break;
      case 'facilityNPI':
        this.tooltip = Object.assign(this.tooltip, {
          facilityNPIToolTipVisible: !this.tooltip['facilityNPIToolTipVisible']
        });
        break;
      case 'diagnosisCode1':
        this.tooltip = Object.assign(this.tooltip, {
          diagnosisCode1ToolTipVisible: !this.tooltip['diagnosisCode1ToolTipVisible']
        });
        break;
    }
  }
  openSsoUrl(url) {
    if (url) {
      window.open(url, '_blank');
    }
  }
}
