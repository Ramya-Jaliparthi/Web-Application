import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../shared.module';
import { DependentRecentRxResponseModelInterface } from '../../pages/medications/models/interfaces/dependant-recent-rx-model.interface';
import { DependantsService } from '../services/dependant.service';


@Injectable()
export class FadResolverService {
    observer: Observable<DependentRecentRxResponseModelInterface>[] = [];

    constructor(public dependantsService: DependantsService,
        public authService: AuthService) {
      }

    async resolve() {
        await this.getAllDependents();
        return this.observer;
    }

    async getAllDependents() {
        const obs: Observable<any>[] = [];
        const hasDependents = this.authService.authToken && this.authService.authToken.hasDependents;

        if (hasDependents === 'true') {
          const depependentResponse = await this.getDependents();
          this.dependantsService.setDependentList(depependentResponse);
        }

        this.observer = obs;
    }

    async getDependents() {
        const depependentInfo = await this.dependantsService.fetchDependentsList().toPromise();
        return depependentInfo;
    }
}