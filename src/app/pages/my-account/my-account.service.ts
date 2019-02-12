import { Injectable } from '@angular/core';
import { AuthHttp } from '../../shared/services/authHttp.service';
import { AuthService } from '../../shared/services/auth.service';
import { ConstantsService } from '../../shared/services/constants.service';
import {GlobalService} from "../../shared/services/global.service";


@Injectable()
export class MyAccountService {
  private _fpverifyuserResponse;
  private _funverifyuserResponse;
  private _hintQuestion: string;
  constructor(private authService: AuthService,
    private http: AuthHttp,
    private globalService: GlobalService,
    private constants: ConstantsService) {

  }
  verifyUser(requestObj?) {
    if (requestObj) {
      this.authService.useridin = requestObj.useridin;
      this.authService.persistSession();
    }

    const request = { 'useridin': this.authService.useridin };
    return this.http.post(this.constants.verifyUserUrl,
      this.http.handleRequest(request))
      .map(res1 => {
        this.fpverifyuserResponse = this.http.handleDecryptedResponse(res1);
        return {
          original: res1,
          decrypted: this.fpverifyuserResponse
        };
      });
  }

  verifyUserValid(requestObj?) {

    // wka23 const request = { 'mesg': { 'email': requestObj.email, 'mobilenum': requestObj.mobile } };
    const request = { 'email': requestObj.email, 'mobilenum': requestObj.mobile };
    // return this.http.post(this.constants.userNameVerify,
    //   this.http.handleRequest(request))
    //   .map(res1 => {
    //     return {
    //       original: res1,
    //       decrypted: this.http.handleDecryptedResponse(res1)
    //     };
    //   });
    return this.http.encryptPost(this.constants.userNameVerify, request);
    // return this.http.post(this.constants.userNameVerify, this.http.handleRequest(request));
    // wka23 return this.http.encryptPost(this.constants.userNameVerify, request);
  }

  verifyUserAuth(requestObj?) {
    let request;
    request = Object.assign(requestObj, {
      useridin: sessionStorage.getItem('useridin')
    });
    return this.http.post(this.constants.verifyUserAuthUrl,
      this.http.handleRequest(request)).map(res1 => {
        return {
          original: res1,
          decrypted: this.http.handleDecryptedResponse(res1)
        };
      });
  }

  confirmIdentity(requestObj?) {
    const request = {
      'useridin': this.getUserId(),
      'dob': this.globalService.getUTCDate(requestObj.dob)
    };
    return this.http.encryptPost(this.constants.identityVerify, request);
  }

  getUserId(): string {
    if (sessionStorage.getItem('fun.funverifyuserResponse')) {
      return JSON.parse(sessionStorage.getItem('fun.funverifyuserResponse')) ?
        JSON.parse(sessionStorage.getItem('fun.funverifyuserResponse')).userId :
        sessionStorage.getItem('useridin');
    } else {
      return sessionStorage.getItem('useridin');
    }
  }

  resetPassword(requestObj?) {
    const generatedRequest = {
      ...requestObj,
      useridin: this.authService.useridin,
      webNonMigratedUser: this.fpverifyuserResponse['webNonMigratedUser'] ? this.fpverifyuserResponse['webNonMigratedUser'] :
        'FALSE'
    };
    return this.http.post(this.constants.resetPwd, this.http.handleRequest(generatedRequest));
  }

  get funverifyuserResponse() {
    if (this._funverifyuserResponse === null || this._funverifyuserResponse === undefined) {
      this._funverifyuserResponse = JSON.parse(sessionStorage.getItem('fun.funverifyuserResponse'));
    }
    return this._funverifyuserResponse;
  }

  set funverifyuserResponse(res) {
    this._funverifyuserResponse = res ? res : null;
    sessionStorage.setItem('fun.funverifyuserResponse', JSON.stringify(this._funverifyuserResponse));
  }

  get fpverifyuserResponse() {
    if (this._fpverifyuserResponse === null || this._fpverifyuserResponse === undefined) {
      this._fpverifyuserResponse = JSON.parse(sessionStorage.getItem('fpw.fpverifyuserResponse'));
    }
    return this._fpverifyuserResponse;
  }

  set fpverifyuserResponse(res) {
    this._fpverifyuserResponse = res ? res : null;
    sessionStorage.setItem('fpw.fpverifyuserResponse', JSON.stringify(this._fpverifyuserResponse));
  }

  get hintQuestion() {
    if (this._hintQuestion === null || this._hintQuestion === undefined) {
      this._hintQuestion = JSON.parse(sessionStorage.getItem('fpw.hint'));
    }
    return this._hintQuestion;
  }

  set hintQuestion(hintQuestion: string) {
    this._hintQuestion = hintQuestion ? hintQuestion : null;
    sessionStorage.setItem('fpw.hint', JSON.stringify(this._hintQuestion));
  }

  VerifyAccessCode(accesscode: any, isFWP: boolean): any {
    const generatedRequest = {
      'useridin': this.getUserId(),
      'accessCode': accesscode,
      'commType': isFWP === true ? this.fpverifyuserResponse['commType'] : this.funverifyuserResponse['commType'],
      'commValue': isFWP === true ? this.fpverifyuserResponse['commValue'] : this.funverifyuserResponse['commValue'],
      'userIdRequired': isFWP === true ? 'false' : 'true'
    };

    return this.http.post(this.constants.verifyRestAccessCodeUrl,
      this.http.handleRequest(generatedRequest));
  }


  sendfunaccesscode(isFWP: boolean) {
    const request = {
      useridin: this.getUserId(),
      commType: isFWP === true ? this.fpverifyuserResponse['commType'] : this.funverifyuserResponse['commType'],
      commValue: isFWP === true ? this.fpverifyuserResponse['commValue'] : this.funverifyuserResponse['commValue'],
      webNonMigratedUser: isFWP === true ? this.fpverifyuserResponse['webNonMigratedUser'] :
        this.funverifyuserResponse['webNonMigratedUser']
    };
    return this.http.post(this.constants.sendfunaccesscodeUrl, this.http.handleRequest(request));
  }

  hideSpinner(): void {
    this.http.hideSpinnerLoading();
  }

  clearStorage() {
    this.hintQuestion = null;
    this.fpverifyuserResponse = null;
    this.funverifyuserResponse = null;
    sessionStorage.removeItem('fpw.hint');
    sessionStorage.removeItem('fpw.fpverifyuserResponse');
    sessionStorage.removeItem('fun.funverifyuserResponse');
    sessionStorage.removeItem('isauthenticated');
    sessionStorage.removeItem('otp');
    sessionStorage.removeItem('otpsuccess');
  }
}
