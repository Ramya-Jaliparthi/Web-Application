
export interface TransactionDetailRequestInterface {
  TransactionId: string;
}

export interface TransactionDetailResponseInterface {
  AccTypeCode: string;
  Amount: number;
  ApprovedAmount: number;
  TransactionCode: number;
  TransactionDate: string;
  TransactionDesc: string;
  TransactionId: string;
  TransactionStatus: number;
}
