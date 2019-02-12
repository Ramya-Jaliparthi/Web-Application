import { MigrationService } from './../migration.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ValidationService } from '../../../shared/services/validation.service';
import { AlertService } from '../../../shared/shared.module';
import { GlobalService } from '../../../shared/services/global.service';
import { AuthService } from '../../../shared/services/auth.service';
import { RegType } from '../../../shared/models/regType.enum';
import { AlertType } from '../../../shared/alerts/alertType.model';
import { ISubscription } from '../../../../../node_modules/rxjs/Subscription';
import { MemberInfo } from '../../../shared/models/memberInfo.model';
import {AuthHttp} from '../../../shared/services/authHttp.service';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent implements OnInit, OnDestroy {
  private subscription: ISubscription;
  public memberData: MemberInfo;
  sw_scope: any;
  removeActivefromscope: any;
  deleteIDlist = new Array;
  sa_scope: string;
  responseist = new Array();
  mutiscope: string;
  mutiemail: string;
  mutiuserid: string;
  singleWebEmail: string;
  ma_selectedId: any;
  hintAnswer: string;
  hintQuestion: string;
  idlist = new Array();
  sa_appMobile: string;
  sa_appEmail: string;
  sa_appUserID: string;
  sw_UserID: string;
  sw_email: string;
  appResponse: any;
  webEmail: string;
  migrationResponse: any;
  registerDetailForm: FormGroup;
  isFormSubmitted: boolean = false;
  showHide: boolean = false;
  message: string = '';
  phoneMask: Array<any>;
  dobMask: Array<any>;
  type: string;
  typePlaceholder: string;
  SINGLEWEB: boolean;
  SINGLEAPP: boolean;
  MULTIPLEAPP: boolean;
  SINGLEWEBSINGLEAPP: boolean;
  SINGLEWEBMULTIPLEAPP: boolean;
  user; // why is this here?

  securityQuestionsOptions = [
    { label: 'Who was your favorite teacher?', value: 'value 1' },
    { label: 'Where did you meet your spouse?', value: 'value 2' },
    { label: 'What is your Mother’s middle name?', value: 'value 3' },
    { label: 'What is the name of your closest friend from childhood?', value: 'value 4' },
    { label: 'In what city or town does your nearest relative live?', value: 'value 5' },
    { label: 'What was the name of your elementary school?', value: 'value 6' },
    { label: 'What was the name of your first pet?', value: 'value 7' }
  ];

  emailMessages = {
    'required': 'You must enter a valid email address.',
  };

  hintAnswercustomMessages = {
    'required': 'Answer to Hint Question is required',
    'invalidHintAnswer': `Your hint answer cannot contain any spaces or special characters. 
    Please re-enter the answer to your hint question`,
    'tralingspace': 'You must enter a valid hint answer'
  };

  constructor(
    private alertService: AlertService,
    private fb: FormBuilder,
    private router: Router,
    private globalService: GlobalService,
    private validationService: ValidationService,
    private authService: AuthService,
    private http: AuthHttp,
    private migrationService: MigrationService) {
    /* this.subscription = this.globalService.memberData$.subscribe(data => {
      this.memberData = data;
    }); */
    this.user = sessionStorage.getItem('key');
    if (this.user === undefined) {
      this.router.navigate(['/login']);
    }
    if (this.authService.authToken.migrationtype === 'SINGLE-WEB') {
      this.SINGLEWEB = true;
      this.SINGLEAPP = false;
      this.MULTIPLEAPP = false;
      this.SINGLEWEBSINGLEAPP = false;
      this.SINGLEWEBMULTIPLEAPP = false;
    } else if (this.authService.authToken.migrationtype === 'SINGLE-APP') {
      this.SINGLEAPP = true;
      this.SINGLEWEB = false;
      this.MULTIPLEAPP = false;
      this.SINGLEWEBSINGLEAPP = false;
      this.SINGLEWEBMULTIPLEAPP = false;
    } else if (this.authService.authToken.migrationtype === 'MULTIPLE-APP') {
      this.MULTIPLEAPP = true;
      this.SINGLEAPP = false;
      this.SINGLEWEB = false;
      this.SINGLEWEBSINGLEAPP = false;
      this.SINGLEWEBMULTIPLEAPP = false;
    } else if (this.authService.authToken.migrationtype === 'SINGLE-WEB-SINGLE-APP') {
      this.SINGLEWEB = false;
      this.SINGLEAPP = true;
      this.MULTIPLEAPP = false;
      this.SINGLEWEBSINGLEAPP = true;
      this.SINGLEWEBMULTIPLEAPP = false;
    } else if (this.authService.authToken.migrationtype === 'SINGLE-WEB-MULTIPLE-APP') {
      this.SINGLEWEB = false;
      this.SINGLEAPP = false;
      this.MULTIPLEAPP = true;
      this.SINGLEWEBSINGLEAPP = false;
      this.SINGLEWEBMULTIPLEAPP = true;
    } else {
      this.SINGLEWEB = true;
      this.SINGLEAPP = false;
      this.MULTIPLEAPP = false;
      this.SINGLEWEBSINGLEAPP = false;
    }
    this.type = 'password';
    this.typePlaceholder = 'Show';
    let formGroup;
    if (this.SINGLEWEB) {
      formGroup = {
        email: ['', [Validators.required, this.validationService.emailValidator()]],
        securityQuestion: ['', [Validators.required]],
        securityQuesAnswer: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30),  this.validationService.trailingSpaceValidator()]]
      };
    } else {
      formGroup = {
        securityQuestion: ['', [Validators.required]],
        securityQuesAnswer: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), this.validationService.trailingSpaceValidator()]]
      };
    }
    this.registerDetailForm = this.fb.group(formGroup);
  }

  getDefaultOptionForSecurityQuestions(): string {
    return this.securityQuestionsOptions && this.securityQuestionsOptions.length > 0 ?
      this.securityQuestionsOptions[0].value : '';
  }

  get isUserEmail() {
    return this.authService.userRegType === RegType.EMAIL;
  }

  get firstName() {
    return this.authService && this.authService.authToken && this.authService.authToken.firstName
      ? this.authService.authToken.firstName : '';
  }

  ngOnInit() {
    this.migrationService.membermigration().subscribe(res => {
      if (!res['result']) {
        console.log('member lookup service response', res);
        this.migrationResponse = res;
        this.webEmail = this.migrationResponse.webAccount.email;
        this.appResponse = this.migrationResponse.appAccounts;
        this.responseist = this.migrationResponse.appAccounts;
        console.log(this.webEmail);
        console.log(this.appResponse);
        if (this.authService.authToken.migrationtype === 'SINGLE-WEB') {
          this.sw_email = this.webEmail;
          this.singleWebEmail = this.webEmail;
          this.sw_UserID = this.migrationResponse.webAccount.userID;
          this.sw_scope = this.migrationResponse.webAccount.scope;
        }
        if (this.authService.authToken.migrationtype === 'SINGLE-APP') {
          for (const response of this.appResponse) {
            this.sa_appUserID = response.userID;
            this.sa_appEmail = response.email;
            this.removeActivefromscope = response.scope.split('ACTIVE-');
            // remove ACTIVE- from scope
            this.sa_scope = this.removeActivefromscope.join('');
          }
        }
        if (this.authService.authToken.migrationtype === 'MULTIPLE-APP') {
          for (const response of this.appResponse) {
            this.sa_appUserID = response.userID;
            this.idlist.push(this.sa_appUserID);
          }
          this.ma_selectedId = this.appResponse[0];
          console.log(this.idlist);
        }
        if (this.authService.authToken.migrationtype === 'SINGLE-WEB-SINGLE-APP') {
          this.sw_email = this.webEmail;
          this.sw_UserID = this.migrationResponse.webAccount.userID;
          for (const response of this.appResponse) {
            this.sa_appUserID = response.userID;
            this.sa_appEmail = response.appEmail;
            this.sa_appMobile = response.appMobile;
          }
        }
        if (this.authService.authToken.migrationtype === 'SINGLE-WEB-MULTIPLE-APP') {
          this.sw_email = this.webEmail;
          this.sw_UserID = this.migrationResponse.webAccount.userID;
          for (const response of this.appResponse) {
            this.sa_appUserID = response.userID;
            this.sa_appEmail = response.appEmail;
            this.sa_appMobile = response.appMobile;
            this.idlist.push(this.sa_appUserID);
          }
          this.ma_selectedId = this.appResponse[0];
        }
      } else {
        console.log('member lookup failed', res);
        if (res['result'] === -1) {
          this.alertService.setAlert("We're currently experiencing technical difficulties. Please try again later, or call <a href='te:18887721722'>1-888-772-1722 </a> for immediate assistance.",
            '', AlertType.Failure);
        }
      }
    });
  }

  ngOnDestroy() {
    this.alertService.clearError();
  }

  togglePasswordVisibility() {
    if (this.type === 'text') {
      this.type = 'password';
      this.typePlaceholder = 'Show';
    } else {
      this.type = 'text';
      this.typePlaceholder = 'Hide';
    }
  }

  request() {
    let reqParams = {};
    this.hintQuestion = this.registerDetailForm.controls.securityQuestion.value;
    this.hintAnswer = this.registerDetailForm.controls.securityQuesAnswer.value;
    if (this.authService.authToken.migrationtype === 'SINGLE-WEB') {
      reqParams = {
        'useridin': this.authService.useridin, // from session
        'selectedUserId': this.migrationResponse.webAccount.userID, // from memlookup
        'selectedUserIdType': 'WEB', // hard-coded
        'selectedUserScope': this.migrationResponse.webAccount.scope, // from memlookup
        'webUserID': this.migrationResponse.webAccount.userID, // from memlookup
        'appUserIDs': [], // hard-coded
        'emailAddress': this.singleWebEmail.trim(), // from UI
        'hintQuestion': this.hintQuestion, // from UI
        'hintAnswer': this.hintAnswer, // from UI
        'password': '' // not in this screen yet.
      };
    }
    if (this.authService.authToken.migrationtype === 'SINGLE-APP') {
      reqParams = {
        'useridin': this.authService.useridin, // from session
        'selectedUserId': this.migrationResponse.appAccounts[0].userID, // from memlookup
        'selectedUserIdType': 'APP', // hard-coded
        'selectedUserScope': this.migrationResponse.appAccounts[0].scope, // from memlookup
        'webUserID': '', // hard-coded
        'appUserIDs': [], // from memlookup
        'emailAddress': this.migrationResponse.appAccounts[0].email, // from memlookup
        'hintQuestion': this.hintQuestion, // from UI
        'hintAnswer': this.hintAnswer, // from UI
        'password': '', // not in this screen yet,
        'isVerifiedEmail': this.migrationResponse.appAccounts[0].isVerifiedEmail
      };
    }

    if (this.authService.authToken.migrationtype === 'MULTIPLE-APP') {
      this.deleteIDlist = [];
      this.mutiuserid = this.ma_selectedId.userID;
      this.mutiemail = this.ma_selectedId.email;
      this.mutiscope = this.ma_selectedId.scope;
      for (let i = this.responseist.length - 1; i >= 0; i--) {
        if (this.responseist[i].userID !== this.ma_selectedId.userID) {
          this.deleteIDlist.push(this.responseist[i].userID);
        }
      }
      reqParams = {
        'useridin': this.authService.useridin, // from session
        'selectedUserId': this.ma_selectedId.userID, // from UI
        'selectedUserIdType': 'APP', // hard-coded
        'selectedUserScope': this.ma_selectedId.scope, // from UI
        'webUserID': '', // hard-code
        'appUserIDs': this.deleteIDlist, // based on UI selection
        'emailAddress': this.ma_selectedId.email,  // from UI
        'hintQuestion': this.hintQuestion,  // from UI
        'hintAnswer': this.hintAnswer,  // from UI
        'password': '', // from login module
        'isVerifiedEmail': this.ma_selectedId.isVerifiedEmail
      };
    }

    if (this.authService.authToken.migrationtype === 'SINGLE-WEB-SINGLE-APP') {
      reqParams = {
        'useridin': this.authService.useridin, // from session
        'selectedUserId': this.migrationResponse.appAccounts[0].userID, // from UI
        'selectedUserIdType': 'APP', // hard-coded
        'selectedUserScope': this.migrationResponse.appAccounts[0].scope, // from UI
        'webUserID': this.migrationResponse.webAccount.userID,
        'appUserIDs': [], // from UI
        'emailAddress': this.migrationResponse.appAccounts[0].email, // from UI
        'hintQuestion': this.hintQuestion, // from UI
        'hintAnswer': this.hintAnswer, // from UI
        'password': '', // from login module
        'isVerifiedEmail': this.migrationResponse.appAccounts[0].isVerifiedEmail
      };
    }

    if (this.authService.authToken.migrationtype === 'SINGLE-WEB-MULTIPLE-APP') {
      this.deleteIDlist = [];
      this.mutiuserid = this.ma_selectedId.userID;
      this.mutiemail = this.ma_selectedId.email;
      this.mutiscope = this.ma_selectedId.scope;
      for (let i = this.responseist.length - 1; i >= 0; i--) {
        if (this.responseist[i].userID !== this.ma_selectedId.userID) {
          this.deleteIDlist.push(this.responseist[i].userID);
        }
      }
      reqParams = {
        'useridin': this.authService.useridin, // from session
        'selectedUserId': this.ma_selectedId.userID, // from UI
        'selectedUserIdType': 'APP', // hard-coded
        'selectedUserScope': this.ma_selectedId.scope, // from UI
        'webUserID': this.migrationResponse.webAccount.userID, // hard-code
        'appUserIDs': this.deleteIDlist, // based on UI selection
        'emailAddress': this.ma_selectedId.email,  // from UI
        'hintQuestion': this.hintQuestion,  // from UI
        'hintAnswer': this.hintAnswer,  // from UI
        'password': '', // from login module
        'isVerifiedEmail': this.ma_selectedId.isVerifiedEmail
      };
    }
    console.log('memacctmerge request ----', reqParams); // Add session storage
    return reqParams;
  }

  onSubmit() {

    // this.router.navigate(['member-migration/updatePassword']);


    const req = this.request();

    this.isFormSubmitted = true;
    this.globalService.markFormGroupTouched(this.registerDetailForm);
    this.validationService.focusFirstError();
    if (this.registerDetailForm.valid) {
      // setting this so we can retrieve this in password.
      // need to work on making this into session stroage, etc.. so it can be reterived on F5 scenario.
      this.migrationService.setMemacctmergerequest(this.request());
      this.alertService.clearError();
      const request = this.registerDetailForm.value;
      if (request.mobile) {
        request.mobile = request.mobile.replace(/[-()]+/g, '');
        request.email = this.authService.useridin;
      } else {
        request.mobile = this.authService.useridin;
      }
      // Rules:
      if (this.authService.authToken.migrationtype === 'SINGLE-WEB') {
        // redirect to update password and then call memacctmerge from there
        this.router.navigate(['member-migration/updatePassword']);
      }
      if (this.authService.authToken.migrationtype === 'SINGLE-APP') {
        // Dont migrate
        const currScope = this.authService.authToken ? this.authService.authToken.scopename : '';
        const memacctmergerequest = this.migrationService.getMemacctmergerequest();
        this.migrationService.migrationcall(
          this.migrationService.migrationrequest(
            memacctmergerequest.selectedUserId,
            memacctmergerequest.selectedUserIdType,
            memacctmergerequest.selectedUserScope,
            memacctmergerequest.webUserID,
            memacctmergerequest.appUserIDs,
            memacctmergerequest.emailAddress,
            memacctmergerequest.hintQuestion,
            memacctmergerequest.hintAnswer, '')).subscribe(res => {
              console.log('service response', res);
              let isValid = false;
              if (res['result'] === '0') {
                isValid = true;
                if (memacctmergerequest.selectedUserId) {
                  localStorage.setItem('login-user', memacctmergerequest.selectedUserId);
                }
              } else {
                if (res['errormessage'] === 'Migration completed, but update notification could not be sent') {
                  isValid = true;
                  if (memacctmergerequest.selectedUserId) {
                    localStorage.setItem('login-user', memacctmergerequest.selectedUserId);
                  }
                }
              }
              if (isValid) {
                this.migrationService.savePageUrl('/myprofile',
                  this.migrationService.getMemacctmergerequest().selectedUserId)
                  .subscribe(migrationServiceResp => {
                    if (migrationServiceResp['result'] === 0) {
                      const memacctmergerequest_1 = this.migrationService.getMemacctmergerequest();
                      if (memacctmergerequest_1.selectedUserScope === 'AUTHENTICATED-AND-VERIFIED') {
                        if (memacctmergerequest_1.isVerifiedEmail === 'true') {
                          this.authService.logout();
                          this.router.navigate(['login']);
                        } else {
                          this.sendAccessCode();
                        }
                      } else {
                        this.sendAccessCode();
                      }
                    } else {
                      console.log('error in postdestURL');
                    }
                  });
              } else {
                console.log('mig error', res);
                if (res['result'] === '-2') {
                  this.alertService.setAlert("We're currently experiencing technical difficulties. Please try again later, or call <a href='te:18887721722'>1-888-772-1722 </a> for immediate assistance.",
                    '', AlertType.Failure);
                }
                if (res['displaymessage']) {
                  this.alertService.setAlert(res['displaymessage'],
                    '', AlertType.Failure);
                }
              }
            });
      }
      if (this.authService.authToken.migrationtype === 'MULTIPLE-APP') {
        // redirect to update password and then call memacctmerge from there
        this.router.navigate(['member-migration/updatePassword']);

      }
      if (this.authService.authToken.migrationtype === 'SINGLE-WEB-SINGLE-APP') {
        this.router.navigate(['member-migration/updatePassword']);

      }
      if (this.authService.authToken.migrationtype === 'SINGLE-WEB-MULTIPLE-APP') {
        this.router.navigate(['member-migration/updatePassword']);
      }
      // if ((this.SINGLEWEB === true || this.SINGLEAPP === true) && this.SINGLEWEBSINGLEAPP === false) {
      //   this.router.navigate(['member-migration/verify']);
      // } else {
      //   this.router.navigate(['member-migration/updatePassword']);
      // }

    }
  }

  private sendAccessCode() {
    const currScope = this.authService.authToken ? this.authService.authToken.scopename : '';
    // const scopeHandleMap = {
    //  : this.sendcommchlaccesscode(this.migrationService.memacctmergerequest.emailAddress,
    //     this.migrationService.memacctmergerequest.selectedUserId),
    //   'AUTHENTICATED-NOT-VERIFIED':,
    //   '': this.currentScopeError
    // }
    // scopeHandleMap[currScope]; // map function called.
    const memacctmergerequest = this.migrationService.getMemacctmergerequest();
    if (currScope === 'AUTHENTICATED-AND-VERIFIED') {
      this.sendcommchlaccesscode(memacctmergerequest.emailAddress,
        memacctmergerequest.selectedUserId);
    } else {
      this.sendaccesscode(memacctmergerequest.emailAddress,
        memacctmergerequest.selectedUserId);
    }
  }

  private currentScopeError() {
    console.log('currentScopeError');
  }
  private sendaccesscode(emailAddress, selectedUserId): void {
    this.migrationService.sendaccesscode(emailAddress, selectedUserId).subscribe(res => {
      if (res['result'] === '0') {
        const communicationChannel = this.http.handleDecryptedResponse(res);
        sessionStorage.setItem('sendCodeRes', JSON.stringify(communicationChannel));
        this.router.navigate(['member-migration/verify']);
      } else {
        console.log('sendaccesscode error', res);
        if (res['result'] === '-1') {
          this.alertService.setAlert("We are unable to complete your request. Please try again.",
            '', AlertType.Failure);
        }
        if (res['displaymessage']) {
          this.alertService.setAlert(res['displaymessage'],
            '', AlertType.Failure);
        }
      }
    }, err => {
      console.log('error', err);
    });
  }

  private sendcommchlaccesscode(emailAddress, selectedUserId): void {
    this.migrationService.sendcommchlaccesscode(emailAddress, selectedUserId).subscribe(res => {
      if (res['result'] === '0') {
        this.router.navigate(['member-migration/verify']);
      } else {
        console.log('sendcommchlaccesscode error', res);
        if (res['result'] === '-1') {
          this.alertService.setAlert("We're currently experiencing technical difficulties. Please try again later, or call <a href='te:18887721722'>1-888-772-1722 </a> for immediate assistance.",
            '', AlertType.Failure);
        }
        if (res['displaymessage']) {
          this.alertService.setAlert(res['displaymessage'],
            '', AlertType.Failure);
        }
      }
    }, err => {
      console.log('error', err);
    });
  }

  public disableSubmitButton() {
    let rtnVal = false;
    rtnVal = !this.registerDetailForm.valid;
    if (!this.SINGLEWEB && this.MULTIPLEAPP) {
      rtnVal = rtnVal || !this.ma_selectedId;
    }
    return rtnVal;
  }


}
