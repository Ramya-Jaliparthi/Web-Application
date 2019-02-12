import { ClaimStatusType } from '../types/claims.types';
import { MyBlueGeneralAPIRequestModelInterface } from '../../../../shared/models/interfaces/generic-app-models.interface';

export interface ClaimProcessingStatusRequestModelInterface extends MyBlueGeneralAPIRequestModelInterface {

    claimId: string;
    recordKey: string;
}

export interface ClaimProcessingStatusResponseModelInterface {
    statusRecord: ClaimStatusRecordInterface;
}

export interface ClaimStatusRecordInterface {
    claimId: string; // example: 123456789000
    claimStatus: ClaimStatusType; // example: Completed  Enum:  [ Completed, Denied, Pending ]
    dateOfService: string; // example: 08/09/2018
    firstDateOfService: string; // example: 08/09/2018
    lastDateOfService: string; // example: 08/09/2018
    recievedDate: string; // example: 08/09/2018
    completedDate: string; // example: 08/09/2018
    memberName?: string;
}
