
export interface ProviderOld {
    RowNum: number;
    PrvState: string;
    PrvPh: string;
    isPCP: boolean;
    isRequiredPCP: boolean;
    pcpID: string;
    PrvType: string;
    PrvName: string;
    PrvSpec: string;
    PrvCity: string;
    addressStr: string;
    DOS: string;
    PrvZip: string;
    hasAddress: boolean;
    PrvStreet: string;
    mem_relationship: string;
    mem_name: string;
    dependentID: string;
}

export interface Provider {
    rowId: string;
    claimId: string;
    recordKey: string;
    providerPhone: string;
    providerNumber: string;
    providerType: string;
    providerName: string;
    memberFirstName: string;
    memberLastName: string;
    memberMiddleInitial: string;
    memberRelationship: string;
    providerSpeciality: string;
    dateOfservice: string;
    isAllowedChangePCP: boolean;
    isPCP: boolean;
    isPCPEligible: boolean;
    isRequiredPCP: boolean;
    pcpId: string;
    dependentId: string;
}

