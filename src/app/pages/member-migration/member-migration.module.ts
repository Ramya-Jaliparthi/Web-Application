import { NgModule } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import { CommonModule } from '@angular/common';
import {MatRadioModule  } from '@angular/material/radio';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MigrationRouter} from './member-migration.routing';
import { ProfileInfoComponent } from './profile-info/profile-info.component';
import { SharedModule } from '../../shared/shared.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdatePasswordComponent } from './profile-info-update/update-password/update-password.component';
import { VerifyEmailMobileComponent } from './profile-info-update/verify-email-mobile/verify-email-mobile.component';
import { MigrationSuccessComponent } from './profile-info-update/migration-success/migration-success.component';
import { TextMaskModule } from 'angular2-text-mask';
import { MigrationService } from './migration.service';

@NgModule({
  imports: [
    MatSelectModule,
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MigrationRouter,
    TextMaskModule
  ],
  declarations: [ProfileInfoComponent, UpdatePasswordComponent, VerifyEmailMobileComponent, MigrationSuccessComponent],
  providers: [MigrationService],
})
export class MemberMigrationModule { }
