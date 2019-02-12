import { Component, OnDestroy, OnInit, ViewChild, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSelectionList, MatSelectionListChange } from '@angular/material';
import { MessageCategoryItem, MessageCategory, CommChannel } from '../mypreferences.model';
import { MyPrefConst } from '../mypreferences.constants';
import { MyPrefService } from '../mypreferences.service';
import { AlertService } from '../../../shared/shared.module';
import { AlertType } from '../../../shared/alerts/alertType.model';
// import { Profile } from '../../my-profile/profile.model';

@Component({
  selector: 'app-healthipdatespromos',
  templateUrl: './notification-detail.component.html',
  styleUrls: ['./notification-detail.component.scss']
})
export class NotificationDetailComponent implements OnInit, OnDestroy {
  HealthCategoryItem: MessageCategoryItem;
  HealthPromoRows: MessageCategory[] = [];
  HealthPromoTotalRow: MessageCategory;
  isCheckBoxedDisabledDueToGlobalLevel: boolean;
  isOptionalPref: boolean;
  title: string;
  test = true;
  chkBox = false;
  value = 'accd';
  // tslint:disable-next-line:max-line-length
  noVerifiedMobile = '<b>You cannot receive any email notifications until you  <a href="/mypreferences/verify" class="link-error"> verify your email. </a></b>';
  noVerifiedEmail = '<b>You cannot enable any text notifications until you <a href="/mypreferences/verify" class="link-error"> verify your phone number. </a></b>';

  constructor(
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private myprefservice: MyPrefService,
    private myPrefConstants: MyPrefConst
  ) {
    this.initializeHealthPromoMatrix();
  }

  getTotalRowElements() {
    if (this.HealthPromoRows.length > 0) {
      return this.HealthPromoRows[0].row;
    } else {
      return [];
    }
  }
  ngOnDestroy() {
    this.alertService.clearError();
  }

  ngOnInit() {
    this.alertService.clearError();
  }

  showAlertMessage(msg) {
    this.alertService.setAlert(msg, '', AlertType.Notification);
  }

  OnSubmit() {
    this.displayMatrix('OnSubmit');
    this.alertService.setAlert('<b>Your preferences have been saved!</b>',
      '',
      AlertType.Success);
    window.scroll(0, 0);
  }

  OnCancel() {
    this.displayMatrix('OnSubmit');
    this.alertService.clearError();
    this.router.navigate(['/mypreferences']);
  }

  displayMatrix(msg) {
    this.HealthPromoRows.forEach(messageCat => {
      console.log(messageCat.rowName + ': ' +
        '\t\t All:' + this.getValueByChannel(messageCat, this.myPrefConstants.commChannels[2].name) +
        '\t\t SMS:' + this.getValueByChannel(messageCat, this.myPrefConstants.commChannels[0].name) +
        '\t\t Email:' + this.getValueByChannel(messageCat, this.myPrefConstants.commChannels[1].name));
    });
  }

  reCalculateMatrix() {
    let calValueSMS, calValueEmail: boolean;
    // this.displayMatrix('before reclauation');
    if (this.HealthPromoRows.length > 1) {
      calValueSMS = this.getValueByChannel(this.HealthPromoRows[1], this.myPrefConstants.commChannels[0].name);
      calValueEmail = this.getValueByChannel(this.HealthPromoRows[1], this.myPrefConstants.commChannels[1].name);
      this.HealthPromoRows.forEach(messageCat => {
        if (messageCat.rowName !== this.HealthPromoRows[0].rowName) {
          messageCat.row.forEach(rowItem => {
            if (rowItem.commChannel === this.myPrefConstants.commChannels[0]) {
              calValueSMS = calValueSMS && rowItem.checked;
            }
            if (rowItem.commChannel === this.myPrefConstants.commChannels[1]) { calValueEmail = calValueEmail && rowItem.checked; }
          });
          // message category all
          this.setValueByChannel(messageCat, this.myPrefConstants.commChannels[2].name,
            this.getValueByChannel(messageCat, this.myPrefConstants.commChannels[1].name)
            && this.getValueByChannel(messageCat, this.myPrefConstants.commChannels[0].name));
        }
      });
      this.setValueByChannel(this.HealthPromoRows[0], this.myPrefConstants.commChannels[0].name, calValueSMS);
      this.setValueByChannel(this.HealthPromoRows[0], this.myPrefConstants.commChannels[1].name, calValueEmail);
    }

    // overall All
    this.setValueByChannel(this.HealthPromoRows[0], this.myPrefConstants.commChannels[2].name,
      this.getValueByChannel(this.HealthPromoRows[0], this.myPrefConstants.commChannels[1].name)
      && this.getValueByChannel(this.HealthPromoRows[0], this.myPrefConstants.commChannels[0].name));
  }

