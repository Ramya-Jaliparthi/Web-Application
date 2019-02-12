import {NgModule} from '@angular/core';
import {RegistrationRouter} from './registration.routing';
import {AuthService} from '../../shared/services/auth.service';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RegisterComponent} from './register/register.component';
import {MemberInfoComponent} from './member-info/member-info.component';
import {RegisterDetailComponent} from './register-detail/register-detail.component';
import {UpdatessnComponent} from './updatessn/updatessn.component';
import {RegistrationService} from './registration.service';
import {SharedModule} from '../../shared/shared.module';
import {AuthGuard} from '../../shared/utils/auth.guard';
import {RegistrationGuard} from './registration.guard';
import {TextMaskModule} from 'angular2-text-mask';
// import { OnlyNumber } from '../../shared/directives/OnlyNumber';
import {SuccessInfoComponent} from './success/success-info.component';
import {SecurityComponent} from './security-answers/security-answers.component';
import {MyAccountService} from '../my-account/my-account.service';
import {MatListModule, MatRadioModule, MatSelectModule, MatFormFieldModule} from '@angular/material';
import {MatInputModule} from '@angular/material/input';
import {LandingService} from '../landing/landing.service';
import {RegistrationResolver} from './registration-resolver';

export {AuthService, RegistrationService};

@NgModule({
  declarations: [
    RegisterComponent,
    RegisterDetailComponent,
    MemberInfoComponent,
    UpdatessnComponent,
    // OnlyNumber,
    SuccessInfoComponent,
    SecurityComponent,
  ],
  exports: [],
  imports: [
    CommonModule,
    RegistrationRouter,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TextMaskModule,
    MatRadioModule,
    MatSelectModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule
  ],
  providers: [
    AuthGuard,
    RegistrationGuard,
    RegistrationService,
    MyAccountService,
    LandingService,
    RegistrationResolver
  ]
})
export class RegistrationModule {
}
