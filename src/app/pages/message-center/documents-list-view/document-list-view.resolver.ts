import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { EocPolicyInterface } from '../modals/interfaces/getBenefitCoverage-models.interface';
import { DocumentsService } from '../documents/documents.service';


@Injectable()
export class DocumentsListViewResolverService implements Resolve<EocPolicyInterface> {

  constructor(private documentsService: DocumentsService) { }

  resolve(): EocPolicyInterface {

    return this.documentsService.getSelectedPolicy();

  }
}
