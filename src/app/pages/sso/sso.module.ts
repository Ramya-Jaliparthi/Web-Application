import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
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
import { SharedModule } from '../../shared/shared.module';
import { SsoComponent } from './sso/sso.component';
import { SsoRouter } from './sso.routing';
import { SsoService } from './sso.service';
import { SsoResolver } from './sso.resolver';
import { SsoGuard } from './sso.guard';

@NgModule({
  declarations: [
    SsoComponent
  ],
  imports: [
    CommonModule,
    SsoRouter,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatRadioModule,
    MatDatepickerModule,
    MatButtonModule,
    MatNativeDateModule
  ],
  providers: [
    SsoService,
    SsoResolver,
    SsoGuard
  ],
  schemas: [
  ]
})

export class SsoModule { }
