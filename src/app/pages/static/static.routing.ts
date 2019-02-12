import {Routes, RouterModule} from '@angular/router';
import {StaticComponent} from './static.component';
import {ConfidentialityComponent} from './confidentiality/confidentiality.component';
import {LearnMoreComponent} from './learn-more/learn-more.component';
import {TermsComponent} from './terms/terms.component';
import {MaintenanceComponent} from './maintenance/maintenance.component';
import {AuthGuard} from '../../shared/utils/auth.guard';
import {AuthenticatedLayoutComponent} from '../../shared/layouts/AuthenticatedLayoutComponent/AuthenticatedLayout.component';
import { FpoMyprofileComponent } from './fpo-myprofile/fpo-myprofile.component';
import { Campaign1Component } from './campaign-1/campaign-1.component';
import {AlegeustermsComponent} from './alegeusterms/alegeusterms.component';
import { Campaign2Component } from './campaign-2/campaign-2.component';
import { Campaign3Component } from './campaign-3/campaign-3.component';
import { Campaign4Component } from './campaign-4/campaign-4.component';
import { Campaign5Component } from './campaign-5/campaign-5.component';
import { Campaign6Component } from './campaign-6/campaign-6.component';

const STATIC_ROUTER: Routes = [
  {
    path: '',
    component: StaticComponent,
    children: [
      {
        path: 'confidentiality',
        component: ConfidentialityComponent
      },
      {
        path: 'learnmore',
        component: LearnMoreComponent
      },
      {
        path: 'terms',
        component: TermsComponent
      },
      {
        path: 'relFpo',
        component: FpoMyprofileComponent
      },
      {
        path: 'alegeusterms',
        component: AlegeustermsComponent
      }
    ]
  },
  {
    path: 'parent/:type',
    component: StaticComponent,
    children: [
      {
        path: 'confidentiality',
        component: ConfidentialityComponent
      },
      {
        path: 'learnmore',
        component: LearnMoreComponent
      },
      {
        path: 'terms',
        component: TermsComponent
      }
    ]
  },
  {
    path: 'maintenance',
    component: AuthenticatedLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: MaintenanceComponent
      }
    ]
  },
  {
    path: 'campaign1',
    component: AuthenticatedLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: Campaign1Component
      }
    ]
  },
  {
    path: 'campaign2',
    component: AuthenticatedLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: Campaign2Component
      }
    ]
  },
  {
    path: 'campaign3',
    component: AuthenticatedLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: Campaign3Component
      }
    ]
  },
  {
    path: 'campaign4',
    component: AuthenticatedLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: Campaign4Component
      }
    ]
  },
  {
    path: 'campaign5',
    component: AuthenticatedLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: Campaign5Component
      }
    ]
  },
  {
    path: 'campaign6',
    component: AuthenticatedLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: Campaign6Component
      }
    ]
  }
];

export const StaticComponentRouter = RouterModule.forChild(STATIC_ROUTER);
