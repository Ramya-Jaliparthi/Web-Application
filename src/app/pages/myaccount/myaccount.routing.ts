import {Routes, RouterModule} from '@angular/router';
import {MyAccountComponent} from './myaccount.component';
import {AuthGuard} from '../../shared/utils/auth.guard';
import {MyaccountResolver} from './myaccount.resolver';

const MYACCOUNT_ROUTER: Routes = [
  {
    path: '',
    component: MyAccountComponent,
    canActivate: [AuthGuard],
    resolve: {
      myAccountData: MyaccountResolver
    }
  }
];

export const MyaccountRouter = RouterModule.forChild(MYACCOUNT_ROUTER);
