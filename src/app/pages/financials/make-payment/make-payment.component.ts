import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinancialsConstants } from '../constants/financials.constants';
import { BcbsmaerrorHandlerService } from '../../../shared/services/bcbsmaerror-handler.service';
import { ValidationService } from '../../../shared/shared.module';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { TitleCasePipe } from '@angular/common';
import {BreadCrumb} from '../../../shared/components/breadcrumbs/breadcrumbs';
import { Element } from '@angular/compiler';

@Component({
  selector: 'app-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.scss']
})
export class MakePaymentComponent implements OnInit {

  public financialConstants = FinancialsConstants;
  private paySubmitted: boolean = false;
  public breadCrumbs: BreadCrumb[];
  payForm: FormGroup;
  providerSelected: string;
  providers: Object[];
  reimbursmentMethods: Object[];
  members: any[];
  services: Object[];
  dateMask: Array<any>;
  paymentForm: boolean;
  paymentConfirmation: boolean;
  reimbursmentConfirmed: boolean;
  disableMethod: boolean = false;
  upload_files: any[];
  localUrl: any[];
  disclosureTerms: string;
  reimbursementTerms: string;
  formData;
  fileTypes = { 'file': 'fa-file', 'text': 'fa-file-alt', 'pdf': 'fa-file-pdf',
                'word': 'fa-file-word', 'png': 'fa-file-image', 'excel': 'fa-file-times' };
  iconType: string;
  isPayProvider: boolean = false;
  submitNow: boolean = true;
  isServiceMoreThanDay: boolean = false;
  addMoreImages: boolean = false;
  header: string = '';
  uploadRecieptMsg: boolean = false;

  amountMessages = {
    'required': 'You must enter a valid amount.',
    'invalidAmount': 'You must enter a valid amount.',
  };

  serviceTypeMessages = {
    'required': 'Please make a selection',
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

  accountNumberCustomMessages = {
    'invalidAlphaNumericString': 'You must enter a valid Account Number',
    'minlength': 'You must enter a valid Account Number.'
  };


  constructor(private fb: FormBuilder,
    private validationService: ValidationService,
    private router: Router,
    private r: ActivatedRoute,
    private titleCase: TitleCasePipe,
    private bcbsmaErrorHandler: BcbsmaerrorHandlerService) {

    this.isPayProvider = this.r.snapshot.paramMap.get('whomToPay') !== 'payMe';
    this.header = this.isPayProvider ? 'Pay a Provider' : 'Pay Myself';
    this.submitNow = this.r.snapshot.paramMap.get('whenToSubmit') === 'now';
    console.log(this.isPayProvider);

    this.payForm = this.fb.group({
      selectProvider: [{ value: '', disabled: false }],
      providerAccountNumber: ['', [this.validationService.alphaNumericValidator(), Validators.minLength(19)]],
      reimbursmentMethod: ['', []],
      paymentAmount: ['', [Validators.required, this.validationService.paymentAmountValidator()]],
      member: ['', [Validators.required]],
      serviceType: ['', [Validators.required]],
      serviceStartDate: ['', [Validators.required, this.validationService.dateValidator()]],
      serviceEndDate: [''],
      userComments: ['', [Validators.maxLength(255)]],
      paymentReciepts: ['', []]
    });

    this.formData = sessionStorage.getItem('makepayment.form');
    if (this.formData) {
      this.formData = JSON.parse(this.formData);
      this.payForm.patchValue(this.formData);
      sessionStorage.removeItem('makepayment.form');
    }

    this.localUrl = [];
    this.upload_files = [];
    this.dateMask = this.validationService.dobMask;
  }

  ngOnInit() {
    this.breadCrumbs = [];
    this.prepareChildBreadCrumbs(this.router.url.split('/').join('/'));
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
        this.disclosureTerms = response.disclosure;
        this.reimbursementTerms = response.reimburseAgreement;
      }
    }

