import {Routes, RouterModule} from '@angular/router';
import {MyplansComponent} from './myplans.component';
import {BenefitsComponent} from './benefits/benefits.component';
import {PlandetailsComponent} from './plandetails/plandetails.component';
import {BenefitDetailsComponent} from './benefitdetails/benefit-details.component';
import {MyPlansDetailsResolverService} from './plandetails/plandetails.resolver';
import {MyBenefitsResolverService} from './benefits/benefits.resolver';
import {MyBenefitDetailsResolverService} from './benefitdetails/benefit-details.resolver';
import {ScopeGuard} from '../../shared/utils/scope.guard';

const MYPLANS_ROUTER: Routes = [
  {
    path: '',
    component: MyplansComponent
  },
  {
    path: 'plandetails',
    canActivate: [ScopeGuard],
    component: PlandetailsComponent,
    resolve: {
      planDetails: MyPlansDetailsResolverService
    },
    data: {
      breadcrumb: 'Plan Details'
    }
  },
  {
    path: 'benefits',
    component: BenefitsComponent,
    resolve: {
      benefits: MyBenefitsResolverService
    },
    data: {
      breadcrumb: 'Plan Benefits'
    }
  },
  {
    path: 'benefitdetails',
    component: BenefitDetailsComponent,
    resolve: {
      benefitDetails: MyBenefitDetailsResolverService
    },
    data: {
      breadcrumb: 'Benefit Details'
    }
  }
];

export const MyplansRouter = RouterModule.forChild(MYPLANS_ROUTER);
