import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {DependantsService} from '../services/dependant.service';
import {GlobalService} from '../services/global.service';
import {ClaimsService} from '../services/myclaims/claims.service';
import {AuthService, ConstantsService} from '../shared.module';

@Injectable()
export class MyclaimsResolverService implements Resolve<Observable<any>> {

  constructor(public dependantsService: DependantsService,
              public authService: AuthService,
              public globalService: GlobalService,
              private claimService: ClaimsService,
              private constantService: ConstantsService) {
  }

  resolve() {
    return this.getallClaims();
  }

  getallClaims() {
    const obs = [];
    obs.push(this.claimService.getClaims());
    return forkJoin(obs);
  }

}
