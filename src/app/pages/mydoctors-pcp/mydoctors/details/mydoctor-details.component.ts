import {Component, OnDestroy, OnInit, HostListener} from '@angular/core';
import {MyDoctorsPcpService} from '../../mydoctors-pcp.service';
import {environment} from '../../../../../environments/environment';
import {
  GetVisitDetailsRequestModel
} from '../../models/get-visit-details.model';
import {
  GetVisitDetailsRequestModelInterface
} from '../../models/interfaces/get-visit-details-models.interface';
import {AuthService} from '../../../../shared/services/auth.service';
import {Router} from '@angular/router';
import {MemberPCPDataModel} from '../../models/my-doctor-module-common.model';
import {MemberPCPDataModelInterface} from '../../models/interfaces/my-doctor-module-common-models.interface';
import {AlertType} from '../../../../shared/alerts/alertType.model';
import {AlertService} from '../../../../shared/services/alert.service';
import {ConstantsService} from '../../../../shared/services/constants.service';

@Component({
  selector: 'app-mydoctor-details',
  templateUrl: './mydoctor-details.component.html',
  styleUrls: ['./mydoctor-details.component.scss']
})
export class MyDoctorDetailsComponent implements OnInit, OnDestroy {
  public ismobile: any;
  mobileViewPort = 992;
  toolTipVisible: boolean;
  tooltipState: any;
  visitDetails: any;
  claims = [];
  // claims = [
  //   { date: '01/04/2018', id: 1234566 },
  //   { date: '12/07/2017', id: 1234566 },
  //   { date: '11/05/2017', id: 1234566 },
  //   { date: '10/03/2017', id: 1234566 }
  // ];
  public doctor;
  public member: MemberPCPDataModelInterface;
  public active: boolean;
  public memberHasMultiplePlans: boolean = false;
  sideNavStatus: string;
  private electPCPLink: string="/mydoctors/add-pcp";
  fpoTargetUrl = environment.drupalTestUrl + '/page/mydoctors-listingscreen';

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth <= this.mobileViewPort) {
      this.ismobile = true;
    } else {
      this.ismobile = false;
      this.sideNavStatus = 'in';

    }
  }

  constructor(private doctorService: MyDoctorsPcpService,
              private alertService: AlertService,
              private authService: AuthService, 
              private router: Router,
              private constants: ConstantsService) {
    if (!sessionStorage.getItem('providerNumber')) {
      this.router.navigate(['/mydoctors']);
    }
    this.doctor = doctorService.selectedDoctor ? doctorService.selectedDoctor : {};
    this.member = doctorService.memberPCP ? doctorService.memberPCP : new MemberPCPDataModel();
    this.active = this.doctorService.active;
    console.log(this.doctor, this.member);
  }

  showToolTip() {
    this.toolTipVisible = !this.toolTipVisible;
  }

  ngOnInit() {
    // this.doctorService.getClaimsforProvider();
    this.getDoctorDetails();
  }

  ngOnDestroy() {
    this.alertService.clearError();
  }

  getDirections() {
    const geoLocation = 'http://maps.google.com/?q=' + encodeURI(this.doctor.addressStr);
    // window.location.href = 'http://maps.google.com/?q=' + geoLocation;
    window.open(
      geoLocation,
      '_self'
    );
  }

  getDoctorDetails() {

    const doctorDetailsReqParams: GetVisitDetailsRequestModelInterface = new GetVisitDetailsRequestModel();
    doctorDetailsReqParams.useridin = this.authService.useridin;
    doctorDetailsReqParams.providerName = sessionStorage.getItem('providerName');
    doctorDetailsReqParams.providerNumber = sessionStorage.getItem('providerNumber');
    if (sessionStorage.getItem('docDependentId')) {
      doctorDetailsReqParams['dependentId'] = sessionStorage.getItem('docDependentId');
    }

    this.doctorService.getDoctorDetails(doctorDetailsReqParams)
      .subscribe(apiData => {
        if (apiData && Object.keys(apiData).length) {
            if (doctorDetailsReqParams['dependentId']) {
              this.doctor = apiData['dependentVisitDetails'];
            } else {
              this.doctor = apiData['visitDetails'];
            }
            if(this.doctor){
              this.doctorService.selectedDoctor=this.doctor;
              this.doctor['mem_name'] = this.doctor.memberMiddleInitial ?
                [this.doctor.memberFirstName, ' ', this.doctor.memberMiddleInitial, ' ', this.doctor.memberLastName].join('') :
                [this.doctor.memberFirstName, ' ', this.doctor.memberLastName].join('');
              this.claims = this.doctor.docVisitHistory;

              let doesMemberHasPCP=false;
              if (this.doctor.pcpId && this.doctor.pcpId !== this.constants.myDoctorInvalidPCPId){
                doesMemberHasPCP= true;
              }
              let doesMemberNeedPCP = false;
              if(this.doctor.isRequiredPCP && this.doctor.isAllowedChangePCP){
                doesMemberNeedPCP=true;
              }
                const pcpId = this.doctor.pcpId?this.doctor.pcpId : '';
                this.member = <MemberPCPDataModelInterface>{
                  isRequiredPCP: doesMemberNeedPCP, // Member Plan`s PCP Requirement
                  hasPCP: doesMemberHasPCP,
                  pcpId: pcpId
                };
            } else {
              // Default To Do
              this.member = <MemberPCPDataModelInterface>{
                isRequiredPCP: false, // Member Plan`s PCP Requirement
                hasPCP: false, // Does member has a PCP
                pcpId: ''
              };
            }
            if(this.member.hasPCP){
              this.electPCPLink="/mydoctors/update-pcp"
            }else{
              this.electPCPLink="/mydoctors/add-pcp";
            }
          }
      });
  }

  navigateToClaimDetails(item) {
    sessionStorage.setItem('claimId', item.claimNumber);
    this.router.navigate(['/myclaims/claimdetails']);
  }

  setPCP(){
    sessionStorage.setItem('docPCPId', this.doctor.pcpId);
    this.router.navigate(['/mydoctors/add-pcp']);
  }

  changePCP(){
    sessionStorage.setItem('docPCPId', this.doctor.pcpId);
    this.router.navigate(['/mydoctors/update-pcp']);
  }


}
