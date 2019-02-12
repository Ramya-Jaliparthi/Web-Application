import { NoDocumentsFoundComponentModel } from '../message-center.modal';
import { MessageDetailsSearchResponseModelInterface } from './message-center-search.interface';

export interface CommonDocumentEntityInterface {
    messageId: string;
    messageUpdatedDateTime: string;
    dateStamp?: string;
    rowNum?: number;
    ShortText: string;
    LongText: string;
    hideEntityFromDisplay?: boolean;
}

export interface MessageCenterNoDocsFoundPageModelInterface {
    title: string;
    noDocsMessage: string;
    containerInfo: string;
}

export interface NoDocumentsFoundComponentModelInterface {
    mode: string;
    title: string;
    searchCriteria: MessageDetailsSearchResponseModelInterface;
}

export interface NoDocumentsFoundComponentConsumer {
    no_doc_found_component_mode: NoDocumentsFoundComponentModelInterface;
}

export interface NoSearchResultsFoundComponentConsumer {
    no_search_results_found_component_mode: NoDocumentsFoundComponentModelInterface;
    isNoSearchResults: boolean;
}
