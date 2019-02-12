import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertType } from '../../../../shared/alerts/alertType.model';
import { AlertService } from '../../../../shared/services/alert.service';
import { Router, NavigationStart, NavigationEnd, Event as NavigationEvent } from '@angular/router';
import { MyDoctorsPcpService } from '../../mydoctors-pcp.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pcp-result',
  templateUrl: './pcp-result.component.html',
  styleUrls: ['./pcp-result.component.scss']
})
export class PcpResultComponent implements OnInit, OnDestroy {
  hasDependents: boolean;
  confirmationNumber: string;
  isRTMSError: boolean=false;
  previousUrl:string;
  constructor( private router: Router, private alertService: AlertService, private activatedRoute: ActivatedRoute,
    private myDoctorsPcpService: MyDoctorsPcpService) {
    this.alertService.clearError();
    if(!this.alertService.errors['pcpmessage']){
      this.router.navigate(['/mydoctors']);
    }
    this.showPcpResult();
    this.isRTMSError=false;
    this.hasDependents = this.myDoctorsPcpService && this.myDoctorsPcpService.memberInfo
                  && this.myDoctorsPcpService.memberInfo.hasDependents ? true : false;
    // this.activatedRoute.url.subscribe(url => {
    //   console.log(url);
    // });
    // router.events.forEach((event: NavigationEvent) => {
    //   if (event instanceof NavigationStart) {
    //     switch (event.url) {
    //     case '/mydoctors/add-pcp':
    //       {
    //         console.log(event.url);
    //           break;
    //       }
    //     case '/mydoctors/add-pcp':
    //       {
    //         console.log(event.url);
    //           break;
    //       }
    //     }
    //   }
    // });
  }

  ngOnInit() {
    this.previousUrl=this.myDoctorsPcpService.previousPCPUrl;
  }

  ngOnDestroy() {
    this.alertService.clearError();
  }

  public showPcpResult(): void {
    this.alertService.clearError();
    if(this.alertService.errors['pcperrorcode']){
      this.isRTMSError=true;
      this.alertService.setAlert(this.alertService.errors['pcpmessage'],'',AlertType.Success);
    }else{
    this.alertService.setAlert('Your PCP has been changed!','',AlertType.Success);
        if(this.alertService.errors['pcpmessage']){
          this.confirmationNumber=this.alertService.errors['pcpmessage'];
        }
    }
  }
}
