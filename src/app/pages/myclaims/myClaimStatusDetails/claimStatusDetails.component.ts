import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ClaimsService} from '../claims.service';
import { AuthService } from '../../../shared/services/auth.service';
import { AlertType } from '../../../shared/alerts/alertType.model';
import { AlertService } from '../../../shared/services/alert.service';
import {ClaimProcessingStatusRequestModelInterface, ClaimProcessingStatusResponseModelInterface,
  ClaimStatusRecordInterface } from '../models/interfaces/claim-processing-data-model.interface';
import {ClaimProcessingStatusRequestModel, ClaimProcessingStatusResponseModel} from '../models/claim-processing-data.model';
import { DatePipe } from '@angular/common';

@Component({
    templateUrl: './claimStatusDetails.component.html',
    styleUrls: ['./claimStatusDetails.component.scss']
})
export class ClaimStatusDetailsComponent implements OnInit {
    claimProcessing: ClaimProcessingStatusResponseModelInterface = new ClaimProcessingStatusResponseModel;
    claimProcessingStatus: ClaimStatusRecordInterface = this.claimProcessing.statusRecord;
    claimProcessingSteps;
    claimDetailedRecord;
    claimProcessingStatusReqParams;
    constructor(private router: Router,
                private claimService: ClaimsService,
                private authService: AuthService,
                private alertService: AlertService,
                private route: ActivatedRoute,
                private datePipe: DatePipe) {
    }

    ngOnInit() {
      this.getClaimProcessingStatus();
    }

   public  getClaimProcessingStatus(): void {

    const claimProcessingStatusReqParams: ClaimProcessingStatusRequestModelInterface = new ClaimProcessingStatusRequestModel();
    claimProcessingStatusReqParams.useridin = this.authService.useridin;
    claimProcessingStatusReqParams.claimId = sessionStorage.getItem('claimId') ? sessionStorage.getItem('claimId') : '';


    this.claimService.getClaimProcessingStatus(claimProcessingStatusReqParams)
          .subscribe(apiData => {

            if (apiData && Object.keys(apiData).length) {
              if (apiData.result && apiData.result !== 0) {
                 this.alertService.setAlert('', apiData['displaymessage'], AlertType.Failure);
              } else {
                this.setClaimProcessingStatus(apiData);
              }
            }
     });


    }

    public setClaimProcessingStatus(apiData): void {

      this.claimProcessingStatus = apiData.statusRecord;
      this.claimProcessingStatus.memberName = sessionStorage.getItem('memberName');
      this.claimProcessingSteps = [
        {
          step: 1,
          label: 'Care',
          description: 'When you visit a doctor or hospital for medical care.',
          additionalDetails: `Date of Service: ${this.formattedDate(this.claimProcessingStatus.dateOfService)} `
        },
        {
          step: 2,
          label: 'Submit',
          description: 'When you or your doctor submits a claim to Blue Cross.',
          additionalDetails: `Claim Submitted to Blue Cross: ${this.formattedDate(this.claimProcessingStatus.recievedDate)} `
        },
        {
          step: 3,
          label: 'Process',
          description: 'Blue Cross processes your claim based on your health coverage.',
          additionalDetails: this.setClaimProcessingTagLine()
        },
        {
          step: 4,
          label: 'Notify',
          description: 'Blue Cross notifies you when you owe money for covered services.',
          additionalDetails: `Claim completed:  ${this.formattedDate(this.claimProcessingStatus.completedDate)}`
        }
      ];

    }

  public setClaimProcessingTagLine(): string {
    if (this.claimProcessingStatus.claimStatus) {
        if (this.claimProcessingStatus.claimStatus.toLowerCase() === 'completed'
            || this.claimProcessingStatus.claimStatus.toLowerCase() === 'denied') {
           return 'Claim completed';
        } else if (this.claimProcessingStatus.claimStatus.toLowerCase() === 'pending') {
          return 'Claim is pending.';
        }
        return '';
    }
  }


   public  navigateToDetailsPage(): void {
      this.router.navigate(['../myclaims/claimdetails']);
    }

    public formattedDate(date: string): string {
       if (date) {
        return this.datePipe.transform(date, 'MM/dd/yyyy');
      }
    }

}
