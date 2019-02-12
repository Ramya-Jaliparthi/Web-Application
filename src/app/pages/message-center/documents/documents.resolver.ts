import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { DocumentsService } from './documents.service';
import { GetPlansBenefitsListResponseModelInterface } from '../modals/interfaces/get-plans-benefits-list-models.interface';


@Injectable()
export class DocumentsResolverService implements Resolve<Promise<GetPlansBenefitsListResponseModelInterface>> {

  constructor(private documentsService: DocumentsService) { }

  async resolve(): Promise<GetPlansBenefitsListResponseModelInterface> {

    return await this.documentsService.getPlanDetailsList().toPromise();

  }
}
