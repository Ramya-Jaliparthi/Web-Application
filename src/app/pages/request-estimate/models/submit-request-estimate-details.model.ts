import {
    SubmitRequestEstimateDetailsRequestModelInterface,
    SubmitRequestEstimateDetailsResponseModelInterface
} from './interfaces/submit-request-estimate-details-models.inteface';
import { GeneralError, MyBlueGeneralAPIRequestModel } from '../../../shared/models/generic-app.model';
import { PolarDataType } from '../../../shared/models/types/app-custom-generic.types';


export class SubmitRequestEstimateDetailsRequestModel extends MyBlueGeneralAPIRequestModel
    implements SubmitRequestEstimateDetailsRequestModelInterface {
    subscriberId: string; // example: 050783643 9 digit Subscriber Identifier
    isEmployee: boolean; // example: true Member is Employee of BCBS MA
    submitterFullName: string; // example: KENDRA FULLERTON Submitter Full Name
    submitterEmailAddress: string; // example: foo@yopmail.com Submitter Email Address
    submitterPhoneNumber: string; // example: 617 - 246 - 5834 Submitter Phone Number
    submitterAddress1: string; // example: 12 SAINT JOHNS CIR Submitter Address1
    submitterAddress2: string; // example: NORTH PROVIDENCE RI Submitter Address2
    submitterCity: string; // Submitter City
    submitterState: string; // Submitter State
    submitterZip: string; // example: Submitter Zip Code specialFormat[...]
    specialFormat: string[]; // [example: List [ "Braille" ] Special Material Requirements string]
    deliveryPreference: string; // example: EMAIL Delivery Preference    Enum:    Array[2]
    patientName: string; // example: KENDRA FULLERTON Patient Name
    providerAndOrFacilityNPIAvailable: PolarDataType; // example: Yes Service Provider NPI and / or Facilty NPI Available
    providerName: string; // example: Dr.Testing Provider Name
    providerNPI: string; // example: Provider NPI
    providerPhoneNumber: string; // example: 617 - 246 - 5834 Provider Phone Number
    facilityServiceAvailable: PolarDataType; // example: No Service at a medical facility available
    facilityName: string; // example: Facility Name
    facilityNPI: string; // example: Facility NPI
    facilityPhoneNumber: string; // example: Facility Phone Number
    facilityAddress: string; // example: Facility Address
    facilityCity: string; // Facility City
    facilityState: string; // Facility State
    facilityZip: string; // example: Facility Zip Code
    procedureDescription: string; // example: Procedure Description
    procedureAndDiagnosisCodesAvailable: boolean; // example: No Procedure Codes And Diagnosis Codes Availalbe
    procedureCode1: string; // example: Procedure Code1
    diagnosisCode1: string; // example: Diagnosis Code1
    procedureCode2: string; // example: Procedure Code2
    diagnosisCode2: string; // example: Diagnosis Code2
    procedureCode3: string; // example: Procedure Code3
    diagnosisCode3: string; // example: Diagnosis Code3
    procedureCode4: string; // example: Procedure Code4
    diagnosisCode4: string; // example: Diagnosis Code4
    procedureCode5: string; // example: Procedure Code5
    diagnosisCode5: string; // example: Diagnosis Code5
    procedureCode6: string; // example: Procedure Code6
    diagnosisCode6: string; // example: Diagnosis Code6
    procedureCode7: string; // example: Procedure Code7
    diagnosisCode7: string; // example: Diagnosis Code7
    procedureCode8: string; // example: Procedure Code8
    diagnosisCode8: string; // example: Diagnosis Code8
    procedureCode9: string; // example: Procedure Code9
    diagnosisCode9: string; // example: Diagnosis Code9
    procedureCode10: string; // example: Procedure Code10
    diagnosisCode10: string; // example: Diagnosis Code10
}

// tslint:disable-next-line:no-empty-interface
export class SubmitRequestEstimateDetailsResponseModel extends GeneralError implements SubmitRequestEstimateDetailsResponseModelInterface {

}
