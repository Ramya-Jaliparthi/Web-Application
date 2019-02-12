import { Routes, RouterModule } from '@angular/router';
import { SsoComponent } from './sso/sso.component';
import { SsoGuard } from './sso.guard';

const SSO_ROUTER: Routes = [
  {
    path: '',
    component: SsoComponent,
    canActivate: [SsoGuard]
  }
];

export const SsoRouter = RouterModule.forChild(SSO_ROUTER);
