import {Routes, RouterModule} from '@angular/router';
import {VdkComponent} from './vdk.component';
import {UnauthenticatedLayoutComponent} from '../../shared/layouts/UnauthenticatedLayoutComponent/UnauthenticatedLayout.component';
import {NoMenuResolver} from '../../shared/utils/nomenu.resolver';
import { LoginComponent } from '../login/login.component';


// TODO: Implement Guards properly register workflow
const LOGIN_ROUTER: Routes = [
   {
    path: 'login',
    component: UnauthenticatedLayoutComponent,
    resolve: {
      menu: NoMenuResolver
    },
    children: [
      {
        path: '',
        component: LoginComponent
      }
    ]
  }
];

export const vdkRouter = RouterModule.forChild(LOGIN_ROUTER);
