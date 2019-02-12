import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { ConstantsService } from './constants.service';
import { AuthHttp } from './authHttp.service';
import { FormGroup } from '@angular/forms';
import { AlertService } from './alert.service';
import { DependantsService } from './dependant.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MemberInfo } from '../models/memberInfo.model';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { HomePageInfoModel } from '../../pages/landing/landing.model';
import * as moment from 'moment';
// import { MyDedCoModelInterface, MyDedCoFilterModelInterface } from '../../pages/myded-co/models/interfaces/myded-co-model.interface';
// import { MyDedCoFilterModel } from '../../pages/myded-co/models/myded-co.model';

declare let $: any;

@Injectable()
export class GlobalService {
  _memberInfo: ReplaySubject<MemberInfo>;


  public _waDataLayer: any;
  // private _myDedCoModelData: MyDedCoModelInterface[];
  private memberData = new BehaviorSubject<MemberInfo>(null);
  public memberData$ = this.memberData.asObservable();
  // public myDedCoFilterData: MyDedCoFilterModelInterface;
  public memberDataObject;
  public filterState: Object = {};
  public landingPageMemberInfo: HomePageInfoModel;
  private REDIRECTION_URLS = {
    'LOCKED_OUT': '../register/updatessn',
    'SSN_MISMATCH': '../register/updatessn',
    'DOB_NOT_FOUND': '../register/register-detail',
    'MEMBER_NOT_FOUND': '../register/memberinfo'
  };
  private API_INVALID_IDENTIFITERS = {
    'dateOfBirth': 'MEM_DOB',
    'firstName': 'MEM_FNAME',
    'lastName': 'MEM_LNAME',
    'memberId': 'MEM_NUM'
  };

  constructor(private alertService: AlertService,
    private http: AuthHttp,
    private constants: ConstantsService,
    private authService: AuthService,
    private router: Router,
    private dependantService: DependantsService) {

    if (this.isAuthenticated() && this.authService.authToken.scopename === 'AUTHENTICATED-AND-VERIFIED') {
      // *****************DO NOT DELETE ************************ */
      // following code has to be un commented after api arrives

      // this.fetchMemberData().subscribe(data => {
      //   this.setMemberData(data);
      // });

      // *****************DO NOT DELETE ************************ */
    }
    this._memberInfo = new ReplaySubject<MemberInfo>(1);
    // this.myDedCoFilterData = new MyDedCoFilterModel({}, {});
    this.clearGlobalSessionDetails();

  }

  setAdobe() {
    // Declare programatically
    (<any>window)._waDataLayer = new Object();
    if (this.isAuthenticated() && this.authService.authToken.syntheticID) {
        (<any>window)._waDataLayer.UID = this.authService.authToken.syntheticID;
    } else {
      (<any>window)._waDataLayer.UID = 'Anonymous';
    }
    // console.log((<any>window)._satellite);
    setTimeout(function () {
      if ((<any>window)._satellite) {
        (<any>window)._satellite.track('mbwLogin');
      }
    }, 3000);
  }

  callSatellite() {
    if ((<any>window)._satellite) {
      (<any>window)._satellite.track('mbwLogin');
    }
  }

  get memberInfo$() {
    return this._memberInfo.asObservable();
  }

  clearMemberData() {
    this.memberData.next(null);
  }

  // get myDedCoModelData(): MyDedCoModelInterface[] {
  //   return this._myDedCoModelData;
  // }

  // set myDedCoModelData(value: MyDedCoModelInterface[]) {
  //   this._myDedCoModelData = value;
  // }

  fetchMemberData() {
    // this.memberData.next(null);
    const request = {
      useridin: this.authService.useridin
    };
    return this.http.post(this.constants.getmemberinfo,
      this.http.handleRequest(request), null)
      .map(res1 => {
        return this.http.handleDecryptedResponse(res1);
      });
  }

