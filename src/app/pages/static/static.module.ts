import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {StaticComponent} from './static.component';
import {ConfidentialityComponent} from './confidentiality/confidentiality.component';
import {LearnMoreComponent} from './learn-more/learn-more.component';
import {TermsComponent} from './terms/terms.component';
import {StaticComponentRouter} from './static.routing';
import {MaintenanceComponent} from './maintenance/maintenance.component';
import {CommonModule} from '@angular/common';
import { FpoMyprofileComponent } from './fpo-myprofile/fpo-myprofile.component';
import { Campaign1Component } from './campaign-1/campaign-1.component';
import {AlegeustermsComponent} from './alegeusterms/alegeusterms.component';
import { Campaign2Component } from './campaign-2/campaign-2.component';
import { Campaign3Component } from './campaign-3/campaign-3.component';
import { Campaign4Component } from './campaign-4/campaign-4.component';
import { Campaign5Component } from './campaign-5/campaign-5.component';
import { Campaign6Component } from './campaign-6/campaign-6.component';

@NgModule({
  declarations: [
    StaticComponent,
    ConfidentialityComponent,
    LearnMoreComponent,
    TermsComponent,
    AlegeustermsComponent,
    MaintenanceComponent,
    FpoMyprofileComponent,
    Campaign1Component,
    Campaign2Component,
    Campaign3Component,
    Campaign4Component,
    Campaign5Component,
    Campaign6Component
  ],
  imports: [
    StaticComponentRouter,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ]
})

export class StaticModule {
}
