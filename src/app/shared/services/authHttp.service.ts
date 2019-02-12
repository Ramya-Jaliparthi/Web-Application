import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ConstantsService } from './constants.service';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoginRequest } from '../models/loginRequest.model';
import { AuthToken } from '../models/authToken';
import { EncryptedRequest } from '../models/encryptedRequest.model';
import { AuthService } from './auth.service';
import { SpinnerService } from './spinner.service';
declare let $: any;


export interface IRequestOptions {

  headers?: HttpHeaders;
  observe?: 'body';
  params?: HttpParams;
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  body?: any;
}

export function applicationHttpClientCreator(http: HttpClient,
  authService: AuthService,
  constantService: ConstantsService,
  spinner: SpinnerService) {
  return new AuthHttp(http, authService, constantService, spinner);
}


@Injectable()
export class AuthHttp {
  api: string;

  public serviceCount: number = 0;
  spinnerStarted = false;

  // Extending the HttpClient through the Angular DI.
  public constructor(public http: HttpClient,
    public authService: AuthService,
    public constantService: ConstantsService,
    public spinner: SpinnerService
  ) {
  }

  /**
   * GET request
   * @param {string} endPoint it doesn't need / in front of the end point
   * @param {IRequestOptions} options options of the request like headers, body, etc.
   * @param {string} api use if there is needed to send request to different back-end than the default one.
   * @returns {Observable<T>}
   */
  public get<T>(endUrl: string, options?: IRequestOptions, useGlobalSpinner?: boolean): Observable<T> {
    useGlobalSpinner = this.isArgument(useGlobalSpinner);
    if (useGlobalSpinner) {
      this.showSpinnerLoading();
    }
    this.serviceCount++;
    return this.http.get<T>(endUrl, options).do(() => {
      this.serviceCount--;
      if (this.serviceCount <= 0) {
        this.hideSpinnerLoading();
      }
    }).catch(error => {
      this.handleError(error);
      return Observable.of(error.error);
    });
  }

  public postWithCallBack<T>(endUrl: string, params: Object, options?: IRequestOptions, callBackFunction?: Function): Observable<T> {
    return this.post<T>(endUrl, params, options).do(() => {
      if (callBackFunction) {
        callBackFunction();
      }
    });
  }

  /**
   * POST request
   * @param {string} endPoint end point of the api
   * @param {Object} params body of the request.
   * @param {IRequestOptions} options options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */

  public post<T>(endUrl: string, params: Object, options?: IRequestOptions, useGlobalSpinner?: boolean): Observable<T> {
    useGlobalSpinner = this.isArgument(useGlobalSpinner);
    if (useGlobalSpinner) {
      this.showSpinnerLoading();
    }
    this.serviceCount++;
    return this.http.post<T>(endUrl, params, {
      headers: this.getRequestOptionArgs(options, endUrl),
    }).do(() => {
      this.serviceCount--;
      // console.log(endPoint + ' serviceCOUNT-' +  this.serviceCount );
      if (this.serviceCount <= 0) {
        this.hideSpinnerLoading();
      }
    }).catch(error => {
      this.serviceCount--;
      if (this.serviceCount <= 0) {
        this.hideSpinnerLoading();
      }
      this.handleError(error);
      return Observable.of(error.error);
    });
    // .retry(1)
  }

  isAnyErrorModalAlreadyOpen(): boolean {
    return this.isModalOpen('tokenExpiryModal') ||
      this.isModalOpen('globalError') ||
      this.isModalOpen('internetconnection') ||
      this.isModalOpen('requestTimeoutError') ? true : false;
  }

  isModalOpen(modalId: string): boolean {
    const modal = $('#' + modalId);
    if (modal && modal[0] && modal[0].className && modal[0].className.indexOf('open') > -1) {
      return true;
    }
    return false;
  }

  showServiceErrorModalPopup(modalType: string) {
    if (!this.isAnyErrorModalAlreadyOpen()) {
      switch (modalType) {
        case 'tokenExpiryModal':
          $('#tokenExpiryModal').modal('open');
          break;
        case 'globalError':
          $('#globalError').modal('open');
          break;
        case 'internetconnection':
          $('#internetconnection').modal('open');
          break;
        case 'requestTimeoutError':
          $('#requestTimeoutError').modal('open');
          break;
      }
    }
  }

