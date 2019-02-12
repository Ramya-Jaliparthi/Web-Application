import {Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy} from '@angular/core';
import {SsoService} from '../sso.service';
import {ActivatedRoute} from '@angular/router';
import {AuthHttp} from '../../../shared/services/authHttp.service';
import {Location} from '@angular/common';
import {AlertService} from '../../../shared/shared.module';
import {AlertType} from '../../../shared/alerts/alertType.model';

@Component({
  templateUrl: './sso.component.html',
  styleUrls: ['./sso.component.scss']
})
export class SsoComponent implements OnInit, AfterViewInit, OnDestroy {
  ssoDetails: any;
  @ViewChild('sso') ssoform: ElementRef;

  constructor(public ssoService: SsoService,
              private activatedRoute: ActivatedRoute,
              private location: Location,
              private authHttpService: AuthHttp,
              private alertService: AlertService) {

  }

  ngOnInit() {
    this.authHttpService.showSpinnerLoading();
    this.ssoDetails = this.activatedRoute.snapshot.data.sso ?
      this.activatedRoute.snapshot.data.sso : null;
  }

  ngOnDestroy() {
    this.authHttpService.hideSpinnerLoading();
  }

  ngAfterViewInit() {

    if (this.ssoDetails) {

      this.ssoform.nativeElement.submit();
      // this.location.back();

    }

  }
}

