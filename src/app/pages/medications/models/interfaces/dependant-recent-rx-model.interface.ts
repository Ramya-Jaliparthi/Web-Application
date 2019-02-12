import { BaseRecentRxResponseModelInterface } from './my-medications-generic-models.interface';
import { MyBlueGeneralAPIRequestModelInterface } from '../../../../shared/models/interfaces/generic-app-models.interface';

export interface DependentRecentRxRequestModelInterface extends MyBlueGeneralAPIRequestModelInterface {
    dependentId: number; // *dependentIdnumber- example: 123456786 - Dependent ID
}

// tslint:disable-next-line:no-empty-interface
export interface DependentRecentRxResponseModelInterface extends BaseRecentRxResponseModelInterface {

}


