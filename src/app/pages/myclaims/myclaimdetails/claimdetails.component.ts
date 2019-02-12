import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { ClaimsService } from '../claims.service';
import { ClaimDetailsResponseModel, ClaimDetail, ClaimAddressModel, ClaimDetailsRequestModel } from '../models/claim-details.model';
import {
  ClaimDetailsResponseModelInterface, ClaimDetailInterface,
  ClaimAddressModelInterface, ClaimTotalInterface, ClaimDetailsRequestModelInterface

} from '../models/interfaces/claim-details-model.interface';
import { AlertType } from '../../../shared/alerts/alertType.model';
import { AlertService } from '../../../shared/services/alert.service';
import { DatePipe } from '@angular/common';
import {
  ClaimBenefitsLinkRequestModelInterface,
  ClaimBenefitsLinkResponseModelInterface
} from '../models/interfaces/claim-benefits-link-model.interface';
import { ClaimBenefitsLinkRequestModel, ClaimBenefitsLinkResponseModel } from '../models/claim-benefits-link.model';
import { ConstantsService } from '../../../shared/shared.module';

@Component({
  templateUrl: './claimdetails.component.html',
  styleUrls: ['./claimdetails.component.scss']
})
export class ClaimdetailsComponent implements OnInit, OnDestroy {
  public EOBError: string = '';

  claimsDetails = null;
  expandedHeight: string;
  isMedexMember: boolean;
  isRateProvided: boolean;
  claimDetails: ClaimDetailInterface = new ClaimDetail();
  benefitsDocument: ClaimBenefitsLinkResponseModelInterface = new ClaimBenefitsLinkResponseModel;
  providerAddress;
  claimTotals;
  claimStatusLowerCaseDescription;
  allClaimServiceLines;
  // providerAddress: ClaimAddressModelInterface[] =  this.claimDetails;
  claimRecord;
  isExpanded = false;
  claimDetailProcessingReqParams;
  fpoTargetUrl = '';
  showFinancialLink: boolean = false;
  showHEQALGFinancialLink: boolean = false;
  ssoFinancialLink: string = '';
  ssoALGFinancialLink: string = '';
  ssoHEQFinancialLink: string = '';
  contactus = this.constants.contactus + this.authService.authToken.scopename;
  constructor(private claimService: ClaimsService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private datePipe: DatePipe,
    public constants: ConstantsService) {
    this.expandedHeight = '48px';
    this.fpoTargetUrl = this.constants.drupalClaimsrUrl;
    if (this.authService.useridin) {
      const user = this.authService.useridin;
      this.isMedexMember = false;
      this.isRateProvided = false;
    }
    this.handleFinanceLinksInSideBar();
  }

  private handleFinanceLinksInSideBar() {
    const hasALG = this.authService.authToken ? this.authService.authToken.isALG === 'true' : false;
    const hasHEQ = this.authService.authToken ? this.authService.authToken.isHEQ === 'true' : false;

    this.showHEQALGFinancialLink = false;
    this.showFinancialLink = false;
    if (hasALG) {
      if (hasHEQ) {
        // both are true - show 2 links
        this.showHEQALGFinancialLink = true;
        this.showFinancialLink = false;
      } else {
        this.showHEQALGFinancialLink = false;
        this.showFinancialLink = true;
      }
    } else {
      if (hasHEQ) {
        this.showHEQALGFinancialLink = false;
        this.showFinancialLink = true;
      } else {
        // both are false - show no links
        this.showHEQALGFinancialLink = false;
        this.showFinancialLink = false;
      }
    }

    // this.showFinancialLink = (hasALG || hasHEQ) ? true : false;
    this.ssoFinancialLink = hasHEQ ? '/sso/heathequity' : '/sso/alegeus';
  }

  openSSO(module?) {
    if (module === 'algOrHeq') {
      window.open(this.ssoFinancialLink, '_blank');
    } else if (module === 'alg') {
      window.open('/sso/alegeus', '_blank');
    } else if (module === 'heq') {
      window.open('/sso/heathequity', '_blank');
    } else if (module === 'connecture') {
      window.open('/sso/connecture', '_blank');
    }
  }

