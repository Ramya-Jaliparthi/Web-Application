import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BcbsmaHttpService } from '../../../shared/services/bcbsma-http.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { FinancialsConstants } from '../constants/financials.constants';

@Injectable()
export class MakePaymentService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  constructor(private bcbsmaHttpService: BcbsmaHttpService) { }

  getMakePaymentDetails(request: any): Observable<any> {

    let params = new HttpParams();
    for (let key in request) {
      params = params.append(key.toString(), request[key]);
    }

    const url = FinancialsConstants.jsonurls.makePaymentDetailsUrl;
    return this.bcbsmaHttpService.get(url, {params: params});
  }
}


