import { Injectable } from '@angular/core';
import { AuthHttp } from '../../shared/services/authHttp.service';
import { ConstantsService } from '../../shared/services/constants.service';
import { AuthService } from '../../shared/shared.module';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class MyAccountService {
  constructor(
    private http: AuthHttp,
    private authService: AuthService,
    private constants: ConstantsService) {
  }

  getAccountInfo(): Observable<any> {
    const request = {
        useridin: this.authService.useridin
    };
    return this.http.encryptPost(this.constants.myaccountUrl, request);
  }
}