  // here we set/change value of the observable
  setMemberData(data) {
    if (data && data['ROWSET']) {
      const member = new MemberInfo().deserialize(data['ROWSET'].ROWS);
      this.memberDataObject = member;
      console.log(<MemberInfo>data['ROWSET'].ROWS);
      const info: MemberInfo = <MemberInfo>data['ROWSET'].ROWS;
      this.authService.isSubscriber = info.relationship === 'Subscriber';
      this._memberInfo.next(member);
      this.memberData.next(member);
    }
  }

  // getMemberInfo() {
  //   const request = {
  //     useridin: this.authService.useridin
  //   };
  //   return this.http.post(this.constants.getmemberinfo,
  //     this.http.handleRequest(request), null)
  //     .map(res1 => this.http.handleDecryptedResponse(res1))
  //     .subscribe(res => {
  //       if (res['ROWSET']) {
  //         console.log(<MemberInfo>res['ROWSET'].ROWS);
  //         const info: MemberInfo = <MemberInfo>res['ROWSET'].ROWS;
  //         this.authService.isSubscriber = info.relationship === 'Subscriber';
  //         this._memberInfo.next(new MemberInfo().deserialize(res['ROWSET'].ROWS));
  //       }
  //     });
  // }

  handleError(response, errorCodes = null, errorMsg?: boolean) {
    const responseJson = response;
    if (errorMsg) {
      if (errorCodes[responseJson.errormessage]) {
        this.alertService.setAlertObj(errorCodes[responseJson.errormessage], 'component');
        this.http.CaptureAPIErrorInAdobe( '' , errorCodes[responseJson.errormessage], '');
      } else {
        this.alertService.setError(responseJson.errormessage);
        this.http.CaptureAPIErrorInAdobe( '' , errorCodes[responseJson.errormessage], '');
      }
    } else if (errorCodes && responseJson && errorCodes[responseJson.displaymessage]) {
      this.alertService.setAlertObj(errorCodes[responseJson.displaymessage], 'component');
      this.http.CaptureAPIErrorInAdobe( '' , errorCodes[responseJson.displaymessage], '');
    } else {
      if (errorMsg) {
        this.alertService.setAlertObj(errorCodes[responseJson.errormessage], 'component');
        this.http.CaptureAPIErrorInAdobe( '' , errorCodes[responseJson.errormessage], '');
      } else if (responseJson) {
        this.alertService.setError(responseJson.displaymessage);
        this.http.CaptureAPIErrorInAdobe( '' , errorCodes[responseJson.displaymessage], '');
      } else {
        this.alertService.setError('Unexpected error');
      }
    }
    this.http.hideSpinnerLoading();
    return Observable.throw(responseJson);
  }

  handleLogin(response?) {
    return this.redirectionRoute().then(
      redirectRoute => {
        this.router.navigate([redirectRoute]);
      },
      redirectRoute => {
        this.router.navigate([redirectRoute]);
      }
    );
  }

