import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { DocumentsService } from './documents.service';
import { GetBenefitCoverageResponseModelInterface } from '../modals/interfaces/getBenefitCoverage-models.interface';


@Injectable()
export class BenefitCoverageListResolverService implements Resolve<Promise<GetBenefitCoverageResponseModelInterface>> {

  constructor(private documentsService: DocumentsService) { }

  async resolve(): Promise<GetBenefitCoverageResponseModelInterface> {

    return await this.documentsService.getBenefitCoverageList().toPromise();

  }
}
