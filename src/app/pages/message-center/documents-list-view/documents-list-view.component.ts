import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {

  FileItemModelInterface
} from '../modals/interfaces/documents.interface';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
import { DocumentsService } from '../documents/documents.service';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
import { MessageCenterConstants } from '../constants/messageCenter.constants';
import { NoDocumentsFoundComponentModel } from '../modals/message-center.modal';
import {
  NoDocumentsFoundComponentModelInterface,
  NoDocumentsFoundComponentConsumer,
  NoSearchResultsFoundComponentConsumer
} from '../modals/interfaces/message-center.interface';
import { BreadCrumb } from '../../../shared/components/breadcrumbs/breadcrumbs';
import { SearchCriteriaItem, MessageDetailsSearchResponseModel } from '../modals/message-center-search.model';
import {
  MessageDetailsSearchResponseModelInterface,
  MessageCenterSearchFilterConsumer,
  MessageCenterSearchFilterDateRanges,
  MessageCenterSearchCompOutputModelInterface
} from '../modals/interfaces/message-center-search.interface';
import { MessageCenterUtilities } from '../utils/message-center.utilities';
import * as moment from 'moment';
import { EocPolicyInterface, RiderInterface } from '../modals/interfaces/getBenefitCoverage-models.interface';

@Component({
  selector: 'app-documents-list-view',
  templateUrl: './documents-list-view.component.html',
  styleUrls: ['./documents-list-view.component.scss']
})
export class DocumentsListViewComponent implements OnInit, NoDocumentsFoundComponentConsumer,
  NoSearchResultsFoundComponentConsumer, MessageCenterSearchFilterConsumer {

  public breadCrumbs: BreadCrumb[];
  public no_doc_found_component_mode: NoDocumentsFoundComponentModelInterface = new NoDocumentsFoundComponentModel();
  public no_search_results_found_component_mode: NoDocumentsFoundComponentModelInterface = new NoDocumentsFoundComponentModel();
  public searchCriteriaData: MessageDetailsSearchResponseModelInterface = new MessageDetailsSearchResponseModel();
  public fileList: FileItemModelInterface[];
  public hasContents: boolean = null;
  public utils: MessageCenterUtilities = new MessageCenterUtilities();
  public isNoSearchResults: boolean = false;
  public mobileHideByFilterOverlay: boolean;

  public eocPolicy: EocPolicyInterface;
  public parentFolderName: string;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private bcbsmaErrorHandler: BcbsmaerrorHandlerService,
    private documentsService: DocumentsService
  ) {
    this.no_doc_found_component_mode.mode = MessageCenterConstants.flags.documentsMode;
    this.no_search_results_found_component_mode.mode = MessageCenterConstants.flags.noSearchResultsMode;
  }


  ngOnInit() {
    this.breadCrumbs = [];
    this.prepareChildBreadCrumbs(this.router.url.split('/')[this.router.url.split('/').length - 1]);
    try {

      this.eocPolicy = this.route.snapshot.data.policy;
      this.parentFolderName = this.documentsService.getSelectedPlan().planName;
      console.log('riders array and plan', this.eocPolicy, this.documentsService.getSelectedPlan());


    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.documentsListViewComponent,
        MessageCenterConstants.methods.ngOnInit);
    }
  }

  public createSearchCriteria(): MessageDetailsSearchResponseModelInterface {

    const searchCriteriaData: MessageDetailsSearchResponseModelInterface = new MessageDetailsSearchResponseModel();
    const keywordList: string[] = [];
    try {
      const now = moment(new Date());
      const dateRangeInfo: MessageCenterSearchFilterDateRanges = {
        all_dates: 0,
        last_30_days: 0,
        last_60_days: 0,
        last_90_days: 0,
        year_to_date: 0
      };

      // this.fileList.map((fileItem) => {
      this.eocPolicy.riders.map((fileItem) => {

        keywordList.push(fileItem.riderTitle);
        keywordList.push(fileItem.riderDescription);
        // dateRangeInfo = this.utils.trackAgeOfEntity(now, fileItem.dateStamp, dateRangeInfo);
      });

      searchCriteriaData
        .addSortByFilter((new SearchCriteriaItem())
          .setCriteriaName(MessageCenterConstants.filters.sortByFilters.mostRecent))
        .addSortByFilter((new SearchCriteriaItem())
          .setCriteriaName(MessageCenterConstants.filters.sortByFilters.oldestFirst))
        .addSortByFilter((new SearchCriteriaItem())
          .setCriteriaName(MessageCenterConstants.filters.sortByFilters.unreadFirst))

        .addDateFilter(
        (new SearchCriteriaItem()).setCriteriaName(MessageCenterConstants.filters.dateFilters.last30Days)
          .setMatchingResultsCount(dateRangeInfo.last_30_days))
        .addDateFilter(
        (new SearchCriteriaItem()).setCriteriaName(MessageCenterConstants.filters.dateFilters.last60Days)
          .setMatchingResultsCount(dateRangeInfo.last_60_days))
        .addDateFilter(
        (new SearchCriteriaItem()).setCriteriaName(MessageCenterConstants.filters.dateFilters.last90Days)
          .setMatchingResultsCount(dateRangeInfo.last_90_days))
        .addDateFilter(
        (new SearchCriteriaItem()).setCriteriaName(MessageCenterConstants.filters.dateFilters.yearToDate)
          .setMatchingResultsCount(dateRangeInfo.year_to_date))
        .addDateFilter(
        (new SearchCriteriaItem()).setCriteriaName(MessageCenterConstants.filters.dateFilters.allDates)
          .setMatchingResultsCount(dateRangeInfo.all_dates))
        .addDateFilter(
        (new SearchCriteriaItem()).setCriteriaName(MessageCenterConstants.filters.dateFilters.customDateRange)
        );

      searchCriteriaData.keywordList = keywordList;
      this.no_search_results_found_component_mode.searchCriteria = searchCriteriaData;
      this.searchCriteriaData = searchCriteriaData;
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.msgListingComponent,
        MessageCenterConstants.methods.createSearchCriteria);
    }

    return searchCriteriaData;
  }

  prepareChildBreadCrumbs(folderId) {
    console.log('floderid', folderId, this.breadCrumbs);
    this.breadCrumbs.push({
      label: 'Home',
      url: ['/home']
      // url: ['/message-center', 'documents', folderId]
    });
    this.breadCrumbs.push({
      label: 'My Inbox',
      url: ['/message-center']
      // url: ['/message-center', 'documents', folderId]
    });
    switch (folderId) {
      // document-list-view
      case 'documents-list-view':
        this.breadCrumbs.push({
          label: 'My Documents',
          url: ['/message-center/documents/home']
          // url: ['/message-center', 'documents', 'home']
        });
        this.breadCrumbs.push({
          label: 'My Plan Documents',
          url: ['/message-center/documents/planDocuments']
        });
        this.breadCrumbs.push({
          label: this.documentsService.getSelectedPlan().planName ,
          url: ['/message-center/documents/planDocuments/benefitCoverageList']
        });
        this.breadCrumbs.push({
          label: this.documentsService.getSelectedPolicy().policyFormName ,
          url: ['/message-center', 'documents', folderId]
        });
        break;
    }
  }

  initBreadcrumbs() {
    this.breadCrumbs = [{
      label: 'Home',
      url: ['/home']
    },
    {
      label: 'My Inbox',
      url: ['/message-center']
    }];
  }

  public onSearch(searchFilterOptions: MessageCenterSearchCompOutputModelInterface): void {
    const searchCriteriaData: MessageDetailsSearchResponseModelInterface = searchFilterOptions.searchCriteriaData;
    const filterOverlayFlag = searchFilterOptions.filterOverlayFlag;

    // toggle filter section display as necessary
    if (filterOverlayFlag) {
      this.mobileHideByFilterOverlay = true;
    } else {
      this.mobileHideByFilterOverlay = false;
    }

    // if the emit event has not been triggered by apply or clear filters then do nothing
    if (searchCriteriaData === null) {
      return;
    }

    let fileList: FileItemModelInterface[];
    try {

      // clear previous search results from view
      this.fileList = <FileItemModelInterface[]>this.utils.clearPreviousSearchFlags(this.fileList);

      // clone the existing msg list to avoid performance issues due to intermitten model changes in view
      fileList = Object.assign([], this.fileList);

      // sort the message list as necessary based on the user selection
      const sortFilterKeys: string[] = searchCriteriaData.sortByFilterMap.getKeys();
      for (const sortKey of sortFilterKeys) {
        const sortCriteria = searchCriteriaData.sortByFilterMap.get(sortKey);
        if (sortCriteria.criteriaName === MessageCenterConstants.filters.sortByFilters.mostRecent && sortCriteria.criteriaSelected) {
          fileList.sort((msgItem_a, msgItem_b) => {
            const date1 = moment(new Date(msgItem_a.dateStamp));
            const date2 = moment(new Date(msgItem_b.dateStamp));
            return moment.duration(date2.diff(date1)).asDays();
          });
          break;
        } else if (sortCriteria.criteriaName === MessageCenterConstants.filters.sortByFilters.oldestFirst
          && sortCriteria.criteriaSelected) {
          fileList.sort((msgItem_a, msgItem_b) => {
            const date1 = moment(new Date(msgItem_a.dateStamp));
            const date2 = moment(new Date(msgItem_b.dateStamp));
            return moment.duration(date1.diff(date2)).asDays();
          });
          break;
        } else if (sortCriteria.criteriaName === MessageCenterConstants.filters.sortByFilters.unreadFirst
          && sortCriteria.criteriaSelected) {
          fileList.sort((msgItem_a, msgItem_b) => {
            const date1 = moment(new Date(msgItem_a.dateStamp));
            const date2 = moment(new Date(msgItem_b.dateStamp));
            return moment.duration(date2.diff(date1)).asDays();
          }).sort((msgItem_a, msgItem_b) => {
            const refA = msgItem_a.messageRead ? 1 : 0;
            const refB = msgItem_b.messageRead ? 1 : 0;
            return refA - refB;
          });
          break;
        }

      }

      // apply date filters to the result obtained from the previous step
      fileList = <FileItemModelInterface[]>this.utils.doDateFilter(fileList,
        searchCriteriaData, MessageCenterConstants.attributes.dateStamp);

      fileList = <FileItemModelInterface[]>this.utils.doKeywordFilter(fileList, searchCriteriaData);

      // check if atleast one file item matches the search results. if not display the 'no-documents-found-component'
      if (!fileList.some((msgListItem) => {
        return !msgListItem.hideEntityFromDisplay;
      })) {
        this.isNoSearchResults = true;
      } else {
        this.isNoSearchResults = false;
      }

      // return the result to enable view-model binding
      this.fileList = fileList;
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.msgListingComponent,
        MessageCenterConstants.methods.onSearch);
    }
  }

  public openPolicy() {
    try {
      if (this.eocPolicy && this.eocPolicy.URL) {
        window.location.href = this.eocPolicy.URL;
      } else {
        this.bcbsmaErrorHandler.logError(
          new Error(MessageCenterConstants.errorMessages.invalidFileItem),
          BcbsmaConstants.modules.messageCenterModule,
          MessageCenterConstants.components.documentsComponent,
          MessageCenterConstants.methods.openFolder
        );
      }
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.documentsListViewComponent,
        MessageCenterConstants.methods.openFile);
    }
    return;
  }

  public openFile(fileItem: RiderInterface) {
    try {
      if (fileItem && fileItem.riderURL) {
        // this.router.navigate([`/message-center/document-view/${fileItem.messageId}`]);
        window.location.href = fileItem.riderURL;
      } else {
        this.bcbsmaErrorHandler.logError(
          new Error(MessageCenterConstants.errorMessages.invalidFileItem),
          BcbsmaConstants.modules.messageCenterModule,
          MessageCenterConstants.components.documentsComponent,
          MessageCenterConstants.methods.openFolder
        );
      }
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.documentsListViewComponent,
        MessageCenterConstants.methods.openFile);
    }
    return;
  }
}
