import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { NotificationPreferencesResolver } from './pages/notification-preferences/notification-preferences.resolver';
import { AuthCentralLayoutComponent } from './shared/layouts/AuthCentralLayoutComponent/AuthCenralLayout.component';
import { AuthenticatedLayoutComponent } from './shared/layouts/AuthenticatedLayoutComponent/AuthenticatedLayout.component';
import { HomepageResolver } from './shared/routeresolvers/homepage-resolver';
import { MyCardsResolverService } from './shared/routeresolvers/my-cards-resolver.service';
import { OrderreplacementResolverService } from './shared/routeresolvers/orderreplacement-resolver';
import { MyPlansResolverService } from './shared/routeresolvers/my-plans-resolver.service';
import { MyclaimsResolverService } from './shared/routeresolvers/myclaims-resolver.service';
import { MyprofileResolverService } from './shared/routeresolvers/myprofile-resolver.service';
import { AuthGuard } from './shared/utils/auth.guard';
import { NoMenuResolver } from './shared/utils/nomenu.resolver';
import { ScopeGuard } from './shared/utils/scope.guard';
import { SsoResolver } from './pages/sso/sso.resolver';
import { MyDedCoResolver } from './pages/myded-co/myded-co.resolver';
import { VdkComponent } from './pages/vdk/vdk.component';
import { FadResolverService } from './shared/routeresolvers/FadResolverService';
import {
  OrderIdCardLayoutComponent,
} from './shared/layouts/OrderIdCardLayoutComponent/OrderIdCardLayout.component';

