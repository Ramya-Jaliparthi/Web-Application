import { Component, OnInit } from '@angular/core';
import { FVSHRSearchHistoryInterface } from '../modals/interfaces/fad-vitals-collection.interface';
import { FadLandingPageSearchControlValuesInterface } from '../modals/interfaces/fad-landing-page.interface';
import { FadLandingPageSearchControlValues, FadAutoCompleteComplexOption } from '../modals/fad-landing-page.modal';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
import { FadConstants } from '../constants/fad.constants';
import { FadPastSearchQueryListService } from './fad-past-search-query-list.service';
import { Router } from '@angular/router';
import { FZCSRCity } from '../modals/fad-vitals-collection.model';

@Component({
  selector: 'app-fad-past-search-query-list',
  templateUrl: './fad-past-search-query-list.component.html',
  styleUrls: ['./fad-past-search-query-list.component.scss']
})
export class FadPastSearchQueryListComponent implements OnInit {

  public searchHistory: FVSHRSearchHistoryInterface[] = [];

  constructor(private bcbsmaErrorHandler: BcbsmaerrorHandlerService,
    private fadPastSearchQueryListService: FadPastSearchQueryListService,
    private router: Router) { }

  ngOnInit() {
    this.fadPastSearchQueryListService.getVitalsSearchHistory().subscribe(response => {
      this.searchHistory = response.searchHistory;
    });
  }

  public populateSearchFields(searchHistoryItem: FVSHRSearchHistoryInterface): void {
    try {
      const searchControlValues: FadLandingPageSearchControlValuesInterface = new FadLandingPageSearchControlValues();

      // Kalagi01 - Temporary code - has to change after api arrives
      searchControlValues.setSearchText((new FadAutoCompleteComplexOption()).setSimpleText(searchHistoryItem.searchKeyword));
      // searchControlValues.planName = searchHistoryItem.planName;
      searchControlValues.setZipCode((new FZCSRCity())
        .setCity(searchHistoryItem.city)
        .setState(searchHistoryItem.state)
        .setZip(searchHistoryItem.zipcode)
      );
      searchControlValues.setDependantName(searchHistoryItem.dependant);
      this.fadPastSearchQueryListService.searchControlValues = searchControlValues;
      this.router.navigate(['/fad']);
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadLandingPageComponent,
        FadConstants.methods.populateSearchFields);
    }
  }

  public onSearchListItemKeyDown(event: KeyboardEvent, searchHistoryItem: FVSHRSearchHistoryInterface) {
    if (event.keyCode === 32 || event.keyCode === 13) {
      event.stopPropagation();
      this.populateSearchFields(searchHistoryItem);
      return false;
    }
  }

}
