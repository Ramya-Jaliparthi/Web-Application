import { MessageCenterNoDocsFoundPageModelInterface, NoDocumentsFoundComponentModelInterface } from './interfaces/message-center.interface';
import { MessageDetailsSearchResponseModelInterface } from './interfaces/message-center-search.interface';

export class CommonDocumentEntity {
    messageId: string;
    messageUpdatedDateTime: string;
    dateStamp: string;
    rowNum?: number;
    ShortText: string;
    LongText: string;
    hideEntityFromDisplay?: boolean;
}

export class MessageCenterNoSearchResultsFoundPageModel implements MessageCenterNoDocsFoundPageModelInterface {
    title = '';
    noDocsMessage = 'Your search did not match any documents';
    containerInfo = 'Clear or change search conditions to view documents';
}

export class MessageCenterNoMessagesFoundPageModel implements MessageCenterNoDocsFoundPageModelInterface {
    title = 'Messages';
    noDocsMessage = 'You don\'t have any messages.';
    containerInfo = 'Messages sent from Blue Cross Blue Shield of MA will show up here.';
}

export class MessageCenterNoDocumentsFoundPageModel implements MessageCenterNoDocsFoundPageModelInterface {
    title = 'My Documents';
    noDocsMessage = 'You don\'t have any documents.';
    containerInfo = 'Documents from Blue Cross Blue Shield of MA will show up here.';
}

export class MessageCenterNoPlanDocumentsFoundPageModel implements MessageCenterNoDocsFoundPageModelInterface {
    title = 'My Plan Documents';
    noDocsMessage = 'You don\'t have any plan documents.';
    containerInfo = 'Plan documents from Blue Cross Blue Shield of MA will show up here.';
}

export class MessageCenterNoUploadsFoundPageModel implements MessageCenterNoDocsFoundPageModelInterface {
    title = 'My Uploads';
    noDocsMessage = 'You don\'t have any uploads';
    containerInfo = 'Uploads to MyBlue will show up here';
}

export class NoDocumentsFoundComponentModel implements NoDocumentsFoundComponentModelInterface {
    mode: string;
    title: string;
    searchCriteria: MessageDetailsSearchResponseModelInterface;
}
