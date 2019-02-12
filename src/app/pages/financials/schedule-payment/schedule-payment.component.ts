import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FinancialsConstants} from '../constants/financials.constants';
import {BcbsmaerrorHandlerService} from '../../../shared/services/bcbsmaerror-handler.service';
import {Router, ActivatedRoute} from '@angular/router';
import {ValidationService} from '../../../shared/shared.module';
import * as moment from 'moment';
import {TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-schedule-payment',
  templateUrl: './schedule-payment.component.html',
  styleUrls: ['./schedule-payment.component.scss']
})
export class SchedulePaymentComponent implements OnInit {

  public financialConstants = FinancialsConstants;
  schedulePaymentForm: FormGroup;
  members: Object[];
  services: Object[];
  providers: Object[];
  reimbursmentMethods: Object[];
  upload_files: any[];
  localUrl: any[];
  dateMask: Array<any>;
  isFormSubmitted: boolean = false;

  amountMessages = {
    'required': 'You must enter a valid amount.',
    'invalidAmount': 'You must enter a valid amount.',
  };

  serviceTypeMessages = {
    'required': 'Please make a selection',
  };

  memberMessages = {
    'required': 'Please select a member',
  };

  reimbursmentMessages = {
    'required': 'Please select a Reimbursment method'
  };

  serviceStartDateMessages = {
    'required': 'Start Date is required.',
    'invalidDate': 'Please enter date in the format of MM/DD/YYYY.',
  };

  serviceEndDateMessages = {
    'required': 'End Date is required.',
    'invalidDate': 'Please enter date in the format of MM/DD/YYYY.',
    'invalidEndDate': 'End Date may not be before the Start Date.',
  };

  constructor(private fb: FormBuilder,
              private router: Router,
              private r: ActivatedRoute,
              private titleCase: TitleCasePipe,
              private validationService: ValidationService,
              private bcbsmaErrorHandler: BcbsmaerrorHandlerService) {
    this.schedulePaymentForm = this.fb.group({
      selectProvider: ['', [Validators.required]],
      reimbursmentMethod: ['', [Validators.required]],
      reimbursmentAmount: ['', [Validators.required, this.validationService.paymentAmountValidator()]],
      billedAmount: ['', [Validators.required, this.validationService.paymentAmountValidator()]],
      member: ['', [Validators.required]],
      serviceType: ['', [Validators.required]],
      serviceStartDate: ['', [Validators.required, this.validationService.dateValidator()]],
      serviceEndDate: ['', [Validators.required, this.validationService.dateValidator()]],
      paymentReciept: ['', [Validators.required]],

      amountAllowedByInsurance: ['', [Validators.required, this.validationService.paymentAmountValidator()]],
      insurancePaidAmount: ['', [Validators.required, this.validationService.paymentAmountValidator()]],
      paidNonReimbursableAmount: ['', [Validators.required, this.validationService.paymentAmountValidator()]],
      myResponsibility: ['', []],
      reimbursedAmountFromAccounts: ['', []],
      whatYouOwe: ['', []],
    });
    this.localUrl = [];
    this.upload_files = [];
    this.dateMask = this.validationService.dobMask;
  }

  ngOnInit() {

    if (this.r.snapshot.data && this.r.snapshot.data.details) {
      const response = this.r.snapshot.data.details;
      console.log(this.r.snapshot.data.details);
      if (response) {
        this.reimbursmentMethods = response.reimbursementMethodList;
        this.services = response.serviceTypeCodes;
        this.members = response.membersList.map((member) => {
          return {
            memberName: this.titleCase.transform(member.firstName) + ' ' + this.titleCase.transform(member.lastName)
          };
        });
        this.providers = [{memberName: 'Provider1'}, {memberName: 'Provider2'}, {memberName: 'Provider3'}];
        this.setDefaultValuesForControlFromResponse();
      }
    }

    // this.members = [{memberName: 'member1'}, {memberName: 'member2'}, {memberName: 'member3'}];
    // this.providers = [{memberName: 'member1'}, {memberName: 'member2'}, {memberName: 'member3'}];
    // this.reimbursmentMethods = [{memberName: 'member1'}, {memberName: 'member2'}, {memberName: 'member3'}];
    // this.services = [{serviceName: 'service1'}, {serviceName: 'service2'}, {serviceName: 'member3'}];
    // this.subscribeToOnChangeEvents();
  }

  setDefaultValuesForControlFromResponse() {
    /* const memberControl = this.schedulePaymentForm.get('member');
    memberControl.setValue(this.members[0].memberName, { emitEvent: false }); */
  }

  subscribeToOnChangeEvents() {

    this.schedulePaymentForm.get('serviceEndDate').valueChanges.subscribe(() => {
      this.dateComparison();
    });
    this.schedulePaymentForm.get('serviceStartDate').valueChanges.subscribe(() => {
      this.dateComparison();
    });
  }

  dateComparison() {
    const startDateControl = this.schedulePaymentForm.get('serviceStartDate');
    const endDateControl = this.schedulePaymentForm.get('serviceEndDate');
    const date1 = this.convertDate(startDateControl.value);
    const date2 = this.convertDate(endDateControl.value);
    // console.log('true', date1, date2, startDateControl.value, endDateControl.value);
    if ((date1 !== '' && date2 !== '') && date1 >= date2) {
      if (!endDateControl.hasError('required') && !endDateControl.hasError('invalidDate')) {
        endDateControl.setErrors({'invalidEndDate': true});
      }
    } else {
      // console.log('clear error');
      if (!endDateControl.hasError('required') && !endDateControl.hasError('invalidDate')) {
        endDateControl.setErrors(null);
      }
    }
  }

  convertDate(date) {
    if (date) {
      return moment(date, 'MM/DD/YYYY').format();
    } else {
      return '';
    }
  }

  removeFileFromList(file: any) {
    let idx = 0;
    let idxMarkedForDelete = -1;
    this.upload_files.forEach(function (currFile) {
      if (currFile.data_raw === file.data_raw) {
        idxMarkedForDelete = idx;
      }
      idx = idx + 1;
    });
    this.upload_files.splice(idxMarkedForDelete, 1);
  }

  public takeOrUploadReciept(event: any) {
    if (event && event.target && event.target.files && event.target.files.length > 0) {
      for (let i = 0, numFiles = event.target.files.length; i < numFiles; i++) {
        const file = event.target.files[i];
        if (event.target.files && file) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            const currFile = {
              type: file.type,
              data_raw: e.target.result
            };
            if (file.type.indexOf('image') !== -1) {
              this.upload_files.push(currFile);
              console.warn(this.upload_files);
              this.localUrl.push(e.target.result);
            }
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }

  public clearAllFields() {
    this.schedulePaymentForm.reset();
  }

  public addProvider() {
    this.router.navigate(['/myfinancials/addprovider']);
  }

  public schedulePayment() {

  }
}
