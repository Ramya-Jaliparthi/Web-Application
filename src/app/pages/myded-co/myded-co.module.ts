import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { TextMaskModule } from 'angular2-text-mask';
import { MyDedCoComponent } from './landing/myded-co.component';
import { MyDedCoG1, MyDedCoG2, MyDedCoGuard } from './myded-co.guard';
import { MyDedCoRouter } from './myded-co.routing';
import {
  MatExpansionModule,
  MatListModule, MatRadioModule, MatButtonModule, MatTooltipModule
} from '@angular/material';
import { GlossaryComponent } from './drupalpages/glossary/glossary.component';
import { InformationComponent } from './drupalpages/information/information.component';

@NgModule({
  declarations: [
    MyDedCoComponent,
    GlossaryComponent,
    InformationComponent
  ],
  exports: [
  ],
  providers: [
    MyDedCoG1,
    MyDedCoG2,
    MyDedCoGuard
  ],
  imports: [
    MyDedCoRouter,
    FormsModule,
    CommonModule,
    TextMaskModule,
    ReactiveFormsModule,
    SharedModule,
    MatListModule,
    MatRadioModule,
    MatButtonModule,
    MatExpansionModule,
    MatTooltipModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class MyDedCoModule { }
