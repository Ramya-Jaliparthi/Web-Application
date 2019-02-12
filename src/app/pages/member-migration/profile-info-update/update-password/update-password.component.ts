import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService, AuthService } from '../../../../shared/shared.module';
import { AlertType } from '../../../../shared/alerts/alertType.model';
import { Router } from '@angular/router';
import { AlertService } from '../../../../shared/services/alert.service';
import { MigrationService } from '../../migration.service';
import { AuthHttp } from '../../../../shared/services/authHttp.service';

declare let $: any;

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {

  typeCurrent: string;
  typePlaceholderCurrent: string;
  typeNew: string;
  typeReEnterNew: string;
  typePlaceholderNew: string;
  typePlaceholderReEnterNew: string;
  isFormSubmitted = false;
  migrationPasswordForm: FormGroup;
  showPasswordErrors = false;
  showReEnterPasswordErrors = false;
  passwordcustomMessages = {
    required: 'You must enter a valid password.',
    invalidPassword: 'Your password does not match the minimum requirement. Please try again.',
    confirmPassword: 'Password doesn\'t match '
  };
  seletcedUserName: string;

  constructor(private validationService: ValidationService,
    private fb: FormBuilder,
    private router: Router,
    private alertService: AlertService,
    private authService: AuthService,
    private http: AuthHttp,
    private migrationService: MigrationService
  ) {
    this.typeCurrent = 'password';
    this.typePlaceholderCurrent = 'Show';
    this.typeNew = 'password';
    this.typePlaceholderNew = 'Show';
    this.migrationPasswordForm = this.fb.group({
      newpassword: ['', []],
      reEnterNewPassword: ['', []]
    });

    this.migrationPasswordForm.controls['newpassword'].setValidators([Validators.required,
    Validators.minLength(8),
    this.validationService.invalidPasswordValidatorWrapper(),
    this.validationService.checkConfirmPasswordValidator(this.migrationPasswordForm.controls['reEnterNewPassword'])
    ]);

    this.migrationPasswordForm.controls['reEnterNewPassword'].setValidators([Validators.required,
    Validators.minLength(8),
    this.validationService.invalidPasswordValidatorWrapper(),
    this.validationService.checkConfirmPasswordValidator(this.migrationPasswordForm.controls['newpassword'], true)]);
    this.alertService.clearError();
  }

  ngOnInit() {
    this.typeCurrent = 'password';
    this.typePlaceholderCurrent = 'Show';
    this.typeNew = 'password';
    this.typeReEnterNew = 'password';
    this.typePlaceholderNew = 'Show';
    this.typePlaceholderReEnterNew = 'Show';
    const memacctmergerequest = this.migrationService.getMemacctmergerequest();
    if (memacctmergerequest) {
      this.seletcedUserName = memacctmergerequest['selectedUserId'];
    }
  }

  togglecurrentPasswordVisibility() {
    if (this.typeCurrent === 'text') {
      this.typeCurrent = 'password';
      this.typePlaceholderCurrent = 'Show';
    } else {
      this.typeCurrent = 'text';
      this.typePlaceholderCurrent = 'Hide';
    }
  }

  showErrorOnBlur(confirmPassword?: boolean) {
    if (confirmPassword) {
      this.showReEnterPasswordErrors = true;
    } else {
      this.showPasswordErrors = true;
    }


  }
  togglenewPasswordVisibility(confirmPassword?: boolean) {

    if (confirmPassword) {
      if (this.typeReEnterNew === 'text') {
        this.typeReEnterNew = 'password';
        this.typePlaceholderReEnterNew = 'Show';
      } else {
        this.typeReEnterNew = 'text';
        this.typePlaceholderReEnterNew = 'Hide';
      }

    } else {

      if (this.typeNew === 'text') {
        this.typeNew = 'password';
        this.typePlaceholderNew = 'Show';
      } else {
        this.typeNew = 'text';
        this.typePlaceholderNew = 'Hide';
      }

    }
  }

  // onSubmit() {
  onSubmit_Backup() {
    // dev purpose only
    // the method contents has to be replaced with the contents of the onSubmit_original function and the
    // method onSubmit_original has to be deleted
    this.migrationService.savePageUrl('/myprofile',
      this.migrationService.getMemacctmergerequest().selectedUserId)
      .subscribe(res => {
        console.log('response', res);
      });

    this.sendAccessCode();

    /* let x = this.migrationService.getMemacctmergerequest();
     if (!x) {
       x = {};
     } else {
       x.password = 'test password';
     }
     this.migrationService.setMemacctmergerequest(x);
     this.router.navigate(['member-migration/verify']);
     return;*/
  }

  // onSubmit() {
  //   this.router.navigate(['/pages/campaign1']);
  // }

  onSubmit() {
    // onSubmit() {
    // calling membermigration for SINGLE-WEB
    // uncomment when you need to migration.
    // we dont have many test data as we think; so use it judicially.
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
        memacctmergerequest.hintAnswer,
        this.migrationPasswordForm.value['newpassword'])).subscribe(res => {
          console.log('service response', res);
          let isValid = false;
          if (res['result'] === '0') {
            isValid = true;
            localStorage.setItem('login-user', this.seletcedUserName);
          } else {
            if (res['errormessage'] === 'Migration completed, but update notification could not be sent') {
              isValid = true;
              localStorage.setItem('login-user', this.seletcedUserName);
            }
          }
          if (isValid) {
            this.migrationService.savePageUrl('/myprofile',
              this.migrationService.getMemacctmergerequest().selectedUserId)
              .subscribe(migrationServiceResp => {
                if (migrationServiceResp['result'] === 0) {
                  const memacctmergerequest_1 = this.migrationService.getMemacctmergerequest();

                  // selected user scope AV and isVerified email AV it goes to Success Screen
                  if (memacctmergerequest_1.selectedUserScope === 'AUTHENTICATED-AND-VERIFIED') {
                    if (memacctmergerequest_1.isVerifiedEmail === 'true') {
                      this.authService.logout();
                      this.router.navigate(['member-migration/success']);
                    } else {
                      this.sendAccessCode();
                    }
                  } else {
                    this.sendAccessCode();
                  }
                } else {
                  console.log('error in postdestURL');
                  // // // currently API team is unabe to process code transfer to ANV users.
                  // // // if (currScope === 'AUTHENTICATED-NOT-VERIFIED') {
                  // if (res['errormessage'] === 'Migration completed, but update notification could not be sent') {
                  //   // this.sendAccessCode();
                  //   if (this.migrationService.memacctmergerequest.selectedUserScope === 'AUTHENTICATED-AND-VERIFIED') {
                  //     if (this.migrationService.memacctmergerequest.isVerifiedEmail === 'true') {
                  //       this.authService.logout();
                  //       this.router.navigate(['login']);
                  //     } else {
                  //       this.sendAccessCode();
                  //     }
                  //   } else {
                  //     this.sendAccessCode();
                  //    }
                  // } else {
                  //   console.log('mig error', res);
                  // }
                  // }
                }
              });
          } else {
            console.log('mig error', res);
            if (res['displaymessage']) {
              this.alertService.setAlert(res['displaymessage'],
                '', AlertType.Failure);
            }
          }
        });

  }

  // for this to work, logged in user should be AV user.
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
        const communicationChannel = this.http.handleDecryptedResponse(res);
        sessionStorage.setItem('sendCodeRes', JSON.stringify(communicationChannel));
        this.router.navigate(['member-migration/verify']);
      } else {
        console.log('sendcommchlaccesscode error', res);
        if (res['displaymessage']) {
          this.alertService.setAlert(res['displaymessage'],
            '', AlertType.Failure);
        }
      }
    }, err => {
      console.log('error', err);
    });
  }

}
