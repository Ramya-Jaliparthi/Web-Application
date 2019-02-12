import { AuthHttp } from '../../shared/services/authHttp.service';
import { AuthService } from '../../shared/shared.module';
import { ConstantsService } from '../../shared/shared.module';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DatePipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ClaimsDetails, MockClaim } from './claims.model';

@Injectable()
export class ClaimsService {

  private claimDetails = new BehaviorSubject<ClaimsDetails>(null);
  public claimDetails$ = this.claimDetails.asObservable();

  private claimRecord = new BehaviorSubject<MockClaim>(null);
  public claimRecord$ = this.claimRecord.asObservable();


  constructor(private http: AuthHttp,
    private constants: ConstantsService,
    private authService: AuthService,
    private datePipe: DatePipe) {

  }

  getClaims(): Observable<any> {
    const request = {
      useridin: this.authService.useridin
    };

    if (sessionStorage.getItem('prvName') === 'null' || sessionStorage.getItem('prvName') === null) {
    } else {
      request['param1'] = sessionStorage.getItem('prvName');
    }

    //noinspection TsLint
    return sessionStorage.getItem('prvName') === 'null' || sessionStorage.getItem('prvName') === null ?
      this.http.encryptPost(this.constants.claimsUrl, request).map(response => {
        if (response && response['result'] !== '-1') {
          if (response['ROWSET'] && response['ROWSET'].totRows <= 1) {
            return [response['ROWSET'].ROWS];
          } else if (response['ROWSET']) {
            return response['ROWSET'].ROWS;
          }
        } else {
          return [];
        }
      }) :
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

  getClaimDetails(body): Observable<any> {
    const url = body.depid ? this.constants.claimsdepdetailsUrl : this.constants.claimdetailsUrl;
    return this.http.encryptPost(url, body);
  }


  getClaimProcessingStatus(requestParams) {
    const url = this.constants.claimProcessingStatusUrl;
    return this.http.encryptPost(url, requestParams);
  }

  getBenefitsDocument(requestParams) {
    const url = this.constants.benefitsLinkUrl;
    return this.http.encryptPost(url, requestParams);
  }

  setClaimDetails(details: ClaimsDetails) {
    this.claimDetails.next(details);
  }

  setClaimRecord(record: MockClaim) {
    this.claimRecord.next(record);
  }

  getClaimsBenefitsLink(body): Observable<any> {
    const url =  this.constants.benefitsLinkUrl;
    return this.http.encryptPost(url, body);
  }

}
