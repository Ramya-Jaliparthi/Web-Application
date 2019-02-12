import { Injectable } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { GlobalService } from '../../shared/services/global.service';
import { updatessnModel } from '../../shared/models/updatessn.model';
import { RegisterRequest } from '../../shared/models/registerRequest.model';
import { MemauthRequest } from '../../shared/models/memauthRequest.model';
import { AuthHttp } from '../../shared/services/authHttp.service';
import { ConstantsService } from '../../shared/services/constants.service';
import { updatestudentidModel } from '../../shared/models/updatestudentid.model';
import {AlertType} from '../../shared/alerts/alertType.model';
import {AlertService} from '../../shared/services/alert.service';
import {ValidationService} from '../../shared/services/validation.service';
import {Observable} from 'rxjs/Observable';
import {GetMemberProfileResponseModel} from '../my-profile/models/get-member-profile-request.model';
import {ProfileService} from '../../shared/services/myprofile/profile.service';
import {Router} from '@angular/router';

@Injectable()
export class RegistrationService {

  mobileNumberRegex = new RegExp('^[0-9]{10}');
  constructor(private authService: AuthService,
    private http: AuthHttp,
    private constants: ConstantsService,
    private validationService: ValidationService,
    private profileService: ProfileService,
    private alertService: AlertService,
    private router: Router,
    private globalService: GlobalService) {
  }

  register(request: RegisterRequest) {
    this.authService.cryptoToken = null;
    return this.authService.getTokens()
      .do(token => {
        this.authService.cryptoToken = token;
        this.authService.persistSession();
      })
      .flatMap(() => {
        return this.http.post(this.constants.registerUserUrl, this.http.handleRequest(request, true));
      });
  }

  updateMemAuthInfo(request) {
    const generatedRequest = {
      ...request,
      useridin: this.authService.useridin
    };

    console.log('Update mem auth info ', generatedRequest);
    return this.http.post(this.constants.updateMemAuthInfoUrl, this.http.handleRequest(generatedRequest));
  }

  authWithSSN(request: updatessnModel) {
    const generatedRequest = {
      ssn: 'XXXXX' + request.ssn,
      useridin: this.authService.useridin
    };
    return this.http.post(this.constants.authWithSsnUrl, this.http.handleRequest(generatedRequest));
  }

  VerifyAccessCode(request: MemauthRequest, isWebUser) {
    let generatedRequest;
    if (isWebUser) {
      generatedRequest = {
        ...request,
        useridin: this.authService.useridin,
        userIDToVerify: this.authService.useridin
      };
    } else {
      generatedRequest = {
        accesscode: request.accesscode,
        useridin: this.authService.useridin,
      };
    }
    let url = this.constants.verifyAccessCodeUrl;
    if (this.authService.authToken && this.authService.authToken.scopename &&
      (this.authService.authToken.scopename === 'REGISTERED-AND-VERIFIED' || this.authService.authToken.scopename === 'AUTHENTICATED-AND-VERIFIED')) {
      url =  this.constants.verfiyCommChlAccesscode;
      generatedRequest = {
        useridin: this.authService.useridin,
        mobile: this.authService.useridin.indexOf('@') === -1 ? this.authService.useridin : '',
        userIDToVerify: this.authService.useridin,
        accesscode: request.accesscode
      };
      if (this.authService.useridin.indexOf('@') !== -1) {
        generatedRequest['email'] = this.authService.useridin;
      }
    }
    return this.http.post(url, this.http.handleRequest(generatedRequest));
  }

  handleError(response, errorCodes = null, errorMsg?: boolean) {
    this.globalService.handleError(response, errorCodes, errorMsg);
  }

  sendaccesscode(requestData?, webUser?, resend?) {
    let request;
    if (webUser) {
      request = {
        ...requestData,
        useridin: this.authService.useridin,
        userIDToVerify: this.authService.useridin
      };
    } else {
      request = {
        useridin: this.authService.useridin
      };
    }
    if (resend) {
      request = {
        ...requestData,
        editCommChannel : 'true'
      };
    }
    let url = this.constants.sendaccesscodeUrl;
    if (this.authService.authToken && this.authService.authToken.scopename &&
      (this.authService.authToken.scopename === 'REGISTERED-AND-VERIFIED' || this.authService.authToken.scopename === 'AUTHENTICATED-AND-VERIFIED')) {
      url =  this.constants.sendCommChlAccesscode;
      request = {
        useridin: this.authService.useridin,
        mobile: this.authService.useridin.indexOf('@') === -1 ? this.authService.useridin : '',
        userIDToVerify: this.authService.useridin
      };
      if (this.authService.useridin.indexOf('@') !== -1) {
        request['email'] = this.authService.useridin;
      }
    }

    return this.http.post(url , this.http.handleRequest(request));
  }

  authStudentID(request: updatestudentidModel) {
    const studentIdRequest = {
      studentid: request.studentid,
      useridin: this.authService.useridin
    };
    return this.http.post(this.constants.authStudentIDUrl, this.http.handleRequest(studentIdRequest));
  }

  authWithLn() {
    const generatedRequest = {
      useridin: this.authService.useridin
    };
    return this.http.post(this.constants.authLnUrl, this.http.handleRequest(generatedRequest));
  }


  postLnAnswers(generatedRequest) {
    return this.http.post(this.constants.validateLnAnsUrl, this.http.handleRequest(generatedRequest));
  }



  redirectToVerification() {
    if (this.isUsedIdValidEmailOrPhoneNumber()) {
      const requestedData = {
        commChannel: this.authService.useridin
      };
      this.sendaccesscode(requestedData, false).subscribe( (res) => {
        this.redirectToVerificationScreen(res);
      });
    } else {
      this.getMemberProfile().subscribe(profile => {
        this.sendaccesscode(this.getRequestedData(profile), true).subscribe((res) => {
          this.redirectToVerificationScreen(res);
        });
      }, (err) => {
        this.alertService.setAlert(err.message, '', AlertType.Failure);
      });
    }
    sessionStorage.setItem('accesscode', 'true');
  }

  redirectToVerificationScreen(res?) {
    this.router.navigate(['/register/verifyaccesscode']).then( () => {
      if (res && res['result'] && res['result'].toString() === '0') {
        const communicationChannel = this.http.handleDecryptedResponse(res);
        sessionStorage.setItem('sendCodeRes', JSON.stringify(communicationChannel));
        this.alertService.setAlert('Verification code sent!', '', AlertType.Success);
      } else {
        this.alertService.setAlert(res['displaymessage'], '', AlertType.Failure);
      }
    });
  }


  getRequestedData(profile) {
    if (profile.phoneNumber) {
      return {
        commChannel: profile.phoneNumber,
        commChannelType: 'MOBILE'
      };
    } else {
      return {
        commChannel: profile.emailAddress,
        commChannelType: 'EMAIL'
      };
    }
  }

  isUsedIdValidEmailOrPhoneNumber() {
    const userId = this.authService.useridin;
    const emailRegex = new RegExp(this.validationService.emailRegex);
    return emailRegex.test(userId) || this.mobileNumberRegex.test(userId);
  }

  getMemberProfile(): Observable<GetMemberProfileResponseModel> {
    let profile: GetMemberProfileResponseModel;
    profile = this.profileService.getProfile();
    if (<GetMemberProfileResponseModel>profile) {
      return Observable.of(profile);
    } else {
      return this.profileService.fetchProfileInfo().do((res: GetMemberProfileResponseModel) => {
        if (<GetMemberProfileResponseModel>res) {
          this.profileService.setProfile(res);
        }
      });
    }
  }
}
