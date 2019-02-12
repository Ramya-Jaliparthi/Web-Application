import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { UploadsResponseDataModelInterface } from '../modals/interfaces/uploads.interface';
import { BcbsmaHttpService } from '../../../shared/services/bcbsma-http.service';

@Injectable()
export class UploadsService {

  constructor(private bcbsmaHttpService: BcbsmaHttpService) { }

  public getUploadedData(): Observable<UploadsResponseDataModelInterface> {
    let backendServiceUrl: string;

    backendServiceUrl = '/assets/data/messageCenterModule/uploadsComponent_SampleData.json';

    return this.bcbsmaHttpService.get(backendServiceUrl);
  }

}
