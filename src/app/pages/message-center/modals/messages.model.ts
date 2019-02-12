import {
    MessageListingRequestModelInterface, MessageListingResponseModelInterface,
    InboxMessageModelInterface,
    UpdateMsgListingAndMemberAlertsRequestInterface,
    UpdateMsgListingAndMemberAlertsRespInterface,
    MessageIdInterface,
    MemAlertsResponseInterface
} from './interfaces/message.interface';

export class MessageListingRequestModel implements MessageListingRequestModelInterface {
    useridin: string;
}

export class MessageListingResponseModel implements MessageListingResponseModelInterface {
    hideEntityFromDisplay?: boolean;
    inboxmessageresponse: InboxMessageModel[];
    result?: number;
    displaymessage?: string;
}

export class InboxMessageModel implements InboxMessageModelInterface {
    LongText: string;
    ShortText: string;
    category: string;
    isDeleted: string;
    isRead: string;
    memberId: string;
    messageId: string;
    messageUpdatedDateTime: string;
    unreadmessagecount: number;
    rowNum?: number;
    selected?: boolean;
    type?: string;
    hideEntityFromDisplay?: boolean;

}

export class UpdateMsgListingAndMemberAlertsRequestModel implements UpdateMsgListingAndMemberAlertsRequestInterface {
    useridin: string;
    memberId: string;
    deletealertids?: string;
    readalertids?: string;
    unreadalertids?: string;
}

export class UpdateMsgListingAndMemberAlertsRespModel implements UpdateMsgListingAndMemberAlertsRespInterface {
    successresponse: MemAlertsResponseModel;
    result?: number;
    displaymessage?: string;
}

export class MemAlertsResponseModel implements MemAlertsResponseInterface {
    unreadMessageCount: number;
}
