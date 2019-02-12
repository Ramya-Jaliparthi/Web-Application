import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  MessageListingRequestModelInterface, UpdateMsgListingAndMemberAlertsRequestInterface,
  UpdateMsgListingAndMemberAlertsRespInterface
} from '../modals/interfaces/message.interface';
import {
  MessageListingRequestModel, MessageListingResponseModel, InboxMessageModel,
  UpdateMsgListingAndMemberAlertsRespModel
} from '../modals/messages.model';
import { BcbsmaHttpService } from '../../../shared/services/bcbsma-http.service';
import { ConstantsService } from '../../../shared/services/constants.service';
import { AuthService } from '../../../shared/services/auth.service';
import { AuthHttp } from '../../../shared/services/authHttp.service';

@Injectable()
export class MsgListingService {
  // public msgListingResponse: InboxMessageModel;
  constructor(private bcbsmaHttpService: BcbsmaHttpService,
    private constants: ConstantsService,
    private authService: AuthService,
    private http: AuthHttp
  ) {
    // this.msgListingResponse = new InboxMessageModel();


  }

  getMsgListing(): Observable<MessageListingResponseModel> {
    const msgListingReqParams: MessageListingRequestModelInterface = new MessageListingRequestModel();
    msgListingReqParams.useridin = this.authService.useridin;
    return this.http.encryptPost(this.constants.msgListingUrl, msgListingReqParams);
    /*.map((response) => {
      return <MessageListingResponseModel>response;
    });*/
  }

  getUpdateMsgListingAndMemberAlerts(msgListingAndMemberAlertsReqParams:
    UpdateMsgListingAndMemberAlertsRequestInterface): Observable<UpdateMsgListingAndMemberAlertsRespModel> {
    return this.http.encryptPost(this.constants.updateMsgListingAndMemAlertsUrl, msgListingAndMemberAlertsReqParams);
    // .map(response => <UpdateMsgListingAndMemberAlertsRespModel>response);
  }

}
