import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaimsService } from './claims.service';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatSidenavModule, MatDatepickerModule, MatExpansionModule, MatListModule, MatRadioModule,
  MatNativeDateModule, MatButtonModule
} from '@angular/material';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { DatePipe } from '@angular/common';
import { OrderModule } from 'ngx-order-pipe';
import { FilterPipe } from 'ngx-filter-pipe';
import { TitleCasePipe } from '@angular/common';
import { ClaimsComponent } from './myclaims/claims.component';
import { ClaimdetailsComponent } from './myclaimdetails/claimdetails.component';
import { ClaimStatusDetailsComponent } from './myClaimStatusDetails/claimStatusDetails.component';
import { ClaimsRouter } from './claims.routing';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [
    ClaimsComponent,
    ClaimdetailsComponent,
    ClaimStatusDetailsComponent
  ],
  imports: [
    CommonModule,
    ClaimsRouter,
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
    OrderModule,
    InfiniteScrollModule
  ],
  providers: [
    ClaimsService,
    DatePipe,
    FilterPipe,
    TitleCasePipe
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})

export class ClaimsModule { }