  handleError(error: HttpErrorResponse, serviceUrl?: string) {
    if (error && error.error && error.error.result === '-1') {
      this.hideSpinnerLoading();
      if (error.status === 401) {
        this.showServiceErrorModalPopup('tokenExpiryModal');
      }
    } else if (error.status === 400 && error.error && typeof error.error.result !== 'undefined') { // Added to handle 400 Status temporarily
      this.hideSpinnerLoading();
    } else if (error.status === 401) {
      this.hideSpinnerLoading();
      this.showServiceErrorModalPopup('tokenExpiryModal');
      this.authService.tokenError = true;
    } else if (error.status === 404) {
      this.hideSpinnerLoading();
      this.showServiceErrorModalPopup('globalError');
      // $('#requestTimeoutError').modal('open');
    } else if (error.status === 408) {
      this.hideSpinnerLoading();
      this.showServiceErrorModalPopup('globalError');
    } else if (error.status > 401 && error.status < 500) {
      this.hideSpinnerLoading();
    } else if (navigator.onLine === false) {
      this.hideSpinnerLoading();
      this.showServiceErrorModalPopup('internetconnection');
    } else if (error.status >= 500) {
      this.hideSpinnerLoading();
      let message = 'Oops Something went wrong. Please try again!';
      if (error && error.error && error.error.result) {
        message = message + ' (' + error.error.result + ')';
        this.CaptureAPIErrorInAdobe(
          error.status.toString(),
          error.error.result, message);
      }
      this.showServiceErrorModalPopup('requestTimeoutError');
      if ($('#timeOutErrorText') && $('#timeOutErrorText')[0]) {
        $('#timeOutErrorText')[0].innerHTML = message;
      }
    } else {
      this.hideSpinnerLoading();
      // $('#requestTimeoutError').modal('open');
      if (serviceUrl && serviceUrl.indexOf('/sso/') === -1) {
        this.showServiceErrorModalPopup('globalError');
      }
      console.log('Error from Global http', error.error);
      this.CaptureAPIErrorInAdobe(error.status.toString(),
        error.error, '');
    }
    if (error && error.error && typeof error.error === 'object') {
      error.error['error'] = true;
    }
    this.CaptureAPIErrorInAdobe(error.status.toString(),
      error.error, '');
  }

  /**
   * PUT request
   * @param {string} endPoint end point of the api
   * @param {Object} params body of the request.
   * @param {IRequestOptions} options options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */
  public put<T>(endPoint: string, params: Object, options?: IRequestOptions): Observable<T> {
    return this.http.put<T>(this.api + endPoint, params, options);
  }

  /**
   * DELETE request
   * @param {string} endPoint end point of the api
   * @param {IRequestOptions} options options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */
  public delete<T>(endPoint: string, options?: IRequestOptions): Observable<T> {
    return this.http.delete<T>(this.api + endPoint, options);
  }

  private getRequestOptionArgs(param_options, url) {
    let options;
    const apigeeUrl = environment.serviceUrl;

    if (param_options) {
      if (this.authService.isAuthenticated()) {
        param_options['Authorization'] = `Bearer ${this.authService.getAuthToken()}`;
        param_options['Content-Type'] = 'application/json';
      } else {
        param_options['Content-Type'] = 'application/json';
      }
      options = new HttpHeaders(param_options);
    } else {
      if (this.authService.isAuthenticated()) {
        options = new HttpHeaders({
          'Authorization': `Bearer ${this.authService.getAuthToken()}`,
          'Content-Type': 'application/json'
        });
        if (url && !(url.indexOf(apigeeUrl) === -1) && environment.uitxnid) {
          options = new HttpHeaders({
            'Authorization': `Bearer ${this.authService.getAuthToken()}`,
            'Content-Type': 'application/json',
            'uitxnid': 'WEB_v3.0_' + this.uuid()
          });
        }
      } else {
        options = new HttpHeaders({
          'Content-Type': 'application/json'
        });
        if (url && !(url.indexOf(apigeeUrl) === -1) && environment.uitxnid) {
          options = new HttpHeaders({
            'Content-Type': 'application/json',
            'uitxnid': 'WEB_v3.0_' + this.uuid()
          });
        }
      }
    }
    // // framing uxid for apigee URLs.
    // if (url && !(url.indexOf(apigeeUrl) === -1) && environment.uitxnid) {
    //   options['uitxnid'] = 'WEB_v3.0_' + this.uuid();
    // }
    // console.log('Final headers', url, options);
    return options;
  }

