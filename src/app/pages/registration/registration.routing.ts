import {Routes, RouterModule} from '@angular/router';
import {RegisterComponent} from './register/register.component';
import {RegisterDetailComponent} from './register-detail/register-detail.component';
import {MemberInfoComponent} from './member-info/member-info.component';
import {UpdatessnComponent} from './updatessn/updatessn.component';
import {VerifyaccesscodeComponent} from './verifyaccesscode/verifyaccesscode.component';
import {UnauthenticatedLayoutComponent} from '../../shared/layouts/UnauthenticatedLayoutComponent/UnauthenticatedLayout.component';
import {SuccessInfoComponent} from './success/success-info.component';
import {SecurityComponent} from './security-answers/security-answers.component';
import {NoMenuResolver} from '../../shared/utils/nomenu.resolver';
import {RegistrationGuard} from './registration.guard';
import { RegistrationResolver } from './registration-resolver';
const REGISTER_ROUTER: Routes = [
  {
    path: '',
    component: UnauthenticatedLayoutComponent,
    resolve: {
      menu: NoMenuResolver
    },
    children: [
      {
        path: '',
        component: RegisterComponent
      },
      {
        path: 'register-detail',
        component: RegisterDetailComponent,
        canActivate: [RegistrationGuard],
        resolve: {
          memberInfo: RegistrationResolver
        }
      },
      {
        path: 'memberinfo',
        component: MemberInfoComponent,
        canActivate: [RegistrationGuard],
        resolve: {
          memberInfo: RegistrationResolver
        }
      },
      {
        path: 'updatessn',
        component: UpdatessnComponent,
        canActivate: [RegistrationGuard],
        resolve: {
          memberInfo: RegistrationResolver
        }
      },
      {
        path: 'verifyaccesscode',
        component: VerifyaccesscodeComponent,
        // canActivate: [RegistrationGuard],
        resolve: {
          memberInfo: RegistrationResolver
        }
      },
      {
        path: 'success',
        component: SuccessInfoComponent,
        canActivate: [RegistrationGuard]
      },
      {
        path: 'securityanswers',
        component: SecurityComponent
      }
    ]
  }
];

export const RegistrationRouter = RouterModule.forChild(REGISTER_ROUTER);
