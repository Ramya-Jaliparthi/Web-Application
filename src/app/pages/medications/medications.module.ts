import { CommonModule, TitleCasePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatDatepickerModule,
  MatExpansionModule,
  MatListModule,
  MatNativeDateModule,
  MatRadioModule,
  MatSidenavModule
} from '@angular/material';
import { FilterPipe, FilterPipeModule } from 'ngx-filter-pipe';
import { OrderModule } from 'ngx-order-pipe';
import { SharedModule } from '../../shared/shared.module';
import { MedicationsRouter } from './medications.routing';
import { MyMedicationDetailsComponent } from './myMedicationDetails/myMedicationDetails.component';
import { MyMedicationsComponent } from './mymedications/mymedications.component';

@NgModule({
  declarations: [
    MyMedicationsComponent,
    MyMedicationDetailsComponent
  ],
  imports: [
    CommonModule,
    MedicationsRouter,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatRadioModule,
    MatDatepickerModule,
    MatButtonModule,
    MatNativeDateModule,
    FilterPipeModule,
    OrderModule
  ],
  providers: [
    FilterPipe,
    TitleCasePipe
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})

export class MyMedicationsModule { }