  encryptPostJwt(url: string, body: any, headers?: string, type?: string) {
    const msg = this.encryptPayload(body);
    return this.http.post(this.constantService.serviceUrl + url, JSON.stringify(msg), this.jwt())
      .pipe(map((response) => this.handleDecryptedResponse(response)));
  }


  public uuid() {
    let uuid = '', i, random;
    for (i = 0; i < 32; i++) {
      // tslint:disable-next-line:no-bitwise
      random = Math.random() * 16 | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      }
      // tslint:disable-next-line:no-bitwise
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
    }
    if (uuid) {
      localStorage['browserID'] = uuid;
    }
    return uuid;
  }


  encryptPost(url: string, body: any, headers?: string, type?: string, useGlobalSpinner?: boolean) {
    const msg = this.encryptPayload(body, false, useGlobalSpinner);

    let options = null;
    const apigeeUrl = environment.serviceUrl;
    // framing uxid for apigee URLs.
    if (!(url.indexOf(apigeeUrl) === -1) && environment.uitxnid) {
      options = {
        'uitxnid': 'WEB_v3.0_' + this.uuid()
      };
    }
    return this.post(url,
      JSON.stringify(msg), null, useGlobalSpinner)
      .map((response: HttpResponse<any>) => this.handleDecryptedResponse(response)).do((res) => {
        // this.serviceCount--; // Not needed since post method already has this
        // console.log(endPoint + ' serviceCOUNT-' +  this.serviceCount );
        // if (this.serviceCount <= 0) {
        //   this.hideSpinnerLoading();
        // }
        if (res['displaymessage'] && res['errormessage'] && res['result']) {
          console.error(res);
          this.CaptureAPIErrorInAdobe(res['result'], res['displaymessage'], res['errormessage']);
        } else {
          console.log('SUCCESS response printed from encryptpost reponse');
        }
      }).catch(error => {
        console.log('Error =' + error.error);
        this.handleError(error, url);
        return Observable.of(error.error);
      });
  }

  public CaptureAPIErrorInAdobe(result: string, displaymessage: string, errormessage: string) {
    // Declare programatically
    if ((<any>window)._waDataLayer) {
      console.log('wa data layer', (<any>window)._waDataLayer);
    } else {
      (<any>window)._waDataLayer = new Object();
      console.log('NEW wa data layer', (<any>window)._waDataLayer);
    }
    (<any>window)._waDataLayer.errormessage = errormessage;
    (<any>window)._waDataLayer.result = result;
    (<any>window)._waDataLayer.displaymessage = displaymessage;
    setTimeout(function () {
      if ((<any>window)._satellite) {
        (<any>window)._satellite.track('errormessage');
      }
    }, 3000);
    console.log('ERROR response sent to adobe', result, displaymessage, errormessage);
  }

  handleDecryptedResponse(response): Object {
    if (response && (response['message'] || response['algmsg'] || response['heqmsg'] || response['lnmessage'])) {
      return this.decryptPayload(response);
    } else {
      // console.log(response);
      return response;
    }
  }

  handleRequest(request, key2NotRequired = false, useGlobalSpinner?: boolean) {
    useGlobalSpinner = this.isArgument(useGlobalSpinner);
    if (useGlobalSpinner) {
      this.showSpinnerLoading();
    }
    return JSON.stringify(this.encryptPayload(request, key2NotRequired, useGlobalSpinner));
  }

  encryptPayload(request: object, isKey2NotReq = false, useGlobalSpinner?: boolean) {
    // Step 2 Perform Encryption
    useGlobalSpinner = this.isArgument(useGlobalSpinner);
    if (useGlobalSpinner) {
      this.showSpinnerLoading();
    }
    const encryptedRequest = new EncryptedRequest();
    // Step 3,4,5
    console.log('Request Object', JSON.stringify(request));
    encryptedRequest.generateEncryptedMessage(request, this.authService.cryptoToken, isKey2NotReq);
    return encryptedRequest;
    // return request;
  }

  decryptPayload(response) {
    const decryptedResponse = new EncryptedRequest();
    let responseMsg = {};

    if (response.message) {
      responseMsg = decryptedResponse.generateDecryptedMessage(response.message, this.authService.cryptoToken);
    }

    if (response['algmsg']) {
      responseMsg['algmsg'] = decryptedResponse.generateDecryptedMessage(response['algmsg'], this.authService.cryptoToken);
    }
    if (response['heqmsg']) {
      responseMsg['heqmsg'] = decryptedResponse.generateDecryptedMessage(response['heqmsg'], this.authService.cryptoToken);
    }
    if (response['lnmessage']) {
      responseMsg['lnmessage'] = decryptedResponse.generateDecryptedMessage(response['lnmessage'], this.authService.cryptoToken);
    }
    if (response['ssomsg']) {
      responseMsg['ssomsg'] = decryptedResponse.generateDecryptedMessage(response['ssomsg'], this.authService.cryptoToken);
    }

    // console.log('Decrypted Response', JSON.stringify(responseMsg));
    console.log('Decrypted Response', responseMsg);
    return responseMsg;
  }

  hideSpinnerLoading() {
    this.spinner.hide();
    this.spinnerStarted = false;
    sessionStorage.removeItem('spinnerStart');
    sessionStorage.removeItem('spinnerEnd');
  }

  showSpinnerLoading() {
    if (!this.spinnerStarted) {
      this.spinner.show();
      this.spinnerStarted = true;
      const num = Date.now();
      sessionStorage['spinnerStart'] = num;
      sessionStorage['spinnerEnd'] = num + environment.screenNavigationSLA;
    }
  }

  isArgument(useGlobalSpinner) {
    if (useGlobalSpinner === null || useGlobalSpinner === undefined) {
      return true;
    } else {
      return useGlobalSpinner;
    }
  }

  public jwt() {
    // create authorization header with jwt token
    const headerJson = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.authToken.access_token
    };

    const headers = new HttpHeaders(headerJson);
    return { headers: headers };
  }

  login(request: LoginRequest) {
    this.authService.useridin = (request.useridin !== null && request.useridin !== undefined) ?
      // request.useridin.toString().toLowerCase() : '';
      request.useridin.toString() : '';
    return this.authService.getTokens()
      .do(token => {
        this.authService.cryptoToken = token;
        this.authService.persistSession();
      })
      .flatMap(() => {
        return this.http.post(this.constantService.loginUserUrl, this.handleRequest(request), {
          headers: this.getRequestLoginOptionArgs(this.constantService.loginUserUrl),
        }).pipe(map((res) => {
          // Need to handle Login Data
          console.log('Login Response', res);
          this.authService.authToken = new AuthToken(res);
          this.authService.useridin = (request.useridin !== null && request.useridin !== undefined) ?
            // request.useridin.toString().toLowerCase() : '';
            request.useridin.toString() : '';
          this.authService.persistSession();
          this.hideSpinnerLoading();
          return this.authService.authToken;
        }));
      });
  }


  private getRequestLoginOptionArgs(url) {
    const options = new HttpHeaders({
      'uitxnid': 'WEB_v3.0_' + this.uuid(),
      'Content-Type': 'application/json'
    });
    // const options = new HttpHeaders();
    // options['uitxnid'] = 'WEB_v3.0_' + this.uuid();
    const apigeeUrl = environment.serviceUrl;
    // console.log('Final headers', url, options);
    return options;
  }
}
