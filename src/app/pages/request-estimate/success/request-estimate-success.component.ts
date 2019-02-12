import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertService } from '../../../shared/services/alert.service';
import { AlertType } from '../../../shared/alerts/alertType.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-estimate-success',
  templateUrl: './request-estimate-success.component.html',
  styleUrls: ['./request-estimate-success.component.scss']
})
export class RequestEstimateSuccessComponent implements OnInit, OnDestroy {
  constructor(public alertService: AlertService, public router: Router, ) {
    this.alertService.setAlert('Success!', '', AlertType.Success, 'component');
  }
  ngOnInit() {
  }
  ngOnDestroy() {
    this.alertService.clearError();
  }
  openSsoUrl(url) {
    if (url) {
      window.open(url, '_blank');
    }
  }
}
