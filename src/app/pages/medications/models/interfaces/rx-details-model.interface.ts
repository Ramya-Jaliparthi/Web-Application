import {
    BaseRxDetailsRequestModelInterface,
    RxDetailsInterface
} from './my-medications-generic-models.interface';
import { GeneralErrorInterface } from '../../../../shared/models/interfaces/generic-app-models.interface';

// tslint:disable-next-line:no-empty-interface
export interface RxDetailsRequestModelInterface extends BaseRxDetailsRequestModelInterface {

}

export interface RxDetailsResponseModelInterface extends GeneralErrorInterface {
    rxDetails: RxDetailsInterface;
}


