import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import {
//   MatButtonModule, MatDatepickerModule, MatExpansionModule, MatInputModule,
//   MatListModule, MatNativeDateModule, MatRadioModule,
//   MatSelectModule, MatTooltipModule
// } from '@angular/material';
import { TextMaskModule } from 'angular2-text-mask';
import { FilterPipe, FilterPipeModule } from 'ngx-filter-pipe';
import { OrderModule } from 'ngx-order-pipe';
import { SharedModule } from '../../shared/shared.module';
import { MyDoctorsPcpGuard } from './mydoctors-pcp.guard';
import { MyDoctorsPcpRouter } from './mydoctors-pcp.routing';
import { MyDoctorsPcpService } from './mydoctors-pcp.service';
import { MyDoctorDetailsComponent } from './mydoctors/details/mydoctor-details.component';
import { MemberInfoResolver } from './mydoctors/landing/memberInfo.resolver';
import { MyDoctorsComponent } from './mydoctors/landing/mydoctors.component';
import { MyDoctorsResolver } from './mydoctors/landing/mydoctors.resolver';
import { AddPcpComponent } from './pcp/add-pcp/add-pcp.component';
import { PcpErrorComponent } from './pcp/pcp-error/pcp-error.component';
import { PcpResultComponent } from './pcp/pcp-result/pcp-result.component';
import { UpdatePcpComponent } from './pcp/update-pcp/update-pcp.component';
import { DependentsResolver } from './mydoctors/landing/dependents.resolver';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MaterialModule } from '../../material.module';
import { MaintenanceComponent } from './maintenance/maintenance.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    // MatListModule,
    // MatRadioModule,
    // MatDatepickerModule,
    // MatButtonModule,
    // MatNativeDateModule,
    // MatExpansionModule,
    // MatTooltipModule,
    // MatSelectModule,
    // MatInputModule,
    MaterialModule,
    TextMaskModule,
    OrderModule,
    FilterPipeModule,
    InfiniteScrollModule,
    MyDoctorsPcpRouter
  ],
  declarations: [
    MyDoctorsComponent, MyDoctorDetailsComponent, AddPcpComponent, UpdatePcpComponent, PcpResultComponent, PcpErrorComponent, MaintenanceComponent],
  providers: [
    DatePipe,
    FilterPipe,
    TitleCasePipe,
    MyDoctorsPcpService,
    MyDoctorsPcpGuard,
    MyDoctorsResolver,
    MemberInfoResolver,
    DependentsResolver
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class MyDoctorsPcpModule { }