  showDescription(row) {
    // tslint:disable-next-line:max-line-length
    let rtnValue = this.getValueByChannel(row, this.myPrefConstants.commChannels[1].name);
    rtnValue = rtnValue || this.getValueByChannel(row, this.myPrefConstants.commChannels[0].name);
    rtnValue = rtnValue && this.isOptionalPref;
    return rtnValue;
  }

  adjustMatrix(isAllChanged) {
    if (this.HealthPromoRows.length > 1) {

      if (isAllChanged) {
        this.setValueByChannel(this.HealthPromoRows[0], this.myPrefConstants.commChannels[1].name,
          this.getValueByChannel(this.HealthPromoRows[0], this.myPrefConstants.commChannels[2].name));
        this.setValueByChannel(this.HealthPromoRows[0], this.myPrefConstants.commChannels[0].name,
          this.getValueByChannel(this.HealthPromoRows[0], this.myPrefConstants.commChannels[2].name));
      }
      // this.displayMatrix('master row adjuested');
      this.HealthPromoRows.forEach(messageCat => {
        if (messageCat.rowName !== this.HealthPromoRows[0].rowName) {
          messageCat.row.forEach(rowItem => {
            if (rowItem.commChannel === this.myPrefConstants.commChannels[0]) {
              this.setValueByChannel(messageCat, this.myPrefConstants.commChannels[0].name,
                this.getValueByChannel(this.HealthPromoRows[0], this.myPrefConstants.commChannels[0].name));
            }
            if (rowItem.commChannel === this.myPrefConstants.commChannels[1]) {
              this.setValueByChannel(messageCat, this.myPrefConstants.commChannels[1].name,
                this.getValueByChannel(this.HealthPromoRows[0], this.myPrefConstants.commChannels[1].name));
            }
          });
          // message category all
          this.setValueByChannel(messageCat, this.myPrefConstants.commChannels[2].name,
            this.getValueByChannel(messageCat, this.myPrefConstants.commChannels[1].name)
            && this.getValueByChannel(messageCat, this.myPrefConstants.commChannels[0].name));
        }
      });
    }
  }

