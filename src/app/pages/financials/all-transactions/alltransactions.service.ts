import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BcbsmaHttpService } from '../../../shared/services/bcbsma-http.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { FinancialsConstants } from '../constants/financials.constants';

@Injectable()
export class AlltransactionsService {

  constructor(private bcbsmaHttpService: BcbsmaHttpService) { }
  getAllTransactionsSummary(): Observable<any> {
    const url = (FinancialsConstants.api.switchToApiUrlFromJsonFile) ? FinancialsConstants.api.Url + FinancialsConstants.urls.getAllTransactionsUrl : FinancialsConstants.jsonurls.getAllTransactionsUrl;
    return this.bcbsmaHttpService.get(url);
  }

}
