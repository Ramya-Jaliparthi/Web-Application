import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { MyDedCoService } from './myded-co.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { GetFamilyDeductiblesResponseInterface } from './models/interfaces/getFamilyDeductibles-model.interface';


@Injectable()
export class MyDedCoResolver implements Resolve<Promise<GetFamilyDeductiblesResponseInterface[]>> {
  constructor(private dedcoService: MyDedCoService) { }

  async resolve() {

    return await forkJoin([
      this.dedcoService.getDeductiblesAndCoinsuranceInfo()
    ]).toPromise();
  }
}
