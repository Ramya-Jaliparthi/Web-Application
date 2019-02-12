import { Injectable } from '@angular/core';
import { InboxMessageModel } from './modals/messages.model';

@Injectable()
export class MessageCenterService {
  public msgListingResponse: InboxMessageModel;
  constructor() {
    this.msgListingResponse = new InboxMessageModel();
  }

}
