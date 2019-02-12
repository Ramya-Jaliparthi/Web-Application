import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';
import { GlobalService } from '../services/global.service';
import { PlanBenefitsListResponseModelInterface } from '../../pages/myplans/models/interfaces/plan-benefits-list-model.interface';
import { MyplansService } from '../../pages/myplans/myplans.service';
import * as moment from 'moment';
@Injectable()
export class MyPlansResolverService implements Resolve<Observable<PlanBenefitsListResponseModelInterface | {}>> {

  plan: PlanBenefitsListResponseModelInterface;
  constructor(public authService: AuthService,
    public globalService: GlobalService,
    public plansService: MyplansService) { }

  resolve() {
    return this.plansService.getPlansData(moment().format('YYYY-MM-DD'))
    .catch(() => {
      return Observable.empty();
    });
  }
}
