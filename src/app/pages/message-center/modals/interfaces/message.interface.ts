import { FileItemModelInterface } from './documents.interface';

export interface MessageListingRequestModelInterface {
    useridin: string;
}

export interface MessageListingResponseModelInterface {
    hideEntityFromDisplay?: boolean;
    inboxmessageresponse: InboxMessageModelInterface[];
    result?: number;
    displaymessage?: string;
}


export class InboxMessageModelInterface {
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

export interface UpdateMsgListingAndMemberAlertsRequestInterface {
    useridin: string;
    memberId: string;
    deletealertids?: string;
    readalertids?: string;
    unreadalertids?: string;
}

export interface UpdateMsgListingAndMemberAlertsRespInterface {
    successresponse: MemAlertsResponseInterface;
    result?: number;
    displaymessage?: string;
}

export class MemAlertsResponseInterface {
    unreadMessageCount: number;
}
export interface MessageIdInterface {
    messageId: string;
}
