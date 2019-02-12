import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthCentralLayoutComponent } from '../../shared/layouts/AuthCentralLayoutComponent/AuthCenralLayout.component';
import { AuthenticatedLayoutComponent } from '../../shared/layouts/AuthenticatedLayoutComponent/AuthenticatedLayout.component';
import { OrderIdCardLayoutComponent } from '../../shared/layouts/OrderIdCardLayoutComponent/OrderIdCardLayout.component';
import { MyDoctorsComponent } from './mydoctors/landing/mydoctors.component';
import { MyDoctorDetailsComponent } from './mydoctors/details/mydoctor-details.component';
import { AddPcpComponent } from './pcp/add-pcp/add-pcp.component';
import { UpdatePcpComponent } from './pcp/update-pcp/update-pcp.component';
import { PcpResultComponent } from './pcp/pcp-result/pcp-result.component';
import { PcpErrorComponent } from './pcp/pcp-error/pcp-error.component';
import { MyDoctorsResolver } from './mydoctors/landing/mydoctors.resolver';
import { MemberInfoResolver } from './mydoctors/landing/memberInfo.resolver';
import { DependentsResolver } from './mydoctors/landing/dependents.resolver';

const routes: Routes = [
  {
    path: '',
    component: AuthenticatedLayoutComponent,
    children: [
      {
        path: '',
        component: MyDoctorsComponent,
        resolve: {
          doctorList: MyDoctorsResolver,
          // memberInfo: MemberInfoResolver,
          // dependentList: DependentsResolver
        },
        data: {
          breadcrumb: 'My Doctor'
        },
      },
      {
        path: 'details',
        data: {
          breadcrumb: 'Doctor Details'
        },
        component: MyDoctorDetailsComponent
      }
    ]
  },
  {
    path: 'add-pcp',
    component: OrderIdCardLayoutComponent,
    data: {
      breadcrumb: 'Add PCP'
    },
    children: [
      {
        path: '',
        component: AddPcpComponent
      }
    ]
  },
  {
    path: 'update-pcp',
    component: OrderIdCardLayoutComponent,
    data: {
      breadcrumb: 'Update PCP'
    },
    children: [
      {
        path: '',
        component: UpdatePcpComponent
      }
    ]
  },
  {
    path: 'pcp-result',
    component: AuthCentralLayoutComponent,
    children: [
      {
        path: '',
        component: PcpResultComponent
      }
    ]
  },
  {
    path: 'pcp-error',
    component: AuthCentralLayoutComponent,
    children: [
      {
        path: '',
        component: PcpErrorComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyDoctorsPcpRouter { }
