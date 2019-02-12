import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { ProfileHomeRouter } from './profileHome.routing';
import { RaceLanguageEthinicityComponent } from './race-language-ethinicity/race-language-ethinicity.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { HttpClientModule } from '@angular/common/http';
import { MatGridListModule } from '@angular/material/grid-list';
import { SharedModule } from '../../shared/shared.module';
import {
  MatRadioModule,
  MatCardModule,
  MatIconModule,
  MatSelectModule,
  MatSidenavModule,
  MatTooltipModule,
  MatDialogModule
} from '@angular/material';
import { StorageServiceModule } from 'angular-webstorage-service';
import { ProfileService } from '../../shared/services/myprofile/profile.service';
import { MyprofileResolverService } from '../../shared/routeresolvers/myprofile-resolver.service';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { VerifyEmailMobileComponent } from './verify-email-mobile/verify-email-mobile.component';

@NgModule({
  imports: [
    CommonModule,
    ProfileHomeRouter,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TextMaskModule,
    MatRadioModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatSidenavModule,
    MatTooltipModule,
    MatGridListModule,
    MatDialogModule,
    StorageServiceModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TextMaskModule,
    MatRadioModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatSidenavModule,
    MatRadioModule,
    StorageServiceModule
  ],
  providers: [
    ProfileService,
    MyprofileResolverService
  ],
  declarations: [
    ProfileComponent,
    RaceLanguageEthinicityComponent,
    UpdatePasswordComponent,
    VerifyEmailMobileComponent
  ],
})
export class ProfileHomeModule { }
