import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { FadDoctorProfileService } from './fad-doctor-profile.service';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
import { FadConstants } from '../constants/fad.constants';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
// import { FVProSRProfessionalInSearchEntity, FVProSRLocation, FVProSRAffilitatedHospital }
// from '../modals/fad-vitals-professionals-search-response.model';
import { CustomizedAddressInfoForDisplayInterface, LinkInterface } from '../modals/interfaces/fad-doctor-profile.interface';
import { CustomizedAddressInfoForDisplay, Link } from '../modals/fad-doctor-profile.modal';
import { StarRatingComponentConsumer } from '../modals/interfaces/fad.interface';
import { StarRatingComponentInputModelInterface } from '../../../shared/components/star-rating/star-rating.interface';
import { StarRatingComponentInputModel } from '../../../shared/components/star-rating/star-rating.model';
import { Router, ActivatedRoute } from '@angular/router';
import { FadProfessionalInterface } from '../modals/interfaces/getSearchByProfessional-models.interface';
import {
  FadDoctorProfileRequestModelInterface, FadProfessionalResponseModelInterface,
  FadLocationDetailsInterface,
  FadDoctorRatingsRequestModelInterface,
  FadDoctorRatingsResponseModelInterface
} from '../modals/interfaces/fad-doctor-profile-details.interface';
import {
  FadDoctorProfileRequestModel, FadProfessionalResponseModel, FadDoctorRatingsRequestModel,
  FadDoctorRatingsResponseModel
} from '../modals/fad-doctor-profile-details.model';
import { FadSearchResultsService } from '../fad-search-results/fad-search-results.service';
import { AlertService } from '../../../shared/shared.module';
import { AlertType } from '../../../shared/alerts/alertType.model';

@Component({
  selector: 'app-fad-doctor-profile',
  templateUrl: './fad-doctor-profile.component.html',
  styleUrls: ['./fad-doctor-profile.component.scss']
})
export class FadDoctorProfileComponent implements OnInit, OnDestroy, StarRatingComponentConsumer {

  public doctorProfile: any;
  public doctorName: string;
  public doctorDegree: string;
  public specialityNames: string = '';
  public identifiers = new Array();
  public languages = new Array();
  public certificates = new Array();
  public education = {};
  public awards = new Array();
  public doctorLocationsCustomizedAddressList: CustomizedAddressInfoForDisplayInterface[] = [];
  public hospitalAffiliationsList: any[] = []; // FVProSRAffilitatedHospital[] = [];  ***** temporary code change  DO NOT DELETE
  public doctorStarRating: StarRatingComponentInputModelInterface;
  public doctorsStarRating = new Array();
  public doctorReviews = new Array();
  public acceptedNetworks = new Array();
  public locationDetails = new Array();

  public pcpidVisibleFlag: boolean;
  public inNetworkFlag: boolean;
  public outOfNetworkFlag: boolean;
  public noNetworkSelectedFlag: boolean;
  public registeredUserFlag: boolean;
  public anonymousUserFlag: boolean;
  private specialityNamesList: string[] = [];
  public isDisplaySpinnerProfessional: boolean = false;
  public isShowProfessionalDetialsSection: boolean = false;
  private selectedLocationIndex: number = 0;
  public fadProfessionalResposeData: FadProfessionalResponseModelInterface;
  public selectedLocationDetails: FadLocationDetailsInterface;
  public startRating: StarRatingComponentInputModelInterface;
  public accordianToggleStatus: any = {};
  fadDoctorRatingsResponseData: FadDoctorRatingsResponseModelInterface;

  constructor(private doctorProfileService: FadDoctorProfileService, private router: Router,
    private bcbsmaErrorHandler: BcbsmaerrorHandlerService,
    private fadDoctorProfileService: FadDoctorProfileService,
    private fadSearchResultsService: FadSearchResultsService,
    private alertService: AlertService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    try {
      const resolvedData = this.route.snapshot.data.fadProfessionalResposeData;
      if (resolvedData && resolvedData.displaymessage && resolvedData.errormessage && resolvedData.result) {
        this.isShowProfessionalDetialsSection = false;
        this.alertService.setAlert(resolvedData.displaymessage, null, AlertType.Failure);
      } else {
        this.fadProfessionalResposeData = new FadProfessionalResponseModel();
        this.fadProfessionalResposeData = resolvedData;
        this.fadProfessionalResposeData.locations = resolvedData.locations;
        this.loadDetailsBasedOnLocation(this.selectedLocationIndex);
        this.isShowProfessionalDetialsSection = true;
      }
      this.getProfessionalratings();
    } catch (exception) {
      this.isShowProfessionalDetialsSection = false;
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadDoctorProfileComponent,
        FadConstants.methods.ngOnInit);
    }
  }

  ngOnDestroy() {
    this.alertService.clearError();
  }

  toggleAccordion(listItem, status) {
    this.accordianToggleStatus[listItem] = status;
  }

  getRating(reviews) {
    this.startRating = new StarRatingComponentInputModel();
    this.startRating.totalRatings = reviews.totalRatings;
    this.startRating.overAllRating = parseFloat(reviews.overallRating);
    return this.startRating;
  }

  formatMobileNumer(primaryPhone) {
    if (primaryPhone && primaryPhone.length > 9) {
      return `(${primaryPhone.substring(0, 3)}) ${primaryPhone.substring(3, 6)}-${primaryPhone.substring(6, 10)}`;
    } else {
      return primaryPhone;
    }
  }

  loadDetailsBasedOnLocation(locationId) {
    this.selectedLocationIndex = locationId;
    this.selectedLocationDetails = this.fadProfessionalResposeData.locations[locationId];
    this.accordianToggleStatus = {};
  }


  public copyIdentifierValue(event, inputId: string): void {
    const element: any = document.querySelector('#' + inputId);
    element.select();
    document.execCommand('copy');
    element.setSelectionRange(0, 0);
  }

  public reviewBenifits(): void {
    throw new Error('yet to be coded');
  }

  public doAuthentication() {
    throw new Error('yet to be coded');
  }

  public showCostBreakdown() {
    this.router.navigate([`/fad/cost-breakdown`]);
  }

  public searchInNetworkDoctors() {
    throw new Error('yet to be coded');
  }

  public getDirections(location, event): void {
    const locationURL = 'http://maps.google.com/?q=' + encodeURI(location);
    window.open(
      locationURL,
      '_self'
    );
  }

  public openFacility(event): void {
    // try {
    //   // this.doctorProfileService.doctorProfile = this.componentInput.professional;
    //   setTimeout(() => {
    //     this.router.navigate(['/fad/facility-profile']);
    //   }, 1);
    // } catch (exception) {
    //   this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
    //     FadConstants.components.fadDoctorProfileComponent,
    //     FadConstants.methods.openProfile);
    // }
  }

  private getProfessionalratings(): void {
    this.isDisplaySpinnerProfessional = true;
    const FadDoctorProfileRequestParams: FadDoctorRatingsRequestModelInterface = new FadDoctorRatingsRequestModel();
    try {
      FadDoctorProfileRequestParams.setRatingIdentifier('ratingIdentifier');
      this.fadDoctorProfileService.getProfessionalratings(FadDoctorProfileRequestParams).subscribe((responseData) => {
        if (responseData) {
          this.fadDoctorRatingsResponseData = new FadDoctorRatingsResponseModel();
          this.fadDoctorRatingsResponseData = responseData;
        }
      }, (error) => {
        this.isDisplaySpinnerProfessional = false;
      });
    } catch (exception) {
      this.isDisplaySpinnerProfessional = false;
    }
  }
}
