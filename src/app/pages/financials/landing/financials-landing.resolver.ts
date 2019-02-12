import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {AccountDetailsRequestModelInterface} from '../models/interfaces';
import {FinancialsLandingPageService} from './financials-landing.service';
import {AccountDetailsRequestModel} from '../models';
import {BcbsmaConstants} from '../../../shared/constants/bcbsma.constants';
import {FinancialsConstants} from '../constants/financials.constants';
import {BcbsmaerrorHandlerService} from '../../../shared/services/bcbsmaerror-handler.service';
import {AuthService} from '../../../shared/services/auth.service';
import {AuthHttp} from '../../../shared/services/authHttp.service';
import {ConstantsService} from '../../../shared/shared.module';


@Injectable()
export class FinancialsLandingResolver implements Resolve<any> {

  constructor(private financialService: FinancialsLandingPageService,
              private authService: AuthService,
              private http: AuthHttp,
              private constants: ConstantsService,
              private bcbsmaErrorHandler: BcbsmaerrorHandlerService) {
  }

  async resolve() {
    return await forkJoin([
      this.financialService.financialSummaryInfo()
    ]).toPromise();
  }
}
