import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { GlobalService } from '../../shared/services/global.service';
import { AlertService } from '../services/alert.service';
import { AuthHttp } from '../../shared/services/authHttp.service';
import {ConstantsService} from '../services/constants.service';

declare let $: any;

@Component({
  selector: 'app-modals',
  templateUrl: './appmodals.component.html',
  styleUrls: ['./appmodals.component.scss']
})

export class AppmodalsComponent implements OnInit {

  currentPage: string;

  constructor(private router: Router,
    private authService: AuthService,
    private globalService: GlobalService,
    private alertService: AlertService,
    private constants: ConstantsService,
    private authHttp: AuthHttp) {
    router.events.subscribe((data: any) => {
      if (data.url === '/claims') {
        this.currentPage = 'Claims';
      } else {
        this.currentPage = 'Home Page';
      }
    });
  }

  ngOnInit() {
    $('#tokenExpiryModal').modal({ dismissible: false });
    $('#requestTimeoutError').modal({ dismissible: true });
    $('#openOtherPartySite').modal({ dismissible: true });
    $('#internetconnection').modal({ dismissible: true });
    $('#globalError').modal({ dismissible: true });
  }

  reset() {
    this.alertService.clearError();
    this.authHttp.hideSpinnerLoading();
    this.authService.logout();
    this.closeTokenError();
    this.router.navigate(['./login']);
  }

  close() {
    $('#requestTimeoutError').modal('close');
  }

  closeModal() {
    $('#openOtherPartySite').modal('close');
  }

  openbluehome() {
    this.closeModal();
    window.open(this.constants.drupalHomeUrl, '_self');
  }

  openHome() {
    this.closeTokenError();
    window.open(this.constants.drupalHomeUrl, '_self');
  }

  closeTokenError() {
    $('#tokenExpiryModal').modal('close');
  }

  reloadPage() {
    window.location.reload();
  }
}
