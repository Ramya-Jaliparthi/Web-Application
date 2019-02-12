import { AuthHttp } from './../../shared/services/authHttp.service';
import { Injectable } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { ConstantsService } from '../../shared/shared.module';

@Injectable()
export class MigrationService {
  public useSendCommChannel: boolean = false;
  private memacctmergerequest = null;

  public getMemacctmergerequest() {
    if (sessionStorage.getItem('migrationReq')) {
      return JSON.parse(sessionStorage.getItem('migrationReq'));
    } else {
      sessionStorage.setItem('migrationReq', JSON.stringify(this.memacctmergerequest));
    }
    return this.memacctmergerequest;
  }

  public setMemacctmergerequest(memacctmergerequest): void {
    sessionStorage.setItem('migrationReq', JSON.stringify(memacctmergerequest));
    this.memacctmergerequest = memacctmergerequest;
  }

  constructor(private http: AuthHttp,
    private authService: AuthService,
    private constants: ConstantsService) { }

  sendaccesscode(email, userIdToVerify, editAndResend?, requestObj?) {
    let request = {
      'useridin': this.authService.useridin,
      'commChannel': email,
      'commChannelType': 'EMAIL',
      'userIDToVerify': userIdToVerify
    };
    if (editAndResend) {
      request = {
        ...requestObj,
        editCommChannel: 'true'
      };
    }
    return this.http.post(this.constants.sendaccesscodeUrl, this.http.handleRequest(request));
  }

  sendcommchlaccesscode(email, userIdToVerify, editAndResend?) {
    const request = {
      useridin: this.authService.useridin,
      email: email,
      mobile: '',
      userIDToVerify: JSON.parse(sessionStorage.getItem('migrationReq'))['selectedUserId'] ? JSON.parse(sessionStorage.getItem('migrationReq'))['selectedUserId']
        : userIdToVerify
    };
    if (editAndResend) {
      request['editCommChannel'] = 'true';
    }
    return this.http.post(this.constants.sendCommChlAccesscode, this.http.handleRequest(request));
  }

  VerifyAccessCode(accesscode) {
    const userIDToVerify = this.memacctmergerequest.selectedUserId;
    const email = this.memacctmergerequest.emailAddress;
    const generatedRequest = {
      'useridin': this.authService.useridin,
      'commChannel': email,
      'commChannelType': 'EMAIL',
      'userIDToVerify': userIDToVerify,
      'accesscode': accesscode
    }; // as per meeting on august 15th workshop

    return this.http.post(this.constants.verifyAccessCodeUrl,
      this.http.handleRequest(generatedRequest));
  }

  VerifyCommChlAccCode(accesscode) {
    const userIDToVerify = this.memacctmergerequest.selectedUserId;
    const email = this.memacctmergerequest.emailAddress;
    const generatedRequest = {
      'useridin': this.authService.useridin,
      'email': email,
      'mobile': '',
      'userIDToVerify': userIDToVerify,
      'accesscode': accesscode
    };  // as per meeting on august 15th workshop

    return this.http.post(this.constants.verfiyCommChlAccesscode,
      this.http.handleRequest(generatedRequest));
  }

  membermigration() {
    const request = { 'useridin': this.authService.useridin };
    return this.http.post(this.constants.memlookupUrl, this.http.handleRequest(request))
      .map(res1 => this.http.handleDecryptedResponse(res1));
  }

  savePageUrl(url: string, selectedId: string) {
    const requestPayload = {
      useridin: this.authService.useridin,
      linkinfo: url,
      selecteduserid: selectedId
    };
    return this.http.post(this.constants.postdesinfoUrl,
      this.http.handleRequest(requestPayload));
  }

  migrationrequest(
    selectedUserId, selectedUserIdType, selectedUserScope,
    webUserID, appUserIDs,
    emailAddress,
    hintQuestion, hintAnswer, password) {

    const migrationtype = this.authService.authToken.migrationtype;
    const useridin = this.authService.useridin;
    const migrationRequestMap = {
      'SINGLE-WEB': {
        'useridin': useridin,
        'selectedUserId': selectedUserId,
        'selectedUserIdType': 'WEB', // always it will be WEB.
        'selectedUserScope': selectedUserScope,
        'webUserID': webUserID, // same as selected user id
        'appUserIDs': [], // will be always empty
        'emailAddress': emailAddress, // will be entered in 1st screen
        'hintQuestion': hintQuestion, // will be selected in 1st screen
        'hintAnswer': hintAnswer, // will be entered in 1st screen
        'password': password // will be from the update password screen
      },
      'SINGLE-APP': {
        'useridin': useridin,
        'selectedUserId': selectedUserId,
        'selectedUserIdType': 'APP', // will be always APP
        'selectedUserScope': selectedUserScope,
        'webUserID': '', // will be empty only
        'appUserIDs': appUserIDs, // will be array with single value only
        'emailAddress': emailAddress, // will be selected by user in 1st screen
        'hintQuestion': hintQuestion, // will be selected by user in 1st screen
        'hintAnswer': hintAnswer, // will be entered by user in 1st screen
        'password': password  // will be from login module.
      },
      'MULTIPLE-APP': {
        'useridin': useridin,
        'selectedUserId': selectedUserId,
        'selectedUserIdType': 'APP', // will be always APP
        'selectedUserScope': selectedUserScope,
        'webUserID': '', // will be empty only
        'appUserIDs': appUserIDs, // will be array with multiple values
        'emailAddress': emailAddress, // will be selected by user in 1st screen
        'hintQuestion': hintQuestion, // will be selected by user in 1st screen
        'hintAnswer': hintAnswer, // will be entered by user in 1st screen
        'password': password  // will be from login module.
      },
      'SINGLE-WEB-SINGLE-APP': {
        'useridin': useridin,
        'selectedUserId': selectedUserId,
        'selectedUserIdType': selectedUserIdType,
        'selectedUserScope': selectedUserScope,
        'webUserID': webUserID,
        'appUserIDs': appUserIDs, // will be array with single value
        'emailAddress': emailAddress, // will be selected by user in 1st screen
        'hintQuestion': hintQuestion, // will be selected by user in 1st screen
        'hintAnswer': hintAnswer, // will be entered by user in 1st screen
        'password': password  // will be from login module or new screen?
      },
      'SINGLE-WEB-MULTIPLE-APP': {
        'useridin': useridin,
        'selectedUserId': selectedUserId,
        'selectedUserIdType': selectedUserIdType,
        'selectedUserScope': selectedUserScope,
        'webUserID': webUserID,
        'appUserIDs': appUserIDs, // will be array with single value
        'emailAddress': emailAddress, // will be selected by user in 1st screen
        'hintQuestion': hintQuestion, // will be selected by user in 1st screen
        'hintAnswer': hintAnswer, // will be entered by user in 1st screen
        'password': password  // will be from login module or new screen?
      },
      'NONE': ''
    };
    const req = migrationRequestMap[migrationtype];
    console.log('member migration request framed is for ' + migrationtype + ' ----- ', req);

    console.log('migration request', sessionStorage.getItem('migrationReq'));
    if (req !== '') {
      // this.migrationcall(migrationRequestMap[migrationtype]);
    }
    return req;
  }

  public migrationcall(request) {
    return this.http.post(this.constants.memacctmergeUrl,
      this.http.handleRequest(request)).map(res1 => this.http.handleDecryptedResponse(res1));

  }

  sendUpdateNotification(request) {
    return this.http.post(this.constants.sendUpdateNotification, this.http.handleRequest(request));
  }

}