  initializeHealthPromoMatrix() {
    this.myprefservice.fetchMyPref().subscribe(resp => {
      switch (this.route.snapshot.url.toString()) { // TODO change to params
        case 'mandatory':
          this.HealthPromoRows = this.myprefservice.getMyPrefNotifcationMandates(resp);
          this.title = 'Mandatory Notification Preferences';
          // tslint:disable-next-line:max-line-length
          this.isCheckBoxedDisabledDueToGlobalLevel = true;
          this.isOptionalPref = false;
          break;
        case 'accountActivity':
          this.HealthPromoRows = this.myprefservice.getMyPrefNotifcationAccountActivity(resp);
          this.title = 'Account Activity Notification Preferences';
          // tslint:disable-next-line:max-line-length
          this.isCheckBoxedDisabledDueToGlobalLevel = !this.getValueByChannel(this.HealthPromoRows[0], this.myPrefConstants.commChannels[2].name);
          this.isOptionalPref = false;
          break;
        case 'smartshopper':
          this.HealthPromoRows = this.myprefservice.getMyPrefNotifcationSmartShopper(resp);
          this.title = 'SmartShopper Notification Preferences';
          // tslint:disable-next-line:max-line-length
          this.isCheckBoxedDisabledDueToGlobalLevel = !this.getValueByChannel(this.HealthPromoRows[0], this.myPrefConstants.commChannels[2].name);
          this.isOptionalPref = false;
          break;
        case 'financials':
          this.HealthPromoRows = this.myprefservice.getMyPrefNotifcationFinancials(resp);
          this.title = 'Financial Notification Preferences';
          // tslint:disable-next-line:max-line-length
          this.isCheckBoxedDisabledDueToGlobalLevel = !this.getValueByChannel(this.HealthPromoRows[0], this.myPrefConstants.commChannels[2].name);
          this.chkBox = true;
          this.isOptionalPref = true;
          break;
        case 'healthyUpdates':
          this.HealthPromoRows = this.myprefservice.getMyPrefNotifcationHealthPromo(resp);
          this.title = 'Healthy Updates (Promos) Notification Preferences';
          this.chkBox = true;
          // tslint:disable-next-line:max-line-length
          this.isCheckBoxedDisabledDueToGlobalLevel = !this.getValueByChannel(this.HealthPromoRows[0], this.myPrefConstants.commChannels[2].name);
          this.isOptionalPref = true;
          break;
        case 'myinbox':
          this.HealthPromoRows = this.myprefservice.getMyPrefNotifcationHealthPromo(resp);
          this.title = 'My Inbox Notification Preferences';
          this.chkBox = true;
          // tslint:disable-next-line:max-line-length
          this.isCheckBoxedDisabledDueToGlobalLevel = !this.getValueByChannel(this.HealthPromoRows[0], this.myPrefConstants.commChannels[2].name);
          this.isOptionalPref = true;
          break;
        default:
          break;
      }
      // get profile details
      this.myprefservice.fetchProfileInfo().subscribe(profile => {
        if (profile) {
          this.myPrefConstants.commChannels[1].isVerified = profile.isVerifiedEmail;// emailAddressConfirmed;
          this.myPrefConstants.commChannels[0].isVerified = profile.isVerifiedMobile; // mobileNumberConfirmed;
          this.myPrefConstants.commChannels[1].onFile = profile.emailAddress ? true : false;
          this.myPrefConstants.commChannels[0].onFile = profile.phoneNumber ? true : false;; // mobileNumber ? true : false;
          // this.myPrefConstants.commChannels[4].isVerified = profile.address;

          if (!profile.isVerifiedEmail) { // emailAddressConfirmed) {
            this.maskPhoneNumberAndStore(profile.emailAddress);
            this.showAlertMessage(this.noVerifiedEmail);
          }
          if (!profile.isVerifiedMobile) { // mobileNumberConfirmed) {
            this.maskPhoneNumberAndStore(profile.phoneNumber); // mobileNumber);
            this.showAlertMessage(this.noVerifiedMobile);
          }
        }
      });
      // this.displayMatrix('onLoad()');
      this.reCalculateMatrix();
      // this.displayMatrix('after Recalculation');
    },
      error => {
        // TODO
      });
    this.HealthPromoTotalRow = this.HealthPromoRows[0];
  }

  // initializeHealthPromoCommunicationChannelRows(msgCat: MessageCategory): MessageCategory {
  initializeHealthPromoCommunicationChannelRows(msgCat: MessageCategory) {
    //
    this.myPrefConstants.commChannels.forEach(commChannel => {
      msgCat.row.push(
        {
          'commChannel': commChannel,
          'checked': false,
          'disabled': false
        }
      );
    });


  }

