import {
    GetDependentVisitDetailsRequestModelInterface,
    GetDependentVisitDetailsResponseModelInterface
} from './interfaces/get-dependent-visit-details-models.interface';
import { VisitDetail } from './my-doctor-module-common.model';
import { GeneralError } from '../../../shared/models/generic-app.model';
import { GetVisitDetailsRequestModel } from './get-visit-details.model';


export class GetDependentVisitDetailsRequestModel extends GetVisitDetailsRequestModel
    implements GetDependentVisitDetailsRequestModelInterface {
    isDependent: boolean;
}

export class GetDependentVisitDetailsResponseModel extends GeneralError
    implements GetDependentVisitDetailsResponseModelInterface {
    dependentVisitDetails: VisitDetail;
}
