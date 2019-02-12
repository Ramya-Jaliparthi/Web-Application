import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AuthService, ConstantsService} from '../../shared/shared.module';
import {AuthHttp} from '../../shared/services/authHttp.service';

@Injectable()
export class SsoService {
  constructor(private constants: ConstantsService,
              private authService: AuthService,
              private http: AuthHttp) {

  }

  getSsoDetails(ssoUrl: string): Observable<any> {
    const request = {
      useridin: this.authService.useridin
    };
    return this.http.encryptPost(this.constants.serviceUrl + ssoUrl, request).map(response => {
      if (response['ssomsg']) {
        response = this.http.decryptPayload(response);
        // return response['ssomsg'];
        console.log('SSO decrypted response', response);
      }
      return response;
    });
  }

  callUrl(resp) {
    const myElement: HTMLElement = document.getElementById('ssoDiv');
    if (myElement) {
      myElement.innerHTML = '<FORM METHOD=\'POST\' ACTION=\'' +
      resp.samlUrl +
      '\'><INPUT TYPE=\'HIDDEN\' NAME=\'NameValue\' VALUE=\'' +
      resp.samlValue + '\'></FORM>';
      const currForm: HTMLFormElement = <HTMLFormElement>myElement.children[0];
      currForm.submit();
    }
  }
}
