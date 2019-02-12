import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FadFacilityCompareService } from './fad-facility-compare.service';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
import { FadConstants } from '../constants/fad.constants';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
import { finalize } from 'rxjs/operators';
import { FadSearchListService } from '../fad-search-list/fad-search-list.service';
import { StarRatingComponentInputModel } from '../../../shared/components/star-rating/star-rating.model';
import { StarRatingComponentInputModelInterface } from '../../../shared/components/star-rating/star-rating.interface';


@Component({
  selector: 'app-fad-facility-compare',
  templateUrl: './fad-facility-compare.component.html',
  styleUrls: ['./fad-facility-compare.component.scss']
})
export class FadFacilityCompareComponent implements OnInit {

  public fadConstants = FadConstants;
  public selectedFacilityID;
  public results;
  public selectedFacilityDetail;
  public doctorStarRating: StarRatingComponentInputModelInterface;

  constructor(private router: Router, private route: ActivatedRoute, private bcbsmaErrorHandler: BcbsmaerrorHandlerService,
    public facilityCompareService: FadFacilityCompareService, private fadSearchListService: FadSearchListService) { }

  ngOnInit() {

    try {
      // this.selectedFacilityID = this.fadSearchListService.getSelectedId();
      // console.log('selected Profession value through service:', this.selectedFacilityID);

      this.facilityCompareService.getCompareTableDetail()
        .subscribe(response => {
          const resp = response;
          this.selectedFacilityDetail = resp.facilities;
          console.log('facilities - ' + this.selectedFacilityDetail);
          console.log(this.selectedFacilityDetail);
        });
      // console.log('selected Profession Detail:', this.selectedFacilityDetail);
      this.doctorStarRating = new StarRatingComponentInputModel();
      this.doctorStarRating.ratingInPercentage = 80;
      this.doctorStarRating.numberOfStars = 5;
      // this.doctorStarRating.ratingInPercentage = this.selectedFacilityDetail.professional.reviews.overall_rating;
      // this.doctorStarRating.numberOfStars = this.selectedFacilityDetail.professional.reviews.total_ratings;

    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.financialModule,
        FadConstants.components.fadFacilityCompareComponent,
        FadConstants.methods.ngOnInit);
    }
  }

  getDataOnSuccess(data) {
    this.results = data;
    this.selectedFacilityDetail = this.results.professionals.filter((professional) => {
      return this.selectedFacilityID.indexOf(professional.id) !== -1;
    });
  }

  public doAuthentication() {
    throw new Error('yet to be coded');
  }

  // Remove from the compare table
  // In case only last one remains redirect to search results
  public removeFacility(idx: number) {
    if (this.selectedFacilityDetail.length === 1 && idx === 0) {
      this.router.navigate([`/fad/search-results`]);
    }
    this.selectedFacilityDetail.splice(idx, 1);
  }

  // Move to Doctor's Profile Page
  public goToFacilityProfilePage() {
    // console.log('clicked on goToProfileDetailPage');
    this.router.navigate([`/fad/facility-profile`]);
  }

  public goBackToSearchListPage() {
    // console.log('clicked on goBackToSearchListPage');
    this.router.navigate([`/fad/search-results`]);
  }


}
