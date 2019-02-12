import { environment } from '../../../environments/environment';
import { TitleCasePipe } from '@angular/common';

export class HomePageInfoModel {
  // UNQ_PER_ID: string;
  // USER_ID: string;
  // clmAllowAmt: string;
  // clmCopay: string;
  // clmDOS: string;
  // clmICN: string;
  // clmLastDOS: string;
  // clmPaidAmt: string;
  // clmPaymtStatus: string;
  // clmSrvType: string;
  // clmStatus: string;
  // clmYouOweAmt: string;
  // groupName: string;
  // groupNumber: string;
  // hasALG: string;
  // hasDependents: string;
  // hasHEQ: string;
  // hasSS: string;
  // memFistName: string;
  // memLastName: string;
  // memMedexFlag: string;
  // memMedicareFlag: string;
  // memMidInit: string;
  // member_id: string;
  // planEffectiveDate: string;
  // planName: string;
  // planType: string;
  // rxCoPay: string;
  // rxDispPrvName: string;
  // rxDispPrvNum: string;
  // rxDrugName: string;
  // rxDrugType: string;
  // rxIncurredDate: string;
  // rxLastFillDate: string;
  // rxNDCCode: string;
  // rxPrescPrvName: string;
  // rxStrength: string;
  // rxUniquePersonId: string;
  // unreadMessageCount: string;
  // userState: string;
  // userType: string;
  // visitCity: string;
  // visitLastSvcDate: string;
  // visitPhone: string;
  // visitPrvName: string;
  // visitPrvNum: string;
  // visitSpec: string;
  // visitSvcDate: string;
  // relationship: string;
  // clmPrvName: string;
  // rxPrescPhone: string;

  memFistName: string;
  memMidInit: string;
  memLastName: string;
  hasDependents: string;
  userState: string;
  userType: string;
  memMedexFlag: string;
  memMedicareFlag: string;
  hasHEQ: string;
  hasALG: string;
  hasSS: string;
  cerner: Cerner;
  hasBQi: string;
  hasBlueGreen: string;
  myclaims: MyClaims;
  unreadMessageCount: string;
  mydoctors: MyDoctors;
  mymedications: MyMedications;

  constructor(private titleCase: TitleCasePipe) {
  }

  get fullName() {
    return `${this.memFistName} ${this.memLastName}`;
  }

  fullMemInfo(sectionType: string) {
    let memName = '';
    if (sectionType === 'claims') {
      if (this.myclaims && this.myclaims.clmMidInit) {
        memName = this.titleCase.transform(this.myclaims.clmFrstName) + ' ' + this.titleCase.transform(this.myclaims.clmMidInit) + ' ' +
          this.titleCase.transform(this.myclaims.clmLastName) + ' (' + this.titleCase.transform(this.myclaims.clmrelationship) + ')';
      } else {
        memName = this.titleCase.transform(this.myclaims.clmFrstName) + ' ' + this.titleCase.transform(this.myclaims.clmLastName)
          + ' (' + this.titleCase.transform(this.myclaims.clmrelationship) + ')';
      }
    } else if (sectionType === 'medications') {
      if (this.mymedications && this.mymedications.rxMidInit) {
        memName = this.titleCase.transform(this.mymedications.rxFrstName) + ' ' +
        this.titleCase.transform(this.mymedications.rxMidInit) + ' ' +
          this.titleCase.transform(this.mymedications.rxLastName) + ' (' +
          this.titleCase.transform(this.mymedications.rxrelationship) + ')';
      } else {
        memName = this.titleCase.transform(this.mymedications.rxFrstName) + ' ' + this.titleCase.transform(this.mymedications.rxLastName)
          + ' (' + this.titleCase.transform(this.mymedications.rxrelationship) + ')';
      }
    }
    return memName;
  }

  deserialize(obj) {
    // this.UNQ_PER_ID = obj.UNQ_PER_ID;
    // this.USER_ID = obj.USER_ID;
    // this.clmAllowAmt = obj.clmAllowAmt;
    // this.clmCopay = obj.clmCopay;
    // this.clmDOS = obj.clmDOS;
    // this.clmICN = obj.clmICN;
    // this.clmLastDOS = obj.clmLastDOS;
    // this.clmPaidAmt = obj.clmPaidAmt;
    // this.clmPaymtStatus = obj.clmPaymtStatus;
    // this.clmSrvType = obj.clmSrvType;
    // this.clmStatus = obj.clmStatus;
    // this.clmYouOweAmt = obj.clmYouOweAmt;
    // this.groupName = obj.groupName;
    // this.groupNumber = obj.groupNumber;
    this.hasALG = obj.hasALG;
    this.hasDependents = obj.hasDependents;
    this.hasHEQ = obj.hasHEQ;
    this.hasSS = obj.hasSS;
    this.memFistName = obj.memFistName;
    this.memLastName = obj.memLastName;
    this.memMedexFlag = obj.memMedexFlag;
    this.memMedicareFlag = obj.memMedicareFlag;
    this.memMidInit = obj.memMidInit;
    this.unreadMessageCount = obj.unreadMessageCount;
    this.userState = obj.userState;
    this.userType = obj.userType;
    this.cerner = obj.cerner;
    this.myclaims = obj.myclaims;
    this.mydoctors = obj.mydoctors;
    this.mymedications = obj.mymedications;
    this.hasBQi = obj.hasBQi;
    this.hasBlueGreen = obj.hasBlueGreen;
    // this.member_id = obj.member_id;
    // this.planEffectiveDate = obj.planEffectiveDate;
    // this.planName = obj.planName;
    // this.planType = obj.planType;
    // this.rxCoPay = obj.rxCoPay;
    // this.rxDispPrvName = obj.rxDispPrvName;
    // this.rxDispPrvNum = obj.rxDispPrvNum;
    // this.rxDrugName = obj.rxDrugName;
    // this.rxDrugType = obj.rxDrugType;
    // this.rxIncurredDate = obj.rxIncurredDate;
    // this.rxLastFillDate = obj.rxLastFillDate;
    // this.rxNDCCode = obj.rxNDCCode;
    // this.rxPrescPrvName = obj.rxPrescPrvName;
    // this.rxStrength = obj.rxStrength;
    // this.rxUniquePersonId = obj.rxUniquePersonId;
    // this.rxPrescPhone = obj.rxPrescPhone;
    // this.visitCity = obj.visitCity;
    // this.visitLastSvcDate = obj.visitLastSvcDate;
    // this.visitPhone = obj.visitPhone;
    // this.visitPrvName = obj.visitPrvName;
    // this.visitPrvNum = obj.visitPrvNum;
    // this.visitSpec = obj.visitSpec;
    // this.visitSvcDate = obj.visitSvcDate;
    // this.relationship = obj.relationship;
    // this.clmPrvName = obj.clmPrvName;
    return this;
  }
}


