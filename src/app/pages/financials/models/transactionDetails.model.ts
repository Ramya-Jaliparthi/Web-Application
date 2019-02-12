import { TransactionDetailRequestInterface, TransactionDetailResponseInterface } from './interfaces';

export class TransactionDetailRequestModel implements TransactionDetailRequestInterface {
  TransactionId: string;
}

export class TransactionDetailResponseModel implements TransactionDetailResponseInterface {
  AccTypeCode: string;
  Amount: number;
  ApprovedAmount: number;
  TransactionCode: number;
  TransactionDate: string;
  TransactionDesc: string;
  TransactionId: string;
  TransactionStatus: number;
}
