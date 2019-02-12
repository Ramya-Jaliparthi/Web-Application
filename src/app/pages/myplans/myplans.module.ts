import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MaterializeModule } from 'angular2-materialize';
import { MyplansService } from './myplans.service';
import { MyPlansDetailsResolverService } from './plandetails/plandetails.resolver';
import { MyBenefitDetailsResolverService } from './benefitdetails/benefit-details.resolver';
import { MyBenefitsResolverService } from './benefits/benefits.resolver';
import { MyplansComponent } from './myplans.component';
import { MyplansRouter } from './myplans.routing';
import {
  MatSidenavModule, MatDatepickerModule, MatExpansionModule, MatDialogModule, MatButtonModule,
  MatListModule, MatRadioModule, MatNativeDateModule, MatIconModule, MatDialog, MatCardModule,
  MatSelectModule, MatTooltipModule
} from '@angular/material';
import { DialogTermsComponent } from './dialogTerms/dialogTerms.component';
import { PlandetailsComponent } from './plandetails/plandetails.component';
import { BenefitsComponent } from './benefits/benefits.component';
import { BenefitDetailsComponent } from './benefitdetails/benefit-details.component';

@NgModule({
  declarations: [
    DialogTermsComponent,
    MyplansComponent,
    PlandetailsComponent,
    BenefitsComponent,
    BenefitDetailsComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatExpansionModule,
    MaterializeModule,
    MyplansRouter,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatListModule,
    MatRadioModule,
    MatDatepickerModule,
    MatButtonModule,
    MatNativeDateModule,
    MatCardModule,
    MatSelectModule,
    MatTooltipModule
  ],
  providers: [
    MyplansService,
    MyPlansDetailsResolverService,
    MyBenefitsResolverService,
    MyBenefitDetailsResolverService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  entryComponents: [
    DialogTermsComponent
  ]
})

export class MyplansModule { }
