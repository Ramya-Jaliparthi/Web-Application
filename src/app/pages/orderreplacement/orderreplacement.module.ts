import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatCheckboxModule, MatListModule, MatButtonModule
} from '@angular/material';
import { OrderreplacementComponent } from './orderreplacement.component';
import { OrderreplacementRouter } from './orderreplacement.routing';
import { ConstantsService } from '../../shared/services/constants.service';
import { MaintenanceComponent } from './maintenance/maintenance.component';

@NgModule({
  declarations: [
    OrderreplacementComponent,
    MaintenanceComponent
  ],
  imports: [
    CommonModule,
    OrderreplacementRouter,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatListModule,
    MatButtonModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})

export class OrderreplacementModule {
}
