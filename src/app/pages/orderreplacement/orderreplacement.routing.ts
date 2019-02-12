import { Routes, RouterModule } from '@angular/router';
import { OrderreplacementComponent } from './orderreplacement.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';

const ORDERIDCARDS_ROUTER: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'Order ID Card'
    },
    component: OrderreplacementComponent
  }
];

export const OrderreplacementRouter = RouterModule.forChild(ORDERIDCARDS_ROUTER);
