import {
  AllTransactionNoDocsFoundPageModelInterface,
  NoDocumentsFoundComponentModelInterface,
  TransactionSummaryRequestInterface, TransactionSummaryResponseInterface
} from './interfaces/all-transaction.interface';
import { TransactionDetailsSearchResponseModelInterface } from './interfaces/filter-search-all-transaction.interface';

export class CommonDocumentEntity {
  messageId: number;
  timeStamp: string;
  dateStamp: string;
  rowNum: number;
  alertShortTxt: string;
  alertLongTxt: string;
  hideEntityFromDisplay: boolean;
}

export class TransactionSummaryResponseModel implements TransactionSummaryResponseInterface {
  public Completed: any[];
  public Pending: any[];
  public Action: any[];
  public Others: any[];
}

export class TransactionSummaryRequestModel implements TransactionSummaryRequestInterface {
  public userId: string;
}

export class AllTransactionNoDocsFoundPageModel implements AllTransactionNoDocsFoundPageModelInterface {
  title = '';
  noDocsMessage = 'Your search did not match any documents';
  containerInfo = 'Clear or change search conditions to view documents';
}

export class AllTransactionNoTransactionsFoundPageModel implements AllTransactionNoDocsFoundPageModelInterface {
  title = 'Transactions';
  noDocsMessage = 'You don\'t have any Transactions.';
  containerInfo = 'Transactions from Blue Cross Blue Shield of MA will show up here.';
}

export class NoDocumentsFoundComponentModel implements NoDocumentsFoundComponentModelInterface {
  mode: string;
  title: string;
  searchCriteria: TransactionDetailsSearchResponseModelInterface;
}