    // this.providers = [{ providerName: 'Provider1' }, { providerName: 'Provider2' }, { providerName: 'Provider3' }];
    this.providers = [];
    this.paymentForm = true;
    this.paymentConfirmation = false;
    this.reimbursmentConfirmed = true;
    this.subscribeToOnChangeEvents();
  }

  subscribeToOnChangeEvents() {
    const reimbursmentMethodControl = this.payForm.get('reimbursmentMethod');
    const selectProviderControl = this.payForm.get('selectProvider');
    if (this.isPayProvider) {
      reimbursmentMethodControl.setValue('', { emitEvent: false });
      reimbursmentMethodControl.disable({ emitEvent: false });
      reimbursmentMethodControl.clearValidators();

      selectProviderControl.enable({ emitEvent: false });
      selectProviderControl.setValidators([Validators.required]);
      this.disableMethod = true;
    } else {
      reimbursmentMethodControl.setValue('Check', { emitEvent: true });
      // reimbursmentMethodControl.enable({ emitEvent: false });
      // reimbursmentMethodControl.setValidators([Validators.required]);

      selectProviderControl.reset();
      selectProviderControl.clearValidators();
       this.disableMethod = true;
    }
    selectProviderControl.setValue('', { emitEvent: true });

    this.payForm.get('serviceEndDate').valueChanges.subscribe(() => {
      this.dateComparison();
    });
    this.payForm.get('serviceStartDate').valueChanges.subscribe(() => {
      this.dateComparison();
    });

    this.payForm.get('member').valueChanges.subscribe((value) => {
      this.onMemberChange(value);
    });

    /* const recieptUploadControl = this.payForm.get('picUpload');
    if (this.submitNow) {
      recieptUploadControl.setValidators([Validators.required]);
    } else {
      recieptUploadControl.reset();
      recieptUploadControl.clearValidators();
    } */
  }

  onMemberChange(value) {
    // TODO: replace this with the API call once the API is ready
    this.providers = [{ providerName: 'Provider1' }, { providerName:  'Provider2' }, { providerName:  'Provider3' }];
  }

  dateComparison() {
    const startDateControl = this.payForm.get('serviceStartDate');
    const endDateControl = this.payForm.get('serviceEndDate');
    const date1 = this.convertDate(startDateControl.value);
    const date2 = this.convertDate(endDateControl.value);
    // console.log('true', date1, date2, startDateControl.value, endDateControl.value);
    if ((date1 !== '' && date2 !== '') && date1 >= date2) {
      if (!endDateControl.hasError('required') && !endDateControl.hasError('invalidDate')) {
        endDateControl.setErrors({ 'invalidEndDate': true });
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

  submitPayment(val) {
    this.paySubmitted = true;

    if (val) {
      this.router.navigate(['/myfinancials/paymentsuccess', this.r.snapshot.paramMap.get('whomToPay'),
        this.r.snapshot.paramMap.get('whenToSubmit')]);
    } else {
      this.router.navigate(['/myfinancials/paymentpending', this.r.snapshot.paramMap.get('whomToPay')]);
    }
  }

  // TODO: Remove this when we're done
  get diagnostic() {
    return;
  }

  public addProvider() {
    this.router.navigate(['/myfinancials/addprovider']);
  }

  public addBankAccount() {

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
    if (this.upload_files.length === 0) {
      this.addMoreImages = false;
      this.uploadRecieptMsg = true;
    }
  }

  public takeOrUploadReciept(event: any) {
    if (event && event.target && event.target.files && event.target.files.length > 0) {
      for (let i = 0, numFiles = event.target.files.length; i < numFiles; i++) {
        const file = event.target.files[i];
        if (event.target.files && file && !this.isFileUploadedAlready(file.name)) {


          const reader = new FileReader();
          let currFile = {};
          reader.onload = (e: any) => {
            const blob = new Blob([file]);
            const fileUrl = URL.createObjectURL(blob);
            console.log(fileUrl, ' hello ');
            currFile = { type: file.type, data_raw: null, name: file.name, isImage: false, fileUrl: fileUrl };
            this.iconType = '';
            if (file.type.indexOf('image') !== -1) {
              currFile['data_raw'] = e.target.result;
              this.iconType = this.fileTypes['png'];
              currFile['isImage'] = true;
            } else if (file.type.indexOf('text') !== -1) {
              currFile['data_raw'] = e.target.result;
              this.iconType = this.fileTypes['text'];
              currFile['isImage'] = false;
            } else if (file.type.indexOf('pdf') !== -1) {
              currFile['data_raw'] = e.target.result;
              this.iconType = this.fileTypes['pdf'];
              currFile['isImage'] = false;
            } else if (file.type.indexOf('spreadsheetml.sheet') !== -1) {
              currFile['data_raw'] = e.target.result;
              this.iconType = this.fileTypes['excel'];
              currFile['isImage'] = false;
            } else if (file.type.indexOf('application/msword') !== -1 || file.type.indexOf('document') !== -1) {
              currFile['data_raw'] = e.target.result;
              this.iconType = this.fileTypes['word'];
              currFile['isImage'] = false;
            } else {
              currFile['data_raw'] = e.target.result;
              this.iconType = this.fileTypes['file'];
              currFile['isImage'] = false;
            }

            this.uploadRecieptMsg = false;
            // if (file.type.indexOf('image') !== -1) {
            this.upload_files.push(currFile);
            this.addMoreImages = true;
            console.warn(this.upload_files);
            this.localUrl.push(e.target.result);
            // }
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }

  checkFileUpload() {
    if (this.upload_files.length === 0) {
      this.uploadRecieptMsg = true;
    }
  }

  downloadImage(fileData, event) {
    let element = event.target;
    if (element.nodeName === 'IMG') {
      element = element.parentElement;
    }

    if (element.nodeName === 'A') {
      element.setAttribute('href', fileData.fileUrl);
      element.setAttribute('download', fileData.name);
    }
    console.log(fileData, event);

  }

  isFileUploadedAlready(fileName: string) {
    if (this.upload_files && this.upload_files.length > 0) {
      return this.upload_files.some((file) => file.name === fileName) ? true : false;
    }
    return false;
  }

  clearAllFields() {
    const defaultMember = this.members && this.members[0] ? this.members[0].memberName : '';
    this.payForm.reset({ member: defaultMember });
  }


  saveState() {
    sessionStorage.setItem('makepayment.form', JSON.stringify(this.payForm.getRawValue()));
    sessionStorage.setItem('makepayment.disclosureTerms', this.disclosureTerms);
    sessionStorage.setItem('makepayment.reimbursementTerms', this.reimbursementTerms);
    this.router.navigate(['/pages/alegeusterms']);
  }

  showServiceEndDate() {
    this.isServiceMoreThanDay = true;
    this.payForm.get('serviceEndDate').setValidators([Validators.required, this.validationService.dateValidator()]);
  }

  navigateToPaymentOptions() {
    this.router.navigate(['/myfinancials/paymentoptions']);
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

     if (folderId.includes('/payMe/now') || folderId.includes('/payMe/later')) {
       this.breadCrumbs.push({
         label: 'Pay Myself',
         url: [this.router.url]
       });
     }
     if (folderId.includes('/payProvider/now') || folderId.includes('/payProvider/later')) {
       this.breadCrumbs.push({
         label: 'Pay a Provider',
         url: [this.router.url]
       });
     }
  }
}
