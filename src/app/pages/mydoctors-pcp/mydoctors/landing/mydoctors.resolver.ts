import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MyDoctorsPcpService } from '../../mydoctors-pcp.service';
import { DependentsResponseModelInterface } from '../../../myclaims/models/interfaces/dependants-model.interface';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { AuthService } from '../../../../shared/services/auth.service';
import { DependantsService } from '../../../../shared/services/dependant.service';
import { MedicationsService } from '../../../../shared/services/medications/medications.service';
import { ConstantsService } from '../../../../shared/shared.module';

@Injectable()
export class MyDoctorsResolver {
  observer: Observable<DependentsResponseModelInterface>[] = [];
  constructor(private myDoctorService: MyDoctorsPcpService,
    private authService: AuthService,
    private dependantsService: DependantsService,
    private medicationService: MedicationsService,
    private constantService: ConstantsService) { }

  // async resolve() {
  //   return await this.myDoctorService.getDoctorList().toPromise();
  //   // return this.myDoctorService.getDoctorList().catch(() => {
  //   //   return Observable.empty();
  //   // });
  // }


  async resolve() {
    await this.getDoctorList();
    console.log('Fetch All Doctors', this.observer);
    return forkJoin(this.observer).map(results => ({
      MemBasicInfo: results[0],
      DoctorList: results.slice(1)
    })).toPromise();
  }

  async getDoctorList() {
    const obs: Observable<any>[] = [];
    const hasDependents = this.authService.authToken && this.authService.authToken.hasDependents;
    console.log(hasDependents);
    if (hasDependents === 'true') {
      const depependentResponse = await this.dependantsService.fetchDependentsList().toPromise();
      this.dependantsService.setDependentList(depependentResponse);
    }
    const dependantsInfo = this.authService.getDependentsList();
    obs.push(this.medicationService.getMemBasicInfo());
    obs.push(this.myDoctorService.getDoctorList());
    if (dependantsInfo && dependantsInfo.dependents) {
      dependantsInfo.dependents.forEach(dependant =>
        obs.push(this.myDoctorService.loadDependantRecords(dependant.dependent.depId, this.constantService.myDepDoctorListUrl))
      );
    }
    this.observer = obs;
  }
}
