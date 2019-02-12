import { RxDetails, BaseRxDetailsRequestModel } from './my-medications-generic.models';
import {
    DependentRxDetailsResponseModelInterface,
    DependentRxDetailsRequestModelInterface
} from './interfaces/dependent-rx-details-model.interface';
import { GeneralError } from '../../../shared/models/generic-app.model';

export class DependentRxDetailsRequestModel extends BaseRxDetailsRequestModel implements DependentRxDetailsRequestModelInterface {
    dependentId: number; // *dependentIdnumber - example: 123456786 - Dependent ID
}

export class DependentRxDetailsResponseModel extends GeneralError implements DependentRxDetailsResponseModelInterface {
    rxDetails: RxDetails;
}
