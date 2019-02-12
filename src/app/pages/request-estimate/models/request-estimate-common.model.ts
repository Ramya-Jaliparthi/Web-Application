import {
    PatientListModelInterface,
    ProviderListItemModelInterface
} from './interfaces/request-estimate-common-models.interface';
import { BasicMemInfoRxSummary } from '../../medications/models/get-member-basic-info.model';
import { DependentInterimModel } from '../../myclaims/models/dependants.model';

export class PatientListModel implements PatientListModelInterface {
    public isSubscriber: boolean = false;
    public name: string = null;
    public subscriber?: BasicMemInfoRxSummary = null;
    public dependant?: DependentInterimModel = null;
}

// export class ProviderListModel implements ProviderListModelInterface {
//     // not finalized yet - will modify it tomorrow kalagi01
//     public isSubscriber: boolean = false;
//     public dependentVisit: VisitsResponse[] = null;
//     public subscriberVisit: VisitsResponse[] = null;
// }

export class ProviderListItemModel implements ProviderListItemModelInterface {
    label: string;
    value: string;

    setLabel(label: string): ProviderListItemModel {
        this.label = label;
        return this;
    }
    setValue(value: string): ProviderListItemModel {
        this.value = value;
        return this;
    }
}
