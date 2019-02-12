import { Routes, RouterModule } from '@angular/router';
import { MyMedicationsComponent } from './mymedications/mymedications.component';
import { MyMedicationDetailsComponent } from './myMedicationDetails/myMedicationDetails.component';
import {MymedsResolverService} from '../../shared/routeresolvers/mymeds-resolver.service';

const MEDICATIONS_ROUTER: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'My Medication'
    },
    component: MyMedicationsComponent,
    resolve: {
      medsInfo: MymedsResolverService
    },
  },
  {
    path: 'medicationdetails',
    data: {
      breadcrumb: 'Medication Details'
    },
    component: MyMedicationDetailsComponent
  }
];

export const MedicationsRouter = RouterModule.forChild(MEDICATIONS_ROUTER);
