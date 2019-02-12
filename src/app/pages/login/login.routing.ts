import { RouterModule, Routes } from '@angular/router';
import { UnauthenticatedLayoutComponent } from '../../shared/layouts/UnauthenticatedLayoutComponent/UnauthenticatedLayout.component';
import { NoMenuResolver } from '../../shared/utils/nomenu.resolver';
import { LoginComponent } from './login.component';


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

export const LoginRouter = RouterModule.forChild(LOGIN_ROUTER);
