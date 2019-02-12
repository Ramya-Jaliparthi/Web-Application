import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AuthService} from '../../shared/services/auth.service';
import {AuthHttp} from '../../shared/services/authHttp.service';
import {ConstantsService} from '../../shared/services/constants.service';
import {Provider} from './mydoctors-pcp.model';
import {MemberInfo} from '../../shared/models/memberInfo.model';
import {
  GetRecentVisitsRequestModelInterface
} from '../mydoctors-pcp/models/interfaces/get-recent-visits-models.interface';
import {
  GetVisitDetailsRequestModelInterface
} from '../mydoctors-pcp/models/interfaces/get-visit-details-models.interface';
import {
  GetVisitDetailsRequestModel
} from '../mydoctors-pcp/models/get-visit-details.model';

import {
  GetDependentRecentVisitsResponseModel,
  GetDependentRecentVisitsRequestModel
} from '../mydoctors-pcp/models/get-dependent-recent-visits.model';
import {
  GetDependentRecentVisitsResponseModelInterface,
  GetDependentRecentVisitsRequestModelInterface
} from '../mydoctors-pcp/models/interfaces/get-dependent-recent-visits-model.interface';
import {
  GetRecentVisitsRequestModel
} from '../mydoctors-pcp/models/get-recent-visits.model';
import {MyDoctorsGenericRequestModel, VisitsResponse} from '../mydoctors-pcp/models/my-doctor-module-common.model';
import {
  VisitsResponseInterface,
  MemberPCPDataModelInterface
} from './models/interfaces/my-doctor-module-common-models.interface';
import {GetVisitDetailsResponseModelInterface} from '../mydoctors-pcp/models/interfaces/get-visit-details-models.interface';
import {GetVisitDetailsResponseModel} from '../mydoctors-pcp/models/get-visit-details.model';

import {
  GetDependentVisitDetailsRequestModelInterface,
  GetDependentVisitDetailsResponseModelInterface
} from '../mydoctors-pcp/models/interfaces/get-dependent-visit-details-models.interface';
import {
  GetDependentVisitDetailsResponseModel,
  GetDependentVisitDetailsRequestModel
} from '../mydoctors-pcp/models/get-dependent-visit-details.model';

import {
  DependentsResponseModelInterface,
  DependentInterimModelInterface
} from '../../pages/myclaims/models/interfaces/dependants-model.interface';
import {GetMemPlanDependentsRequest, GetMemberPlanInformation} from './models/get-member-plan-info-model';
import {GetMemberPlanDependentResponseModel} from './models/get-member-plan-dependent-model';
import {GetCodeResponseModelInterface} from './models/interfaces/get-code-model-interface';
import {ChangePCPRequestModel, ChangePCPResponseModel} from './models/change-pcp-request.model';
import {
  ChangePCPRequestModelInterface,
  ChangePCPResponseModelInterface
} from './models/interfaces/change-pcp-request-model-interface';
import {GetPCPInfoRequestModel, GetPCPInfoResponseModel} from './models/get-pcp-info-request.model';
import {
  GetPCPInfoRequestModelInterface,
  GetPCPInfoResponseModellInterface
} from './models/interfaces/get-pcp-info-request-model-interface';
import { AlertService } from '../../shared/services/alert.service';
import { AlertType } from '../../shared/alerts/alertType.model';


@Injectable()
export class MyDoctorsPcpService {
  private _selectedDoctor: Provider;
  private _doctorList: Provider[];
  private _memberPCP: MemberPCPDataModelInterface;
  private _active: boolean;
  private _memberInfo: MemberInfo;
  private _doctorDetails: Object;
  private _previousPCPUrl: string;


  constructor(private http: AuthHttp,
              private constants: ConstantsService,
              public authService: AuthService,
              private alertService: AlertService) {
    this.setActiveStatus();
  }


  getMemberPlanInfo(requestParam): Observable<GetMemberPlanInformation> {
    const targetUrl = this.constants.getMemPlanInfo;
    return this.http.encryptPost(targetUrl, requestParam);
  }

  getMemberPlanDependentsInfo(requestParam): Observable<GetMemberPlanDependentResponseModel> {
    const targetUrl = this.constants.getMemPlanDependents;
    return this.http.encryptPost(targetUrl, requestParam);
  }

  getChangePCPReasonInfo(requestParam): Observable<GetCodeResponseModelInterface> {
    const targetUrl = this.constants.getCodes;
    return this.http.encryptPost(targetUrl, requestParam);
  }

  getPCPInfo(requestParam): Observable<GetPCPInfoResponseModellInterface> {
    const targetUrl = this.constants.getPCPInfo;
    return this.http.encryptPost(targetUrl, requestParam);
  }

