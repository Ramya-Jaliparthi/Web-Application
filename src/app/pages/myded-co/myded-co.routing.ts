import { RouterModule, Routes } from '@angular/router';
import { AuthCentralLayoutComponent } from '../../shared/layouts/AuthCentralLayoutComponent/AuthCenralLayout.component';
import { AuthenticatedLayoutComponent } from '../../shared/layouts/AuthenticatedLayoutComponent/AuthenticatedLayout.component';
import { GlossaryComponent } from './drupalpages/glossary/glossary.component';
import { InformationComponent } from './drupalpages/information/information.component';
import { MyDedCoComponent } from './landing/myded-co.component';
import { MyDedCoGuard } from './myded-co.guard';
const MYDEDCO_ROUTER: Routes = [
  {
    path: '',
    component: AuthenticatedLayoutComponent,
    children: [
      {
        path: '',
        component: MyDedCoComponent,
        canActivate: [MyDedCoGuard],
      }
    ]
  },
  {
    path: 'glossary',
    component: AuthCentralLayoutComponent,
    children: [
      {
        path: '',
        component: GlossaryComponent
      }
    ]
  },
  {
    path: 'information',
    component: AuthCentralLayoutComponent,
    children: [
      {
        path: '',
        component: InformationComponent
      }
    ]
  }
];

export const MyDedCoRouter = RouterModule.forChild(MYDEDCO_ROUTER);
