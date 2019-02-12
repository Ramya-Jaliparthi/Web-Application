import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { GetBenefitTextResponseModelInterface } from '../modals/interfaces/getBenefitText-models.interface';
import { DocumentDetailService } from './document-detail.service';


@Injectable()
export class DocumentDetailResolverService implements Resolve<Promise<GetBenefitTextResponseModelInterface>> {

  constructor(private documentDetailService: DocumentDetailService) { }

  async resolve(): Promise<GetBenefitTextResponseModelInterface> {

    return await this.documentDetailService.getBenefitTextData().toPromise();

  }
}
