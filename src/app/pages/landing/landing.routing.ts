import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../shared/utils/auth.guard';
import { AuthUserLandingComponent } from './authenticated-user/authenticated-user.component';
import { AllowAVOnlyGuard } from './landing.guard';
const LANDING_ROUTER: Routes = [
  {
    path: '',
    component: AuthUserLandingComponent,
    canActivate: [AuthGuard, AllowAVOnlyGuard]
  }
];

export const LandingRouter = RouterModule.forChild(LANDING_ROUTER);
