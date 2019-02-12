import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {BreadCrumb} from '../../../shared/components/breadcrumbs/breadcrumbs';
@Component({
  selector: 'app-make-payment-success',
  templateUrl: './make-payment-success.component.html',
  styleUrls: ['./make-payment-success.component.scss']
})
export class MakePaymentSuccessComponent implements OnInit {

  cardDetails = null;
  showCardDetails: boolean = true;
  showActivateCardOptions: boolean = false;

  transactionDetails: any;
  amountInt: number;
  amountDec: number;

  isPayProvider: boolean = false;
  submitNow: boolean = true;

  public breadCrumbs: BreadCrumb[];

  constructor(private r: ActivatedRoute,
              private router: Router) {

    this.isPayProvider = this.r.snapshot.paramMap.get('whomToPay') !== 'payMe';
    this.submitNow = this.r.snapshot.paramMap.get('whenToSubmit') === 'now';
  }

  ngOnInit() {
    this.breadCrumbs = [];
    this.prepareChildBreadCrumbs(this.router.url.split('/').join('/'));
    this.transactionDetails = {
      amount: 10000.00,
      name: 'John Doe',
      provider: 'Jane Smith',
      serviceType: 'Medical',
      note: 'Lorem Ipsum Dolor Sit Amet',
      dateOfTransaction: '01/01/2019',
      dateOfServiceStart: '12/29/2018',
      dateOfServiceEnd: '12/31/2018'
    };
  }

  showAllTransactions() {

  }

  // Methods to convert Transaction amount into decimal values
  public convertAmountToBaseValue(value) {
    return Math.trunc(value);
  }

  public convertAmountToDecimalValue(value) {
    const int_part = Math.trunc(value);
    const float_part = Number((value - int_part).toFixed(2));
    const decimal = float_part.toString().split('.');
    if (!decimal[1]) {
      const zero = '00';
      return zero;
    }
    return decimal[1];
  }

  prepareChildBreadCrumbs(folderId) {
    this.breadCrumbs.push({
      label: 'Home',
      url: ['/home']
    });
    this.breadCrumbs.push({
      label: 'My Financials',
      url: ['/myfinancials']
    });
    this.breadCrumbs.push({
      label: 'Payment Submitted',
      url: [this.router.url]
    });
  }

}
