import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { FinancialsConstants } from '../constants/financials.constants';
import { finalize } from 'rxjs/operators';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
import { MatGridListModule } from '@angular/material/grid-list';
import { AlltransactionsService } from './alltransactions.service';
import { AllTransactionSummaryInterface } from '../models/interfaces/all-transaction.interface';
import {
  FilterSearchAllTransaction,
  AllTransactionSearchCompOutputModelInterface,
  AllTransactionSearchFilterDateRanges,
  SearchCriteriaItemInterface,
  TransactionDetailsSearchResponseModelInterface
} from '../models/interfaces/filter-search-all-transaction.interface';
import { TransactionDetailsSearchResponseModel, SearchCriteriaItem } from '../models/filter-search-all-transaction.model';
import * as moment from 'moment';
import { AllTransactionUtilities } from '../utils/all-transaction.utilities';
import { NoDocumentsFoundComponentModel } from '../models/all-transaction.model';
import { NoDocumentsFoundComponentConsumer, NoSearchResultsFoundComponentConsumer } from '../models/interfaces/all-transaction.interface';
import { Filter } from '../../../shared/components/filter/filter.model';

@Component({
  selector: 'app-all-transactions',
  templateUrl: './all-transactions.component.html',
  styleUrls: ['./all-transactions.component.scss']
})
export class AllTransactionsComponent implements OnInit {

  public financialConstants = FinancialsConstants;
  public isNoTransactionResults: boolean = false;
  public allTransactionSummary = new Object;
  public allTransactionCompleted = new Array();
  public allTransactionPending = new Array();
  public allTransactionActionitems = new Array();
  public allTransactionOthers = new Array();

  public searchCriteriaData: TransactionDetailsSearchResponseModelInterface = new TransactionDetailsSearchResponseModel();
  public msgCount: number = 0;
  // public msgListing: MessageListing[];
  private utils: AllTransactionUtilities = new AllTransactionUtilities();
  public isMsgNotAvailable: boolean = false;
  public isNoSearchResults: boolean = false;
  public mobileHideByFilterOverlay: boolean;
  public no_transaction_found_component_mode: NoDocumentsFoundComponentModel = new NoDocumentsFoundComponentModel();
  public no_search_results_found_component_mode: NoDocumentsFoundComponentModel = new NoDocumentsFoundComponentModel();
  public filterConfig: Filter;

  constructor(private authService: AuthService, private router: Router,
    private allTransService: AlltransactionsService,
    private bcbsmaErrorHandler: BcbsmaerrorHandlerService) {

    this.no_transaction_found_component_mode.mode = FinancialsConstants.flags.transactionMode;
    this.no_search_results_found_component_mode.mode = FinancialsConstants.flags.noSearchResultsMode;

    this.filterConfig = {
      hasSearch: false,
      items: [
        // {
        //   type: 'checkbox',
        //   divider: false,
        //   multi: false,
        //   headerText: 'Effective Date',
        //   hideToggle: false,
        //   expanded: false,
        //   disabled: false,
        //   disableRipple: false,
        //   collapsedHeight: null,
        //   expandedHeight: '44px',
        //   titlecase: false,
        //   list: [
        //     {
        //       text: '2018',
        //       value: '2018',
        //       selected: false,
        //       disabled: false
        //     },
        //     {
        //       text: '2017',
        //       value: '2017',
        //       selected: false,
        //       disabled: false
        //     },
        //     {
        //       text: '2016',
        //       value: '2016',
        //       selected: false,
        //       disabled: false
        //     }

        //   ]
        // }
      ]
    };

  }

