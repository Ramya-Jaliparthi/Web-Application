import { Routes, RouterModule } from '@angular/router';
import { MyPreferencesComponent } from './mypreferences/mypreferences.component';
import { NotificationDetailComponent } from './notification-detail/notification-detail.component';
import { MyPrefNotificationsComponent } from './notifications/notifications.component';
import { MyPrefDeliveryComponent } from './delivery/delivery.component';
import { MyPrefDeliveryFinancialComponent } from './delivery-financial/delivery-financial.component';
import { VerifyEmailMobileComponent } from './verify-email-mobile/verify-email-mobile.component';
import { AuthCentralLayoutComponent } from '../../shared/layouts/AuthCentralLayoutComponent/AuthCenralLayout.component';
import { AuthenticatedLayoutComponent } from '../../shared/layouts/AuthenticatedLayoutComponent/AuthenticatedLayout.component';
import { MyPrefALGGuard, MyPrefAVScopeGuard, MyPrefAPIResolver, MyProfileAPIResolver  } from './mypreferences.guard';

const MYPREF_ROUTER: Routes = [
  {
    path: '',
    component: AuthenticatedLayoutComponent,
    children: [
      // {
        // path: '',
        // resolve: {
        //   mypref: MyPrefAPIResolver,
        //   myprofile: MyProfileAPIResolver,
        // },
        // children: [
          {
            path: '',
            component: MyPrefNotificationsComponent
          },
          {
            path: 'healthyUpdates',
            component: NotificationDetailComponent
          },
          {
            path: 'mandatory',
            component: NotificationDetailComponent
          },
          {
            path: 'accountActivity',
            component: NotificationDetailComponent
          },
          {
            path: 'smartshopper',
            canActivate: [MyPrefAVScopeGuard],
            component: NotificationDetailComponent
          },
          {
            path: 'financials',
            component: NotificationDetailComponent
          },
          {
            path: 'myinbox',
            component: NotificationDetailComponent
          }
        // ]
      // }
    ]
  },
  {
    path: 'verify',
    component: AuthCentralLayoutComponent ,
    children: [
      {
        path: '',
        component: VerifyEmailMobileComponent
      }
    ]
  }
];

export const PrefRouter = RouterModule.forChild(MYPREF_ROUTER);
