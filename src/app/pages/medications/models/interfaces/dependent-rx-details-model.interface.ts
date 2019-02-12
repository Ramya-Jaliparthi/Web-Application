import { BaseRxDetailsRequestModelInterface, RxDetailsInterface } from './my-medications-generic-models.interface';
import { GeneralErrorInterface } from '../../../../shared/models/interfaces/generic-app-models.interface';

export interface DependentRxDetailsRequestModelInterface extends BaseRxDetailsRequestModelInterface {
    dependentId: number; // *dependentIdnumber - example: 123456786 - Dependent ID
}

export interface DependentRxDetailsResponseModelInterface extends GeneralErrorInterface {
    rxDetails: RxDetailsInterface;
}
