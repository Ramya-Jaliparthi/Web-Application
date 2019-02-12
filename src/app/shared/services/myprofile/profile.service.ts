import { Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { Observable } from 'rxjs/Observable';
import { ConstantsService } from '../constants.service';
import { AuthService } from '../auth.service';
import { AuthHttp } from '../authHttp.service';
import { GlobalService } from '../global.service';
import {
  GetMemberProfileRequestModel,
  GetMemberProfileResponseModel
} from '../../../pages/my-profile/models/get-member-profile-request.model';
import {
  UpdateMemberProfileRequestModel,
  UpdateMemberProfileResponseModel,
  UpdateHandAProfileRequestModel,
  UpdateEmailProfileRequestModel,
  UpdatePhoneProfileRequestModel,
  UpdateAddressProfileRequestModel
} from '../../../pages/my-profile/models/update-member-profile.model';
import {
  GetDemographicInfoResponseModel,
  GetDemographicInfoRequestModel
} from '../../../pages/my-profile/models/get-demographic-info.model';
import { MemberProfileGenericResponseModel, BaseDemographicInfoModel } from '../../../pages/my-profile/models/member-profile-generics.model';
import { BaseProfilesRequestModelInterface } from '../../../pages/my-profile/models/interfaces/member-profile-generics.interface';

@Injectable()
export class ProfileService {

  private profile: GetMemberProfileResponseModel;
  editAddress: boolean = false;
  editEmail: boolean = this.editEmail ? this.editEmail : false;
  editPhone: boolean = this.editPhone ? this.editPhone : false;
  editHint: boolean = false;
  maskedVerify: string = '';

  constructor(private http: AuthHttp,
    private constants: ConstantsService,
    private globalService: GlobalService,
    public authService: AuthService,
    @Inject(SESSION_STORAGE) private storage: StorageService) { }


  private modifyScopeDataInRequest(request: BaseProfilesRequestModelInterface): BaseProfilesRequestModelInterface {
    request.scope = this.deriveShortScopeNameForRealScope(request.scope);
    return request;
  }

  // https://documenter.getpostman.com/view/2915912/RWTrMbWj#6bedc4f3-42b0-4635-b6b4-3a5168528517
  getProfile() {
    return this.storage.get('memProfile');
  }

  setProfile(profile: GetMemberProfileResponseModel) {
    this.profile = profile;
    this.storage.set('memProfile', profile);
  }

  getUserRole() {
    return this.authService.authToken.scopename;
  }

  // getMemberInfo() {
  //   return this.globalService.getMemberInfo();
  // }

  fetchProfileInfo(): Observable<GetMemberProfileResponseModel> {
    this.editAddress = false;
    this.editEmail = false;
    this.editPhone = false;
    this.editHint = false;
    const request: GetMemberProfileRequestModel = new GetMemberProfileRequestModel();
    request.useridin = this.authService.useridin;

    return this.http.post(this.constants.getmemprofile,
      this.http.handleRequest(request))
      .map(res1 => this.http.handleDecryptedResponse(res1))
      .flatMap(res => {
        if (!(<GetMemberProfileResponseModel>res).useridin) {
          const errorRsp: MemberProfileGenericResponseModel = <MemberProfileGenericResponseModel>res;
          throw new Error(errorRsp.displaymessage);
        }
        return Observable.of(<GetMemberProfileResponseModel>res);
      });
  }

  getDemoGraphicInfo(): Observable<GetDemographicInfoResponseModel> {
    if (!this.profile) {
      this.profile = this.storage.get('memProfile');
    }

    const request: GetDemographicInfoRequestModel = new GetDemographicInfoRequestModel();
    request.useridin = this.profile.useridin;

    return this.http.post(this.constants.getDemoGraphicInfo,
      this.http.handleRequest(request))
      .map(encryptedResp => {
        return this.http.handleDecryptedResponse(encryptedResp);
      })
      .flatMap(demographicInfoResponse => {
        if (!(<GetDemographicInfoResponseModel>demographicInfoResponse).useridin) {
          const errorRsp: MemberProfileGenericResponseModel = <MemberProfileGenericResponseModel>demographicInfoResponse;
          throw new Error(errorRsp.errormessage);
        }
        return Observable.of(<GetDemographicInfoResponseModel>demographicInfoResponse);
      });
  }

  // sendaccesscode() {
  //   const request = {
  //     useridin: this.authService.useridin,
  //     key2id: this.authService.cryptoToken.key2id
  //   };
  //   return this.http.post(this.constants.sendaccesscodeUrl, this.http.handleRequest(request));
  //   // return this.globalService.sendaccesscode();
  // }

  verifyAccessCode(request) {
    const generatedRequest = {
      ...request,
      useridin: this.authService.useridin,
      key2id: this.authService.cryptoToken.key2id
    };
    return this.http.post(this.constants.verifyResetUrl,
      this.http.handleRequest(generatedRequest));
  }

  updatePassword(request): Observable<UpdateMemberProfileResponseModel> {
    let updatePasswordReq: UpdateMemberProfileRequestModel;
    updatePasswordReq = Object.assign(request, {
      useridin: this.authService.useridin,
      userState: this.authService.authToken.scopename// this.getProfile().userState // this.authService.authToken.scopename
    });
    // commented this as this is not avail in swagger..
    // key2id: this.authService.cryptoToken.key2id
    return <Observable<UpdateMemberProfileResponseModel>>this.http.post(this.constants.changepassword,
      this.http.handleRequest(updatePasswordReq));
  }

  updateProfile(updateProfileObj: UpdateMemberProfileRequestModel,
    editAddress, editEmail, editPhone, editHint): Observable<UpdateMemberProfileResponseModel> {
    // const updateProfileRequest = {
    //   memobject: Profile.getMemObject(updateProfileObj),
    //   useridin: this.authService.useridin
    // };
    const updateHandAProfileRequestModel = new UpdateHandAProfileRequestModel();
    const updateEmailProfileRequestModel = new UpdateEmailProfileRequestModel();
    const updatePhoneProfileRequestModel = new UpdatePhoneProfileRequestModel();
    const updateAddressProfileRequestModel = new UpdateAddressProfileRequestModel();

    // do data massaging:
    if (editAddress) {
      updateAddressProfileRequestModel.useridin = updateProfileObj.useridin;
      updateAddressProfileRequestModel.address1 = updateProfileObj.address1;
      updateAddressProfileRequestModel.address2 = updateProfileObj.address2;
      updateAddressProfileRequestModel.city = updateProfileObj.city;
      updateAddressProfileRequestModel.state = updateProfileObj.state;
      updateAddressProfileRequestModel.zip = updateProfileObj.zip;

      // updateAddressProfileRequestModel = <UpdateAddressProfileRequestModel>
      // this.modifyScopeDataInRequest(updateAddressProfileRequestModel);
      return <Observable<UpdateMemberProfileResponseModel>>this.http.post(this.constants.updatememprofile,
        this.http.handleRequest(updateAddressProfileRequestModel));
    }
    if (editEmail) {
      updateEmailProfileRequestModel.useridin = updateProfileObj.useridin;
      updateEmailProfileRequestModel.emailAddress = updateProfileObj.emailAddress;

      // updateEmailProfileRequestModel = <UpdateEmailProfileRequestModel>this.modifyScopeDataInRequest(updateEmailProfileRequestModel);
      return <Observable<UpdateMemberProfileResponseModel>>this.http.post(this.constants.updatememprofile,
        this.http.handleRequest(updateEmailProfileRequestModel));
    }
    if (editPhone) {
      updatePhoneProfileRequestModel.useridin = updateProfileObj.useridin;
      updatePhoneProfileRequestModel.phoneNumber = updateProfileObj.phoneNumber;
      updatePhoneProfileRequestModel.phoneType = updateProfileObj.phoneType;

      // updatePhoneProfileRequestModel = <UpdatePhoneProfileRequestModel>this.modifyScopeDataInRequest(updatePhoneProfileRequestModel);
      return <Observable<UpdateMemberProfileResponseModel>>this.http.post(this.constants.updatememprofile,
        this.http.handleRequest(updatePhoneProfileRequestModel));
    }
    if (editHint) {
      updateHandAProfileRequestModel.useridin = updateProfileObj.useridin;
      updateHandAProfileRequestModel.hintAnswer = updateProfileObj.hintAnswer;
      updateHandAProfileRequestModel.hintQuestion = updateProfileObj.hintQuestion;

      // updateHandAProfileRequestModel = <UpdateHandAProfileRequestModel>this.modifyScopeDataInRequest(updateHandAProfileRequestModel);
      return <Observable<UpdateMemberProfileResponseModel>>this.http.post(this.constants.updatememprofile,
        this.http.handleRequest(updateHandAProfileRequestModel));
    }

    /*
    1. Update Address:
    {
      "useridin":"sandytest239@mailinator.com",
      "address1":"1 Enterprise Dr",
      "address2":"BCBS MA Office",
      "city":"QUINCY",
      "state":"MA",
      "zip":"02171"
    }
    2. Update Mobile Phone Number:
    {
      "useridin":"sandytest239@mailinator.com",
      "phoneNumber":"6787758809",
      "phoneType":"MOBILE"
    }
    3. Update HintQuetison and Answer
    {
      "useridin":"sandytest239@mailinator.com",
      "hintQuestion":"What is your favorite car?",
      "hintAnswer":"BMW"
    }
    4.Update Email Address
    {
      "useridin":"sandytest239@mailinator.com",
      "emailAddress":"sandytest239@mailinator.com"
    }
    */

    // return <Observable<UpdateMemberProfileResponseModel>>this.http.post(this.constants.updatememprofile,
    //   this.http.handleRequest(updateProfileObj));
  }

  updateDemographicInfo(demographicInfoRequest: BaseDemographicInfoModel): Observable<GetDemographicInfoResponseModel> {
    // demographicInfoRequest = <GetDemographicInfoRequestModel>this.modifyScopeDataInRequest(demographicInfoRequest);
    return <Observable<GetDemographicInfoResponseModel>>this.http.post(this.constants.updateDemographicInfoUrl,
      this.http.handleRequest(demographicInfoRequest));
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

  public deriveShortScopeNameForRealScope(scope): string {
    const shortScope = {
      'REGISTERED-NOT-VERIFIED': 'RNV',
      'REGISTERED-AND-VERIFIED': 'RV',
      'AUTHENTICATED-NOT-VERIFIED': 'ANV',
      'AUTHENTICATED-AND-VERIFIED': 'AV'
    };
    return shortScope[scope];
  }

  sendUpdateNotification(request) {
    return this.http.post(this.constants.sendUpdateNotification, this.http.handleRequest(request));
  }

  public updateCommChannel(updateCommChannelReqParams) {
    return <Observable<UpdateMemberProfileResponseModel>>this.http.post(this.constants.updatememprofile,
      this.http.handleRequest(updateCommChannelReqParams));
  }
}
