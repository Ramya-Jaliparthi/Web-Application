import {Component, OnDestroy, OnInit} from '@angular/core';
import {GlobalService} from '../../../shared/services/global.service';
import {StaticInfo} from '../../../shared/models/staticInfo.model';
import {AlertService} from '../../../shared/services/alert.service';
import { ConstantsService } from '../../../shared/shared.module';
import { AuthHttp } from '../../../shared/services/authHttp.service';
import { environment } from '../../../../environments/environment';
import {Image} from '../../../shared/models/image.model';

@Component({
  templateUrl: './campaign-3.component.html',
  styleUrls: ['./campaign-3.component.scss']
})

export class Campaign3Component implements OnInit, OnDestroy {

  fpoTargetUrl: string;
  public fpocontentData1: Image;
  public fpocontentData2: Image;
  public environment: object;
  constructor(private globalService: GlobalService,
              private alertService: AlertService,
            private constants: ConstantsService,
            private authHttp: AuthHttp) {
              this.environment = environment;
              this.fpoTargetUrl = this.constants.drupalContentCampaignUrl3;
  }
  ngOnInit() {
    this.authHttp.get(this.fpoTargetUrl).subscribe((response) => {
      this.fpocontentData1 = response[0];
      this.fpocontentData2 = response[1];
      console.log(this.fpocontentData1, this.fpocontentData2);
    });

  }

  ngOnDestroy() {
    this.alertService.clearError();
  }

}
