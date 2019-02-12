import { VisitDetailInterface } from './my-doctor-module-common-models.interface';
import { GeneralErrorInterface } from '../../../../shared/models/interfaces/generic-app-models.interface';
import { GetVisitDetailsRequestModelInterface } from './get-visit-details-models.interface';

export interface GetDependentVisitDetailsRequestModelInterface extends GetVisitDetailsRequestModelInterface {
    isDependent: boolean;
}

export interface GetDependentVisitDetailsResponseModelInterface extends GeneralErrorInterface {
    dependentVisitDetails: VisitDetailInterface;
}
