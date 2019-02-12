import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {RequestEstimateService} from './request-estimate.service';
import { DependantsService } from '../../shared/services/dependant.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { AuthService } from '../../shared/shared.module';

@Injectable()
export class RequestEstimateResolver implements Resolve<Observable<any>>{

  observer: Observable<any>[] = [];
  basicInfo: any;
  constructor(private globalService: RequestEstimateService,
    private dependantsService: DependantsService,
    private authService: AuthService) {
  }

  resolve() {
    const hasDependents = this.authService.authToken && this.authService.authToken.hasDependents;
    if (hasDependents && hasDependents === 'true') {
      return forkJoin([
        this.globalService.getMemBasicInfo(),
        this.dependantsService.fetchDependentsList()
      ]);
    } else {
      return this.globalService.getMemBasicInfo();
    }
  }

  // getMemBasicInfo() {
  //   this.globalService.getMemBasicInfo().subscribe((response) => {
  //     if (response && response.rxSummary && response.rxSummary.hasDependents) {
  //       this.basicInfo = response;
  //       this.observer.push(this.dependantsService.fetchDependentsList());
  //     }
  //   });
  // }
}
