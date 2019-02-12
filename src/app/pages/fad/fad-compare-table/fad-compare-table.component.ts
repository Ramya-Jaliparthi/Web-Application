import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FadCompareTableService } from './fad-compare-table.service';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
import { FadConstants } from '../constants/fad.constants';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
import { finalize } from 'rxjs/operators';
import { FadSearchListService } from '../fad-search-list/fad-search-list.service';
import { StarRatingComponentInputModel } from '../../../shared/components/star-rating/star-rating.model';
import { StarRatingComponentInputModelInterface } from '../../../shared/components/star-rating/star-rating.interface';

@Component({
  selector: 'app-fad-compare-table',
  templateUrl: './fad-compare-table.component.html',
  styleUrls: ['./fad-compare-table.component.scss']
})
export class FadCompareTableComponent implements OnInit {

  public fadConstants = FadConstants;
  public selectedProfessionID;
  public results;
  public selectedProfessionDetail;
  public doctorStarRating: StarRatingComponentInputModelInterface;

  constructor(private router: Router, private route: ActivatedRoute, private bcbsmaErrorHandler: BcbsmaerrorHandlerService,
    public compareTableService: FadCompareTableService, private fadSearchListService: FadSearchListService) { }

  ngOnInit() {

    try {
      this.selectedProfessionID = this.fadSearchListService.getSelectedId();
      // console.log('selected Profession value through service:', this.selectedProfessionID);

      this.getCompareTableDetail();
      // console.log('selected Profession Detail:', this.selectedProfessionDetail);
      this.doctorStarRating = new StarRatingComponentInputModel();
      this.doctorStarRating.ratingInPercentage = 80;
      // this.doctorStarRating.numberOfStars = 5;
      // this.doctorStarRating.ratingInPercentage = this.selectedProfessionDetail.professional.reviews.overall_rating;
      // this.doctorStarRating.numberOfStars = this.selectedProfessionDetail.professional.reviews.total_ratings;

    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadCompareTableComponent,
        FadConstants.methods.ngOnInit);
    }
  }

  public getCompareTableDetail() {
    // return this.compareTableService.getCompareTableDetail().subscribe(response=>this.getDataOnSuccess(response));
    const searchData = this.compareTableService.getSearchResult();
    // console.log('search data', searchData);
    this.getDataOnSuccess(searchData);

  }

  getDataOnSuccess(data) {
    this.results = data;
    this.selectedProfessionDetail = this.results.professionals.filter((professional) => {
      return this.selectedProfessionID.indexOf(professional.id) !== -1;
    });
    // console.log('Filter data in getDataOnSuccess()', this.selectedProfessionDetail);
  }

  public doAuthentication() {
    throw new Error('yet to be coded');
  }

  // Remove from the compare table
  // In case only last one remains redirect to search results
  public removeProfessional(idx: number) {
    // console.log('index of profile in the list: ' + idx);
    if (this.selectedProfessionDetail.length === 1 && idx === 0) {
      this.router.navigate([`/fad/search-results`]);
    }
    this.selectedProfessionDetail.splice(idx, 1);
  }

  // Move to Doctor's Profile Page
  public goToDoctorProfilePage() {
    // console.log('clicked on goToProfileDetailPage');
    this.router.navigate([`/fad/doctor-profile`]);
  }

  public goBackToSearchListPage() {
    // console.log('clicked on goBackToSearchListPage');
    this.router.navigate([`/fad/search-results`]);
  }

}
