import { Component, Directive, OnInit, NgModule, ViewEncapsulation, Host, HostListener, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageCenterConstants } from '../constants/messageCenter.constants';
import { Router, ActivatedRoute } from '@angular/router';
import { UpdateMsgListingAndMemberAlertsRequestInterface } from '../modals/interfaces/message.interface';
import { MessageListingResponseModel, UpdateMsgListingAndMemberAlertsRequestModel, InboxMessageModel } from '../modals/messages.model';
import { MsgListingService } from './msg-listing.service';
import { MessageCenterService } from '../message-center.service';
import { FileItemModelInterface } from '../modals/interfaces/documents.interface';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
import { AuthService } from '../../../shared/services/auth.service';
import { HeaderService } from '../../../shared/layouts/header/header.service';
import { AlertType } from '../../../shared/alerts/alertType.model';
import { AlertService } from '../../../shared/services/alert.service';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
import {
  MessageCenterSearchFilterConsumer,
  MessageDetailsSearchResponseModelInterface,
  MessageCenterSearchFilterDateRanges,
  SearchCriteriaItemInterface,
  MessageCenterSearchCompOutputModelInterface
} from '../modals/interfaces/message-center-search.interface';
import { MessageDetailsSearchResponseModel, SearchCriteriaItem } from '../modals/message-center-search.model';
import * as moment from 'moment';
import { MessageCenterUtilities } from '../utils/message-center.utilities';
import { NoDocumentsFoundComponentModel } from '../modals/message-center.modal';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { NoDocumentsFoundComponentConsumer, NoSearchResultsFoundComponentConsumer } from '../modals/interfaces/message-center.interface';
import { ConstantsService } from '../../../shared/shared.module';

