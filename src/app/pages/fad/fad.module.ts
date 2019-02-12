import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../../shared/utils/auth.guard';
import { AuthHttp } from '../../shared/services/authHttp.service';
import { SharedModule, AuthService, ConstantsService } from '../../shared/shared.module';
import { authHttpFactory } from '../../shared/utils/authHttp.factory';
import { FadLandingPageComponent } from './fad-landing-page/fad-landing-page.component';
import { FadService } from './fad.service';
import { FadRouter } from './fad.routing';
import { FadLandingPageService } from './fad-landing-page/fad-landing-page.service';
import { FadMedicalIndexComponent } from './fad-medical-index/fad-medical-index.component';
import { FadMedicalIndexService } from './fad-medical-index/fad-medical-index.service';
import { HttpClient } from '@angular/common/http';
import { FadSearchResultsComponent } from './fad-search-results/fad-search-results.component';
import { FadNoDocsPageComponent } from './fad-no-docs-page/fad-no-docs-page.component';
import { FadSearchResultsService } from './fad-search-results/fad-search-results.service';
import { FadNoDocsPageService } from './fad-no-docs-page/fad-no-docs-page.service';
import { FadSearchFilterComponent } from './fad-search-filter/fad-search-filter.component';
import { FadSearchFilterService } from './fad-search-filter/fad-search-filter.service';
import { FadSearchListComponent } from './fad-search-list/fad-search-list.component';
import { FadSearchListService } from './fad-search-list/fad-search-list.service';
import { FadDoctorProfileComponent } from './fad-doctor-profile/fad-doctor-profile.component';
import { FadDoctorProfileService } from './fad-doctor-profile/fad-doctor-profile.service';
import { FadFacilityProfileComponent } from './fad-facility-profile/fad-facility-profile.component';
import { FadFacilityProfileService } from './fad-facility-profile/fad-facility-profile.service';
import { FadProfileCardComponent } from './fad-profile-card/fad-profile-card.component';
import { FadPastSearchQueryListComponent } from './fad-past-search-query-list/fad-past-search-query-list.component';
import { FadPastSearchQueryListService } from './fad-past-search-query-list/fad-past-search-query-list.service';
import { FadCompareTableComponent } from './fad-compare-table/fad-compare-table.component';
import { FadCompareTableService } from './fad-compare-table/fad-compare-table.service';
import { FadFacilityCompareComponent } from './fad-facility-compare/fad-facility-compare.component';
import { FadFacilityCompareService } from './fad-facility-compare/fad-facility-compare.service';
import { FadCostBreakdownComponent } from './fad-cost-breakdown/fad-cost-breakdown.component';
import { FadDoctorRatingComponent } from './fad-doctor-rating/fad-doctor-rating.component';
import { FadCostBreakdownService } from '../fad/fad-cost-breakdown/fad-cost-breakdown.service';
import { FadSearchResultsResolver } from './fad-search-results/fad-search-results.resolver';
import { FadFacilityListComponent } from './fad-facility-list/fad-facility-list.component';
import { FadFacilityCardComponent } from './fad-facility-card/fad-facility-card.component';
import { FadFacilityListService } from './fad-facility-list/fad-facility-list.service';
import { FadDoctorProfileResolver } from './fad-doctor-profile/fad-doctor-profile.resolver';
import { FadFacilityProfileResolver } from './fad-facility-profile/fad-facility-profile.resolver';
import { FadFacilitySearchFilterComponent } from './fad-facility-search-filter/fad-facility-search-filter.component';



@NgModule({
  imports: [
    CommonModule,
    FadRouter,
    SharedModule,
    InfiniteScrollModule
  ],
  exports: [],
  declarations: [
    FadLandingPageComponent,
    FadMedicalIndexComponent,
    FadSearchResultsComponent,
    FadNoDocsPageComponent,
    FadSearchFilterComponent,
    FadSearchListComponent,
    FadDoctorProfileComponent,
    FadFacilityProfileComponent,
    FadProfileCardComponent,
    FadPastSearchQueryListComponent,
    FadCompareTableComponent,
    FadFacilityCompareComponent,
    FadCostBreakdownComponent,
    FadDoctorRatingComponent,
    FadFacilityListComponent,
    FadFacilityCardComponent,
    FadFacilitySearchFilterComponent
  ],
  entryComponents: [
    FadProfileCardComponent,
    FadFacilityCardComponent
  ],
  providers: [
    FadService,
    FadLandingPageService,
    FadMedicalIndexService,
    FadSearchResultsService,
    FadNoDocsPageService,
    FadSearchFilterService,
    FadSearchListService,
    FadDoctorProfileService,
    FadFacilityProfileService,
    FadPastSearchQueryListService,
    FadCompareTableService,
    FadFacilityCompareService,
    FadCostBreakdownService,
    FadSearchResultsResolver,
    FadDoctorProfileResolver,
    FadFacilityProfileResolver,
    FadFacilityListService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class FadModule { }
