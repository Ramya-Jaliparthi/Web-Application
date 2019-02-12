import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FinancialsConstants} from '../constants/financials.constants';
import {ValidationService} from '../../../shared/shared.module';
import {BreadCrumb} from '../../../shared/components/breadcrumbs/breadcrumbs';
import {Router, ActivatedRoute} from '@angular/router';
import {BcbsmaerrorHandlerService} from '../../../shared/services/bcbsmaerror-handler.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-add-provider',
  templateUrl: './add-provider.component.html',
  styleUrls: ['./add-provider.component.scss']
})
export class AddProviderComponent implements OnInit {
  public financialConstants = FinancialsConstants;
  addProviderForm: FormGroup;
  isFormSubmitted: boolean = false;
  phoneMask: Array<any>;
  zipMask: Array<any>;
  public breadCrumbs: BreadCrumb[];

  statesList = FinancialsConstants.statesList;

  providerMessages = {
    'required': 'Provider name is required',
    'invalidAlphaString': 'You must enter a valid provider name'
  };

  addressMessages = {
    'required': 'You must enter a valid mailing address.',
    'invalidCharacters': 'You must enter a valid mailing address.'
  };

  cityMessages = {
    'required': 'You must enter the city.',
    'invalidCharacters': 'You must enter a valid city.'
  };

  stateMessages = {
    'required': 'State is required'
  };

  zipMessages = {
    'required': 'You must enter your ZIP code.',
    'minlength': 'You must enter a valid ZIP code.'
  };

  mobileNumberMessages = {
    'invalidNumber': 'You must enter a valid phone number.',
    'invalidMobile': 'You must enter a valid phone number.'
  };

  constructor(private fb: FormBuilder,
              private router: Router,
              private r: ActivatedRoute,
              private validationService: ValidationService,
              private location: Location,
              private bcbsmaErrorHandler: BcbsmaerrorHandlerService) {
    this.addProviderForm = this.fb.group({
      providerName: ['', [Validators.required, this.validationService.alphaStringValidator()]],
      providerAddress1: ['', [Validators.required, this.validationService.specialCharactersValidator()]],
      providerAddress2: ['', [this.validationService.specialCharactersValidator()]],
      providerCity: ['', [Validators.required, this.validationService.specialCharactersValidator()]],
      providerState: ['', [Validators.required]],
      providerZipCode: ['', [Validators.required, Validators.minLength(5)]],
      providerPhoneNumber: ['', [this.validationService.phoneValidator(),
        this.validationService.mobileValidator()]],

    });

    this.phoneMask = this.validationService.phoneMask;
    this.zipMask = this.validationService.zipMask;
  }

  ngOnInit() {
    this.breadCrumbs = [];
    this.prepareChildBreadCrumbs(this.router.url.split('/').join('/'));
  }

  public addProvider() {

  }

  clearAllFields() {
    // this.addProviderForm.reset();
  }

  closeAddProvider() {
    this.location.back();
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
      label: 'Add Provider',
      url: ['/myfinancials/addprovider']
    });
  }

}
