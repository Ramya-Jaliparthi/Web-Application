import { NgModule } from '@angular/core';
import { MyAccountRouter } from './my-account.routing';
import { AuthService } from '../../shared/services/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { AuthGuard } from '../../shared/utils/auth.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { CreatePasswordComponent } from './create-password/create-password.component';
import { ForgotUsernameComponent } from './forgot-username/forgot-username.component';
import { TextMaskModule } from 'angular2-text-mask';
import { RegistrationService } from '../registration/registration.service';
import { MyAccountService } from './my-account.service';
import { ConfirmidentityComponent } from './confirm-identity/confirmidentity.component';
import { FpConfirmidentityComponent } from './fp-confirm-identity/fpconfirmidentity.component';
import { ForgetUserNameFlowGuard } from './utils/forget-username-flow.guard';
import { ForgetPasswordFlowGuard } from './utils/forget-password-flow.guard';
import { VerifyAccessGuard } from './utils/verify-access.guard';
import { CreatePasswordGuard } from './utils/create-password.guard';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { VerifyOTPaccesscodeComponent } from './verifyOTPaccesscode/verifyaccesscode.component';

export { AuthService };

@NgModule({
  declarations: [
    ForgotPasswordComponent,
    ForgotUsernameComponent,
    CreatePasswordComponent,
    ConfirmidentityComponent,
    FpConfirmidentityComponent,
    VerifyOTPaccesscodeComponent
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    MyAccountRouter,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TextMaskModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    AuthGuard,
    ForgetUserNameFlowGuard,
    ForgetPasswordFlowGuard,
    VerifyAccessGuard,
    CreatePasswordGuard,
    MyAccountService,
    RegistrationService
  ]
})
export class MyAccountModule { }