  changePCPInfo(requestParam): Observable<ChangePCPResponseModelInterface> {
    const targetUrl = this.constants.changePCP;
    return this.http.encryptPost(targetUrl, requestParam);
  }

  getDoctorList(): Observable<VisitsResponseInterface[]> {
    const request: GetRecentVisitsRequestModelInterface = new MyDoctorsGenericRequestModel();
    request.useridin = this.authService.useridin;

    return this.http
      .encryptPost(this.constants.myDoctorListUrl, request)
      .map(response => {
        if (response) {
          if (response['recentVisits']) {
            response['recentVisits'].map((visit) => visit.currUser = true);
            this.doctorList = <VisitsResponse[]>response['recentVisits'];
          }
          return <VisitsResponse[]>response['recentVisits'];
        }
      });
  }

  setActiveStatus(): void {
    const scopename = this.authService.authToken ? this.authService.authToken.scopename : '';
    if (scopename.toLowerCase().indexOf('inactive') >= 0) {
      this.active = false;
    } else {
      this.active = true;
    }
  }

  // To Do after clarification
  setMemberPCP(): void {
    if (this.memberInfo && this.doctorList) {
      const doesMemberHasPCP = (this.doctorList.filter((doctor) => {
        return (doctor.memberRelationship.toUpperCase() === this.memberInfo.relationship.toUpperCase()
          && doctor.pcpId && doctor.pcpId !== this.constants.myDoctorInvalidPCPId);
      }).length > 0);
      const doesMemberNeedPCP = (this.doctorList.filter((doctor) => {
        return (doctor.memberRelationship.toUpperCase() === this.memberInfo.relationship.toUpperCase()
          && doctor.isRequiredPCP === true && doctor.isAllowedChangePCP === true);
      }).length > 0);
      const pcpId = this.doctorList[0] && this.doctorList[0].pcpId ? this.doctorList[0].pcpId : '';
      this.memberPCP = <MemberPCPDataModelInterface>{
        isRequiredPCP: doesMemberNeedPCP, // Member Plan`s PCP Requirement
        hasPCP: doesMemberHasPCP,
        pcpId: pcpId
      };
    } else {
      // Default To Do
      this.memberPCP = <MemberPCPDataModelInterface>{
        isRequiredPCP: false, // Member Plan`s PCP Requirement
        hasPCP: false, // Does member has a PCP
        pcpId: ''
      };
    }
  }

  get memberInfo() {
    const storedMemInfo = sessionStorage.getItem('mydoctors.memberInfo');
    if (storedMemInfo && storedMemInfo.toString &&
      storedMemInfo.toString().trim() !== 'undefined' && storedMemInfo.toString().trim() !== 'null') {
      if (this._memberInfo === null || this._memberInfo === undefined) {
        return JSON.parse(storedMemInfo);
      }
    }

    return this._memberInfo;
  }

  set memberInfo(memberInfo: MemberInfo) {
    this._memberInfo = memberInfo;
    sessionStorage.setItem('mydoctors.memberInfo', JSON.stringify(memberInfo));
  }

  get active() {
    if (this._active === null || this._active === undefined) {
      return JSON.parse(sessionStorage.getItem('mydoctors.active'));
    }
    return this._active;
  }

  set previousPCPUrl(previsousUrl: string) {
    this._previousPCPUrl = previsousUrl;
  }
  get previousPCPUrl() {
    return this._previousPCPUrl;
  }

  set active(active: boolean) {
    this._active = active;
    sessionStorage.setItem('mydoctors.active', JSON.stringify(active));
  }

  get memberPCP(): MemberPCPDataModelInterface {
    if (this._memberPCP === null || this._memberPCP === undefined) {
      return JSON.parse(sessionStorage.getItem('mydoctors.memberPCP'));
    }
    return this._memberPCP;
  }

  set memberPCP(memberPCP: MemberPCPDataModelInterface) {
    this._memberPCP = memberPCP;
    sessionStorage.setItem('mydoctors.memberPCP', JSON.stringify(memberPCP));
  }

  get doctorList() {
    // if (this._doctorList === null || this._doctorList === undefined) {
    //   return JSON.parse(sessionStorage.getItem('mydoctors.doctorList'));
    // }
    return this._doctorList;
  }

  set doctorList(doctorList: Provider[]) {
    this._doctorList = doctorList;
    // sessionStorage.setItem('mydoctors.doctorList', JSON.stringify(this._doctorList));
  }

