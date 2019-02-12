import {CommonModule, TitleCasePipe} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule, MatSelectModule } from '@angular/material';
import { MaterializeModule } from 'angular2-materialize';
import { TextMaskModule } from 'angular2-text-mask';
import { SharedModule } from '../../shared/shared.module';
import { AuthGuard } from '../../shared/utils/auth.guard';
import { ScopeGuard } from '../../shared/utils/scope.guard';
import { AuthUserLandingComponent } from './authenticated-user/authenticated-user.component';
import { AllowAVOnlyGuard, LandingGuard } from './landing.guard';
import { LandingRouter } from './landing.routing';
import { LandingService } from './landing.service';
import {RegistrationService} from '../registration/registration.service';

@NgModule({
  declarations: [
    AuthUserLandingComponent,
  ],
  exports: [],
  providers: [
    AuthGuard,
    ScopeGuard,
    LandingGuard,
    AllowAVOnlyGuard,
    LandingService,
    RegistrationService,
    TitleCasePipe
  ],
  imports: [
    CommonModule,
    LandingRouter,
    HttpClientModule,
    FormsModule,
    TextMaskModule,
    SharedModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatSelectModule,
    MaterializeModule
  ]
})
export class LandingModule {
}