  ngOnInit() {
    try {
      this.getAllTransactionsSummary();
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.financialModule,
        FinancialsConstants.components.allTransactionsComponent,
        FinancialsConstants.methods.ngOnInit);
    }
  }

  // Method to fetch transaction cateogry data from api
  getAllTransactionsSummary() {
    this.allTransService.getAllTransactionsSummary().subscribe((allTranSummaryApiData) => {
      try {
        if (allTranSummaryApiData && Object.keys(allTranSummaryApiData).length > 0) {
          this.allTransactionSummary = allTranSummaryApiData;
          this.allTransactionActionitems = allTranSummaryApiData.Action;
          this.allTransactionCompleted = allTranSummaryApiData.Completed;
          this.allTransactionPending = allTranSummaryApiData.Pending;
          this.allTransactionOthers = allTranSummaryApiData.Others;
          this.isNoTransactionResults = true;

          this.createSearchCriteria();
        }
      } catch (exception) {
        this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.financialModule,
          FinancialsConstants.components.allTransactionsComponent,
          FinancialsConstants.methods.getAllTransactionsSummary);
      }
    }, error => {
      this.bcbsmaErrorHandler.handleHttpError(error, BcbsmaConstants.modules.financialModule,
        FinancialsConstants.services.alltransactionsService,
        FinancialsConstants.methods.getAllTransactionsSummary);
    });
  }

  // Method to navigate to the transaction details page
  public navigateToTransactionDetail(transactId) {
   // console.log("transactDetail param " + transactId);
    try {
      if (transactId) {
        this.router.navigate([`/myfinancials/alltransactions/transactiondetail`, transactId]);
      } else {
        this.bcbsmaErrorHandler.logError(
          new Error(FinancialsConstants.errorMessages.invalidParamInFunctionCall),
          BcbsmaConstants.modules.financialModule,
          FinancialsConstants.components.allTransactionsComponent,
          FinancialsConstants.methods.navigateToTransactionDetail
        );
      }
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.financialModule,
        FinancialsConstants.components.allTransactionsComponent,
        FinancialsConstants.methods.navigateToTransactionDetail);
    }
    return;
  }
  public createSearchCriteria(): TransactionDetailsSearchResponseModelInterface {
    const searchCriteriaData: TransactionDetailsSearchResponseModelInterface = new TransactionDetailsSearchResponseModel();
    const keywordList: string[] = [];
    try {
      const now = moment(new Date());
      let dateRangeInfo: AllTransactionSearchFilterDateRanges = {
        all_dates: 0,
        last_30_days: 0,
        last_60_days: 0,
        last_90_days: 0,
        year_to_date: 0
      };
      const uniqueCategoryMap: string[] = [];
      // this.msgListing.map((msgListItem) => {
      //   keywordList.push(msgListItem.alertShortTxt);
      //   keywordList.push(msgListItem.alertLongTxt);

      //   const categoryName: string = msgListItem.category;
      //   dateRangeInfo = this.utils.trackAgeOfEntity(now, msgListItem.timeStamp, dateRangeInfo);
      //   if (uniqueCategoryMap.indexOf(categoryName) === -1) {
      //     uniqueCategoryMap.push(categoryName);
      //     searchCriteriaData.addCategoryFilter(
      //       (new SearchCriteriaItem()).setCriteriaName(categoryName)
      //         .setMatchingResultsCount(1)
      //     );
      //   } else {
      //     searchCriteriaData.categoryFilterMap.get(categoryName).matchingResultsCount++;
      //   }
      //   return;
      // });

      searchCriteriaData.keywordList = keywordList;

      searchCriteriaData
        .addSortByFilter((new SearchCriteriaItem())
          .setCriteriaName(FinancialsConstants.filters.sortByFilters.mostRecent))
        .addSortByFilter((new SearchCriteriaItem())
          .setCriteriaName(FinancialsConstants.filters.sortByFilters.oldestFirst))
        .addSortByFilter((new SearchCriteriaItem())
          .setCriteriaName(FinancialsConstants.filters.sortByFilters.unreadFirst))

        .addDateFilter(
          (new SearchCriteriaItem()).setCriteriaName(FinancialsConstants.filters.dateFilters.last30Days)
            .setMatchingResultsCount(dateRangeInfo.last_30_days))
        .addDateFilter(
          (new SearchCriteriaItem()).setCriteriaName(FinancialsConstants.filters.dateFilters.last60Days)
            .setMatchingResultsCount(dateRangeInfo.last_60_days))
        .addDateFilter(
          (new SearchCriteriaItem()).setCriteriaName(FinancialsConstants.filters.dateFilters.last90Days)
            .setMatchingResultsCount(dateRangeInfo.last_90_days))
        .addDateFilter(
          (new SearchCriteriaItem()).setCriteriaName(FinancialsConstants.filters.dateFilters.yearToDate)
            .setMatchingResultsCount(dateRangeInfo.year_to_date))
        .addDateFilter(
          (new SearchCriteriaItem()).setCriteriaName(FinancialsConstants.filters.dateFilters.allDates)
            .setMatchingResultsCount(dateRangeInfo.all_dates))
        .addDateFilter(
          (new SearchCriteriaItem()).setCriteriaName(FinancialsConstants.filters.dateFilters.customDateRange)

        );

      this.searchCriteriaData = searchCriteriaData;
      this.no_search_results_found_component_mode.searchCriteria = searchCriteriaData;
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.financialModule,
        FinancialsConstants.components.allTransactionsComponent,
        FinancialsConstants.methods.createSearchCriteria);
    }

    return searchCriteriaData;
  }

  // Methods to convert Transaction amount into decimal values
  public convertAmountToBaseValue(value) {
    return Math.trunc(value);
  }

  public convertAmountToDecimalValue(value) {
    const int_part = Math.trunc(value);
    const float_part = Number((value - int_part).toFixed(2));
    const decimal = float_part.toString().split('.');
    if (!decimal[1]) {
      const zero = '00';
      return zero;
    }
    return decimal[1];
  }

}
