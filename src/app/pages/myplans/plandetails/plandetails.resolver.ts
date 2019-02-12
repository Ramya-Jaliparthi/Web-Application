
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MyplansService } from '../../../pages/myplans/myplans.service';
import { GetPlanBenefitServicesResponseModelInterface } from '../models/interfaces/plans-benefits-service-model.interface';

@Injectable()
export class MyPlansDetailsResolverService implements Resolve<Observable<GetPlanBenefitServicesResponseModelInterface | {}>> {
    constructor(public plansService: MyplansService) { }

    resolve() {
        return this.plansService.getPlanBenefitServices(false)
            .catch(() => {
                return Observable.empty();
            });
    }
}
