import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { BcbsmaHttpService } from '../../../shared/services/bcbsma-http.service';
import { UploadedDocInfoRequestModelInterface, UploadDataItemInterface } from '../modals/interfaces/uploads.interface';

@Injectable()
export class UploadDetailsService {

  constructor(private bcbsmaHttpService: BcbsmaHttpService) { }

  public getDocumentData(uploadedDocInfoRequest: UploadedDocInfoRequestModelInterface):
    Observable<UploadDataItemInterface> {
    let backendServiceUrl: string;

    backendServiceUrl = '/assets/data/messageCenterModule/uploadDetailsComponent_SampleData.json';

    return this.bcbsmaHttpService.get(backendServiceUrl);
  }
}
