import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MyDoctorsPcpService } from '../../mydoctors-pcp.service';
import { DependantsService } from '../../../../shared/services/dependant.service';
import { AuthService } from '../../../../shared/shared.module';
import { DependentsResponseModelInterface } from '../../../myclaims/models/interfaces/dependants-model.interface';

@Injectable()
export class DependentsResolver {
  observer: Observable<DependentsResponseModelInterface>[] = [];
  constructor(
    public dependantsService: DependantsService,
    public authService: AuthService) { }

  async resolve() {
    return await this.dependantsService.fetchDependentsList().toPromise();
    // .catch(() => {
    //   return Observable.empty();
    // });
  }

  // async resolve() {
  //   this.myDoctorService.getDoctorList().catch(() => {
  //     return Observable.empty();
  //   });
  //   await this.getAllDependants();
  //   console.log('Fetch All medications', 4);
  //   return forkJoin(this.observer).toPromise();
  // }

  // async getAllDependants() {
  //   const obs: Observable<DependentsResponseModelInterface>[] = [];
  //   obs.push(this.dependantsService.fetchDependentsList())
  //   this.observer = obs;
  // }

}