  get selectedDoctor() {
    if (this._selectedDoctor === null || this._selectedDoctor === undefined) {
      return JSON.parse(sessionStorage.getItem('mydoctors.selectedDoctor'));
    }
    return this._selectedDoctor;
  }

  set selectedDoctor(doctor: Provider) {
    this._selectedDoctor = doctor;
    sessionStorage.setItem('mydoctors.selectedDoctor', JSON.stringify(this._selectedDoctor));
  }

  getClaimsforProvider() {
    const request = {
      useridin: this.authService.useridin
    };

    this.http.encryptPost(this.constants.claimsforproviderUrl, request).map(response => {
      if (response && response['result'] !== '-1') {
        if (response['ROWSET'] && response['ROWSET'].totRows <= 1) {
          return [response['ROWSET'].ROWS];
        } else {
          return response['ROWSET'].ROWS;
        }
      } else {
        return [];
      }
    });
  }

  get doctorDetails() {
    if (this._doctorDetails === null || this._doctorDetails === undefined) {
      return JSON.parse(sessionStorage.getItem('mydoctors.doctorDetails'));
    }
    return this._doctorDetails;
  }

  set doctorDetails(doctor: Object) {
    this._doctorDetails = doctor;
    sessionStorage.setItem('mydoctors.doctorDetails', JSON.stringify(this._doctorDetails));
  }


  getDoctorDetails(request): any {
    const url = request.dependentId ? this.constants.myDepDoctorDetailsUrl : this.constants.myDoctorDetailsUrl;
    return this.http
      .encryptPost(url, request)
      .map(response => {
          if (!response || (response && response.result < 0)) {
            this.doctorDetails = null;
              this.alertService.setAlert( response['displaymessage'], '', AlertType.Failure);
              return null;
          } else {
            if (request.dependentId) {
              this.doctorDetails = <GetDependentVisitDetailsResponseModel>response;
            } else {
              this.doctorDetails = <GetVisitDetailsResponseModel>response;
            }
            return this.doctorDetails;
          }
      });
  }


  loadDependantRecords(dependantId: any, url: string): Observable<GetDependentRecentVisitsResponseModelInterface> {
    this.http.showSpinnerLoading();

    const dependentRecentRxReq: GetDependentRecentVisitsRequestModel = new GetDependentRecentVisitsRequestModel();
    dependentRecentRxReq.useridin = this.authService.useridin;
    dependentRecentRxReq.dependentId = dependantId;
    return this.http.encryptPost(url, dependentRecentRxReq).map(response => {
      if (response.result < 0) {
        this.http.hideSpinnerLoading();
        return new GetDependentRecentVisitsResponseModel();
      } else {
        return this.addDependentIdToRecords(response, dependantId);
      }
    });
  }

  addDependentIdToRecords(records, dependantId) {
    const dependantInfo: DependentInterimModelInterface = this.authService.getDependentsList().dependents
      .find((dependant) => dependant.dependent.depId === dependantId);
    let memberInfo = '';
    let mem_name = '';
    // if (dependantInfo && dependantInfo.dependent.middleInitial) {
    // memberInfo = `${dependantInfo.dependent.firstName} ${dependantInfo.dependent.middleInitial} ${dependantInfo.dependent.lastName}
    // (${dependantInfo.dependent.relationship})`;
    // } else  if (dependantInfo) {
    //   memberInfo = `${dependantInfo.dependent.firstName} ${dependantInfo.dependent.lastName} (${dependantInfo.dependent.relationship})`;
    // }
    if (dependantInfo && dependantInfo.dependent.middleInitial) {
      memberInfo = `${dependantInfo.dependent.firstName} ${dependantInfo.dependent.middleInitial}
      ${dependantInfo.dependent.lastName} (${dependantInfo.dependent.relationship})`;
      mem_name = `${dependantInfo.dependent.firstName} ${dependantInfo.dependent.middleInitial} ${dependantInfo.dependent.lastName}`;
    } else if (dependantInfo) {
      memberInfo = `${dependantInfo.dependent.firstName} ${dependantInfo.dependent.lastName} (${dependantInfo.dependent.relationship})`;
      mem_name = `${dependantInfo.dependent.firstName} ${dependantInfo.dependent.lastName}`;
    }

    if (records && records.recentVisits.length > 0) {
      // const updatedRecords = [];
      const updatedRecords = records.recentVisits.map((record) => {
        return {...record, MemberInfo: memberInfo, mem_name: mem_name, dependentId: dependantId};
      });
      return updatedRecords;
    }

    if (records && records.recentVisits.length === undefined && Object.keys(records).length) {
      return {...records, MemberInfo: memberInfo, mem_name: mem_name, dependentId: dependantId};
    }

    return records;
  }
}
