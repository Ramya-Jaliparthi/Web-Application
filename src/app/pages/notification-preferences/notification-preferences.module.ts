import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {NotificationPreferencesResolver} from './notification-preferences.resolver';
import {NotificationPreferencesComponent} from './notification-preferences.component';
import {NotificationsRouter} from './notification-preferences.routing';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NotificationsRouter,
    SharedModule
  ],
  declarations: [
    NotificationPreferencesComponent
  ],
  providers: [
    NotificationPreferencesResolver
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class NotificationPreferencesModule {
}
