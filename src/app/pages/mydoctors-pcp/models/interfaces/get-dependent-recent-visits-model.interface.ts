
import {
    VisitsResponseInterface,
    MyDoctorsGenericRequestModelInterface
} from './my-doctor-module-common-models.interface';
import { GeneralErrorInterface } from '../../../../shared/models/interfaces/generic-app-models.interface';

// tslint:disable-next-line:no-empty-interface
export interface GetDependentRecentVisitsRequestModelInterface extends MyDoctorsGenericRequestModelInterface {

}

export interface GetDependentRecentVisitsResponseModelInterface extends GeneralErrorInterface {
    recentVisits: VisitsResponseInterface[];
}
