import { Component, OnDestroy, OnInit } from '@angular/core';

import { AlertType } from '../../../shared/alerts/alertType.model';
import { Router } from '@angular/router';
import { AlertService } from '../../../shared/shared.module';

@Component({
    selector: 'app-myprefdeliveryfinancial',
    templateUrl: './delivery-financial.component.html',
    styleUrls: ['./delivery-financial.component.scss']
  })

  export class MyPrefDeliveryFinancialComponent implements OnDestroy {
    constructor(
      private router: Router,
      private alertService: AlertService,
    ) {
    }

    ngOnDestroy() {
      this.alertService.clearError();
    }

    OnSubmit() {
      window.scrollTo(0, 0);
      this.alertService.setAlert('Success! Your preferences are saved!',
      '',
      AlertType.Success);
    }

    OnCancel() {
      this.alertService.clearError();
      window.scrollTo(0, 0);
      this.router.navigate(['/mypreferences']);
    }
}
