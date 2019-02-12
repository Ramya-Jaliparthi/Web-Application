
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MyplansService } from '../../../pages/myplans/myplans.service';
import { GetPlanBenefitServicesResponseModelInterface } from '../models/interfaces/plans-benefits-service-model.interface';

@Injectable()
export class MyBenefitDetailsResolverService implements Resolve<Observable<any | {}>> {
    constructor(public plansService: MyplansService) { }

    resolve() {
        return Observable.forkJoin(
            this.plansService.getPlanBenefitDetails().catch(res => Observable.of({
                ...res
            })),
            this.plansService.getLimitationText().catch(res => Observable.of({
                ...res
            }))
        );
    }
}
