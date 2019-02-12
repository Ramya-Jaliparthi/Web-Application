import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { MakePaymentService } from './make-payment.service';


@Injectable()
export class MakePaymentResolver implements Resolve<Promise<any>> {
    constructor(private paymentService: MakePaymentService) { }

    resolve() {
        return this.paymentService.getMakePaymentDetails(null);
    }
}
