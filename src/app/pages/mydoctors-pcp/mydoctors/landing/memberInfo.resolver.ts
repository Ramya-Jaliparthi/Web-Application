import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MemberInfo } from '../../../../shared/models/memberInfo.model';
import { GlobalService } from '../../../../shared/services/global.service';
import { MyDoctorsPcpService } from '../../mydoctors-pcp.service';

@Injectable()
export class MemberInfoResolver implements Resolve<Observable<any>> {
    constructor(private myDoctorService: MyDoctorsPcpService, private globalService: GlobalService) { }

    async resolve() {
        if (!this.globalService.memberDataObject) {
            // return await this.globalService.getMemberInfo();
            const memberInfo = {
                memFistName: 'testf', memLastName: 'testl', relationship: 'Subscriber', clmAllowAmt: '', clmDOS: '',
                clmICN: '', clmPaidAmt: '', clmPaymtStatus: '', clmPrvName: '',
                hasDependents: 'true', memGender: '', clmSrvType: '', clmStatus: '', hasALG: '', hasHEQ: '',
                lastLoginDt: '', memMidInit: '', numOfClmsSinceLastLogin: '', rxDispDt: '',
                rxDispPrvCity: '', rxDispPrvName: '', rxDispPrvNum: '', rxDispPrvPhone: '', rxDispPrvState: '',
                rxDispPrvStreet: '', rxDispPrvZip: '', rxDrugName: '', rxNSDC: '',
                rxPrescPhone: '', rxPrescPrvName: '', rxPrescPrvNum: '', rxStrength: '', visitCity: '', visitPhone: '',
                visitPrvName: '', visitPrvNum: '', visitSpec: '', visitState: '',
                visitStreet: '', visitSvcDate: '', visitZip: '', member_id: '', userState: '', userType: '',
                memMedexFlag: '', memMedicareFlag: '', hasSS: '', clmLastDOS: '', clmYouOweAmt: '',
                clmCopay: '', unreadMessageCount: '', visitLastSvcDate: '', rxDrugType: '', rxCoPay: '',
                rxLastFillDate: '', rxUniquePersonId: '', rxNDCCode: '', rxIncurredDate: '', planName: '',
                planType: '', groupNumber: '', groupName: '', planEffectiveDate: ''
            };
            return await new Observable((observer) => {
                observer.next(memberInfo);
                observer.complete();
            }).toPromise();

            // return this.globalService.fetchMemberData().map((data) => {
            //     if (data && data['ROWSET']) {
            //         return (new MemberInfo().deserialize(data['ROWSET'].ROWS));
            //     } else {
            //         return data;
            //     }
            // }).catch(() => {
            //     return Observable.empty();
            // });
        } else {
            // return await new Observable((observer) => {
            //     observer.next(this.globalService.memberDataObject);
            //     observer.complete();
            // }).toPromise();

            return await this.globalService.memberDataObject;
        }
    }
}
