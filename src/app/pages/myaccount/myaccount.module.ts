import {CommonModule, TitleCasePipe} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatRadioModule, MatSelectModule} from '@angular/material';
import {MaterializeModule} from 'angular2-materialize';
import {TextMaskModule} from 'angular2-text-mask';
import {SharedModule} from '../../shared/shared.module';
import {AuthGuard} from '../../shared/utils/auth.guard';
import {MyaccountRouter} from './myaccount.routing';
import {MyAccountComponent} from './myaccount.component';
import {LandingService} from '../landing/landing.service';
import {MyAccountService} from './myaccount.service';

@NgModule({
  declarations: [
    MyAccountComponent,
  ],
  exports: [],
  providers: [
    AuthGuard,
    LandingService,
    TitleCasePipe,
    MyAccountService
  ],
  imports: [
    CommonModule,
    MyaccountRouter,
    FormsModule,
    TextMaskModule,
    SharedModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatSelectModule,
    MaterializeModule
  ]
})
export class MyaccountModule {
}
