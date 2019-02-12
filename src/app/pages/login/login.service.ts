import {Injectable} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {AuthHttp} from '../../shared/services/authHttp.service';

@Injectable()
export class LoginService {

  constructor(private authService: AuthService,
              private authHttp: AuthHttp) {
  }

  login(request) {
    this.authService.cryptoToken = null;
    return this.authHttp.login(request);
  }
}
