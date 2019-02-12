import { Routes, RouterModule } from '@angular/router';
import { AuthCentralLayoutComponent } from '../../shared/layouts/AuthCentralLayoutComponent/AuthCenralLayout.component';
import { AuthenticatedLayoutComponent } from '../../shared/layouts/AuthenticatedLayoutComponent/AuthenticatedLayout.component';
import { RequestEstimateComponent } from './landing/request-estimate.component';
import { RequestEstimateSuccessComponent } from './success/request-estimate-success.component';
import { RequestEstimateResolver } from './request-estimate.resolver';
import { RequestEstimateGuard } from './request-estimate.guard';

const REQUESTESTIMATE_ROUTER: Routes = [
  {
    path: '',
    component: AuthenticatedLayoutComponent,
    canActivate: [RequestEstimateGuard],
    children: [
      {
        path: '',
        component: RequestEstimateComponent,
        data: {
          breadcrumb: 'Request Written Estimate'
        },
        resolve: {
          memberInfo: RequestEstimateResolver
        }
      }
    ]
  },
  {
    path: 'success',
    component: AuthCentralLayoutComponent,
    children: [
      {
        path: '',
        data: {
          breadcrumb: 'Request Written Estimate Success'
        },
        component: RequestEstimateSuccessComponent
      }
    ]
  }
];

export const RequestEstimateRouter = RouterModule.forChild(REQUESTESTIMATE_ROUTER);
