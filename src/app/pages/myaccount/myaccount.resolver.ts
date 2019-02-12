import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {MyAccountService} from './myaccount.service';
import {AuthService} from '../../shared/shared.module';

@Injectable()
export class MyaccountResolver implements Resolve<any> {
  isRegisteredUser: boolean;

  constructor(private myaccountService: MyAccountService,
              private authService: AuthService) {
  }

  async resolve() {
    this.isRegisteredUser = this.authService.getScopeName().includes('REGISTERED');
    if (!this.isRegisteredUser) {
      return await forkJoin([
        this.fetchMyAccountInfo()
      ]).toPromise();
    }
  }


  fetchMyAccountInfo() {
    this.isRegisteredUser = this.authService.getScopeName().includes('REGISTERED');
    if (!this.isRegisteredUser) {
      return this.myaccountService.getAccountInfo();
    }
  }

}
