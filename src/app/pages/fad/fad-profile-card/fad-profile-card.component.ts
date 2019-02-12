import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
import { FadConstants } from '../constants/fad.constants';
import { StarRatingComponentInputModel } from '../../../shared/components/star-rating/star-rating.model';
import { StarRatingComponentInputModelInterface } from '../../../shared/components/star-rating/star-rating.interface';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
import { StarRatingComponentConsumer } from '../modals/interfaces/fad.interface';
import { FadProfileCardComponentOutputModel, FadProfileCardComponentInputModel } from '../modals/fad-profile-card.modal';
import {
  FadProfileCardComponentOutputModelInterface,
  FadProfileCardComponentInputModelInterface
} from '../modals/interfaces/fad-profile-card.interface';
import { Router } from '@angular/router';
// import { FVProSRLocation } from '../modals/fad-vitals-professionals-search-response.model';
import { first } from 'rxjs/operators';
import { FadDoctorProfileService } from '../fad-doctor-profile/fad-doctor-profile.service';
import { AuthService } from '../../../shared/shared.module';
@Component({
  selector: 'app-fad-profile-card',
  templateUrl: './fad-profile-card.component.html',
  styleUrls: ['./fad-profile-card.component.scss']
})
export class FadProfileCardComponent implements OnInit, StarRatingComponentConsumer {

  @Output('componentOutput') componentOutput: EventEmitter<FadProfileCardComponentOutputModelInterface>
    = new EventEmitter<FadProfileCardComponentOutputModelInterface>();

  @Input('componentInput') componentInput: FadProfileCardComponentInputModelInterface;

  // temporary stuff
  public doctorStarRating: StarRatingComponentInputModelInterface;
  public checked: boolean = false;
  public toggleShowMoreLocationStatus: boolean = false;
  // end of temporary stuff

  public doctorName: string;
  public doctorDegree: string;
  public speciality: string;
  public medicalGroup: string;
  public address: string;
  public phoneNumber: string;
  public numberOfLocations: number;
  public cost_dollars: string = '00';
  public cost_pennies: string = '00';

  constructor(private bcbsmaErrorHandler: BcbsmaerrorHandlerService, private router: Router,
    private doctorProfileService: FadDoctorProfileService, private authService: AuthService) { }

  ngOnInit() {
    try {

      this.doctorName = this.componentInput.professional.doctorName;
      // this.doctorDegree = this.componentInput.professional.degrees.join(',');
      this.speciality = this.componentInput.professional.specialty;

      // const specialityBuffer = [];
      // this.componentInput.professional.specializations.map((specialization) => {
      //   specialityBuffer.push(specialization.field_specialty.name);
      //   return specialization;
      // });
      // this.speciality = specialityBuffer.join(',');

      if (this.componentInput.professional.locations) {
        this.numberOfLocations = this.componentInput.professional.locations.length;
        const firstLocation = this.componentInput.professional.locations[0];
        this.medicalGroup = firstLocation.name;
        this.address = firstLocation.address;
        this.phoneNumber = firstLocation.phone;
        /*this.address = [firstLocation.address.addr_line1, firstLocation.address.addr_line2, // have to check
        firstLocation.address.city, firstLocation.address.state_code, firstLocation.address.county].filter((adrItem) => {
          if (adrItem) {
            return adrItem;
          }
        }).join(', ') + ' ' + firstLocation.address.postal_code;

        if (firstLocation.phones.voice && firstLocation.phones.voice.length > 0) {
          this.phoneNumber = firstLocation.phones.voice[0].number;  // have to check
        }*/

        /* COST IS MISSING */
        /* kalagi01: DO NOT DELETE******************/
        // if (firstLocation.cost) {
        //   const costString: string = firstLocation.cost + '';
        //   this.cost_dollars = costString.split('.')[0];
        //   this.cost_pennies = costString.split('.')[0];
        // }
      } else {
        this.numberOfLocations = 0;
      }

      // temporary stuff
      this.doctorStarRating = new StarRatingComponentInputModel();
      this.doctorStarRating.ratingInPercentage =
        // tslint:disable-next-line:radix
        parseInt('' + parseFloat(this.componentInput.professional.reviews.overallRating.toString()) * 100 / 5);
      this.doctorStarRating.totalRatings = this.componentInput.professional.reviews.totalRatings;
      // tslint:disable-next-line:radix
      this.doctorStarRating.overAllRating = parseFloat(this.componentInput.professional.reviews.overallRating.toString());
      // this.doctorStarRating.numberOfStars = 5;
      // end of temporary stuff
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadProfileCardComponent,
        FadConstants.methods.ngOnInit);
    }
  }

  public openProfile(event): void {
    try {
      const professionalDetails: any = this.componentInput.professional;
      this.doctorProfileService.doctorProfile = professionalDetails.providerId;
      sessionStorage.setItem('professionalId', professionalDetails.providerId.toString());
      setTimeout(() => {
        this.router.navigate(['/fad/doctor-profile']);
      }, 1);
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadProfileCardComponent,
        FadConstants.methods.openProfile);
    }
  }

  public toggleShowMoreLocation() {
    this.toggleShowMoreLocationStatus = !this.toggleShowMoreLocationStatus;
  }

  /**
   * @description: get triggered when check box selection changes in the profile card. Triggers an output with the necessary info to
   * the parent component
   */
  public onSelectionChange(): void {
    try {
      const output: FadProfileCardComponentOutputModelInterface = new FadProfileCardComponentOutputModel();
      output.professional = this.componentInput.professional;
      output.isSelected = this.checked;
      this.componentOutput.emit(output);
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadProfileCardComponent,
        FadConstants.methods.onSelectionChange);
    }
  }

  public doAuthentication() {
    this.router.navigateByUrl('/login');
  }

  public reviewBenifits(): void {
    throw new Error('yet to be coded');
  }
}
