import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatDialogModule,
  MatExpansionModule,
  MatListModule,
  MatRadioModule,
  MatSelectModule,
  MatTooltipModule
} from '@angular/material';
import { StorageServiceModule } from 'angular-webstorage-service';
import { TextMaskModule } from 'angular2-text-mask';
import { ProfileService } from '../../shared/services/myprofile/profile.service';
import { SharedModule } from '../../shared/shared.module';
import { RequestEstimateComponent } from './landing/request-estimate.component';
import { RequestEstimateGuard } from './request-estimate.guard';
import { RequestEstimateResolver } from './request-estimate.resolver';
import { RequestEstimateRouter } from './request-estimate.routing';
import { RequestEstimateService } from './request-estimate.service';
import { RequestEstimateSuccessComponent } from './success/request-estimate-success.component';

@NgModule({
  imports: [
    RequestEstimateRouter,
    FormsModule,
    CommonModule,
    TextMaskModule,
    ReactiveFormsModule,
    SharedModule,
    MatListModule,
    MatRadioModule,
    MatButtonModule,
    MatExpansionModule,
    MatTooltipModule,
    MatSelectModule,
    MatDialogModule,
    StorageServiceModule
  ],
  declarations: [RequestEstimateComponent, RequestEstimateSuccessComponent],
  providers: [
    RequestEstimateService,
    RequestEstimateGuard,
    RequestEstimateResolver,
    ProfileService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class RequestEstimateModuleModule { }