  onMyPrefChange1(row: MessageCategory, item: MessageCategoryItem, selectionListChange) {
    if (selectionListChange.selected && item.commChannel.name !== 'All') {
      if (item.commChannel.onFile) {
        if (item.commChannel.isVerified) {
          this.setValueToRowInGlobal(row, item.commChannel.name, selectionListChange.selected);
          this.reCalculateMatrix();
          this.displayMatrix('onChange()');
        } else {
          // set in service for pickup in verify screen
          this.myprefservice.commChannelBeingVerified = item.commChannel;
          this.myprefservice.messageCategoryBeingVerified = row;
          this.router.navigate(['/mypreferences/verify']);
        }
      } else {
        // send to MyProfile
        // this.router.navigate(['/myprofile/edit']);
      }
    } else {
      // should be verified already - because user is unchecking
      this.setValueToRowInGlobal(row, item.commChannel.name, selectionListChange.selected);
      this.reCalculateMatrix();
      this.displayMatrix('onChange()');
    }
  }


  // utilities
  getRowByName(rowname) {
    this.HealthPromoRows.forEach(element => {
      if (element.rowName === rowname) {
        return element;
      }
    });
  }

  getValueByChannel(category: MessageCategory, channelName: string): boolean {
    let rtnVal = false;
    category.row.forEach(element => {
      if (element.commChannel.name === channelName) {
        rtnVal = element.checked;
      }
    });
    return rtnVal;
  }

  setValueByChannel(category: MessageCategory, channelName: string, val: boolean) {
    category.row.forEach(element => {
      if (element.commChannel.name === channelName) {
        element.checked = val;
      }
    });
  }

  setValueToChildRowsFromTotalRow(channelName: string) {
    const valToBeSet = this.getValueByChannel(this.HealthPromoRows[0], channelName);
    this.HealthPromoRows.forEach(messageCategory => {
      if (messageCategory.rowName !== this.HealthPromoRows[0].rowName) {
        this.setValueByChannel(this.HealthPromoRows[0], channelName, valToBeSet);
      }
    });
  }

  setValueToRowInGlobal(category: MessageCategory, channelName: string, val: boolean) {
    this.HealthPromoRows.forEach(messageCategory => {
      if (messageCategory.rowName === category.rowName) {
        this.setValueByChannel(messageCategory, channelName, val);
        if (this.myPrefConstants.commChannels[2].name === channelName) {
          this.setValueByChannel(messageCategory, this.myPrefConstants.commChannels[0].name, val);
          this.setValueByChannel(messageCategory, this.myPrefConstants.commChannels[1].name, val);
        }
        if (category.rowName === this.HealthPromoRows[0].rowName) {
          let bIsAllChanged = false;
          if (this.myPrefConstants.commChannels[2].name === channelName) {
            bIsAllChanged = true;
          }
          this.adjustMatrix(bIsAllChanged);
        }
      }
    });
  }

  maskEmailIdAndStore(userId: string) {
    const maskedUserId = userId ? userId.replace(/^(.{3})(.*)(@.*)$/,
      (_, firstCharacter, charToMasked, domain) => {
        return `${firstCharacter}${charToMasked.replace(/./g, '*')}${domain}`;
      }) : userId;
    // return maskedUserId;
    sessionStorage.setItem('myPrefmaskedVerify', maskedUserId);
  }

  maskPhoneNumberAndStore(userId: string) {
    const regex = /^(.{3})(.{3})(.{4})(.*)/;
    let maskedUserId = userId ? userId.replace(/^(.*)(.{4})$/,
      (_, digitsToMasked, lastFourDigits) => {
        return `${digitsToMasked.replace(/./g, '*')}${lastFourDigits}`;
      }) : userId;
    const str = maskedUserId;
    const subst = `$1-$2-$3`;
    maskedUserId = str.replace(regex, subst);
    // return  maskedUserId;
    sessionStorage.setItem('myPrefmaskedVerify', maskedUserId);
  }
}
