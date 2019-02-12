import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { MyMedicationDetailsService } from './my-medication-details.service';
import { RxDetailsResponseModelInterface } from '../models/interfaces/rx-details-model.interface';
import { GetMemBasicInfoResponseModelInterface } from '../models/interfaces/get-member-basic-info-model.interface';
import { MedicationsService } from '../../../shared/services/medications/medications.service';
import { Router } from '@angular/router';
import { ConstantsService } from '../../../shared/shared.module';
import { AlertService } from '../../../shared/services/alert.service';
import { GetMemBasicInfoResponseModel, BasicMemInfoRxSummary } from '../models/get-member-basic-info.model';
import { DependantRelationShipType } from '../models/types/my-medication.types';
import { TitleCasePipe } from '@angular/common';

@Component({
  templateUrl: './myMedicationDetails.component.html',
  styleUrls: ['./myMedicationDetails.component.scss']
})
export class MyMedicationDetailsComponent implements OnInit, OnDestroy {
  public ismobile: any;
  mobileViewPort = 992;
  public medicationDetail: RxDetailsResponseModelInterface;
  public basicMemInfo: GetMemBasicInfoResponseModelInterface;
  public fpoTargetUrl = '';
    @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth <= this.mobileViewPort) {
      this.ismobile = true;
    } else {
      this.ismobile = false;
    }
  }

  constructor(private myMedicationDetailsService: MyMedicationDetailsService,
    private router: Router,
    private alertService: AlertService,
    private medicationsService: MedicationsService,
    private title: TitleCasePipe,
    private constantsService: ConstantsService) {
    this.fpoTargetUrl = this.constantsService.drupalTestUrl + '/page/mymedications-nomedications';
  }

  ngOnInit() {
    this.populateDetailsFromSessionStorageIfEmpty();

    if (window.innerWidth <= this.mobileViewPort) {
      this.ismobile = true;
    }

    const currentUserInfo = this.myMedicationDetailsService.getCurrentUserInfo();
    const medicationDetailsRequest = this.myMedicationDetailsService.getMyMedicationDetailsRequest();
    if (currentUserInfo.isDependentUser || (medicationDetailsRequest && medicationDetailsRequest.dependentId)) {

      const dependentMemInfo = currentUserInfo.dependentMemberInfo.split(' ');

      const basicMemInfoRx = new BasicMemInfoRxSummary();
      // basicMemInfoRx.hasDependents = false;
      // basicMemInfoRx.memFirstName = dependentMemInfo[0];
      // basicMemInfoRx.memMiddleInitial = dependentMemInfo[1];
      // basicMemInfoRx.memLastName = dependentMemInfo[2];
      // basicMemInfoRx.relationship = <DependantRelationShipType>dependentMemInfo[3].replace(/[\(\)]/g, '');

      basicMemInfoRx.fullName = dependentMemInfo.join(' ');

      this.basicMemInfo = new GetMemBasicInfoResponseModel();
      this.basicMemInfo.rxSummary = basicMemInfoRx;

    } else {
      this.medicationsService.getMemBasicInfo().subscribe(memBasicInfoResp => {
        this.basicMemInfo = memBasicInfoResp;
        if (this.basicMemInfo.rxSummary) {
          this.basicMemInfo.rxSummary.fullName = this.basicMemInfo.rxSummary.memMiddleInitial ?
            [this.title.transform(this.basicMemInfo.rxSummary.memFirstName), ' ',
              this.title.transform(this.basicMemInfo.rxSummary.memMiddleInitial), ' ',
              this.title.transform(this.basicMemInfo.rxSummary.memLastName), ' (',
              (this.title.transform(this.basicMemInfo.rxSummary.relationship)), ')'].join('') :
            [this.title.transform(this.basicMemInfo.rxSummary.memFirstName), ' ',
              this.title.transform(this.basicMemInfo.rxSummary.memLastName), ' (',
              (this.title.transform(this.basicMemInfo.rxSummary.relationship)), ')'].join('');
        }
      });
    }
    this.myMedicationDetailsService.getMedicationDetails().subscribe(medicationDetailResp => {
      this.medicationDetail = medicationDetailResp;
      if (medicationDetailsRequest.dependentId) {
        this.medicationDetail.rxDetails.dependentId = medicationDetailsRequest.dependentId.toString();
        console.log(this.medicationDetail.rxDetails.dependentId);
      }
      console.log(this.medicationDetail);

    });
  }

  ngOnDestroy() {
    this.alertService.clearError();
  }

  populateDetailsFromSessionStorageIfEmpty() {
    const medDetailsRequest = this.myMedicationDetailsService.getMyMedicationDetailsRequest();
    if (!medDetailsRequest) {
      const medDetails = sessionStorage.getItem('medicationDetailRequest');
      if (medDetails && medDetails !== 'null') {
        this.myMedicationDetailsService.setMyMedicationDetailsRequest(JSON.parse(medDetails));
        this.fetchDependentDetailsFromSession();
      } else {
        this.router.navigate(['/mymedications']);
      }
    }
  }

  fetchDependentDetailsFromSession() {
    const medicationDetailsRequest = this.myMedicationDetailsService.getMyMedicationDetailsRequest();
      if ((medicationDetailsRequest && medicationDetailsRequest.dependentId)) {
        const dependentDetails = sessionStorage.getItem('medicationDependentMemberInfo');
        if (dependentDetails) {
          this.myMedicationDetailsService.setCurrentUserInfo(true, JSON.parse(dependentDetails));
        }
      }
  }

  getDirections() {
    const location = this.medicationDetail.rxDetails.pharmacy;
    const address = [location.address, ', ', location.city, ', ', location.state, ' ', location.zip].join('');
    const geoLocation = 'http://maps.google.com/?q=' + encodeURI(address);
    // window.location.href = 'http://maps.google.com/?q=' + geoLocation;
    window.open(
      geoLocation,
      '_self'
    );
  }

  navigateToClaimDetails(item) {
    sessionStorage.setItem('claimId', item.claimNumber);
    this.router.navigate(['/myclaims/claimdetails']);
  }

  navigateToDoctorDetails(doctorInfo): void {
    sessionStorage.setItem('providerName', doctorInfo.prescribingDoctor);
    sessionStorage.setItem('providerNumber', doctorInfo.prescribingDoctorNumber);
    if (doctorInfo.dependentId) {
      sessionStorage.setItem('docDependentId', doctorInfo.dependentId);
    }
    this.router.navigate([`/mydoctors/details`]);
  }
}
