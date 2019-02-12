import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { SchedulePaymentService } from './schedule-payment.service';


@Injectable()
export class SchedulePaymentResolver implements Resolve<Promise<any>> {
    constructor(private paymentService: SchedulePaymentService) { }

    resolve() {
        return this.paymentService.getSchedulePaymentDetails(null);
    }
}
