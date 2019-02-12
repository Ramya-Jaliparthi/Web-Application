import { Component, OnInit } from '@angular/core';
import { MessageCenterConstants } from '../constants/messageCenter.constants';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
import { NoDocumentsFoundComponentModel } from '../modals/message-center.modal';
import { UploadsService } from './uploads.service';
import { UploadsResponseDataModelInterface, UploadDataItemInterface } from '../modals/interfaces/uploads.interface';
import { UploadsResponseDataModel } from '../modals/uploads.modal';
import { Router } from '@angular/router';
import {
  MessageCenterSearchFilterConsumer,
  MessageDetailsSearchResponseModelInterface,
  MessageCenterSearchFilterDateRanges,
  MessageCenterSearchCompOutputModelInterface
} from '../modals/interfaces/message-center-search.interface';
import { MessageDetailsSearchResponseModel, SearchCriteriaItem } from '../modals/message-center-search.model';
import * as moment from 'moment';
import { MessageCenterUtilities } from '../utils/message-center.utilities';
import {
  NoDocumentsFoundComponentConsumer,
  NoSearchResultsFoundComponentConsumer,
  NoDocumentsFoundComponentModelInterface
} from '../modals/interfaces/message-center.interface';
import { FileItemModelInterface } from '../modals/interfaces/documents.interface';

@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.scss']
})
export class UploadsComponent implements NoDocumentsFoundComponentConsumer,
  NoSearchResultsFoundComponentConsumer, MessageCenterSearchFilterConsumer {

  public no_doc_found_component_mode: NoDocumentsFoundComponentModelInterface = new NoDocumentsFoundComponentModel();
  public no_search_results_found_component_mode: NoDocumentsFoundComponentModelInterface = new NoDocumentsFoundComponentModel();
  public searchCriteriaData: MessageDetailsSearchResponseModelInterface = new MessageDetailsSearchResponseModel();
  public uploadedData: UploadsResponseDataModelInterface;
  public uploadsList: UploadDataItemInterface[];
  public hasDocuments: boolean = null;
  public isNoSearchResults: boolean = false;
  public mobileHideByFilterOverlay: boolean;

  private utils: MessageCenterUtilities = new MessageCenterUtilities();

  constructor(
    private bcbsmaErrorHandler: BcbsmaerrorHandlerService,
    private uploadsService: UploadsService,
    private router: Router
  ) {
    try {
      this.no_doc_found_component_mode.mode = MessageCenterConstants.flags.uploadsMode;
      this.no_search_results_found_component_mode.mode = MessageCenterConstants.flags.noSearchResultsMode;

      this.uploadedData = new UploadsResponseDataModel();
      this.uploadsList = this.uploadedData.uploadedData;

      this.uploadsService.getUploadedData().subscribe(
        data => {

          if (data) {
            this.uploadedData = data;
            this.uploadsList = data.uploadedData;
            if (this.uploadsList.length > 0) {
              this.hasDocuments = true;
            } else {
              this.hasDocuments = false;
            }
          }

          this.createSearchCriteria();

        },
        error => {
          this.bcbsmaErrorHandler.handleHttpError(error,
            BcbsmaConstants.modules.messageCenterModule,
            MessageCenterConstants.services.documentsService,
            MessageCenterConstants.methods.getDocumentViewData);
        }
      );
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.uploadsComponent,
        MessageCenterConstants.methods.constructor);
    }
  }

  public createSearchCriteria(): MessageDetailsSearchResponseModelInterface {
    const keywordList: string[] = [];
    const searchCriteriaData: MessageDetailsSearchResponseModelInterface = new MessageDetailsSearchResponseModel();
    try {

      const now = moment(new Date());
      let dateRangeInfo: MessageCenterSearchFilterDateRanges = {
        all_dates: 0,
        last_30_days: 0,
        last_60_days: 0,
        last_90_days: 0,
        year_to_date: 0
      };

      this.uploadsList.map((msgListItem) => {
        keywordList.push(msgListItem.ShortText);
        keywordList.push(msgListItem.LongText);
        dateRangeInfo = this.utils.trackAgeOfEntity(now, msgListItem.dateStamp, dateRangeInfo);
      });

      searchCriteriaData
        .addSortByFilter((new SearchCriteriaItem())
          .setCriteriaName(MessageCenterConstants.filters.sortByFilters.mostRecent))
        .addSortByFilter((new SearchCriteriaItem())
          .setCriteriaName(MessageCenterConstants.filters.sortByFilters.oldestFirst))

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
        MessageCenterConstants.components.uploadsComponent,
        MessageCenterConstants.methods.createSearchCriteria);
    }

    return searchCriteriaData;
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

    let uploadsList: UploadDataItemInterface[];
    try {

      // clear previous search results from view
      this.uploadsList = <UploadDataItemInterface[]>this.utils.clearPreviousSearchFlags(this.uploadsList);

      // clone the existing msg list to avoid performance issues due to intermitten model changes in view
      uploadsList = Object.assign([], this.uploadsList);

      // sort the message list as necessary based on the user selection
      const sortFilterKeys: string[] = searchCriteriaData.sortByFilterMap.getKeys();
      for (const sortKey of sortFilterKeys) {
        const sortCriteria = searchCriteriaData.sortByFilterMap.get(sortKey);
        if (sortCriteria.criteriaName === MessageCenterConstants.filters.sortByFilters.mostRecent && sortCriteria.criteriaSelected) {
          uploadsList.sort((msgItem_a, msgItem_b) => {
            const date1 = moment(new Date(msgItem_a.dateStamp));
            const date2 = moment(new Date(msgItem_b.dateStamp));
            return moment.duration(date2.diff(date1)).asDays();
          });
          break;
        } else if (sortCriteria.criteriaName === MessageCenterConstants.filters.sortByFilters.oldestFirst
          && sortCriteria.criteriaSelected) {
          uploadsList.sort((msgItem_a, msgItem_b) => {
            const date1 = moment(new Date(msgItem_a.dateStamp));
            const date2 = moment(new Date(msgItem_b.dateStamp));
            return moment.duration(date1.diff(date2)).asDays();
          });
          break;
        }

      }

      // apply date filters to the result obtained from the previous step
      uploadsList = <UploadDataItemInterface[]>this.utils.doDateFilter(uploadsList,
        searchCriteriaData, MessageCenterConstants.attributes.dateStamp);

      uploadsList = <UploadDataItemInterface[]>this.utils.doKeywordFilter(uploadsList,
        searchCriteriaData);

      // check if atleast one file item matches the search results. if not display the 'no-documents-found-component'
      if (!uploadsList.some((msgListItem) => {
        return !msgListItem.hideEntityFromDisplay;
      })) {
        this.isNoSearchResults = true;
      } else {
        this.isNoSearchResults = false;
      }

      // return the result to enable view-model binding
      this.uploadsList = uploadsList;
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.msgListingComponent,
        MessageCenterConstants.methods.onSearch);
    }
  }

  public openFile(uploadedFileItem: UploadDataItemInterface): void {
    try {
      if (uploadedFileItem && uploadedFileItem.messageId) {
        this.router.navigate([`/message-center/upload-detail/${uploadedFileItem.messageId}`]);
      } else {
        this.bcbsmaErrorHandler.logError(
          new Error(MessageCenterConstants.errorMessages.invalidFolderLocation),
          BcbsmaConstants.modules.messageCenterModule,
          MessageCenterConstants.components.uploadsComponent,
          MessageCenterConstants.methods.openFile
        );
      }
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.uploadsComponent,
        MessageCenterConstants.methods.openFile);
    }
  }
}