export const router: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'fad',
    // canActivate: [AuthGuard, ScopeGuard],
    component: AuthenticatedLayoutComponent,
    resolve: {
      claimsInfo: FadResolverService
    },
    data: {
      breadcrumb: 'FAD'
    },
    loadChildren: 'app/pages/fad/fad.module#FadModule'
  },
  {
    path: 'myclaims',
    canActivate: [AuthGuard, ScopeGuard],
    component: AuthenticatedLayoutComponent,
    resolve: {
      claimsInfo: MyclaimsResolverService
    },
    data: {
      breadcrumb: 'My Claims'
    },
    loadChildren: 'app/pages/myclaims/claims.module#ClaimsModule'
  },
  {
    path: 'member-migration',
    canActivate: [ScopeGuard],
    resolve: {
      menu: NoMenuResolver
    },
    component: AuthCentralLayoutComponent,
    loadChildren: 'app/pages/member-migration/member-migration.module#MemberMigrationModule'
  },
  {
    path: 'myplans',
    canActivate: [AuthGuard, ScopeGuard],
    component: AuthenticatedLayoutComponent,
    resolve: {
      plan: MyPlansResolverService
    },
    data: {
      breadcrumb: 'My Plans'
    },
    loadChildren: 'app/pages/myplans/myplans.module#MyplansModule'
  },
  {
    path: 'mycards',
    canActivate: [AuthGuard, ScopeGuard],
    component: AuthenticatedLayoutComponent,
    resolve: {
      cardsInfo: MyCardsResolverService
    },
    data: {
      breadcrumb: 'My Cards'
    },
    loadChildren: 'app/pages/mycards/mycards.module#MycardsModule'
  },
  {
    path: 'mypreferences',
    canActivate: [AuthGuard, ScopeGuard],
    loadChildren: 'app/pages/mypreferences/mypreferences.module#MyPreferencesModule'
  },
  {
    path: 'mydedco',
    canActivate: [AuthGuard, ScopeGuard],
    resolve: {
      dedcoList: MyDedCoResolver
    },
    data: {
      breadcrumb: 'Deductible & Co-insurance'
    },
    loadChildren: 'app/pages/myded-co/myded-co.module#MyDedCoModule'
  },
  {
    path: 'request-estimate',
    canActivate: [AuthGuard, ScopeGuard],
    data: {
      breadcrumb: 'Request Written Estimate'
    },
    loadChildren: 'app/pages/request-estimate/request-estimate.module#RequestEstimateModuleModule'
  },
  {
    path: 'orderreplacement',
    canActivate: [AuthGuard, ScopeGuard],
    component: OrderIdCardLayoutComponent,
    resolve: {
      cardsData: OrderreplacementResolverService
    },
    data: {
      breadcrumb: 'Order ID Card'
    },
    loadChildren: 'app/pages/orderreplacement/orderreplacement.module#OrderreplacementModule'
  },
  {
    path: 'mymedications',
    canActivate: [AuthGuard, ScopeGuard],
    component: AuthenticatedLayoutComponent,
    data: {
      breadcrumb: 'My Medications'
    },
    loadChildren: 'app/pages/medications/medications.module#MyMedicationsModule'
  },
  {
    path: 'fad',
    loadChildren: 'app/pages/sso/sso.module#SsoModule',
    resolve: {
      sso: SsoResolver
    }
  },
  {
    path: 'sso/cerner',
    canActivate: [AuthGuard, ScopeGuard],
    loadChildren: 'app/pages/sso/sso.module#SsoModule',
    resolve: {
      sso: SsoResolver
    }
  },
  {
    path: 'sso/alegeus',
    canActivate: [AuthGuard, ScopeGuard],
    loadChildren: 'app/pages/sso/sso.module#SsoModule',
    resolve: {
      sso: SsoResolver
    }
  },
  {
    path: 'sso/heathequity',
    canActivate: [AuthGuard, ScopeGuard],
    loadChildren: 'app/pages/sso/sso.module#SsoModule',
    resolve: {
      sso: SsoResolver
    }
  },
  {
    path: 'sso/connecture',
    canActivate: [AuthGuard, ScopeGuard],
    loadChildren: 'app/pages/sso/sso.module#SsoModule',
    resolve: {
      sso: SsoResolver
    }
  },
  {
    path: 'mydoctors',
    canActivate: [AuthGuard, ScopeGuard],
    data: {
      breadcrumb: 'My Doctors'
    },
    loadChildren: 'app/pages/mydoctors-pcp/mydoctors-pcp.module#MyDoctorsPcpModule'
  },
  {
    path: 'register',
    loadChildren: 'app/pages/registration/registration.module#RegistrationModule'
  },
  {
    path: 'login',
    // canActivate: [AuthGuard],
    loadChildren: 'app/pages/login/login.module#LoginModule',
  },
  {
    path: 'account',
    // canActivate: [AuthGuard],
    loadChildren: 'app/pages/my-account/my-account.module#MyAccountModule',
  },
  {
    path: 'myprofile',
    canActivate: [AuthGuard, ScopeGuard], // confirmed with leads (ANV users wont goto myprofile )
    loadChildren: 'app/pages/my-profile/profileHome.module#ProfileHomeModule',
    data: {
      breadcrumb: 'Profile'
    },
    resolve: {
      profile: MyprofileResolverService
    }
  },
  {
    path: 'message-center',
    canActivate: [AuthGuard, ScopeGuard],
    data: {
      breadcrumb: 'My Inbox'
    },
    loadChildren: 'app/pages/message-center/message-center.module#MessageCenterModule'
  },
  {
    path: 'home',
    component: AuthenticatedLayoutComponent,
    loadChildren: 'app/pages/landing/landing.module#LandingModule',
    resolve: {
      home: HomepageResolver
    }
  },
  {
    path: 'myaccount',
    component: AuthenticatedLayoutComponent,
    data: {
      breadcrumb: 'My Account'
    },
    loadChildren: 'app/pages/myaccount/myaccount.module#MyaccountModule',
  },
  {
    path: 'vdk',
    component: VdkComponent
  },
  {
    path: 'notification-preferences',
    canActivate: [AuthGuard, ScopeGuard],
    component: AuthCentralLayoutComponent,
    data: {
      breadcrumb: 'Preferences'
    },
    loadChildren: 'app/pages/notification-preferences/notification-preferences.module#NotificationPreferencesModule',
    resolve: {
      commstatus: NotificationPreferencesResolver
    }
  },
  {
    path: 'pages',
    loadChildren: 'app/pages/static/static.module#StaticModule',
  },
  {
    path: 'myfinancials',
    canActivate: [AuthGuard, ScopeGuard],
    loadChildren: 'app/pages/financials/financials.module#FinancialsModule',
    data: {
      breadcrumb: 'My Financials'
    }
  },
  // {
  //   path: '404',
  //   component: NotfoundComponent
  // },
  {
    path: '**',
    component: NotfoundComponent
  }
];

export const appRouter: ModuleWithProviders = RouterModule.forRoot(router, { onSameUrlNavigation: 'reload' });
