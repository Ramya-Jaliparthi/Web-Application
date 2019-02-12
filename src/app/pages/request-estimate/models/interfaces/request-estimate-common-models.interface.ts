import { BasicMemInfoRxSummaryInterface } from '../../../medications/models/interfaces/get-member-basic-info-model.interface';
import { DependentInterimModelInterface } from '../../../myclaims/models/interfaces/dependants-model.interface';
import { VisitsResponseInterface } from '../../../mydoctors-pcp/models/interfaces/my-doctor-module-common-models.interface';

export interface PatientListModelInterface {
    isSubscriber: boolean;
    name: string;
    subscriber?: BasicMemInfoRxSummaryInterface;
    dependant?: DependentInterimModelInterface;
}
// export interface ProviderListModelInterface {
//     // not finalized yet - will modify it tomorrow kalagi01
//     isSubscriber: boolean;
//     dependentVisit: VisitsResponseInterface[];
//     subscriberVisit: VisitsResponseInterface[];
// }

export interface ProviderListItemModelInterface {
    label: string;
    value: string;

    setLabel(label: string): ProviderListItemModelInterface;
    setValue(value: string): ProviderListItemModelInterface;
}

