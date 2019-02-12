import { Routes, RouterModule } from '@angular/router';
import { ClaimsComponent } from './myclaims/claims.component';
import { ClaimdetailsComponent } from './myclaimdetails/claimdetails.component';
import { ClaimStatusDetailsComponent } from './myClaimStatusDetails/claimStatusDetails.component';
import { MyclaimsResolverService } from '../../shared/routeresolvers/myclaims-resolver.service';

const CLAIMS_ROUTER: Routes = [
  {
    path: '',
    component: ClaimsComponent,
    data: {
      pageTitle: 'My Claims'
    }
  },
  {
    // path: 'claimDetails/:id/:recordKey',
    path: 'claimdetails',
    component: ClaimdetailsComponent,
    data: {
      pageTitle: 'Claim Detail',
      breadcrumb: 'Claim Details'
    }
  },
  {
    // path: 'claimStatusDetails/:id/:recordKey',
    path: ':detail/:claimstatusdetails',
    component: ClaimStatusDetailsComponent,
    data: {
      pageTitle: 'Claim Status Detail',
      breadcrumb: 'Claim Status Detail'
    }
  }
];

export const ClaimsRouter = RouterModule.forChild(CLAIMS_ROUTER);
