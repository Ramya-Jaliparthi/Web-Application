import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextMaskModule } from 'angular2-text-mask';
import {
  MatExpansionModule,
  MatListModule, MatRadioModule, MatButtonModule, MatTooltipModule
} from '@angular/material';
import { FinancialsComponent } from './landing/financials.component';
import { FinancialsRouter } from './financials.routing';
import { AuthHttp } from '../../shared/services/authHttp.service';
import { authHttpFactory } from '../../shared/utils/authHttp.factory';
import { HttpClient } from '@angular/common/http';
import { SharedModule, AuthService, ConstantsService } from '../../shared/shared.module';
import { AuthGuard } from '../../shared/utils/auth.guard';
import { FinancialsLandingPageService } from './landing/financials-landing.service';
import { FinancialAccountDetailComponent } from './financialAccountDetail/financial-account-detail.component';
import { FinancialAccountDetailService } from './financialAccountDetail/financial-account-detail.service';
import { AllTransactionsComponent } from './all-transactions/all-transactions.component';
import { AlltransactionsService } from './all-transactions/alltransactions.service';
import { FilterSearchAllTransactionsComponent } from './filter-search-all-transactions/filter-search-all-transactions.component';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { TransactionDetailsService } from './transaction-details/transaction-details.service';
import { MakePaymentComponent } from './make-payment/make-payment.component';
import { SchedulePaymentComponent } from './schedule-payment/schedule-payment.component';
import { AddProviderComponent } from './add-provider/add-provider.component';
import { PreviousAccountsComponent } from './previous-accounts/previous-accounts.component';
import { DebitCardsComponent } from './debit-cards/debit-cards.component';
import { DebitCardDetailsComponent } from './debit-card-details/debit-card-details.component';
import { MakePaymentSuccessComponent } from './make-payment-success/make-payment-success.component';
import { MakePaymentLaterComponent } from './make-payment-later/make-payment-later.component';
import { MakePaymentOptionsComponent } from './make-payment-options/make-payment-options.component';
import { ActivateCardComponent } from './activate-card/activate-card.component';
import { ReportCardComponent } from './report-card/report-card.component';

@NgModule({
  declarations: [
    FinancialsComponent,
    FinancialAccountDetailComponent,
    AllTransactionsComponent,
    FilterSearchAllTransactionsComponent,
    TransactionDetailsComponent,
    MakePaymentComponent,
    SchedulePaymentComponent,
    AddProviderComponent,
    PreviousAccountsComponent,
    DebitCardsComponent,
    DebitCardDetailsComponent,
    MakePaymentSuccessComponent,
    MakePaymentLaterComponent,
    MakePaymentOptionsComponent,
    ActivateCardComponent,
    ReportCardComponent
  ],
  exports: [
  ],
  providers: [
    AuthGuard,
    FinancialsLandingPageService,
    FinancialAccountDetailService,
    AlltransactionsService,
    TransactionDetailsService
  ],
  imports: [
    FinancialsRouter,
    FormsModule,
    CommonModule,
    TextMaskModule,
    ReactiveFormsModule,
    SharedModule,
    MatListModule,
    MatRadioModule,
    MatButtonModule,
    MatExpansionModule,
    MatTooltipModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class FinancialsModule { }
