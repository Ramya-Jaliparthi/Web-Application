import { RouterModule, Routes } from '@angular/router';
import { MyprofileResolverService } from '../../shared/routeresolvers/myprofile-resolver.service';
import { ProfileComponent } from './profile/profile.component';
import { RaceLanguageEthinicityComponent } from './race-language-ethinicity/race-language-ethinicity.component';
import { VerifyEmailMobileComponent } from './verify-email-mobile/verify-email-mobile.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { AuthCentralLayoutComponent } from '../../shared/layouts/AuthCentralLayoutComponent/AuthCenralLayout.component';
import { AuthenticatedLayoutComponent } from '../../shared/layouts/AuthenticatedLayoutComponent/AuthenticatedLayout.component';

const REGISTER_ROUTER: Routes = [
  {
    path: '',
    component: AuthenticatedLayoutComponent ,
    children: [
      {
        path: '',
        component: ProfileComponent
      }
    ],
    resolve: {
      profile: MyprofileResolverService
    }
  },
  {
    path: 'race',
    component: AuthenticatedLayoutComponent ,
    data: {
      pageTitle: 'Race Ethnicity Language',
      breadcrumb: 'Race Ethnicity Language'
    },
    children: [
      {
        path: '',
        component: RaceLanguageEthinicityComponent
      }
    ],
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
  },
  {
    path: 'updatePassword',
    component: AuthCentralLayoutComponent ,
    data: {
      pageTitle: 'Update Password',
      breadcrumb: 'Update Password'
    },
    children: [
      {
        path: '',
        component: UpdatePasswordComponent
      }
    ]
  }
];

export const ProfileHomeRouter = RouterModule.forChild(REGISTER_ROUTER);
