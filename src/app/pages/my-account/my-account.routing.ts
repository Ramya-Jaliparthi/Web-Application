import { Routes, RouterModule } from '@angular/router';
import { UnauthenticatedLayoutComponent } from '../../shared/layouts/UnauthenticatedLayoutComponent/UnauthenticatedLayout.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { CreatePasswordComponent } from './create-password/create-password.component';
import { ForgotUsernameComponent } from './forgot-username/forgot-username.component';
import { VerifyaccesscodeComponent } from '../registration/verifyaccesscode/verifyaccesscode.component';
import { ConfirmidentityComponent } from './confirm-identity/confirmidentity.component';
import { ForgetUserNameFlowGuard } from './utils/forget-username-flow.guard';
import { ForgetPasswordFlowGuard } from './utils/forget-password-flow.guard';
import { VerifyAccessGuard } from './utils/verify-access.guard';
import { CreatePasswordGuard } from './utils/create-password.guard';
import { FpConfirmidentityComponent } from './fp-confirm-identity/fpconfirmidentity.component';
import { NoMenuResolver } from '../../shared/utils/nomenu.resolver';
import { VerifyOTPaccesscodeComponent } from './verifyOTPaccesscode/verifyaccesscode.component';

const ACCOUNT_ROUTER: Routes = [
  {
    path: '',
    component: UnauthenticatedLayoutComponent,
    resolve: {
      menu: NoMenuResolver
    },
    children: [
      {
        path: 'forgotPassword/:user',
        component: ForgotPasswordComponent
      },
      {
        path: 'forgotusername',
        component: ForgotUsernameComponent
      },
      {
        path: 'createPassword',
        // canActivate: [CreatePasswordGuard],
        component: CreatePasswordComponent
      },
      {
        path: 'verifyAccessCode/:caller',
        canActivate: [VerifyAccessGuard],
        component: VerifyOTPaccesscodeComponent
      },
      {
        path: 'confirmidentity',
        canActivate: [ForgetUserNameFlowGuard],
        component: ConfirmidentityComponent
      },
      {
        path: 'fpconfirmidentity',
        canActivate: [ForgetPasswordFlowGuard],
        component: FpConfirmidentityComponent
      }
    ]
  }
];

export const MyAccountRouter = RouterModule.forChild(ACCOUNT_ROUTER);
