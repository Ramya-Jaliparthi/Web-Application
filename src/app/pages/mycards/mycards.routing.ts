import { Routes, RouterModule } from '@angular/router';
import { MycardsComponent } from './mycards.component';
import { MyCardsGuard } from './mycards.guard';

const MYCARDS_ROUTER: Routes = [
   {
    path: '',
    component: MycardsComponent,
    data: {
      breadcrumb: 'My Cards'
    },
    canActivate: [MyCardsGuard]
  }
];

export const MycardsRouter = RouterModule.forChild(MYCARDS_ROUTER);
