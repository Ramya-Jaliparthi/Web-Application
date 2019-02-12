import { NgModule } from '@angular/core';
import { ProfileInfoComponent } from './profile-info/profile-info.component';
import { UpdatePasswordComponent } from '../member-migration/profile-info-update/update-password/update-password.component';
import { VerifyEmailMobileComponent } from '../member-migration/profile-info-update/verify-email-mobile/verify-email-mobile.component';
import { MigrationSuccessComponent } from '../member-migration/profile-info-update/migration-success/migration-success.component';
import { Routes, RouterModule } from '@angular/router';

const MEM_MIGRATION_ROUTER: Routes = [
  {
    path: '',
    component: ProfileInfoComponent,
    data: {
      pageTitle: 'Member-Migration'
    }
  },
  {
    path: 'verify',
    component: VerifyEmailMobileComponent
  },
  {
    path: 'updatePassword',
    component: UpdatePasswordComponent
  },
  {
    path: 'success',
    component: MigrationSuccessComponent
  }
];

export const MigrationRouter = RouterModule.forChild(MEM_MIGRATION_ROUTER);
