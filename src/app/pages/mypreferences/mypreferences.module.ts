import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';

import {
  MatRadioModule,
  MatCardModule,
  MatIconModule,
  MatSelectModule,
  MatSidenavModule,
  MatTooltipModule,
  MatTooltip,
  MatDialogModule,
  MatCheckboxModule,
   MatDatepickerModule, MatExpansionModule,
  MatListModule, MatNativeDateModule, MatButtonModule
} from '@angular/material';
import {TextMaskModule} from 'angular2-text-mask';
import { MyPrefALGGuard, MyPrefAVScopeGuard, MyPrefAPIResolver, MyProfileAPIResolver } from './mypreferences.guard';
import { MyPreferencesComponent } from './mypreferences/mypreferences.component';
import { NotificationDetailComponent } from './notification-detail/notification-detail.component';
import { MyPrefNotificationsComponent } from './notifications/notifications.component';
import { MyPrefDeliveryComponent } from './delivery/delivery.component';
import { MyPrefDeliveryFinancialComponent } from './delivery-financial/delivery-financial.component';
import { PrefRouter} from './mypreferences.routing';
import { MyPrefService } from './mypreferences.service';
import { MyPrefConst } from './mypreferences.constants';
import { VerifyEmailMobileComponent } from './verify-email-mobile/verify-email-mobile.component';

@NgModule({
    declarations: [
      MyPreferencesComponent,
      NotificationDetailComponent,
      MyPrefNotificationsComponent,
      MyPrefDeliveryComponent,
      VerifyEmailMobileComponent,
      MyPrefDeliveryFinancialComponent
    ],
    exports: [
    ],
    providers: [
      MyPrefAVScopeGuard,
      MyPrefALGGuard,
      MyPrefService,
      MyPrefAPIResolver,
      MyProfileAPIResolver,
      MyPrefConst
    ],
    imports: [
      FormsModule,
      CommonModule,
      TextMaskModule,
      ReactiveFormsModule,
      PrefRouter,
      SharedModule,
      MatRadioModule,
      MatSelectModule,
      MatCardModule,
      MatIconModule,
      MatSidenavModule,
      MatTooltipModule,
      MatDialogModule,
      MatCheckboxModule,
      MatDatepickerModule,
      MatExpansionModule,
      MatListModule,
      MatNativeDateModule,
      MatButtonModule
    ]
  })
  export class MyPreferencesModule { }
