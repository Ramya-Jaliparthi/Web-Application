import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { OrderreplacementService } from '../services/orderreplacement/orderreplacement.service';
import {AuthService} from '../shared.module';

@Injectable()
export class OrderreplacementResolverService implements Resolve<Observable<any[]>>  {
    constructor(
        private authService: AuthService,
        private orderreplacementService: OrderreplacementService,
    ) { }

    resolve() {
      if (this.authService.getRtmsMode()) {
        return this.orderreplacementService.getCardPage();
      }
    }


}
