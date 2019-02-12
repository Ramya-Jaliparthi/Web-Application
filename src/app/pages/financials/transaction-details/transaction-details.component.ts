import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { FinancialsConstants } from '../constants/financials.constants';
import { finalize } from 'rxjs/operators';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
import { BcbsmaConstants } from '../../../shared/constants/bcbsma.constants';
import { TransactionDetailsService } from './transaction-details.service';
import { TransactionDetailRequestModel, TransactionDetailRequestInterface, TransactionDetailResponseInterface } from '../models';

declare let $: any;

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss']
})
export class TransactionDetailsComponent implements OnInit, AfterViewInit {

  public financialConstants = FinancialsConstants;
  public transactionDetail: TransactionDetailResponseInterface[];
  public transactionDetail1: any;
  private editMode: boolean = true;
  private paidOutPocketAmount: number;

  public transactionDetailsMakePayment: boolean;
  public transactionDenied: boolean;
  public recurringPayment: boolean;
  private billingBreakdownWithEdit: boolean;

  constructor(private router: Router, private route: ActivatedRoute, private bcbsmaErrorHandler: BcbsmaerrorHandlerService,
    public transactionDetailService: TransactionDetailsService) {

  }

  ngOnInit() {
    try {
      const transactionDetailRequest: TransactionDetailRequestInterface = new TransactionDetailRequestModel();
      transactionDetailRequest.TransactionId = this.route.snapshot.paramMap.get('TransactionId');

      this.transactionDetailsMakePayment = true;
      this.transactionDenied = false;
      this.recurringPayment = false;
      this.billingBreakdownWithEdit = false;

      this.getTransactionDetail(transactionDetailRequest);

    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.financialModule,
        FinancialsConstants.components.transactionsDetailComponent,
        FinancialsConstants.methods.ngOnInit);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => $('.collapsible').collapsible(), 1000);
  }

  public getTransactionDetail(transactionDetailRequest: TransactionDetailRequestInterface) {
    this.transactionDetailService.getTransactionDetail(transactionDetailRequest).subscribe((transacData) => {
      try {
        if (transacData && Object.keys(transacData).length > 0) {
          this.transactionDetail = transacData;
          //console.log('transactionDetail' + this.transactionDetail);
          this.transactionDetail1 = JSON.stringify(this.transactionDetail);
          ///console.log('transactionDetail1' + this.transactionDetail1);
        }
      } catch (exception) {
        this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.financialModule,
          FinancialsConstants.components.transactionsDetailComponent,
          FinancialsConstants.methods.getTransactionDetail);
      }
    }, error => {
      this.bcbsmaErrorHandler.handleHttpError(error, BcbsmaConstants.modules.financialModule,
        FinancialsConstants.services.transactionDetailsService,
        FinancialsConstants.methods.getTransactionDetail);
    });
  }

  public editPaidOfPocket() {
    this.editMode = true;
  }

  public savePaidOfPocket() {
    this.editMode = false;
    console.log('paidOutPocketAmount - ' + this.paidOutPocketAmount);
  }

}
