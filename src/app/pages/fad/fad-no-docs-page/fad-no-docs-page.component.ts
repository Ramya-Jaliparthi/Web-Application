import { Component, OnInit, Input } from '@angular/core';
import { FadNoDocsPageInputDataModelInterface } from '../modals/interfaces/fad-no-docs-page.interface';
import { FadSearchResultsService } from '../fad-search-results/fad-search-results.service';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
import { FadConstants } from '../constants/fad.constants';

@Component({
  selector: 'app-fad-no-docs-page',
  templateUrl: './fad-no-docs-page.component.html',
  styleUrls: ['./fad-no-docs-page.component.scss']
})
export class FadNoDocsPageComponent implements OnInit {

  @Input('componentInput') componentInput: FadNoDocsPageInputDataModelInterface;

  public searchText: string = '';
  constructor(private searchResultsService: FadSearchResultsService, private bcbsmaErrorHandler: BcbsmaerrorHandlerService) { }

  ngOnInit() {
    try {
      if (this.searchResultsService.getSearchCriteria()) {
        this.searchText = this.searchResultsService.getSearchCriteria().getSearchText().getSimpleText();
      }
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.fadModule,
        FadConstants.components.fadNoDocsPageComponent,
        FadConstants.methods.ngOnInit);
    }
  }

}
