import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../../../shared/shared.module';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
    selector: 'app-myprefnotifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss']
  })
  export class MyPrefNotificationsComponent implements OnInit, OnDestroy {
     receInfo: boolean;
    // required
     myPrefMandate: boolean;
     myPrefAccActivity: boolean;
     myPrefSmartShopper: boolean;

    // optional
     myPrefFinance: boolean;
     myPrefHealthPromo: boolean;
     myPrefMyInbox: boolean;
     isAllOptionalPrefUnChecked: boolean;

    constructor(
      private authService: AuthService,
      private alertService: AlertService,
      private router: Router
    ) {
    }

    ngOnDestroy() {
      this.alertService.clearError();
    }

    showDesc(flag) {
      // if (!flag) {
        return 'hidden';
     // }
    }

    reCalculateOptions() {
      this.isAllOptionalPrefUnChecked =  this.myPrefFinance || this.myPrefHealthPromo || this.myPrefMyInbox;
      // this.isAllOptionalPrefUnChecked =  this.myPrefHealthPromo || this.myPrefMyInbox;
    }

    ngOnInit() {
      this.alertService.clearError();
      this.receInfo = true;
      this.myPrefMandate = true;
      this.myPrefAccActivity = true;
      this.myPrefSmartShopper = true;
      const scopename = this.authService.authToken ? this.authService.authToken.scopename : '';
      // if(scopename === '')
      this.myPrefFinance = true;
      this.myPrefHealthPromo = false;
      this.myPrefMyInbox = true;
      this.isAllOptionalPrefUnChecked =  this.myPrefFinance || this.myPrefHealthPromo || this.myPrefMyInbox;
      // TODO - API integration for getting chckBox values
    }
}
