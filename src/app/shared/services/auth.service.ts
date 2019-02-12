import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CryptoToken} from '../models/token.model';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import {AuthToken} from '../models/authToken';
import * as moment from 'moment';
import {RegType} from '../models/regType.enum';
import {ConstantsService} from './constants.service';
import {DependentsModelInterface} from '../../pages/myclaims/models/interfaces/dependants-model.interface';
import {DependentsResponseModel} from '../../pages/myclaims/models/dependants.model';
import {GetMemBasicInfoResponseModelInterface} from '../../pages/medications/models/interfaces/get-member-basic-info-model.interface';
import * as momentTime from 'moment-timezone';

@Injectable()
export class AuthService {
  cryptoToken: CryptoToken;
  _authToken: AuthToken;
  memAuthInfo: any;
  useridin: string;
  refreshTimer: number;
  dependentsList: DependentsModelInterface = null;
  isSubscriber = false;
  depId: number;
  tokenError = false;
  basicMemInfo: GetMemBasicInfoResponseModelInterface = null;
  authRestartScreen = '/register/register-detail';
  userState: string;

  constructor(private http: HttpClient,
              private constantService: ConstantsService
  ) {
    this.fetchSession();
    this.getTokens().subscribe(token => {
        this.cryptoToken = token;
        this.persistSession();
      },
      error => {
        // this.hideSpinnerLoading();
      });
  }

  fetchSession() {
    if ((sessionStorage['authToken'] !== undefined)
      && (sessionStorage['authToken'] !== 'undefined')) {
      this.authToken = JSON.parse(sessionStorage['authToken']);
    }
    if (sessionStorage['useridin']) {
      this.useridin = sessionStorage['useridin'];
    }
    if (sessionStorage['token']) {
      this.cryptoToken = sessionStorage['token'] !== 'undefined' ? JSON.parse(sessionStorage['token']) : null;
    }
  }

  getTokens(): Observable<any> {
    if (this.cryptoToken) {
      return Observable.of(this.cryptoToken);
    } else {
      return this.http.get(this.constantService.tokenbaseurl + this.constantService.tokensEndPoint);
    }
  }

  persistSession() {
    sessionStorage['authToken'] = JSON.stringify(this.authToken);
    sessionStorage['token'] = JSON.stringify(this.cryptoToken);
    sessionStorage['useridin'] = this.useridin;
  }

  private uuid() {
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
    if ( uuid ) {
      localStorage['browserID'] = uuid;
    }
    return uuid;
  }

  get authToken() {
    return this._authToken;
  }

  set authToken(val) {
    this._authToken = val;

    // Register timer to update token
    if (!this.refreshTimer && val && val.access_token && this.getExpAccessTokenTime() > 0) {
      this.refreshTimer = setTimeout(this.refreshToken.bind(this), this.getExpAccessTokenTime());
    }
  }

  get userRegType() {
    return this.useridin && this.useridin.indexOf('@') === -1 ? RegType.MOBILE : RegType.EMAIL;
  }


  getUpdatedTokens(): Observable<any> {
    return this.http.get(this.constantService.tokenbaseurl + this.constantService.tokensEndPoint);
  }


  isAuthenticated(): boolean {
    this.fetchSession();
    return !!this.authToken;
  }

  getScopeName(): string {
    this.fetchSession();
    return this.authToken ? this.authToken.scopename : '';
  }

  getAuthToken() {
    return this.authToken.access_token;
  }

  getRefreshToken() {
    return this.authToken ? this.authToken.refresh_token : '';
  }

  getExpAccessTokenTime() {
    const accessTokenExpires = moment(this.authToken.access_token_expires, 'YYYY-MMM-DDTHH:mm:ss.SSSZ');
    return accessTokenExpires.diff((+moment()) + 630000, 'milliseconds');
  }

  refreshToken() {
    console.log('refresh token called');
    this.refreshTimer = null;
    const body = new URLSearchParams();
    body.set('grant_type', 'refresh_token');
    body.set('refresh_token', this.getRefreshToken());
    this.getUpdatedTokens().subscribe(token => {
      // this.cryptoToken = token;
      // this.persistSession();
      if (this.authToken) {
        return this.http.post(this.constantService.refreshtokenurl, body.toString(), this.jwtContentTypeEncoded()).subscribe(res => {
          this.authToken = new AuthToken(res);
          this.authTokenInfoFromSession();
          this.persistSession();
          return this.authToken;
        });
      }
      // this.cryptoToken = token;
      // this.persistSession();
    });
  }

  authTokenInfoFromSession() {
    // reading the information from the previous session
    // which is not part of refresh token
    // like planTypes, userType, HasActivePlan
    const authTokenSession = sessionStorage.getItem('authToken');
    if (authTokenSession) {
      try {
        const authTokenSessionJson = JSON.parse(authTokenSession);
        if (authTokenSessionJson) {
          this.authToken.HasActivePlan = authTokenSessionJson.HasActivePlan;
          this.authToken.planTypes = authTokenSessionJson.planTypes;
          this.authToken.userType = authTokenSessionJson.userType;
        }
      } catch (ex) {
        // TODO
      }
    }
  }

  public jwtContentTypeEncoded() {
    // create authorization header with jwt token
    const headerJson = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + this.authToken.access_token,
      'uitxnid': 'WEB_v3.0_' + this.uuid()
    };
    const headers = new HttpHeaders(headerJson);
    return {headers: headers};
  }

  setDependentsList(dependentsList: DependentsModelInterface) {
    const temp: DependentsModelInterface = new DependentsResponseModel();
    dependentsList.dependents.forEach((element => {
      if (element.dependent.firstName) {
        element.dependent.firstName = element.dependent.firstName.replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      }

      if (element.dependent.lastName) {
        element.dependent.lastName = element.dependent.lastName.replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      }

      temp.dependents.push(element);
    }));

    this.dependentsList = temp;
    // sessionStorage.setItem('dependentsList', JSON.stringify(this.dependentsList));
  }

  getDependentsList(): DependentsModelInterface {
    if (!this.dependentsList) {
      // this.dependentsList = JSON.parse(sessionStorage.getItem('dependentsList'));
    }
    return this.dependentsList;
  }

  logout() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
    this.clearSession();
  }

  clearSession() {
    this.cryptoToken = null;
    this.authToken = null;
    this.useridin = null;
    this.dependentsList = null;
    this.tokenError = false;
    sessionStorage.clear();
    this.basicMemInfo = null;
  }

  storeUserState(userState) {
    sessionStorage['userState'] = userState;
  }

  fetchUserState() {
    return sessionStorage['userState'];
  }

  setRtmsMode() {
    window.sessionStorage.setItem('rtmsMode', 'true');

  }

  removeRtmsMode() {
    window.sessionStorage.removeItem('rtmsMode');
  }

  getRtmsMode() {
    const hour = momentTime.tz(new Date(), 'America/New_York').hour();
    const minute = momentTime.tz(new Date(), 'America/New_York').minute();
    const currentTime = parseFloat(parseFloat(`${hour}.${minute}`).toFixed(2));
    return (currentTime >= 6 && currentTime <= 20) ? true : false;
  }

  isLogin(): boolean {
    return this.authToken ? true : false;
  }

}
