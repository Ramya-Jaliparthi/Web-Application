import { Component, OnInit, OnDestroy } from '@angular/core';
import { FadFacilityProfileService } from './fad-facility-profile.service';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
import { FadConstants } from '../constants/fad.constants';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
import { CustomizedAddressInfoForDisplayInterface, LinkInterface } from '../modals/interfaces/fad-facility-profile.interface';
import { StarRatingComponentConsumer } from '../modals/interfaces/fad.interface';
import { StarRatingComponentInputModelInterface } from '../../../shared/components/star-rating/star-rating.interface';
import { StarRatingComponentInputModel } from '../../../shared/components/star-rating/star-rating.model';
import { Router, ActivatedRoute } from '@angular/router';
import { FadProfessionalInterface } from '../modals/interfaces/getSearchByProfessional-models.interface';
import { AlertService } from '../../../shared/shared.module';
import { FadFacilityResponseModel } from '../modals/fad-facility-profile-details.model';
import { AlertType } from '../../../shared/alerts/alertType.model';
import { FadFacilityResponseModelInterface, LocationListInterface } from '../modals/interfaces/fad-facility-profile-details.interface';

@Component({
  selector: 'app-fad-facility-profile',
  templateUrl: './fad-facility-profile.component.html',
  styleUrls: ['./fad-facility-profile.component.scss']
})
export class FadFacilityProfileComponent implements OnInit, OnDestroy, StarRatingComponentConsumer {

  public facilityProfile: FadProfessionalInterface; // FVProSRProfessionalInSearchEntity;
  public facilityName: string;

  // public specialityNames: string = '';
  // public identifiers = new Array();
  // public languages = new Array();
  // public certificates = new Array();
  // public education = {};
  // public awards = new Array();
  // public facilityLocationsCustomizedAddressList: CustomizedAddressInfoForDisplayInterface[] = [];
  // public hospitalAffiliationsList: any[] = []; // FVProSRAffilitatedHospital[] = [];
  // public facilityStarRating: StarRatingComponentInputModelInterface;
  // public facilitysStarRating = new Array();
  // public facilityReviews = new Array();
  // public acceptedNetworks = new Array();
  // public locationDetails = new Array();
  // public accreditationsAwards = new Array();
  // public blueDistinctionPlusAwards = new Array();
  // public blueDistinctionAwards = new Array();
  // public hospitalQualityMethodology = new Array();
  // public overallRatingOnSurvey = new Array();

  // public inNetworkFlag: boolean;
  // public outOfNetworkFlag: boolean;
  // public noNetworkSelectedFlag: boolean;
  // public registeredUserFlag: boolean;
  // public anonymousUserFlag: boolean;

  private specialityNamesList: string[] = [];
  public isShowFacilityDetialsSection: boolean = false;
  public fadFacilityResposeData: FadFacilityResponseModelInterface;
  public startRating: StarRatingComponentInputModelInterface;
  public selectedLocationDetails: LocationListInterface;
  private selectedLocationIndex: number = 0;
  private hospitalQualityDefaultListLimit: number = 3;
  private hospitalQualityListLimit: number = this.hospitalQualityDefaultListLimit;
  public accordianToggleStatus: any = {};

  constructor(private facilityProfileService: FadFacilityProfileService,
    private router: Router,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private bcbsmaErrorHandler: BcbsmaerrorHandlerService) { }

  ngOnInit() {
    try {
      const resolvedData = this.route.snapshot.data.fadFacilityResposeData;
      if (resolvedData && resolvedData.displaymessage && resolvedData.errormessage && resolvedData.result) {
        this.isShowFacilityDetialsSection = false;
        this.alertService.setAlert(resolvedData.displaymessage, null, AlertType.Failure);
      } else {
        this.fadFacilityResposeData = new FadFacilityResponseModel();
        this.fadFacilityResposeData = resolvedData.facility;
        this.loadDetailsBasedOnLocation(this.selectedLocationIndex);
        this.isShowFacilityDetialsSection = true;
      }
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadFacilityProfileComponent,
        FadConstants.methods.ngOnInit);
    }
  }

  ngOnDestroy() {
    this.alertService.clearError();
  }

  loadDetailsBasedOnLocation(locationId) {
    this.selectedLocationIndex = locationId;
    this.selectedLocationDetails = this.fadFacilityResposeData.location[locationId];
    this.accordianToggleStatus = {};
  }

  getRating(reviews) {
    this.startRating = new StarRatingComponentInputModel();
    this.startRating.totalRatings = reviews.totalRatings;
    this.startRating.overAllRating = parseFloat(reviews.overallRating);
    return this.startRating;
  }

  getQualityRating(quality) {
    this.startRating = new StarRatingComponentInputModel();
    this.startRating.totalRatings = quality.score;
    this.startRating.numberOfStars = 3;
    this.startRating.overAllRating = parseFloat(quality.score);
    return this.startRating;
  }

  public copyIdentifierValue(event, inputId: string): void {
    const element: any = document.querySelector('#' + inputId);
    element.select();
    document.execCommand('copy');
    element.setSelectionRange(0, 0);
  }

  toggleAccordion(listItem, status) {
    this.accordianToggleStatus[listItem] = status;
  }

  hospitalQualityListLimitToggle() {
    this.hospitalQualityListLimit = this.hospitalQualityListLimit === this.hospitalQualityDefaultListLimit ?
      this.selectedLocationDetails.quality.length : this.hospitalQualityDefaultListLimit;
  }

  public getDirections(location, event): void {
    const locationURL = 'http://maps.google.com/?q=' + encodeURI(location);
    window.open(
      locationURL,
      '_self'
    );
  }

  public openFacility(event): void {
    try {
      // this.facilityProfileService.facilityProfile = this.componentInput.professional;
      setTimeout(() => {
        this.router.navigate(['/fad/facility-profile']);
      }, 1);
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadFacilityProfileComponent,
        FadConstants.methods.openProfile);
    }
  }

  public reviewBenifits(): void {
    throw new Error('yet to be coded');
  }

  public doAuthentication() {
    throw new Error('yet to be coded');
  }

  public showCostBreakdown() {
    throw new Error('yet to be coded');
  }

  public learnMoreAboutQuality() {
    throw new Error('yet to be coded');
  }

  public searchAffiliatedDoctors() {
    throw new Error('yet to be coded');
  }
}
