import {
    RxDetailsInterface, BaseRxDetailsRequestModelInterface, BaseRecentRxResponseModelInterface,
    RxSummaryInterface, RefillInterface, PharmacyInterface, RadioListInterface
} from './interfaces/my-medications-generic-models.interface';
import { GeneralError, MyBlueGeneralAPIRequestModel } from '../../../shared/models/generic-app.model';

export class Pharmacy implements PharmacyInterface {
    id: string; // example: 70010002236544
    name: string; // example: STAR PHARMACY
    phoneNumber: string; // example: 617-782-162
    address: string; // example: 370 WESTERN AVE
    city: string; // example: BRIGHTON
    state: string; // example: MA
    zip: string; // example: 02135
}

export class Refill implements RefillInterface {
    date: string; // ($date)   example: 2013-09-23
    claimNumber: string; // example: 026152957073500
}

export class RxSummary implements RxSummaryInterface {
    genericName: string; // genericNamestring        example: Hydrocodone-Acetaminophen Tab 7.5-325 MG        Medication Generic Name
    pharmacy: Pharmacy;
    copay: number; // copaynumber($double)        example: 5.45        Copay for this Rx (medication)

    lastFill: string; // lastFillstring($date)        example: 2013-09-23        Last Fill date of the Rx (medication)

    prescribingDoctor: string; // prescribingDoctorstring example: DAVID K WEINSTOCK MD  ull name
    // and Designation of the Prescribing Doctor as avaiable
    uniquePersonId: number; // uniquePersonIdnumber example: 4964184 Unique Person ID
    ndcCd: string; // ndcCdstring        example: 00603389121        NDC Code
    rxIncurredDate: string; // rxIncurredDatestring($date) example: 2013-09-23        RX Incurred Date
    MemberInfo: string;
    currUser: boolean;
    dependentId: number;
}

export class BaseRecentRxResponseModel extends GeneralError implements BaseRecentRxResponseModelInterface {
    rxSummary: RxSummary[] = [];
}

export class BaseRxDetailsRequestModel extends MyBlueGeneralAPIRequestModel implements BaseRxDetailsRequestModelInterface {
    uniquePersonId: number; // uniquePersonIdnumber example: 4964184 Unique Person ID
    ndcCd: string; // ndcCdstring example: 00603389121 NDC Code
    rxIncurredDate: string; // rxIncurredDatestring($date) example: 2013-09-23 RX Incurred Date
    dependentId: number; // rxIncurredDatestring($date) example: 2013-09-23 RX Incurred Date
}

export class RxDetails implements RxDetailsInterface {
    genericName: string; // genericNamestring example: Hydrocodone-Acetaminophen Tab 7.5-325 MG Medication Generic Name
    pharmacy: Pharmacy;
    copay: string; // copaynumber($double) example: 5.45 Copay for this Rx (medication)

    lastFill: string; // lastFillstring($date) example: 2013-09-23 Last Fill date of the Rx (medication)

    prescribingDoctor: string; // prescribingDoctorstring example: DAVID K WEINSTOCK MD Full name and
    // Designation of the Prescribing Doctor as avaiable
    dependentId: string;
    refillHistory: Refill[];
}

export class RadioList implements RadioListInterface {
    value: string;
    checked: boolean;

    setValue(value: string): RadioList {
        this.value = value;
        return this;
    }

    setChecked(checked: boolean): RadioList {
        this.checked = checked;
        return this;
    }
}


