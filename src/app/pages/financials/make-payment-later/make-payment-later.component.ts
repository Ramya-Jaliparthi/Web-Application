import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {BreadCrumb} from '../../../shared/components/breadcrumbs/breadcrumbs';
import { Breadcrumb } from 'primeng/primeng';

@Component({
  selector: 'app-make-payment-later',
  templateUrl: './make-payment-later.component.html',
  styleUrls: ['./make-payment-later.component.scss']
})
export class MakePaymentLaterComponent implements OnInit {

  transactionDetails: any;
  amountInt: number;
  amountDec: number;

  recieptsUploaded: boolean = false;

  isPayProvider: boolean = false;
  public breadCrumbs: BreadCrumb[];

  constructor(private r: ActivatedRoute,
              private router: Router,
              private location: Location) {

    this.isPayProvider = this.r.snapshot.paramMap.get('whomToPay') !== 'payMe';
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

  editPayment() {
    this.location.back();
  }

  submitPayment() {

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
      label: 'Saved Payment',
      url: [this.router.url]
    });
  }
}
