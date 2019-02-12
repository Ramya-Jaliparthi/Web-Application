import { TransactionDetailsSearchResponseModelInterface } from './filter-search-all-transaction.interface';

export interface AllTransactionSummaryInterface {
  DisplayName: string;
  TransactionAmt: 0;
  TransactionDate: string;
  TransactionId: string;
  TransactionStatus: string;
  TransactionType: string;
}

export interface TransactionSummaryResponseInterface {
  Completed: any[];
  Pending: any[];
  Action: any[];
  Others: any[];
}

export interface TransactionSummaryRequestInterface {
  userId: string;
}

export interface CommonDocumentEntityInterface {
  messageId: number;
  timeStamp: string;
  dateStamp: string;
  rowNum: number;
  alertShortTxt: string;
  alertLongTxt: string;
  hideEntityFromDisplay: boolean;
}

export interface AllTransactionNoDocsFoundPageModelInterface {
  title: string;
  noDocsMessage: string;
  containerInfo: string;
}

export interface NoDocumentsFoundComponentModelInterface {
  mode: string;
  title: string;
  searchCriteria: TransactionDetailsSearchResponseModelInterface;
}

export interface IHash<T> {
  [key: string]: T;
}

export interface HashMapInterface<T> {
  // map: IHash<T>;
  size: number;
  get(key: string): T;
  put(key: string, value: T): HashMapInterface<T>;
  contains(key: string): boolean;
  remove(key: string): HashMapInterface<T>;
  removeAll(): HashMapInterface<T>;
  getKeys(): string[];
  getValues(): T[];
}

export interface NoDocumentsFoundComponentConsumer {
  no_doc_found_component_mode: NoDocumentsFoundComponentModelInterface;
}

export interface NoSearchResultsFoundComponentConsumer {
  no_search_results_found_component_mode: NoDocumentsFoundComponentModelInterface;
  isNoSearchResults: boolean;
}

