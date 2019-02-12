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
import { MaterializeModule } from 'angular2-materialize';
import { SharedModule } from '../../shared/shared.module';
import { CardComponent } from './card/card.component';
import { MycardsComponent } from './mycards.component';
import { MycardsRouter } from './mycards.routing';
import { MyCardsGuard } from './mycards.guard';

@NgModule({
  declarations: [
    MycardsComponent,
    CardComponent
  ],
  imports: [
    CommonModule,
    MaterializeModule,
    MycardsRouter,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    MatSidenavModule,
    MatExpansionModule,
    MatRadioModule,
    MatDatepickerModule,
    MatButtonModule,
    MatNativeDateModule
  ],
  providers: [
    TitleCasePipe,
    MyCardsGuard
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})

export class MycardsModule { }