  login(request) {
    this.http.login(request).subscribe(response => {
      // this.handleLogin(response);
      this.router.navigate(['/home']);
      // TODO : Call getdependentlist here
      /*if (localStorage.getItem('targetRoute')) {
        const targetRoute = localStorage.getItem('targetRoute');
        localStorage.removeItem('targetRoute');
        this.router.navigate([targetRoute]);
      }*/
    }, err => {
      this.http.hideSpinnerLoading();
      if (err.status === 404) {
        $('#globalError').modal('open');
        return Observable.throw(err.error);
      } else if (err.status >= 500) {
        $('#requestTimeoutError').modal('open');
        return Observable.throw(err.error);
      } else {
        this.handleError(err.error, this.constants.displayMessage);
        return Observable.throw(err.error);
      }
    }
    );
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  redirectionRoute() {
    const scopename = this.authService.authToken ? this.authService.authToken.scopename : '';

    return new Promise((resolve, reject) => {
      const scopeNames = ['REGISTERED-NOT-VERIFIED', 'INACTIVE-AUTHENTICATED-AND-VERIFIED', 'REGISTERED-AND-VERIFIED'];
      const user = sessionStorage.getItem('key');
      if (scopeNames.indexOf(scopename) >= 0) {
        this.memAuth().subscribe(memAuthResponse => {
          if (memAuthResponse && memAuthResponse['ROWSET'] && memAuthResponse['ROWSET'].ROWS && memAuthResponse['ROWSET'].ROWS.userType) {
            sessionStorage.setItem('userType', memAuthResponse['ROWSET'].ROWS.userType);
          }
          if (memAuthResponse['errormessage']) {
            reject('../register/register-detail');
            return;
          }
          if (memAuthResponse['ROWSET']) {
            const redirectionUrl = this.getRedirectionPageUrl(memAuthResponse);
            if (redirectionUrl) {
              reject(redirectionUrl);
            }
          } else {
            resolve();
          }
        });
      } else if (scopename === 'AUTHENTICATED-NOT-VERIFIED') {
        reject('../register/verifyaccesscode');
      } else if (scopename === 'AUTHENTICATED-AND-VERIFIED') {
        // if (this.isAuthenticated() && this.authService.authToken.scopename === 'ACTIVE-AUTHENTICATED-AND-VERIFIED') {
        // this.getMemberInfo(true);
        this.fetchMemberData();
        // }
        if (localStorage.getItem('targetRoute')) {
          console.log('from global service targeted url fetched from localstorage - ' + localStorage.getItem('targetRoute'));
          const targetRoute = localStorage.getItem('targetRoute');
          localStorage.removeItem('targetRoute');
          resolve('../' + targetRoute);
        } else {
          resolve('../home');
        }
      }
    });

  }

  getRedirectionPageUrl(memberAuthResponse) {
    const memberDetails = memberAuthResponse['ROWSET'].ROWS;
    let redirectionUrl = '';
    this.authService.memAuthInfo = memberDetails;
    if (memberDetails.memNum && memberDetails.memNum !== 'null') {
      redirectionUrl = this.getUrlBasedUponLastAuthText(memberDetails);
    } else {
      redirectionUrl = this.getUrlWhenMemberIdIsNull(memberDetails);
    }
    return redirectionUrl;
  }

  getUrlBasedUponLastAuthText(memberDetails) {
    const lastMemResult = memberDetails.lastMemResult;
    const lastAuthFailText = memberDetails.lastAuthFailtxt;
    const authAttemptCnt = memberDetails.authAttemptCnt;
    let url = '';
    if (((lastMemResult.indexOf(this.API_INVALID_IDENTIFITERS.dateOfBirth) > -1 ||
      lastMemResult.indexOf(this.API_INVALID_IDENTIFITERS.firstName) > -1 ||
      lastMemResult.indexOf('FIRST_SCREEN') > -1 ||
      lastMemResult.indexOf(this.API_INVALID_IDENTIFITERS.lastName) > -1) && lastAuthFailText.indexOf('NO_LOGIN') > -1)
      && !(lastMemResult.indexOf(this.API_INVALID_IDENTIFITERS.memberId) > -1)
    ) {
      url = this.REDIRECTION_URLS['DOB_NOT_FOUND'];
    } else if (lastMemResult.indexOf(this.API_INVALID_IDENTIFITERS.memberId) > -1) {
      url = this.REDIRECTION_URLS['MEMBER_NOT_FOUND'];
    } else {
      sessionStorage.setItem('updatessn', 'true');
      url = this.REDIRECTION_URLS['SSN_MISMATCH'];
    }
    return url;
  }

  getUrlWhenNoLogin(memberDetails) {
    let url = null;
    if (this.isValidNameEntered(memberDetails)) {
      url = this.isValidMemberIdEntered(memberDetails) ?
        this.REDIRECTION_URLS.SSN_MISMATCH : this.REDIRECTION_URLS.MEMBER_NOT_FOUND;
    } else {
      url = this.REDIRECTION_URLS.DOB_NOT_FOUND;
    }
    return url;
  }

  isValidMemberIdEntered(memberDetails) {
    return memberDetails.memNum && memberDetails.memSuffix && memberDetails.memSuffix.toString().indexOf('null') === -1;
  }

  isValidNameEntered(memberDetails) {
    return memberDetails.firstName && memberDetails.lastName && memberDetails.DOB;
  }

  getUrlWhenMemberIdIsNull(memberDetails) {
    return memberDetails && memberDetails.lastName && memberDetails.lastName !== 'null'
      ? '../register/memberinfo' : '../register/register-detail';
  }

  getUrlBasedUponLastAuthResult(memberDetails) {
    const lastAuthResult = memberDetails.lastAuthResult;
    return lastAuthResult && memberDetails.lastName
      && lastAuthResult.split(',').indexOf('0') >= 0 ? '../register/verifyaccesscode' : '';
  }

  memAuth() {
    const request = {
      useridin: this.authService.useridin
    };
    return this.http.post(this.constants.memAuthUrl,
      this.http.handleRequest(request))
      .map(res1 => this.http.handleDecryptedResponse(res1));
  }

  sendaccesscode() {
    const request = {
      useridin: this.authService.useridin
    };
    return this.http.post(this.constants.sendaccesscodeUrl, this.http.handleRequest(request));
  }

  markFormGroupTouched(formGroup: FormGroup) {
    let myObjects;
    myObjects = Object.keys(formGroup.controls).map(itm => formGroup.controls[itm]);
    myObjects.forEach(control => {
      control.markAsTouched();
      control.markAsDirty();
      if (control.controls) {
        control.controls.forEach(c => this.markFormGroupTouched(c));
      }
    });
  }

  markFormGroupUnTouched(formGroup: FormGroup) {
    let myObjects;
    myObjects = Object.keys(formGroup.controls).map(itm => formGroup.controls[itm]);
    formGroup.markAsUntouched();
  }

  logout() {
    this.http.postWithCallBack(this.constants.logoutUrl, null, null, this.onLogoutCallBack).subscribe(() => {
      // delete this.dependantService.dependants;
      this.dependantService.clearDependantsList();
      this.authService.logout();
      this.memberData.next(null);
      // this.router.navigate(['./login']);
      // $('#tokenexpires').modal('close');
      window.open(this.constants.drupalHomeUrl, '_self');
    }, () => {
      // delete this.dependantService.dependants;
      this.dependantService.clearDependantsList();
      this.authService.logout();
      // this.memberData.next(null);
      // this.router.navigate(['./login']);
      // $('#tokenexpires').modal('close');
      window.open(this.constants.drupalHomeUrl, '_self');
    });
  }

  onLogoutCallBack() {
    $('#tokenExpiryModal').modal('close');
  }


  isMobile() {
    return !!(navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i));
  }

  getConfidentiality() {
    return this.http.get(this.constants.confidentiality);
  }

  getTermsAndConditions() {
    return this.http.get(this.constants.termsAndConditions);
  }

  clearGlobalSessionDetails() {
    // sessionStorage.removeItem('med_filterState');
    sessionStorage.removeItem('claims_filterState');
  }

  togglePasswordType(type: string) {
    return type === 'text' ? { type: 'password', placeHolder: 'Show' } : { type: 'text', placeHolder: 'Hide' };
  }

  getUTCDate(localDate: any): string {
    return moment.utc(localDate, 'MM/DD/YYYY').format('YYYY-MM-DD');
  }

  groupBy(xs, prop) {
    const grouped = {};
    for (let i = 0; i < xs.length; i++) {
      const p = xs[i][prop];
      if (!grouped[p]) { grouped[p] = []; }
      grouped[p].push(xs[i]);
    }
    return grouped;
  }

}