@Component({
  selector: 'app-msg-listing',
  templateUrl: './msg-listing.component.html',
  styleUrls: ['./msg-listing.component.scss']
})
export class MsgListingComponent implements OnInit, NoDocumentsFoundComponentConsumer,
  NoSearchResultsFoundComponentConsumer {

  public no_doc_found_component_mode: NoDocumentsFoundComponentModel = new NoDocumentsFoundComponentModel();
  public no_search_results_found_component_mode: NoDocumentsFoundComponentModel = new NoDocumentsFoundComponentModel();

  public searchCriteriaData: MessageDetailsSearchResponseModelInterface = new MessageDetailsSearchResponseModel();
  public msgCount: number = 0;
  public isDeleteListing: boolean = false;
  public isUndoListing: boolean = false;
  public isDisplayBanner: boolean = false;
  public IsHideBanner: boolean = false;
  public isDisplayUndo: boolean = false;
  public msgListingResponse: MessageListingResponseModel;
  public msgListing: InboxMessageModel[] = [];
  public isMsgNotAvailable: boolean = false;
  public isNoSearchResults: boolean = false;
  public mobileHideByFilterOverlay: boolean;
  public applyFilterFlag: boolean;
  public showClearLink: boolean = false;
  public filterMsgCount: Object[];

  private utils: MessageCenterUtilities = new MessageCenterUtilities();
  private deletedMsgListing: any = [];
  private deletedMessageIds: string;
  private undoTimeout: any;
  private memberId: string;
  public fpoTargetUrl = this.constants.drupalTestUrl + '/page/myinbox-nomessages';

  constructor(public el: ElementRef, private router: Router,
    private route: ActivatedRoute,
    private messagesService: MsgListingService,
    private messageCenterService: MessageCenterService,
    private authservice: AuthService,
    private headerService: HeaderService,
    private bcbsmaErrorHandler: BcbsmaerrorHandlerService,
    private alertService: AlertService,
    private datePipe: DatePipe,
    private constants: ConstantsService
  ) {
    this.no_doc_found_component_mode.mode = MessageCenterConstants.flags.messagesMode;
    this.no_search_results_found_component_mode.mode = MessageCenterConstants.flags.noSearchResultsMode;

  }

  public clearFilter() {
    const clearButtonInFilterSection: HTMLButtonElement = <HTMLButtonElement>document.getElementsByClassName('clear-filter-button')[0];
    clearButtonInFilterSection.click();
  }

  ngOnInit() {
    try {
      this.setMsgListing();
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.msgListingComponent,
        MessageCenterConstants.methods.ngOnInit);
    }
  }

  // Show banner section on window scroll to clear and delete message listing
  @HostListener('window:scroll', ['$event'])
  showBannerOnWindowScroll($event) {

    const msgListingPos = this.el.nativeElement.offsetTop;
    const windowScrollPos = window.pageYOffset;

    if (windowScrollPos > msgListingPos) {
      if (this.msgCount > 0) {
        this.isDisplayBanner = true;
        this.IsHideBanner = true;
      }
    } else {
      this.isDisplayBanner = false;
      this.IsHideBanner = false;
    }

  }



  public createSearchCriteria(): MessageDetailsSearchResponseModelInterface {
    const searchCriteriaData: MessageDetailsSearchResponseModelInterface = new MessageDetailsSearchResponseModel();
    const keywordList: string[] = [];
    try {
      const now = moment(new Date());
      let dateRangeInfo: MessageCenterSearchFilterDateRanges = {
        all_dates: 0,
        last_30_days: 0,
        last_60_days: 0,
        last_90_days: 0,
        year_to_date: 0
      };
      const uniqueCategoryMap: string[] = [];
      this.msgListing.map((msgListItem) => {
        keywordList.push(msgListItem.ShortText);
        keywordList.push(msgListItem.LongText);

        const categoryName: string = msgListItem.category;
        dateRangeInfo = this.utils.trackAgeOfEntity(now, msgListItem.messageUpdatedDateTime, dateRangeInfo);

        if (uniqueCategoryMap.indexOf(categoryName) === -1) {
          uniqueCategoryMap.push(categoryName);
          searchCriteriaData.addCategoryFilter(
            (new SearchCriteriaItem()).setCriteriaName(categoryName)
              .setMatchingResultsCount(1)
          );
        } else {
          searchCriteriaData.categoryFilterMap.get(categoryName).matchingResultsCount++;
        }
        return;
      });

      searchCriteriaData.keywordList = keywordList;

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

      this.searchCriteriaData = searchCriteriaData;
      this.no_search_results_found_component_mode.searchCriteria = searchCriteriaData;
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.msgListingComponent,
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

    let messageList: InboxMessageModel[];
    this.applyFilterFlag = searchFilterOptions.applyFilter;
    try {

      this.showClearLink = false;

      // clear previous search results from view
      this.msgListing = <InboxMessageModel[]>this.utils.clearPreviousSearchFlags(this.msgListing);

      // clone the existing msg list to avoid performance issues due to intermitten model changes in view
      messageList = Object.assign([], this.msgListing);

      // sort the message list as necessary based on the user selection
      const sortFilterKeys: string[] = searchCriteriaData.sortByFilterMap.getKeys();
      for (const sortKey of sortFilterKeys) {
        const sortCriteria = searchCriteriaData.sortByFilterMap.get(sortKey);
        if (sortCriteria.criteriaName === MessageCenterConstants.filters.sortByFilters.mostRecent &&
          sortCriteria.criteriaSelected) {
          messageList.sort((msgItem_a, msgItem_b) => {
            const date1 = moment(new Date(msgItem_a.messageUpdatedDateTime));
            const date2 = moment(new Date(msgItem_b.messageUpdatedDateTime));
            return moment.duration(date2.diff(date1)).asDays() ||
              this.compareStringField(msgItem_b.ShortText, msgItem_a.ShortText);
          });
          break;
        } else if (sortCriteria.criteriaName === MessageCenterConstants.filters.sortByFilters.oldestFirst
          && sortCriteria.criteriaSelected) {
          this.showClearLink = true;
          messageList.sort((msgItem_a, msgItem_b) => {
            const date1 = moment(new Date(msgItem_a.messageUpdatedDateTime));
            const date2 = moment(new Date(msgItem_b.messageUpdatedDateTime));
            return moment.duration(date1.diff(date2)).asDays();
          });
          break;
        } else if (sortCriteria.criteriaName === MessageCenterConstants.filters.sortByFilters.unreadFirst
          && sortCriteria.criteriaSelected) {
          this.showClearLink = true;
          messageList.sort((msgItem_a, msgItem_b) => {
            const date1 = moment(new Date(msgItem_a.messageUpdatedDateTime));
            const date2 = moment(new Date(msgItem_b.messageUpdatedDateTime));
            return moment.duration(date2.diff(date1)).asDays();
          }).sort((msgItem_a, msgItem_b) => {
            const refA = msgItem_a.isRead === 'true' ? 1 : 0;
            const refB = msgItem_b.isRead === 'true' ? 1 : 0;
            return refA - refB;
          });
          break;
        }
      }


      const categoryFilterKeys: string[] = searchCriteriaData.categoryFilterMap.getKeys();
      const selectedCategoryNames: string[] = [];
      for (const categoryKey of categoryFilterKeys) {
        if (searchCriteriaData.categoryFilterMap.get(categoryKey).criteriaSelected) {
          selectedCategoryNames.push(categoryKey);
        }
      }

      // do nothing if no category is selected and skip to next step
      // if atleast one is selected hide message items in categories that are not selected
      if (selectedCategoryNames.length > 0) {
        this.showClearLink = true;
        messageList = messageList.map((msgListItem) => {
          const categoryName: string = msgListItem.category;
          if (selectedCategoryNames.indexOf(categoryName) !== -1) {
            // this.msgListingResponse.hideEntityFromDisplay = false;
            msgListItem.hideEntityFromDisplay = false;
          } else {
            msgListItem.hideEntityFromDisplay = true;
            // this.msgListingResponse.hideEntityFromDisplay = true;
          }
          return msgListItem;
        });
      } else {
        messageList = messageList.map((msgListItem) => {
          msgListItem.hideEntityFromDisplay = false;
          return msgListItem;
        });
      }

      // apply date filters to the result obtained from the previous step
      const refMessageList = Object.assign([], messageList);
      let refMessageEntityDisplayCount: number = 0;
      refMessageList.map(refMsgEntity => {
        if (refMsgEntity.hideEntityFromDisplay) {
          refMessageEntityDisplayCount++;
        }
      });

      messageList = <InboxMessageModel[]>this.utils.doDateFilter(refMessageList, searchCriteriaData,
        MessageCenterConstants.attributes.messageUpdatedDateTime);
      let messageEntityDisplayCount: number = 0;
      messageList.map(msgList => {
        if (msgList.hideEntityFromDisplay) {
          messageEntityDisplayCount++;
        }
      });

      if (refMessageEntityDisplayCount !== messageEntityDisplayCount) {
        this.showClearLink = true;
      }


      messageList = <InboxMessageModel[]>this.utils.doKeywordFilter(messageList, searchCriteriaData);
      // check if atleast one file item matches the search results. if not display the 'no-documents-found-component'
      if (!messageList.some((msgListItem) => {
        return !msgListItem.hideEntityFromDisplay;
        // return !this.msgListingResponse.hideEntityFromDisplay;
      })) {
        this.isNoSearchResults = true;
      } else {
        this.isNoSearchResults = false;
      }

      // return the result to enable view-model binding
      this.msgListing = messageList;
      this.filterMsgCount = messageList.filter(oMessageList => oMessageList.hideEntityFromDisplay === false);

    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.msgListingComponent,
        MessageCenterConstants.methods.onSearch);
    }
  }

  public setMsgListing() {


    this.messagesService.getMsgListing().subscribe((apiData) => {
      if (apiData && Object.keys(apiData).length) {
        if (!apiData.hasOwnProperty('result') && apiData.result !== 0) {
          if (apiData.hasOwnProperty('inboxmessageresponse') && apiData.inboxmessageresponse.length) {
            const msgListing = apiData.inboxmessageresponse.filter(oMsgListing => oMsgListing.isDeleted === 'false');
            if (msgListing.length) {
              this.msgListing = msgListing;
              this.createSearchCriteria();
              setTimeout(() => {
                if (Object.keys(this.messageCenterService.msgListingResponse).length &&
                  this.messageCenterService.msgListingResponse.type === 'delete') {
                  this.deleteMsgListing(this.messageCenterService.msgListingResponse);
                }
              }, 100);


            } else {
              this.isMsgNotAvailable = true;

            }

          }
        } else {
          if (apiData.result === -90704) {
            this.isMsgNotAvailable = true;
          } else {
            this.alertService.setAlert('', apiData['displaymessage'], AlertType.Failure);
          }
        }

      } else {
        this.isMsgNotAvailable = true;
      }




      /*try {
        if (apiData && Object.keys(apiData).length) {
          // if (Object.keys(apiData.ROWSET).length && apiData.ROWSET.ROWS.length) {
          // this.msgListing = apiData.ROWSET.ROWS;
          this.createSearchCriteria();
          // }
        }
      } catch (exception) {
        this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
          MessageCenterConstants.components.msgListingComponent,
          MessageCenterConstants.methods.setMsgListing);
      }

    }, error => {
      this.bcbsmaErrorHandler.handleHttpError(error, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.services.messagesService, MessageCenterConstants.methods.getMsgListing);*/
    });
  }

  public getSelectedMsgListing(oMsgListing, oMsgCheckBox) {
    try {
      if (!this.isDeleteListing && this.isUndoListing) {
        this.msgCount = 0;
      }

      if (oMsgCheckBox.checked) {
        this.msgCount++;
        oMsgListing.selected = true;
        this.isDeleteListing = true;
      } else {
        this.msgCount--;
        oMsgListing.selected = false;
      }

      if (this.msgCount <= 0) {
        this.isDeleteListing = false;
      }

      this.isUndoListing = false;
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.msgListingComponent,
        MessageCenterConstants.methods.getSelectedMsgListing);
    }
  }


  public deleteMsgListing(oMsgListingResp?: InboxMessageModel) {
    try {
      this.isDeleteListing = false;
      this.isUndoListing = true;
      this.deletedMsgListing = [];
      this.deletedMessageIds = '';

      if (oMsgListingResp) {
        this.msgCount = 1;
        this.deletedMessageIds = oMsgListingResp.messageId;
        this.memberId = oMsgListingResp.memberId;
        this.deletedMsgListing.push({
          deletedMsgs: this.msgListing[oMsgListingResp.rowNum],
          deletedMsgIndex: oMsgListingResp.rowNum
        });
        this.msgListing.splice(oMsgListingResp.rowNum, 1);
      } else {
        const msgListingLen: number = this.msgListing.length;
        for (let index = msgListingLen - 1; index >= 0; index -= 1) {
          if (this.msgListing[index].selected) {
            this.memberId = this.msgListing[index].memberId;
            if (!this.deletedMessageIds) {
              this.deletedMessageIds = this.msgListing[index].messageId;
            } else {
              this.deletedMessageIds += '|' + this.msgListing[index].messageId;
            }
            this.deletedMsgListing.push({ deletedMsgs: this.msgListing[index], deletedMsgIndex: index });
            this.msgListing.splice(index, 1);
          }
        }

      }

      this.removeUndoOption();


    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.msgListingComponent,
        MessageCenterConstants.methods.deleteMsgListing);
    }
  }

  public undoMsgListing() {
    try {
      this.isDeleteListing = false;
      this.isUndoListing = false;
      this.msgCount = 0;

      if (this.undoTimeout) {
        clearTimeout(this.undoTimeout); // Reset the undo timeout
        this.isDisplayUndo = false;

      }

      const deletedMsgListingLen: number = this.deletedMsgListing.length;

      for (let index = deletedMsgListingLen - 1; index >= 0; index -= 1) {
        this.deletedMsgListing[index].deletedMsgs.selected = false;
        this.msgListing.splice(this.deletedMsgListing[index].deletedMsgIndex, 0,
          this.deletedMsgListing[index].deletedMsgs);
      }
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.msgListingComponent,
        MessageCenterConstants.methods.undoMsgListing);
    }
  }

  public removeUndoOption() {

    try {

      // let self=this;
      if (this.undoTimeout) {
        clearTimeout(this.undoTimeout); // Reset the undo timeout
        this.isDisplayUndo = false;

      }

      // To remove the undo option after 3 secs
      this.undoTimeout = setTimeout(() => {


        this.updateMsgListingAndMemberAlerts();


      }, 30000);
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.msgListingComponent,
        MessageCenterConstants.methods.removeUndoOption);
    }
  }

  public clearMsgListing() {
    try {
      this.msgCount = 0;
      this.isDeleteListing = false;
      this.msgListing.forEach((msg) => {
        msg.selected = false;
      });
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.msgListingComponent,
        MessageCenterConstants.methods.clearMsgListing);
    }
  }

  public showMsgDetails(oMsg, index) {
    try {

      this.messageCenterService.msgListingResponse = oMsg;
      this.messageCenterService.msgListingResponse.rowNum = index;
      sessionStorage.setItem('messageId', oMsg.messageId);
      sessionStorage.setItem('memberId', oMsg.memberId);
      sessionStorage.setItem('category', oMsg.category);
      this.router.navigate(['/message-center/message-detail']);
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.msgListingComponent,
        MessageCenterConstants.methods.showMsgDetails);
    }
  }

  public updateMsgListingAndMemberAlerts() {

    const updateMsgListingAndMemberAlertsReqParams: UpdateMsgListingAndMemberAlertsRequestInterface
      = new UpdateMsgListingAndMemberAlertsRequestModel();

    if (this.deletedMessageIds) {
      updateMsgListingAndMemberAlertsReqParams.deletealertids = this.deletedMessageIds;
    }

    updateMsgListingAndMemberAlertsReqParams.memberId = this.memberId;
    updateMsgListingAndMemberAlertsReqParams.useridin = this.authservice.useridin;

    this.messagesService.getUpdateMsgListingAndMemberAlerts(updateMsgListingAndMemberAlertsReqParams).subscribe((apiData) => {
      if (apiData && Object.keys(apiData).length) {
        if (apiData.hasOwnProperty('result') && apiData.result !== 0) {
          this.alertService.setAlert('', apiData['displaymessage'], AlertType.Failure);
        } else {
          // this.msgListing.filter(oMsgListing => oMsgListing.isDeleted === 'false');
          this.isDisplayUndo = true;
          this.msgCount = 0;
          this.messageCenterService.msgListingResponse.type = '';
          this.applyFilterFlag = false;
          this.setMsgListing();
          this.headerService.unReadMsgCount = apiData.successresponse.unreadMessageCount.toString();
        }
      }
    });


  }

  compareStringField(value1: string, value2: string) {
    if (value1 === value2) {
      return 0;
    }
    return value1 > value2 ? -1 : 1;
  }

  public formattedDate(date: string): string {

    if (moment(date).isValid()) {
      let format: string = 'MMM dd, y'; // Default Format
      const currentDate = moment().format('YYYY-MM-DD'),
        msgDate = moment(date).format('YYYY-MM-DD');

      if (moment(msgDate).isSame(currentDate, 'day')) {  // For Checking same day or not
        format = 'hh:mm a';
      } else if (moment(msgDate).isSame(currentDate, 'year')) { // For Checking same year or not
        format = 'MMM dd';
      }

      return this.datePipe.transform(date, format);
    }

    return '';
  }
}
