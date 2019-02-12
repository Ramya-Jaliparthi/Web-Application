import { Injectable } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { AuthHttp } from '../../shared/services/authHttp.service';
declare let $: any;

@Injectable()
export class VdkService {

  constructor(private authService: AuthService,
    private authHttp: AuthHttp) {
  }

  login(request) {
    this.authService.cryptoToken = null;
    return this.authHttp.login(request);
  }
}
