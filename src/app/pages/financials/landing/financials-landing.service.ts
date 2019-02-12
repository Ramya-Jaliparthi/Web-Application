import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BcbsmaHttpService} from '../../../shared/services/bcbsma-http.service';
import {AuthHttp} from '../../../shared/services/authHttp.service';
import {ConstantsService} from '../../../shared/services/constants.service';
import {HttpHeaders, HttpParams} from '@angular/common/http';
import {
  AccountDetailsRequestModelInterface,
  AccountSummaryTypeInterface,
  TransactionSummaryRequestInterface,
  TransactionSummaryResponseInterface,
  AccountDetailsRequestModel
} from '../models';
import {BcbsmaerrorHandlerService} from '../../../shared/services/bcbsmaerror-handler.service';
import {FinancialsConstants} from '../constants/financials.constants';
import {BcbsmaConstants} from '../../../shared/constants/bcbsma.constants';
import {AuthService} from '../../../shared/shared.module';


@Injectable()
export class FinancialsLandingPageService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  private summaryResponse;

  constructor(private http: AuthHttp,
              private constants: ConstantsService,
              private authService: AuthService,
              private bcbsmaErrorHandler: BcbsmaerrorHandlerService,
              private bcbsmaHttpService: BcbsmaHttpService) {

  }

  getAccountSummary(request: AccountDetailsRequestModelInterface): Observable<AccountSummaryTypeInterface[]> {

    let params = new HttpParams();
    for (const key in request) {
      if (request.hasOwnProperty(key)) {
        params = params.append(key.toString(), request[key]);
      }
    }

    /* const url = (FinancialsConstants.api.switchToApiUrlFromJsonFile) ? FinancialsConstants.api.Url +
      FinancialsConstants.urls.accountSummaryUrl : FinancialsConstants.jsonurls.accountSummaryUrl;
    return this.bcbsmaHttpService.get(url, {params: params}); */

    return this.http.encryptPost(this.constants.alegeusAccountsSummaryUrl, params);
  }

  getTransactionDetails(transxSummaryRequest: TransactionSummaryRequestInterface): Observable<TransactionSummaryResponseInterface> {

    let params = new HttpParams();
    for (const key in transxSummaryRequest) {
      if (transxSummaryRequest.hasOwnProperty(key)) {
        params = params.append(key.toString(), transxSummaryRequest[key]);
      }
    }

    /* const url = (FinancialsConstants.api.switchToApiUrlFromJsonFile) ? FinancialsConstants.api.Url +
      FinancialsConstants.urls.getAllTransactionsUrl : FinancialsConstants.jsonurls.getTransactionDetailsUrl;
    return this.bcbsmaHttpService.get(url, {params: params}); */

    return this.http.encryptPost(this.constants.alegeusAccountsSummaryUrl, params);
  }

  getfinancialHeaderText(fincialInfo): string {
    const headers = {
      'HSA': 'Health Savings Account',
      'ABH': 'Health Savings Account',
      'AB2': 'Health Savings Account',
      'ROL': 'Flexible Spending Rollover Account',
      'FSA': 'Flexible Spending Account',
      'HRA': 'Health Reimbursement Arrangement',
      'HRD': 'Health Reimbursement Arrangement',
      'DTR': 'Deductible Tracking Account',
      'DCA': 'Dependent Care Account Commuter',
      'DFS': 'Dependent Care Flexible Spending Account',
      'FSL': 'Limited Purpose Flexible Spending Account',
      'PFS': 'Parking Account',
      'TFS': 'Transportation Account',
      'HIA': 'Health Incentive Account'
    };
    return headers[fincialInfo];
  }

  financialSummaryInfo() {
    try {
      // if (this.summaryResponse) {
      //   return Observable.of(this.summaryResponse);
      // } else {
      const accountDetailsRequest: AccountDetailsRequestModelInterface = new AccountDetailsRequestModel();
      accountDetailsRequest.useridin = this.authService.useridin;
      accountDetailsRequest.planyear = 0;
      return this.http.encryptPost(this.constants.alegeusAccountsSummaryUrl, accountDetailsRequest).map((res) => {
        this.summaryResponse = res && res.algmsg  ? res.algmsg : res;
        return this.summaryResponse;
      });
      // }
    } catch (exception) {
      this.bcbsmaErrorHandler.logError(exception, BcbsmaConstants.modules.financialModule,
        FinancialsConstants.services.financialResolverService,
        FinancialsConstants.methods.financialSummaryInfo);
    }
  }

  getAccountDetails(response, year) {
    const accountdetails = [];
    let account;
    account = this.filteredResults(response, 'HSA', year);
    if (account.length >= 1) {
      account.length === 1 ? accountdetails.push(account[0]) : accountdetails.push(...account);
    }

    account = this.filteredResults(response, 'ABH', year);
    if (account.length >= 1) {
      account.length === 1 ? accountdetails.push(account[0]) : accountdetails.push(...account);
    }

    account = this.filteredResults(response, 'AB2', year);
    if (account.length >= 1) {
      account.length === 1 ? accountdetails.push(account[0]) : accountdetails.push(...account);
    }

    account = this.filteredResults(response, 'HRA', year);
    if (account.length >= 1) {
      account.length === 1 ? accountdetails.push(account[0]) : accountdetails.push(...account);
    }

    account = this.filteredResults(response, 'HRD', year);
    if (account.length >= 1) {
      account.length === 1 ? accountdetails.push(account[0]) : accountdetails.push(...account);
    }

    account = this.filteredResults(response, 'FSA', year);
    if (account.length >= 1) {
      account.length === 1 ? accountdetails.push(account[0]) : accountdetails.push(...account);
    }
    account = this.filteredResults(response, 'ROL', year);
    if (account.length >= 1) {
      account.length === 1 ? accountdetails.push(account[0]) : accountdetails.push(...account);
    }

    account = this.filteredResults(response, 'RO1', year);
    if (account.length >= 1) {
      account.length === 1 ? accountdetails.push(account[0]) : accountdetails.push(...account);
    }

    account = this.filteredResults(response, 'FSL', year);
    if (account.length >= 1) {
      account.length === 1 ? accountdetails.push(account[0]) : accountdetails.push(...account);
    }
    account = this.filteredResults(response, 'DCA', year);
    if (account.length >= 1) {
      account.length === 1 ? accountdetails.push(account[0]) : accountdetails.push(...account);
    }

    account = this.filteredResults(response, 'DFS', year);
    if (account.length >= 1) {
      account.length === 1 ? accountdetails.push(account[0]) : accountdetails.push(...account);
    }

    account = this.filteredResults(response, 'PFS', year);
    if (account.length >= 1) {
      account.length === 1 ? accountdetails.push(account[0]) : accountdetails.push(...account);
    }

    account = this.filteredResults(response, 'TFS', year);
    if (account.length >= 1) {
      account.length === 1 ? accountdetails.push(account[0]) : accountdetails.push(...account);
    }

    account = this.filteredResults(response, 'HIA', year);
    if (account.length >= 1) {
      account.length === 1 ? accountdetails.push(account[0]) : accountdetails.push(...account);
    }

    account = this.filteredResults(response, 'DTR', year);
    if (account.length >= 1) {
      account.length === 1 ? accountdetails.push(account[0]) : accountdetails.push(...account);
    }

    account = this.filteredResults(response, 'OTHER', year);
    if (account.length >= 1) {
      account.length === 1 ? accountdetails.push(account[0]) : accountdetails.push(...account);
    }

    return accountdetails;
  }

  filteredResults(res, type, year) {
    try {
      const accountTypes = [
        'HSA',
        'ABH',
        'AB2',
        'HRA',
        'HRD',
        'ROL',
        'RO1',
        'DCA',
        'FSA',
        'DFS',
        'PFS',
        'TFS',
        'DTR',
        'HIA',
        'FSL'
      ];
      let result = [];
      if (Array.isArray(res)) {
        result = res.filter((item) => {
          if (type === 'OTHER') {
            return item.planYear === year && accountTypes.indexOf(item.accountType) < 0;
          } else {
            return item.planYear === year && type === item.accountType && 'DTR' !== item.accountType;
          }
        });
      }
      return result;

    } catch (e) {
      console.log(e);
    }
  }

}


