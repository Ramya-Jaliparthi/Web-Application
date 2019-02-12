import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService, ConstantsService } from '../../shared/shared.module';
import { MedicationsService } from '../services/medications/medications.service';
import { DependentRecentRxResponseModelInterface } from '../../pages/medications/models/interfaces/dependant-recent-rx-model.interface';
import { GlobalService } from '../services/global.service';
import { DependantsService } from '../services/dependant.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { AuthHttp } from '../services/authHttp.service';

@Injectable()
export class MymedsResolverService {
  observer: Observable<DependentRecentRxResponseModelInterface>[] = [];

  constructor(public dependantsService: DependantsService,
    public authService: AuthService,
    public authHttp: AuthHttp,
    public globalService: GlobalService,
    private medicationsService: MedicationsService,
    private constantService: ConstantsService) {
  }

  async resolve() {
    await this.getAllMedications();
    console.log('Fetch All medications', this.observer);
    return forkJoin(this.observer).map(results => ({
      MemBasicInfo: results[0],
      MedRecords: results.slice(1)
    })).toPromise();
  }

  async getAllMedications() {
    const obs: Observable<any>[] = [];
    const hasDependents = this.authService.authToken && this.authService.authToken.hasDependents;
    if (hasDependents === 'true') {
      const depependentResponse = await this.getDependents();
      this.dependantsService.setDependentList(depependentResponse);
    }
    const dependantsInfo = this.authService.getDependentsList();
    obs.push(this.medicationsService.getMemBasicInfo());
    obs.push(this.medicationsService.getMedications());
    if (dependantsInfo && dependantsInfo.dependents) {
      dependantsInfo.dependents.forEach(dependant =>
        obs.push(this.dependantsService.loadDependantRecords(dependant.dependent.depId, this.constantService.depMedicationsUrl))
      );
    }
    this.observer = obs;
  }

  async getDependents() {
    const depependentInfo = await this.dependantsService.fetchDependentsList().toPromise();
    return depependentInfo;
  }

}
