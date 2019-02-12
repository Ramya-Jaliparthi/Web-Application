import { Injectable } from '@angular/core';
import { MessageDetailResponseDataModel } from '../modals/message-detail.model';
import { ConstantsService } from '../../../shared/services/constants.service';
import { BcbsmaHttpService } from '../../../shared/services/bcbsma-http.service';
import { AuthHttp } from '../../../shared/services/authHttp.service';
import { Observable } from 'rxjs/Observable';
import { MessageDetailRequestDataModelInterface } from '../modals/interfaces/message-detail.interface';

@Injectable()
export class MessageDetailService {

  constructor(private constants: ConstantsService,
    private http: AuthHttp,
    private bcbsmaHttpService: BcbsmaHttpService) { }

  getMessageDetail(msgDetailReqParams: MessageDetailRequestDataModelInterface): Observable<MessageDetailResponseDataModel> {
    /*if (messageDetailRequest.fileId === 'message-detail-item') {
      url = '/assets/data/messageCenterModule/messageListingComponent_SampleData.json';
    }*/
    return this.http.encryptPost(this.constants.msgDetailUrl, msgDetailReqParams);
  }

}
