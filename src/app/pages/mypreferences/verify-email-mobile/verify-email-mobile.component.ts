import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertType } from '../../../shared/alerts/alertType.model';
import { GlobalService } from '../../../shared/services/global.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConstantsService } from '../../../shared/services/constants.service';
import { MyAccountService } from '../../my-account/my-account.service';
import { AlertService } from '../../../shared/services/alert.service';
import { ValidationService } from '../../../shared/services/validation.service';
import { MyPrefService } from '../mypreferences.service';
declare let $: any;

@Component({
  selector: 'app-verify-email-mobile-mypref',
  templateUrl: './verify-email-mobile.component.html',
  styleUrls: ['./verify-email-mobile.component.scss']
})
export class VerifyEmailMobileComponent implements OnInit, OnDestroy {

  @ViewChild('accesscode1') accesscode1: ElementRef;
  @ViewChild('accesscode2') accesscode2: ElementRef;
  @ViewChild('accesscode3') accesscode3: ElementRef;
  @ViewChild('accesscode4') accesscode4: ElementRef;
  @ViewChild('accesscode5') accesscode5: ElementRef;
  @ViewChild('accesscode6') accesscode6: ElementRef;
  verifyaccesscodeForm: FormGroup;
  errorMsg = false;
  accesscodeMask: Array<any>;
  isFormSubmitted = false;
  location: string;
  myPrefmaskedVerify: string;
  codeMask: Object = { mask: this.validationService.numericMask, guide: false };
  params: any;
  commChannelBeingVerified: string;

  constructor(private alertService: AlertService,
    private fb: FormBuilder,
    private constants: ConstantsService,
    private globalService: GlobalService,
    private router: Router,
    private route: ActivatedRoute,
    private validationService: ValidationService,
    private profileService: MyPrefService) {
    this.alertService.clearError();
    this.location = this.router.url.split('/')[1];
    this.params = this.route.snapshot.url;
    this.verifyaccesscodeForm = this.fb.group({
      accesscode1: ['', [Validators.required]],
      accesscode2: ['', [Validators.required]],
      accesscode3: ['', [Validators.required]],
      accesscode4: ['', [Validators.required]],
      accesscode5: ['', [Validators.required]],
      accesscode6: ['', [Validators.required]],
    }, {
        validator: this.validationService.accessCodeValidator()
      });

    this.verifyaccesscodeForm.valueChanges.subscribe((accesscodes) => {
      Object.keys(accesscodes).forEach((key, index) => {
        const itemValue = (accesscodes[key] ? accesscodes[key] : '').toString();
        if (itemValue.length > 1) {
          let currentIndex = index;
          itemValue.split('').forEach((character) => {
            if (currentIndex < 6) {
              if (!accesscodes['accesscode' + (currentIndex + 1)] || index === currentIndex) {
                const accesscodekey = 'accesscode' + (currentIndex + 1);
                accesscodes[accesscodekey] = character;
                this.verifyaccesscodeForm.get(accesscodekey).setValue(character, { emitEvent: false });
                this[accesscodekey].nativeElement.focus();
              }
              currentIndex++;
            }
          });
        }
      });

    });
    this.accesscodeMask = this.validationService.accesscodeMask;
  }

  ngOnInit() {
    this.getMaskedValue();
    this.commChannelBeingVerified = this.profileService.commChannelBeingVerified.verifyAccessCodeLabel;
    this.profileService.sendaccesscode().subscribe(response => {
    },
      error => {
        this.alertService.setAlert('This feature is unavailable at the moment. Please try again later.', '', AlertType.Failure);
      });
  }

  getMaskedValue() {
    this.myPrefmaskedVerify = sessionStorage.getItem('myPrefmaskedVerify');
  }

  maskEmailId(userId: string): string {
    const maskedUserId = userId ? userId.replace(/^(.{3})(.*)(@.*)$/,
      (_, firstCharacter, charToMasked, domain) => {
        return `${firstCharacter}${charToMasked.replace(/./g, '*')}${domain}`;
      }) : userId;
    return maskedUserId;
  }

  maskPhoneNumber(userId: string): string {
    const regex = /^(.{3})(.{3})(.{4})(.*)/;
    let maskedUserId = userId ? userId.replace(/^(.*)(.{4})$/,
      (_, digitsToMasked, lastFourDigits) => {
        return `${digitsToMasked.replace(/./g, '*')}${lastFourDigits}`;
      }) : userId;
    const str = maskedUserId;
    const subst = `$1-$2-$3`;
    maskedUserId = str.replace(regex, subst);
    return maskedUserId;
  }

  ngOnDestroy() {
    this.alertService.clearError();
  }

  onSubmit() {
    this.isFormSubmitted = true;
    this.alertService.clearError();
    const accessCode = {
      'accesscode': '' + this.verifyaccesscodeForm.value.accesscode1 + this.verifyaccesscodeForm.value.accesscode2 +
        this.verifyaccesscodeForm.value.accesscode3 + this.verifyaccesscodeForm.value.accesscode4 +
        this.verifyaccesscodeForm.value.accesscode5 + this.verifyaccesscodeForm.value.accesscode6
    };
    this.alertService.setAlert('Success!', '', AlertType.Success);


    if (this.verifyaccesscodeForm.valid) {
      this.profileService.verifyAccessCode(accessCode)
        .subscribe(response => {
          if (response['result'] === '0') {
            this.router.navigate(['/mypreferences']);
          } else {
            if (response['displaymessage']) {
              this.globalService.handleError(response, this.constants.displayMessage, true);
              this.verifyaccesscodeForm.setValue({
                accesscode1: '', accesscode2: '', accesscode3: '', accesscode4: '', accesscode5: '', accesscode6: ''
              });
            }
            this.validationService.focusFirstError();
          }
        });
    }
  }

  sendAccessCode() {
    this.alertService.clearError();
    /* API Call for email/phone confirmation*/
    this.profileService.sendaccesscode().subscribe(response => {
      // clear access code
      this.verifyaccesscodeForm.setValue({
        accesscode1: '', accesscode2: '', accesscode3: '', accesscode4: '', accesscode5: '', accesscode6: ''
      });
      this.alertService.clearError();
      // tslint:disable-next-line:max-line-length
      sessionStorage.getItem('maskedVerifyPhone') === 'Y' ? this.alertService.setAlert('Verification code resent!', '', AlertType.Success) :
        this.alertService.setAlert('Verification code resent! You may need to check your spam folder.', '', AlertType.Success);
      this.validationService.focusFirstError();
    },
      error => {
        this.alertService.setAlert('This feature is unavailable at the moment. Please try again later.', '', AlertType.Failure);
      });
  }

  regVerifyAccessCode() {
    /*this.registrationService.sendaccesscode().subscribe( response => {
      // clear access code
      this.verifyaccesscodeForm.setValue({
        accesscode1: '',  accesscode2: '', accesscode3: '', accesscode4: '',  accesscode5: '',  accesscode6: ''
      });
      this.alertService.clearError();
      this.alertService.setAlert('Verification code sent!', 'Success' , AlertType.Success);
      this.validationService.focusFirstError();
    });*/
  }

  onKeyUp(event, previousElement, nextElement) {
    this.errorMsg = false;
    if ((event.key === 'Backspace' || event.key === 'ArrowLeft') && previousElement) {
      previousElement.focus();
    }
    if ((event.key === 'ArrowRight' || (event.keyCode >= 48 && event.keyCode <= 57)
      || (event.keyCode >= 96 && event.keyCode <= 105)) && nextElement) {
      nextElement.focus();
    }
  }
}

