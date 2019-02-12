import {Routes, RouterModule} from '@angular/router';
import {NotificationPreferencesComponent} from './notification-preferences.component';

const NOTIFICATIONS_ROUTER: Routes = [
  {
    path: '',
    data: {
      pageTitle: 'Notification Preferences',
      breadcrumb: 'Notification Preferences'
    },
    component: NotificationPreferencesComponent
  }
];

export const NotificationsRouter = RouterModule.forChild(NOTIFICATIONS_ROUTER);
