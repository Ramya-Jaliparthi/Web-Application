import { Inject, Injectable } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { GlobalService } from '../../shared/services/global.service';

import { AuthHttp } from '../../shared/services/authHttp.service';
import { ConstantsService } from '../../shared/services/constants.service';

import { Observable } from 'rxjs/Observable';
import { MyPreferencesModel, MessageCategory, MessageCategoryItem, CommChannel } from './mypreferences.model';
import { MyPrefConst } from './mypreferences.constants';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { GetMemberProfileResponseModel, GetMemberProfileRequestModel } from '../my-profile/models/get-member-profile-request.model';
// import { Profile } from '../my-profile/profile.model';


@Injectable()
export class MyPrefService {
  rtnVal = '';
  _mypref: ReplaySubject<any>;
  Mandates: MessageCategory[] = [];
  AccountActivity: MessageCategory[] = [];
  SmartShopper: MessageCategory[] = [];
  Financials: MessageCategory[] = [];
  HealthPromo: MessageCategory[] = [];
  MyInbox: MessageCategory[] = [];
  // used when user is clicking on a check Box that requires navigation to other pages.
  commChannelBeingVerified: CommChannel;
  messageCategoryBeingVerified: MessageCategory;


  constructor(
    private http: AuthHttp,
    private constants: ConstantsService,
    private globalService: GlobalService,
    public authService: AuthService,
    private myprefconst: MyPrefConst) { }

  updatecommstatus() { }

  getcommstatus() { }

  updateswrveproperties() { }

  updateALGpreferences() { }

  fetchProfileInfo(): Observable<GetMemberProfileResponseModel> {
    const request: GetMemberProfileRequestModel = new GetMemberProfileRequestModel();
    request.useridin = this.authService.useridin;

    return this.http.post(this.constants.getmemprofile,
      this.http.handleRequest(request))
      .map(res1 => this.http.handleDecryptedResponse(res1))
      .flatMap((memberProfileResp) => {
        return Observable.of(<GetMemberProfileResponseModel>memberProfileResp);
      });
  }

  sendaccesscode() {
    const request = {
      useridin: this.authService.useridin,
      key2id: this.authService.cryptoToken.key2id
    };
    return this.http.post(this.constants.sendaccesscodeUrl, this.http.handleRequest(request));
  }

  verifyAccessCode(request) {
    const generatedRequest = {
      ...request,
      useridin: this.authService.useridin,
      key2id: this.authService.cryptoToken.key2id
    };
    return this.http.post(this.constants.verifyResetUrl,
      this.http.handleRequest(generatedRequest));
  }

  getHealthPromos(): MessageCategory[] {
    const HealthPromoRows = [
      {
        rowName: 'Total',
        rowDescription: '',
        row: [
          { 'commChannel': this.myprefconst.commChannels[3], 'checked': false, 'disabled': true },
          { 'commChannel': this.myprefconst.commChannels[2], 'checked': true, 'disabled': true },
          { 'commChannel': this.myprefconst.commChannels[1], 'checked': false, 'disabled': false }
        ]
      },
      {
        rowName: 'Message Category 1',
        rowDescription: 'Description Lorem ipsum dolor sit amet.',
        row: [
          { 'commChannel': this.myprefconst.commChannels[3], 'checked': false, 'disabled': true },
          { 'commChannel': this.myprefconst.commChannels[2], 'checked': true, 'disabled': true },
          { 'commChannel': this.myprefconst.commChannels[1], 'checked': false, 'disabled': false }
        ]
      },
      {
        rowName: 'Message Category 2',
        rowDescription: '',
        row: [
          { 'commChannel': this.myprefconst.commChannels[3], 'checked': false, 'disabled': true },
          { 'commChannel': this.myprefconst.commChannels[2], 'checked': true, 'disabled': true },
          { 'commChannel': this.myprefconst.commChannels[1], 'checked': false, 'disabled': false }
        ]
      }
    ];

    return HealthPromoRows;
  }

  setHealthPromos() {

  }

  // Utilities
  // get myPref$() {
  // return this._memberInfo.asObservable();
  // }

  fetchMyPref() {
    return this.http.get('https://testapi.io/api/sanjaipk/users');
  }

  getMyPrefNotifcationMandates(serviceResponse): MessageCategory[] {
    return this.getMyPrefNotifcationDetails(serviceResponse, 'Mandatory');
  }
  getMyPrefNotifcationAccountActivity(serviceResponse): MessageCategory[] {
    return this.getMyPrefNotifcationDetails(serviceResponse, 'Account Activity');
  }
  getMyPrefNotifcationSmartShopper(serviceResponse): MessageCategory[] {
    return this.getMyPrefNotifcationDetails(serviceResponse, 'SmartShopper');
  }
  getMyPrefNotifcationFinancials(serviceResponse): MessageCategory[] {
    return this.getMyPrefNotifcationDetails(serviceResponse, 'Financials');
  }
  getMyPrefNotifcationHealthPromo(serviceResponse): MessageCategory[] {
    return this.getMyPrefNotifcationDetails(serviceResponse, 'Healthy Updates (Promos)');
  }
  getMyPrefNotifcationMyInbox(serviceResponse): MessageCategory[] {
    return this.getMyPrefNotifcationDetails(serviceResponse, 'My Inbox');
  }

  getMyPrefNotifcationDetails(serviceResponse, screen) {
    const rtnArray: MessageCategory[] = [];
    serviceResponse.Preferences.forEach(level1Detail => {
      if (level1Detail.name === 'Notifications') {
        level1Detail.details.forEach(level2Detail => {
          if (level2Detail.name === screen) {
            // total Row
            const TotalMCRow: MessageCategoryItem[] = [];
            TotalMCRow.push(new MessageCategoryItem(this.myprefconst.commChannels[2], level2Detail.all, false));
            TotalMCRow.push(new MessageCategoryItem(this.myprefconst.commChannels[0], level2Detail.sms, false));
            TotalMCRow.push(new MessageCategoryItem(this.myprefconst.commChannels[1], level2Detail.email, false));
            rtnArray.push(new MessageCategory(level2Detail.name, TotalMCRow, ''));
            // actual categories
            level2Detail.details.forEach(item => {
              const MCRows: MessageCategoryItem[] = [];
              MCRows.push(new MessageCategoryItem(this.myprefconst.commChannels[2], item.all, false));
              MCRows.push(new MessageCategoryItem(this.myprefconst.commChannels[0], item.sms, false));
              MCRows.push(new MessageCategoryItem(this.myprefconst.commChannels[1], item.email, false));
              if (item.name === 'Message Category 2') {
                rtnArray.push(new MessageCategory(item.name, MCRows, ''));
              } else {
                rtnArray.push(new MessageCategory(item.name, MCRows, 'lorem ipsum dolor sit'));
              }
            });
          }
        });
      }
    });
    return rtnArray;
  }
}
