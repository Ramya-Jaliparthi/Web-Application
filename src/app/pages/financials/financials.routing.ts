import {RouterModule, Routes} from '@angular/router';
import {AuthCentralLayoutComponent} from '../../shared/layouts/AuthCentralLayoutComponent/AuthCenralLayout.component';
import {AuthenticatedLayoutComponent} from '../../shared/layouts/AuthenticatedLayoutComponent/AuthenticatedLayout.component';
import {FinancialsComponent} from './landing/financials.component';
import {FinancialAccountDetailComponent} from './financialAccountDetail/financial-account-detail.component';
import {AllTransactionsComponent} from './all-transactions/all-transactions.component';
import {TransactionDetailsComponent} from './transaction-details/transaction-details.component';
import {MakePaymentComponent} from './make-payment/make-payment.component';
import {SchedulePaymentComponent} from './schedule-payment/schedule-payment.component';
import {AddProviderComponent} from './add-provider/add-provider.component';
import {FinancialsLandingResolver} from './landing/financials-landing.resolver';
import {MakePaymentResolver} from './make-payment/make-payment.resolver';
import {SchedulePaymentResolver} from './schedule-payment/schedule-payment.resolver';
import {PreviousAccountsComponent} from './previous-accounts/previous-accounts.component';
import {DebitCardsComponent} from './debit-cards/debit-cards.component';
import {DebitCardDetailsComponent} from './debit-card-details/debit-card-details.component';
import {MakePaymentSuccessComponent} from './make-payment-success/make-payment-success.component';
import {MakePaymentLaterComponent} from './make-payment-later/make-payment-later.component';
import {MakePaymentOptionsComponent} from './make-payment-options/make-payment-options.component';
import {ActivateCardComponent} from './activate-card/activate-card.component';
import {ReportCardComponent} from './report-card/report-card.component';

const FINANCIALS_ROUTER: Routes = [
  {
    path: '',
    component: AuthenticatedLayoutComponent,
    children: [
      {
        path: '',
        component: FinancialsComponent,
        resolve: {
          summary: FinancialsLandingResolver
        }
      }
    ]
  },
  {
    path: 'account/:acctype/:planyear',
    component: AuthenticatedLayoutComponent,
    children: [
      {
        path: '',
        component: FinancialAccountDetailComponent,
        resolve: {
          summary: FinancialsLandingResolver
        }
      }
    ]
  },
  {
    path: 'previousaccounts',
    component: AuthenticatedLayoutComponent,
    children: [
      {
        path: '',
        component: PreviousAccountsComponent,
        resolve: {
          summary: FinancialsLandingResolver
        }
      },
      {
        path: 'account/:acctype/:planyear',
        component: FinancialAccountDetailComponent,
        resolve: {
          summary: FinancialsLandingResolver
        }
      }
    ]
  },
  {
    path: 'alltransactions',
    component: AuthenticatedLayoutComponent,
    children: [
      {
        path: '',
        component: AllTransactionsComponent
      }
    ]
  },
  {
    path: 'alltransactions/transactiondetail/:TransactionId',
    component: AuthenticatedLayoutComponent,
    children: [
      {
        path: '',
        component: TransactionDetailsComponent
      }
    ]
  },
  {
    path: 'makepayment/:whomToPay/:whenToSubmit',
    component: AuthCentralLayoutComponent,
    children: [
      {
        path: '',
        component: MakePaymentComponent,
        resolve: {
          details: MakePaymentResolver
        }
      }
    ]
  },
  {
    path: 'schedulepayment',
    component: AuthCentralLayoutComponent,
    children: [
      {
        path: '',
        component: SchedulePaymentComponent,
        resolve: {
          details: SchedulePaymentResolver
        }
      }
    ]
  },
  {
    path: 'addprovider',
    component: AuthCentralLayoutComponent,
    children: [
      {
        path: '',
        component: AddProviderComponent
      }
    ]
  },
  {
    path: 'cards',
    component: AuthenticatedLayoutComponent ,
    children: [
      {
        path: '',
        component: DebitCardsComponent
      }
    ]
  },
  {
    path: 'carddetails',
    component: AuthCentralLayoutComponent,
    children: [
      {
        path: '',
        component: DebitCardDetailsComponent
      }
    ]
  },
  {
    path: 'paymentsubmitted/:whomToPay/:whenToSubmit',
    component: AuthenticatedLayoutComponent,
    children: [
      {
        path: '',
        component: MakePaymentSuccessComponent
      }
    ]
  },
  {
    path: 'paymentpending/:whomToPay',
    component: AuthenticatedLayoutComponent,
    children: [
      {
        path: '',
        component: MakePaymentLaterComponent
      }
    ]
  },
  {
    path: 'paymentoptions',
    component: AuthCentralLayoutComponent,
    children: [
      {
        path: '',
        component: MakePaymentOptionsComponent
      }
    ]
  },
  {
    path: 'activatecard',
    component: AuthCentralLayoutComponent,
    children: [
      {
        path: '',
        component: ActivateCardComponent
      }
    ]
  },
  {
    path: 'reportcard',
    component: AuthCentralLayoutComponent,
    children: [
      {
        path: '',
        component: ReportCardComponent
      }
    ]
  }
];

export const FinancialsRouter = RouterModule.forChild(FINANCIALS_ROUTER);