  ngOnInit() {
    this.getClaimDetails();
    this.claimService.claimRecord$.subscribe(message => {
      this.claimRecord = message;
      if (this.claimRecord !== null) {
        sessionStorage.setItem('claimRecord', JSON.stringify(this.claimRecord));
      }
    });

    if (this.claimRecord === null) {
      this.claimRecord = JSON.parse(sessionStorage.getItem('claimRecord'));
    }
  }

  ngOnDestroy() {
    this.alertService.clearError();
  }

  getClaimDetails() {

    const claimDetailsReqParams: ClaimDetailsRequestModelInterface = new ClaimDetailsRequestModel();
    claimDetailsReqParams.useridin = this.authService.useridin;
    claimDetailsReqParams.claimId = sessionStorage.getItem('claimId') ? sessionStorage.getItem('claimId') : '';


    this.claimService.getClaimDetails(claimDetailsReqParams)
      .subscribe(apiData => {
        if (apiData && Object.keys(apiData).length) {
          if (apiData.result && apiData.result !== 0) {
            this.claimDetails = null;
            this.alertService.setAlert('', apiData['displaymessage'], AlertType.Failure);
          } else {
            this.claimDetails = apiData; // this.allClaimDetails.claimDetails;
            sessionStorage.setItem('memberName', this.claimDetails.memberName);
            this.claimStatusLowerCaseDescription = this.claimDetails.claimStatus.toString().toLowerCase();
            this.providerAddress = this.claimDetails.providerAddress;
            this.claimTotals = this.claimDetails.claimTotals;
            this.allClaimServiceLines = this.claimDetails.claimServiceLines;
          }
        }
      });
  }

  getDirections() {
    // e.g.:- 60 LEONARD ST, BELMONT MA 02478
    const location = this.providerAddress.address1 + ', ' +
      this.providerAddress.city + this.providerAddress.state + this.providerAddress.zipcode;
    console.log('location', location);
    const geoLocation = 'http://maps.google.com/?q=' + encodeURI(location);
    // window.location.href = 'http://maps.google.com/?q=' + geoLocation;
    window.open(
      geoLocation,
      '_self'
    );
  }

  toggleExpansionPanel(isExpanded: boolean) {
    this.isExpanded = isExpanded;
  }

  navigateToDetails(claimId, claimDetails) {
    // this.claimService.setClaimDetails(claimDetails);
    this.router.navigate(['../', 'claimdetails', 'claimstatusdetails'], { relativeTo: this.route });
  }

  openUrl(url) {
    if (url) {
      window.open(url, '_self');
    }
  }

  openContactsUs() {
    window.open(this.contactus, '_self');
  }

  formattedDate(date: string): string {
    if (date) {
      return this.datePipe.transform(date, 'MM/dd/yyyy');
    }
  }

  loadBenefitsDocument() {

    const benefitsDocumentReqParams: ClaimBenefitsLinkRequestModelInterface = new ClaimBenefitsLinkRequestModel();
    benefitsDocumentReqParams.useridin = this.authService.useridin;
    benefitsDocumentReqParams.eobClaimId = this.claimDetails.eobClaimId;
    benefitsDocumentReqParams.eobContractId = this.claimDetails.eobContractId;
    benefitsDocumentReqParams.claimProcessDate = this.claimDetails.claimProcessDate;
    benefitsDocumentReqParams.recordKey = sessionStorage.getItem('claimKey');


    this.claimService.getClaimsBenefitsLink(benefitsDocumentReqParams)
      .subscribe(apiData => {
        if (apiData && Object.keys(apiData).length) {
          if (apiData.result && apiData.result !== 0) {
              this.alertService.setAlert('', apiData['displaymessage'], AlertType.Failure);
          } else {
            this.benefitsDocument = apiData;
            this.openUrl(this.benefitsDocument.eobLink);
          }

        }

      });

  }
}
