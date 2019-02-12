import { MyDoctorsVisitProviderType } from '../types/my-doctors.type';
import { MyBlueGeneralAPIRequestModelInterface } from '../../../../shared/models/interfaces/generic-app-models.interface';

export interface MyDoctorsGenericRequestModelInterface extends MyBlueGeneralAPIRequestModelInterface {
    dependentId: string;
}

export interface DocVisitEntryModelInterface {
    date: string;
    claimNumber: string;
}

export interface VisitDetailInterface {
    docVisitHistory: DocVisitEntryModelInterface[];
    lastDateOfService: string; // lastDateOfServicestring    example: 2018-08-27
    hasAddress: boolean; // hasAddressboolean    example: true    Enum:    Array [ 2 ]
    addressStr: string; // addressStrstring    example: 123 Street, MA, 02135
    claimId: string; // claimIdstring    example: 012345678912345
    recordKey: string; // recordKeystring    example: 123456
    providerPhone: string; // providerPhonestring    example: 123-123-1234
    providerNumber: string; // providerNumberstring    example: 70010000J12136
    providerType: MyDoctorsVisitProviderType; // providerTypestring    example: Physician    Enum:    Array [ 4 ]
    providerName: string; // providerNamestring    example: John Smith MD
    memberFirstName: string; // memberFirstNamestring    example: FirstName
    memberLastName: string; // memberLastNamestring    example: LastName
    memberId: string; // memberIdstring    example: 123456789000
    subscriberId: string; // subscriberIdstring    example: 123456789000
    providerSpeciality: string; // providerSpecialitystring    example: Radiology
    dateOfservice: string; // dateOfServicestring    example: 2018-08-27
    isAllowedChangePCP: boolean; // isAllowedChangePCPboolean    example: true    Enum:    Array [ 2 ]
    isPCP: boolean; // isPCPboolean    example: true    Enum:    Array [ 2 ]
    isPCPEligible: boolean; // isPCPEligibleboolean    example: true    Enum:    Array [ 2 ]
    isRequiredPCP: boolean; // isRequiredPCPboolean    example: true    Enum:    Array [ 2 ]
    pcpId: string; // pcpIdstring    example: 123456789000
}

export interface VisitsResponseInterface {
    rowId: string; // rowIdstring    example: 1231232
    claimId: string; // claimIdstring    example: 012345678912345
    recordKey: string; // recordKeystring    example: 123456
    providerPhone: string; // providerPhonestring    example: 123-123-1234
    providerNumber: string; // providerNumberstring    example: 70010000J12136
    providerType: MyDoctorsVisitProviderType; // providerTypestring    example: Physician    Enum:    Array [ 4 ]
    providerName: string; // providerNamestring    example: John Smith MD
    memberFirstName: string; // memberFirstNamestring    example: FirstName
    memberLastName: string; // memberLastNamestring    example: LastName
    memberMiddleInitial: string; // memberMiddleInitialstring   example: S
    memberRelationship: string; // memberRelationshipstring    example: Subscriber    Enum:    Array [ 3 ]
    providerSpeciality: string; // providerSpecialitystring    example: Radiology
    dateOfservice: string; // dateOfServicestring    example: 2018-08-27
    isAllowedChangePCP: boolean; // isAllowedChangePCPboolean    example: true    Enum:    Array [ 2 ]
    isPCP: boolean; // isPCPboolean    example: true    Enum:    Array [ 2 ]
    isPCPEligible: boolean; // isPCPEligibleboolean    example: true    Enum:    Array [ 2 ]
    isRequiredPCP: boolean; // isRequiredPCPboolean    example: true    Enum:    Array [ 2 ]
    pcpId: string; // pcpIdstring    example: 123456789000
}

export interface MemberPCPDataModelInterface {
    isRequiredPCP: boolean; // Member Plan`s PCP Requirement
    hasPCP: boolean;
    pcpId: string;
}
