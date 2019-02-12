import {
    DependentRecentRxResponseModelInterface,
    DependentRecentRxRequestModelInterface
} from './interfaces/dependant-recent-rx-model.interface';
import { BaseRecentRxResponseModel } from './my-medications-generic.models';
import { MyBlueGeneralAPIRequestModel } from '../../../shared/models/generic-app.model';

export class DependentRecentRxRequestModel extends MyBlueGeneralAPIRequestModel
    implements DependentRecentRxRequestModelInterface {
    dependentId: number; // *dependentIdnumber- example: 123456786 - Dependent ID
}

// tslint:disable-next-line:no-empty-interface
export class DependentRecentRxResponseModel extends BaseRecentRxResponseModel
    implements DependentRecentRxResponseModelInterface {

}


