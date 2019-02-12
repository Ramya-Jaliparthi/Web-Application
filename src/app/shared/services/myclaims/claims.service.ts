

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { ClaimsDetails, MockClaim } from '../../models/myclaims/claims.model';
import { AuthService, ConstantsService } from '../../shared.module';
import { AuthHttp } from '../authHttp.service';
import {
  ClaimsSummaryResponseModelInterface,
  ClaimsSummaryRequestModelInterface
} from '../../../pages/myclaims/models/interfaces/claims-summary-data-model.interface';
import {
  ClaimsSummaryResponseModel,
  ClaimsSummaryRequestModel,
  ClaimSummaryMetadata
} from '../../../pages/myclaims/models/claims-summary-data.model';

@Injectable()
export class ClaimsService {

  private claimDetails = new BehaviorSubject<ClaimsDetails>(null);
  public claimDetails$ = this.claimDetails.asObservable();

  private claimRecord = new BehaviorSubject<MockClaim>(null);
  public claimRecord$ = this.claimRecord.asObservable();

  constructor(private http: AuthHttp,
    private constants: ConstantsService,
    private authService: AuthService) {
  }

  getClaims(filterPaginationReqParams?: ClaimsSummaryRequestModelInterface, pagination?: boolean):
     Observable<ClaimsSummaryResponseModelInterface> {
    let request: ClaimsSummaryRequestModelInterface = new ClaimsSummaryRequestModel(), globalSpinner = true;
    if (!filterPaginationReqParams) {
     request.useridin = this.authService.useridin;
     const sortorder = 'Most Recent';
      request.summaryMetaData = new ClaimSummaryMetadata();
     request.summaryMetaData.sortOrder = sortorder;
    }else {
      request = filterPaginationReqParams;
      if (pagination) {
        globalSpinner = false;
      }
    }

    return this.http.encryptPost(this.constants.claimsUrl, request, null, null, globalSpinner).map(response => {
      return <ClaimsSummaryResponseModel>response;
    });

  }

  getDetailsClaim(body): Observable<any> {
    const url = body.depid ? 'depclaimsinfo/getdepclaimsforICN' : 'claimsinfo/getclaimsforICN';
    return this.http.encryptPost(url, body);
  }

  setClaimDetails(details: ClaimsDetails) {
    this.claimDetails.next(details);
  }

  setClaimRecord(record: MockClaim) {
    this.claimRecord.next(record);
  }
}
