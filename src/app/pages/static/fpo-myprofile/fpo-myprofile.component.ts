import {Component, OnDestroy, OnInit} from '@angular/core';
import {GlobalService} from '../../../shared/services/global.service';
import {StaticInfo} from '../../../shared/models/staticInfo.model';
import {AlertService} from '../../../shared/services/alert.service';
import { ConstantsService } from '../../../shared/shared.module';

@Component({
  templateUrl: './fpo-myprofile.component.html',
  styleUrls: ['./fpo-myprofile.component.scss']
})

export class FpoMyprofileComponent implements OnInit, OnDestroy {

  fpoTargetUrl: string;

  constructor(private globalService: GlobalService,
              private alertService: AlertService,
            private constants: ConstantsService) {

  }

  ngOnInit() {
    this.fpoTargetUrl = this.constants.drupalRELUrl;
  }

  ngOnDestroy() {
    this.alertService.clearError();
  }

}
