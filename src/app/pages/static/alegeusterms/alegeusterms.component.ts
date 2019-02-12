import {Component, OnDestroy, OnInit} from '@angular/core';
import {StaticInfo} from '../../../shared/models/staticInfo.model';

@Component({
  templateUrl: './alegeusterms.component.html',
  styleUrls: ['./alegeusterms.component.scss']
})

export class AlegeustermsComponent implements OnInit, OnDestroy {
  disclosureTerms: any;
  reimbursementTerms: any;

  constructor() {
    this.disclosureTerms = sessionStorage.getItem('makepayment.disclosureTerms');
    this.reimbursementTerms = sessionStorage.getItem('makepayment.reimbursementTerms');
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    sessionStorage.removeItem('makepayment.disclosureTerms');
    sessionStorage.removeItem('makepayment.reimbursementTerms');
  }


}
