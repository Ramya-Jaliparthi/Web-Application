import { Routes, RouterModule } from '@angular/router';
import { FadLandingPageComponent } from './fad-landing-page/fad-landing-page.component';
// import { AuthGuard } from '../../shared/utils/auth.guard';
import { FadMedicalIndexComponent } from './fad-medical-index/fad-medical-index.component';
import { FadSearchResultsComponent } from './fad-search-results/fad-search-results.component';
import { FadDoctorProfileComponent } from './fad-doctor-profile/fad-doctor-profile.component';
import { FadFacilityProfileComponent } from './fad-facility-profile/fad-facility-profile.component';
import { FadPastSearchQueryListComponent } from './fad-past-search-query-list/fad-past-search-query-list.component';
import { FadCompareTableComponent } from './fad-compare-table/fad-compare-table.component';
import { FadFacilityCompareComponent } from './fad-facility-compare/fad-facility-compare.component';
import { FadCostBreakdownComponent } from './fad-cost-breakdown/fad-cost-breakdown.component';
import { FadDoctorRatingComponent } from './fad-doctor-rating/fad-doctor-rating.component';
import { FadSearchResultsResolver } from './fad-search-results/fad-search-results.resolver';
import { FadDoctorProfileResolver } from './fad-doctor-profile/fad-doctor-profile.resolver';
import { FadFacilityProfileResolver } from './fad-facility-profile/fad-facility-profile.resolver';

const FAD_ROUTES: Routes = [
  {
    path: '',
    component: FadLandingPageComponent
  },
  {
    path: 'search-results',
    component: FadSearchResultsComponent,
    runGuardsAndResolvers: 'always',
    // canActivate: [AuthGuard]
    resolve: {
      fadLandingPageSearchResults: FadSearchResultsResolver
    },
  },
  {
    path: 'doctor-profile',
    component: FadDoctorProfileComponent,
    // canActivate: [AuthGuard]
    data: {
      pageTitle: 'Doctor Profile',
      breadcrumb: 'Doctor Profile'
    },
    resolve: {
      fadProfessionalResposeData: FadDoctorProfileResolver
    },
  },
  {
    path: 'facility-profile',
    component: FadFacilityProfileComponent,
    // canActivate: [AuthGuard]
    resolve: {
      fadFacilityResposeData: FadFacilityProfileResolver
    },
  },
  {
    path: 'rate-doctor',
    component: FadDoctorRatingComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'medical-index/:type',
    component: FadMedicalIndexComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'past-search-queries',
    component: FadPastSearchQueryListComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'compare-table',
    component: FadCompareTableComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'facility-compare',
    component: FadFacilityCompareComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'cost-breakdown',
    component: FadCostBreakdownComponent,
    // canActivate: [AuthGuard]
  }
];



export const FadRouter = RouterModule.forChild(FAD_ROUTES);


/**
 * import { Routes, RouterModule } from '@angular/router';
import { FadLandingPageComponent } from './fad-landing-page/fad-landing-page.component';
// import { AuthGuard } from '../../shared/utils/auth.guard';
import { FadMedicalIndexComponent } from './fad-medical-index/fad-medical-index.component';
import { FadSearchResultsComponent } from './fad-search-results/fad-search-results.component';
import { FadDoctorProfileComponent } from './fad-doctor-profile/fad-doctor-profile.component';
import { FadFacilityProfileComponent } from './fad-facility-profile/fad-facility-profile.component';
import { FadPastSearchQueryListComponent } from './fad-past-search-query-list/fad-past-search-query-list.component';
import { FadCompareTableComponent } from './fad-compare-table/fad-compare-table.component';
import { FadFacilityCompareComponent } from './fad-facility-compare/fad-facility-compare.component';
import { FadCostBreakdownComponent } from './fad-cost-breakdown/fad-cost-breakdown.component';
import { FadDoctorRatingComponent } from './fad-doctor-rating/fad-doctor-rating.component';
import { FadSearchResultsResolver } from './fad-search-results/fad-search-results.resolver';
import { UnauthenticatedLayoutComponent } from '../../shared/layouts/UnauthenticatedLayoutComponent/UnauthenticatedLayout.component';

const FAD_ROUTES: Routes = [{

  path: '',
  component: UnauthenticatedLayoutComponent,
  children: [
    {
      path: '',
      component: FadLandingPageComponent
    },
    {
      path: 'search-results',
      component: FadSearchResultsComponent,
      // canActivate: [AuthGuard]
      resolve: {
        fadLandingPageSearchResults: FadSearchResultsResolver
      },
    },
    {
      path: 'doctor-profile',
      component: FadDoctorProfileComponent,
      // canActivate: [AuthGuard]
    },
    {
      path: 'facility-profile',
      component: FadFacilityProfileComponent,
      // canActivate: [AuthGuard]
    },
    {
      path: 'rate-doctor',
      component: FadDoctorRatingComponent,
      // canActivate: [AuthGuard]
    },
    {
      path: 'medical-index/:type',
      component: FadMedicalIndexComponent,
      // canActivate: [AuthGuard]
    },
    {
      path: 'past-search-queries',
      component: FadPastSearchQueryListComponent,
      // canActivate: [AuthGuard]
    },
    {
      path: 'compare-table',
      component: FadCompareTableComponent,
      // canActivate: [AuthGuard]
    },
    {
      path: 'facility-compare',
      component: FadFacilityCompareComponent,
      // canActivate: [AuthGuard]
    },
    {
      path: 'cost-breakdown',
      component: FadCostBreakdownComponent,
      // canActivate: [AuthGuard]
    }
  ]
}
];



export const FadRouter = RouterModule.forChild(FAD_ROUTES);

 */