import { RxDetails, BaseRxDetailsRequestModel } from './my-medications-generic.models';
import { RxDetailsResponseModelInterface, RxDetailsRequestModelInterface } from './interfaces/rx-details-model.interface';
import { GeneralError } from '../../../shared/models/generic-app.model';

// tslint:disable-next-line:no-empty-interface
export class RxDetailsRequestModel extends BaseRxDetailsRequestModel implements RxDetailsRequestModelInterface {

}

export class RxDetailsResponseModel extends GeneralError implements RxDetailsResponseModelInterface {
    rxDetails: RxDetails;
}


