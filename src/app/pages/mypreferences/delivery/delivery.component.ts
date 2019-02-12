import { Component, OnDestroy, OnInit } from '@angular/core';

import { AlertType } from '../../../shared/alerts/alertType.model';
import { Router } from '@angular/router';
import { AlertService } from '../../../shared/shared.module';

@Component({
    selector: 'app-myprefdelivery',
    templateUrl: './delivery.component.html',
    styleUrls: ['./delivery.component.scss']
  })

  export class MyPrefDeliveryComponent implements OnDestroy {
    constructor(
      private router: Router,
      private alertService: AlertService,
    ) {
    }

    ngOnDestroy() {
      this.alertService.clearError();
    }

}
