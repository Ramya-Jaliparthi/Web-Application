import { GeneralErrorInterface, MyBlueGeneralAPIRequestModelInterface } from '../../../../shared/models/interfaces/generic-app-models.interface';

export interface PharmacyInterface {
    id: string; // example: 70010002236544
    name: string; // example: STAR PHARMACY
    phoneNumber: string; // example: 617-782-162
    address: string; // example: 370 WESTERN AVE
    city: string; // example: BRIGHTON
    state: string; // example: MA
    zip: string; // example: 02135
}

export interface RefillInterface {
    date: string; // ($date)   example: 2013-09-23
    claimNumber: string; // example: 026152957073500
}

export interface RxSummaryInterface {
    genericName: string; // genericNamestring  example: Hydrocodone-Acetaminophen Tab 7.5-325 MG -Medication Generic Name
    pharmacy: PharmacyInterface;
    copay: number; // copaynumber($double) example: 5.45 - Copay for this Rx (medication)
    lastFill: string; // lastFillstring($date) example: 2013-09-23 - Last Fill date of the Rx (medication)
    prescribingDoctor: string; // prescribingDoctorstring example: DAVID K WEINSTOCK MD  full name
    // and Designation of the Prescribing Doctor as avaiable
    uniquePersonId: number; // uniquePersonIdnumber example: 4964184 Unique Person ID
    ndcCd: string; // ndcCdstring example: 00603389121 - NDC Code
    rxIncurredDate: string; // rxIncurredDatestring($date) example: 2013-09-23 - RX Incurred Date
    MemberInfo: string;
    currUser: boolean;
    dependentId: number;
}

export interface BaseRecentRxResponseModelInterface extends GeneralErrorInterface {
    rxSummary: RxSummaryInterface[];
}

export interface BaseRxDetailsRequestModelInterface extends MyBlueGeneralAPIRequestModelInterface {
    uniquePersonId: number; // uniquePersonIdnumber example: 4964184 Unique Person ID
    ndcCd: string; // ndcCdstring example: 00603389121 NDC Code
    rxIncurredDate: string; // rxIncurredDatestring($date) example: 2013-09-23 RX Incurred Date
    dependentId: number; // rxIncurredDatestring($date) example: 2013-09-23 RX Incurred Date
}

export interface RxDetailsInterface {
    genericName: string; // genericNamestring example: Hydrocodone-Acetaminophen Tab 7.5-325 MG Medication Generic Name
    pharmacy: PharmacyInterface;
    copay: string; // copaynumber($double) example: 5.45 Copay for this Rx (medication)

    lastFill: string; // lastFillstring($date) example: 2013-09-23 Last Fill date of the Rx (medication)

    prescribingDoctor: string; // prescribingDoctorstring example: DAVID K WEINSTOCK MD Full name and
    // Designation of the Prescribing Doctor as avaiable
    dependentId: string;
    refillHistory: RefillInterface[];
}

export interface RadioListInterface {
    value: string;
    checked: boolean;

    setValue(value: string): RadioListInterface;
    setChecked(checked: boolean): RadioListInterface;
}
