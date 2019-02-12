import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FinancialsConstants } from '../constants/financials.constants';
import {BreadCrumb} from '../../../shared/components/breadcrumbs/breadcrumbs';

@Component({
  selector: 'app-make-payment-options',
  templateUrl: './make-payment-options.component.html',
  styleUrls: ['./make-payment-options.component.scss']
})
export class MakePaymentOptionsComponent implements OnInit {
  public financialConstants = FinancialsConstants;
  public breadCrumbs: BreadCrumb[];
  payOptionsForm: FormGroup;

  constructor(private fb: FormBuilder,
    private router: Router) {
  }

  ngOnInit() {
    this.breadCrumbs = [];
    this.prepareChildBreadCrumbs(this.router.url.split('/')[this.router.url.split('/').length - 3]);
    this.payOptionsForm = this.fb.group({
      whenToSubmit: ['now', [Validators.required]],
      whomToPay: ['payMe', [Validators.required]]
    });
  }

  makePayment() {
    const whomToPay = this.payOptionsForm.controls['whomToPay'].value;
    const whenToSubmit = this.payOptionsForm.controls['whenToSubmit'].value;
    // Navigate to the next step
    this.router.navigate(['/myfinancials/makepayment', whomToPay, whenToSubmit]);
  }

  navigateToMyFinanicals() {
    this.router.navigate(['/myfinancials']);
  }

  prepareChildBreadCrumbs(folderId) {
    this.breadCrumbs.push({
      label: 'Home',
      url: ['/home']
    });
    this.breadCrumbs.push({
      label: 'My Financials',
      url: ['/myfinancials']
    }, {
      label: 'Make Payment',
      url: ['/myfinancials/paymentoptions']
    });
  }

}
