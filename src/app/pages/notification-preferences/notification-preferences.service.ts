import { Inject, Injectable } from '@angular/core';
import { AuthHttp } from '../../shared/services/authHttp.service';
import { ConstantsService } from '../../shared/services/constants.service';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../shared/services/auth.service';
import { GlobalService } from '../../shared/services/global.service';
import { environment } from '../../../environments/environment';
import { CommStatusModel } from '../../shared/models/commStatusModel';

@Injectable()
export class NotificationPreferencesService {
  serviceResponse: any;
  commStatusDetails: any;
  maskedVerify: string = '';
  editEmail: boolean = false;
  editPhone: boolean = false;

  constructor(private http: AuthHttp,
    private constants: ConstantsService,
    public authService: AuthService) { }

  getcommStatus(): any {
    const request = {
      useridin: this.authService.useridin
    };
    return this.http.encryptPost(this.constants.getCommPreferenceUrl, request, null, null, false);
  }

  updateCommStatus(request) {
    const generatedRequest = {
      ...request,
      useridin: this.authService.useridin
    };

    console.log('Update preferences ', generatedRequest);
    return this.http.post(this.constants.updateCommPreferenceUrl, this.http.handleRequest(generatedRequest));
  }
  VerifyAccessCode(accesscode, commChannelType, commChannel) {
    /*
    {
      'useridin': 'string',
      'commChannel': 'string',
      'commChannelType': 'MOBILE',
      'userIDToVerify': 'string',
      'accessCode': 'string'
    }
    */
    const generatedRequest = {
      'useridin': this.authService.useridin,
      'commChannel': commChannel,
      'commChannelType': commChannelType,
      'userIDToVerify': this.authService.useridin,
      'accesscode': accesscode
    };

    return this.http.post(this.constants.verifyAccessCodeUrl,
      this.http.handleRequest(generatedRequest));
  }

  VerifyCommChlAccCode(accesscode, email, mobile) {
    /*
      {
        'useridin': 'string',
        'email': 'string',
        'mobile': 'string',
        'userIDToVerify': 'string',
        'accessCode': 'string'
      }
    */
    const generatedRequest = {
      'useridin': this.authService.useridin,
      'email': email,
      'mobile': mobile,
      'userIDToVerify': this.authService.useridin,
      'accesscode': accesscode
    };

    return this.http.post(this.constants.verfiyCommChlAccesscode,
      this.http.handleRequest(generatedRequest));
  }


  sendaccesscode(commChannelType, commChannel) {
    /*
        {
          'useridin': 'string',
          'commChannel': 'string',
          'commChannelType': 'MOBILE',
          'userIDToVerify': 'string'
        }*/
    const request = {
      'useridin': this.authService.useridin,
      'commChannel': commChannel,
      'commChannelType': commChannelType,
      'userIDToVerify': this.authService.useridin
    };
    return this.http.post(this.constants.sendaccesscodeUrl, this.http.handleRequest(request));
    // return this.globalService.sendaccesscode();
  }

  sendcommchlaccesscode(email, mobile) {
    /*
    https://app.swaggerhub.com/apis/web-API-team/web-3_0_common_api_documentation/1.0.0#/default/sendcommchlacccode
      {
  'useridin': 'string',
  'email': 'string',
  'mobile': 'string',
  'userIDToVerify': 'string'
  }
    */
    const request = {
      useridin: this.authService.useridin,
      email: email,
      mobile: mobile,
      userIDToVerify: this.authService.useridin
    };
    return this.http.post(this.constants.sendCommChlAccesscode, this.http.handleRequest(request));
    // return this.globalService.sendaccesscode();
  }

}
