import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { HeaderService } from '../../../shared/layouts/header/header.service';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
import { MsgListingService } from '../msg-listing/msg-listing.service';
import { MessageDetailService } from './message-detail.service';
import { AlertType } from '../../../shared/alerts/alertType.model';
import { AlertService } from '../../../shared/services/alert.service';

import {
  MessageDetailRequestDataModelInterface,
  MessageDetailResponseDataModelInterface,
  MessageDetailModelInterface
} from '../modals/interfaces/message-detail.interface';
import { switchMap } from 'rxjs/operators';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
import { MessageCenterConstants } from '../constants/messageCenter.constants';
import { MessageDetailRequestDataModel, MessageDetailResponseDataModel, MessageDetailModel } from '../modals/message-detail.model';
import { MessageCenterService } from '../message-center.service';
import { MessageCenterSearchService } from '../message-center-search/message-center-search.service';
import { BreadCrumb } from '../../../shared/components/breadcrumbs/breadcrumbs';
import {
  UpdateMsgListingAndMemberAlertsRequestInterface,
  MessageListingResponseModelInterface
} from '../modals/interfaces/message.interface';
import { UpdateMsgListingAndMemberAlertsRequestModel } from '../modals/messages.model';





@Component({
  selector: 'app-message-detail',
  templateUrl: './message-detail.component.html',
  styleUrls: ['./message-detail.component.scss']
})
export class MessageDetailComponent implements OnInit {

  public msgDetail: MessageDetailModelInterface = new MessageDetailModel();
  public category: string;
  public timeStamp: string;
  public breadCrumbs: BreadCrumb[];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private headerService: HeaderService,
    private bcbsmaErrorHandler: BcbsmaerrorHandlerService,
    private msgListingService: MsgListingService,
    private messageCenterService: MessageCenterService,
    private messageDetailService: MessageDetailService,
    private messageCenterSearchService: MessageCenterSearchService,
    private alertService: AlertService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.initBreadcrumbs();
    try {


      this.setMessageDetail();

      /*this.route.paramMap.pipe(
        switchMap((params: ParamMap, index: number) => {
          const messageDetailComponentRequest: MessageDetailRequestDataModelInterface = {
            'fileId': params.get('fileId')
          };
          return this.messageDetailService.getMessageDetail(messageDetailComponentRequest);
        })
      ).subscribe(
        data => {
          this.messageDetailData = new MessageDetailResponseDataModel();
          if (!data) {
            this.throwInvalidServiceResponseDataErrorInOnInit();
          }
          this.messageDetailData = data;
        },
        error => {
          this.bcbsmaErrorHandler.handleHttpError(error,
            BcbsmaConstants.modules.messageCenterModule,
            MessageCenterConstants.services.documentsService,
            MessageCenterConstants.methods.getMessageDetail);
        }
      );*/
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.messageDetailComponent,
        MessageCenterConstants.methods.ngOnInit);
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
    },
    {
      label: 'Messages',
      url: ['/message-center', 'messages']
    },
    {
      label: 'Message Detail',
      url: ['/message-center', 'message-detail']
    }
    ];
  }

  private setMessageDetail() {

    this.messageDetailService.getMessageDetail(this.setMsgDetailAndMemberAlertsReqParams()).subscribe(
      (apiData) => {
        if (apiData && Object.keys(apiData).length) {
          // this.timeStamp = this.messageCenterService.msgListingResponse.messageUpdatedDateTime;
          if (apiData.hasOwnProperty('messageDetailResponse') && Object.keys(apiData.messageDetailResponse).length) {
            this.msgDetail = apiData.messageDetailResponse;
            this.category = sessionStorage.getItem('category') ? sessionStorage.getItem('category') : '';
            if (this.messageCenterService.msgListingResponse.isRead === 'false') { // if it's already read, this call is not required
              this.markAsRead();
            }
          } else if (apiData.hasOwnProperty('result') && apiData.result !== 0) {
            this.alertService.setAlert('', apiData['displaymessage'], AlertType.Failure);
          }

        }
      });
  }

  public backToMsgListing() {
    try {
      this.messageCenterSearchService.isPersistSearchCriteria = true;
      this.router.navigate(['/message-center/messages']);
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.messageCenterModule,
        MessageCenterConstants.components.messageDetailComponent,
        MessageCenterConstants.methods.backToMsgListing);
    }
  }

  private throwInvalidServiceResponseDataErrorInOnInit(): void {
    this.bcbsmaErrorHandler.logError(
      new Error(MessageCenterConstants.errorMessages.invalidServiceResponseData),
      BcbsmaConstants.modules.messageCenterModule,
      MessageCenterConstants.components.messageDetailComponent,
      MessageCenterConstants.methods.ngOnInit
    );
  }

  public deleteMessage() {
    this.backToMsgListing();
    this.messageCenterService.msgListingResponse.type = 'delete';
  }

  public markAsUnread() {

    this.msgListingService.getUpdateMsgListingAndMemberAlerts(this.setMsgDetailAndMemberAlertsReqParams(false)).
      subscribe((apiData) => {
        if (apiData && Object.keys(apiData).length) {

          if (apiData.hasOwnProperty('result') && apiData.result !== 0) {
            this.alertService.setAlert('', apiData['displaymessage'], AlertType.Failure);
          } else {
            this.headerService.unReadMsgCount = apiData.successresponse.unreadMessageCount.toString();
            this.backToMsgListing();
          }

        }
      });
  }

  public markAsRead() {
    this.msgListingService.getUpdateMsgListingAndMemberAlerts(this.setMsgDetailAndMemberAlertsReqParams(true)).
      subscribe((apiData) => {
        if (apiData && Object.keys(apiData).length) {
          if (apiData.hasOwnProperty('result') && apiData.result !== 0) {
            this.alertService.setAlert('', apiData['displaymessage'], AlertType.Failure);
          } else {
            console.log(apiData);
            this.headerService.unReadMsgCount = apiData.successresponse.unreadMessageCount.toString();
          }

        }
      });

  }

  public formattedDate(date: string, format: string): string {
    if (date) {
      return this.datePipe.transform(date, format);
    }
  }

  private setMsgDetailAndMemberAlertsReqParams(isMsgRead?: boolean): any {

    const memberId = sessionStorage.getItem('memberId') ? sessionStorage.getItem('memberId') : '',
      messageId = sessionStorage.getItem('messageId') ? sessionStorage.getItem('messageId') : '',
      useridin = this.authService.useridin;

    if (typeof isMsgRead === 'boolean') {
      const updateMsgListingAndMemberAlertsReqParams: UpdateMsgListingAndMemberAlertsRequestInterface
        = new UpdateMsgListingAndMemberAlertsRequestModel();

      if (isMsgRead === true) {
        updateMsgListingAndMemberAlertsReqParams.readalertids = messageId;
      } else {
        updateMsgListingAndMemberAlertsReqParams.unreadalertids = messageId;
      }
      updateMsgListingAndMemberAlertsReqParams.useridin = useridin;
      updateMsgListingAndMemberAlertsReqParams.memberId = memberId;
      return updateMsgListingAndMemberAlertsReqParams;
    } else {
      const msgDetailReqParams: MessageDetailRequestDataModelInterface = new MessageDetailRequestDataModel();
      msgDetailReqParams.memberId = memberId;
      msgDetailReqParams.messageId = messageId;
      msgDetailReqParams.useridin = useridin;

      return msgDetailReqParams;
    }
    // return;

  }

}
