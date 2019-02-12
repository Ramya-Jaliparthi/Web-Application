import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertType } from '../../../../shared/alerts/alertType.model';
import { AlertService } from '../../../../shared/services/alert.service';
import { Router, RoutesRecognized } from '@angular/router';
import { MyDoctorsPcpService } from '../../mydoctors-pcp.service';
@Component({
  selector: 'app-pcp-error',
  templateUrl: './pcp-error.component.html',
  styleUrls: ['./pcp-error.component.scss']
})
export class PcpErrorComponent implements OnInit, OnDestroy {
  previousUrl: string="/mydoctors/add-pcp";
  constructor(private router: Router, private alertService: AlertService, private pcpService: MyDoctorsPcpService) {
    this.alertService.clearError();
    if(!this.alertService.errors['pcpmessage']){
      this.router.navigate(['/mydoctors']);
    }
    this.showPcpResult();
  }

  ngOnInit() {
    this.previousUrl=this.pcpService.previousPCPUrl;
    this.router.events
    .filter(e => e instanceof RoutesRecognized)
    .pairwise()
    .subscribe((event: any[]) => {
      this.previousUrl=event[0].urlAfterRedirects;
    });
  }

  ngOnDestroy() {
    this.alertService.clearError();
  }

  public showPcpResult(): void {
    this.alertService.clearError();
    if(this.alertService.errors['pcperrorcode'] && this.alertService.errors['pcperrorcode']===-91860){
      this.alertService.setAlert(this.alertService.errors['pcpmessage'],'', AlertType.Success);  
    }else{
      this.alertService.setAlert(this.alertService.errors['pcpmessage'],'', AlertType.Failure);
    }
  }
}
