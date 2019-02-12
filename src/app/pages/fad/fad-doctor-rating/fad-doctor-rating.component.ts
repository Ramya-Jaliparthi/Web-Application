import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
import { FadConstants } from '../constants/fad.constants';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
import { StarRatingComponentConsumer } from '../modals/interfaces/fad.interface';
import { StarRatingComponentInputModelInterface } from '../../../shared/components/star-rating/star-rating.interface';
import { StarRatingComponentInputModel } from '../../../shared/components/star-rating/star-rating.model';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';

declare let $: any;


@Component({
  selector: 'app-fad-doctor-rating',
  templateUrl: './fad-doctor-rating.component.html',
  styleUrls: ['./fad-doctor-rating.component.scss']
})
export class FadDoctorRatingComponent implements OnInit {

  isFormSubmitted = false;
  doctorRatingGroup: FormGroup;
  doctorName: string;
  doctorDegree: string;
  facilityStarRating: StarRatingComponentInputModelInterface;
  errorText: boolean;
  cantReview: boolean;
  reviewSubmitError: boolean;
  reviewSubmitSuccess: boolean;

  forModeration: boolean;
  reviewSubmitted: boolean;
  reviewAlreadyDone: boolean;

  constructor(private fb: FormBuilder, private router: Router, private bcbsmaErrorHandler: BcbsmaerrorHandlerService) {

    this.doctorName = 'FName LName';
    this.doctorDegree = 'MD';
    this.doctorRatingGroup = this.fb.group({
      overallSatisfaction: ['', [Validators.required]],
      recommendToFamily: ['', [Validators.required]],
      easeOfUnderstanding: ['', []],
      doctorAvailability: ['', []],
      staffRating: ['', []],
      additionalComments: ['', [Validators.maxLength(100)]],
      reviewTitle: ['', [Validators.maxLength(30)]],
      userName: ['', [Validators.maxLength(30)]]
    });

  }

  ngOnInit() {
    try {
      // temporary stuff
      this.facilityStarRating = new StarRatingComponentInputModel();
      // this.facilityStarRating.ratingInPercentage = 67;
      this.facilityStarRating.numberOfStars = 5;

      this.reviewSubmitError = true;
      this.errorText = true;
      this.cantReview = false;
      this.reviewSubmitSuccess = false;

      this.forModeration = false;
      this.reviewSubmitted = false;
      this.reviewAlreadyDone = true;

    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadFacilityProfileComponent,
        FadConstants.methods.ngOnInit);
    }
  }

  public gotoTermsandConditions() {
    throw new Error('yet to be coded');
  }

  public clearAllFields() {
    throw new Error('yet to be coded');
  }

  public submitReview() {
    throw new Error('yet to be coded');
  }

  public gotoDoctorProfile() {
    throw new Error('yet to be coded');
  }

  public onSubmit() {
    console.log(this.doctorRatingGroup.value);
    console.log(this.doctorRatingGroup.valid);
  }
}