export interface Cerner {
  hasCerner: string;
  hasCernerEE: string;
  hasCernerMedicare: string;
}

export interface MyClaims {
  clmFrstName: string;
  clmMidInit: string;
  clmLastName: string;
  clmrelationship: string;
  clmICN: string;
  clmDOS: string;
  clmLastDOS: string;
  clmPrvName: string;
  clmCoveredAmt: string;
  clmYouOweAmt: string;
  clmPaymtStatus: string;
  clmStatus: string;
}

export interface MyDoctors {
  visitFrstName: string;
  visitMidInit: string;
  visitLastName: string;
  visitPrvNum: string;
  visitSvcDate: string;
  visitLastSvcDate: string;
  visitPrvName: string;
  visitSpec: string;
  visitPhone: string;
  visitDependentId: string;
}

export interface MyMedications {
  rxFrstName: string;
  rxMidInit: string;
  rxLastName: string;
  rxrelationship: string;
  rxDrugName: string;
  rxStrength: string;
  rxPrescPhone: string;
  rxDispPrvNum: string;
  rxDispPrvName: string;
  rxCoPay: string;
  rxLastFillDate: string;
  rxNDCCode: string;
  rxIncurredDate: string;
  rxDependentId: number;
}



export class ArticleModel {
  Icon: string;
  Index: number;
  Title: string;
  Body: string;
  Description: string;
  RegularImages: string;
  TabletImage: string;
  MobileImages: string;
  Heading: string;
  ArticleText: string;
  ArticleUrl: string;

  constructor(number) {
    this.Index = number;

    // if (number === 1) {
    //   this.Heading = 'Healthy Living';
    //   this.Icon = 'assets/images/Asset34@2x.png';
    // } else if (number === 2) {
    //   this.Heading = 'Fitness';
    //   this.Icon = 'assets/images/home-fitness-news-icon-ios@2x.png';
    // } else if (number === 3) {
    //   this.Heading = 'Wellness';
    //   this.Icon = 'assets/images/Asset33@2x.png';
    // }
  }

  deserialize(jsonObj, sanitizer?) {
    // console.log('Landing Articles Model', jsonObj);
    this.Title = jsonObj.Title;
    this.ArticleText = jsonObj.ArticleText;
    // const bodyComponents = jsonObj.Body.split('</p>');
    // this.Description = bodyComponents[0] + '</p>';
    // this.Body = bodyComponents.slice(1).join('');
    this.RegularImages = environment.drupalTestUrl + jsonObj.RegularImages;
    this.ArticleUrl = jsonObj.ArticleUrl;

    if (sanitizer) {
      // this.Body = sanitizer.bypassSecurityTrustHtml(this.Body);
    }
    return this;
  }
}

export class HomePageClaimsoModel {
  clmFrstName: string;
  clmMidInit: string;
  clmLastName: string;
  clmrelationship: string;
  clmICN: string;
  clmDOS: string;
  clmLastDOS: string;
  clmPrvName: string;
  clmCoveredAmt: string;
  clmYouOweAmt: string;
  clmPaymtStatus: string;
  clmStatus: string;

  constructor(private titleCase: TitleCasePipe) {
  }

  deserialize(obj) {
    return this;
  }
}

export class HomePageDoctorsModel {
  visitFrstName: string;
  visitMidInit: string;
  visitLastName: string;
  visitPrvNum: string;
  visitSvcDate: string;
  visitLastSvcDate: string;
  visitPrvName: string;
  visitSpec: string;
  visitPhone: string;

  constructor(private titleCase: TitleCasePipe) {
  }

  deserialize(obj) {
    return this;
  }
}
export class HomePageMedicationModel {
  rxFrstName: string;
  rxMidInit: string;
  rxLastName: string;
  rxrelationship: string;
  rxDrugName: string;
  rxStrength: string;
  rxPrescPhone: string;
  rxDispPrvNum: string;
  rxDispPrvName: string;
  rxCoPay: string;
  rxLastFillDate: string;
  rxNDCCode: string;
  rxIncurredDate: string;

  constructor(private titleCase: TitleCasePipe) {
  }

  deserialize(obj) {
    return this;
  }
}
