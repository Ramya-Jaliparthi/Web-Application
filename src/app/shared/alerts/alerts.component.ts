import { Component, Input } from '@angular/core';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent {
  @Input() scope: string;

  constructor(private alertService: AlertService) {
  }

  get alert() {
    return this.alertService.getAlert(this.scope);
  }
}
