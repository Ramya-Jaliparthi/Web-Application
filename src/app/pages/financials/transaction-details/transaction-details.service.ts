import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BcbsmaHttpService } from '../../../shared/services/bcbsma-http.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { FinancialsConstants } from '../constants/financials.constants';
import { TransactionDetailRequestModel, TransactionDetailResponseInterface } from '../models';


@Injectable()
export class TransactionDetailsService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  constructor(private bcbsmaHttpService: BcbsmaHttpService) { }

  getTransactionDetail(request: TransactionDetailRequestModel): Observable<TransactionDetailResponseInterface[]> {

    let params = new HttpParams();
    for (const key in request) {
      params = params.append(key.toString(), request[key]);
    }

    const url = (FinancialsConstants.api.switchToApiUrlFromJsonFile) ? FinancialsConstants.api.Url + FinancialsConstants.urls.getTransactionDetailsUrl : FinancialsConstants.jsonurls.getTransactionDetailsUrl;
    console.log(url);

    return this.bcbsmaHttpService.get(url, { params: params });
  }
}
