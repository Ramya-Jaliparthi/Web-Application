import { Observable } from 'rxjs/Observable';
import { AuthHttp } from './authHttp.service';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ConstantsService } from './constants.service';
import {
  DependentsResponseModelInterface,
  DependentInterimModelInterface
} from '../../pages/myclaims/models/interfaces/dependants-model.interface';
import { DependentsResponseModel } from '../../pages/myclaims/models/dependants.model';
import {
  DependentRecentRxRequestModelInterface,
  DependentRecentRxResponseModelInterface
} from '../../pages/medications/models/interfaces/dependant-recent-rx-model.interface';
import { DependentRecentRxRequestModel, DependentRecentRxResponseModel } from '../../pages/medications/models/dependant-recent-rx.model';
import { TitleCasePipe } from '@angular/common';

@Injectable()
export class DependantsService {
  dependantMedications$: Observable<any[]>;
  dependentsList: any;

  constructor(
    private http: AuthHttp,
    private authService: AuthService,
    private titleCasePipe: TitleCasePipe,
    private constantsService: ConstantsService
  ) {

  }


  clearDependantsList() {
    // this._dependants.next(null);
  }

  fetchDependentsList(): Observable<DependentsResponseModelInterface> {
    if (this.authService.dependentsList) {
      return Observable.of(this.authService.dependentsList);
    }
    const requestObj = {
      useridin: this.authService.useridin
    };
    return this.http.encryptPost(this.constantsService.dependentsUrl, requestObj);
  }

  getDependentsList() {
    return this.dependentsList;
  }

  loadDependants() {
    console.log('loadDependants');
    this.fetchDependentsList().subscribe(response => {
      this.setDependentList(response);
    }, err => {
      console.log('No dependants' + err.error());
    });
  }

  setDependentList(response: DependentsResponseModelInterface) {
    if (response === null || response['displaymessage'] || response['fault'] || response['type'] === 'error') {
      this.authService.setDependentsList(new DependentsResponseModel());
    } else {
      const dependentsList = response;
      this.authService.setDependentsList(dependentsList);
    }
  }

  loadDependantRecords(dependantId: number, url: string): Observable<DependentRecentRxResponseModelInterface> {
    this.http.showSpinnerLoading();

    const dependentRecentRxReq: DependentRecentRxRequestModelInterface = new DependentRecentRxRequestModel();
    dependentRecentRxReq.useridin = this.authService.useridin;
    dependentRecentRxReq.dependentId = dependantId;
    return this.http.encryptPost(url, dependentRecentRxReq).map(response => {
      if (response.result < 0) {
        this.http.hideSpinnerLoading();
        return new DependentRecentRxResponseModel();
      } else {
        return this.addDependentIdToRecords(response, dependantId);
      }
    });
  }

  addDependentIdToRecords(records, dependantId) {
    const dependantInfo: DependentInterimModelInterface = this.authService.getDependentsList().dependents
      .find((dependant) => dependant.dependent.depId === dependantId);
    let memberInfo = '';
    if (dependantInfo && dependantInfo.dependent.middleInitial) {
      // tslint:disable-next-line:max-line-length
      memberInfo = `${dependantInfo.dependent.firstName} ${dependantInfo.dependent.middleInitial} ${dependantInfo.dependent.lastName} (${dependantInfo.dependent.relationship})`;
    } else if (dependantInfo) {
      memberInfo = `${dependantInfo.dependent.firstName} ${dependantInfo.dependent.lastName} (${dependantInfo.dependent.relationship})`;
    }
    if (records && records.rxSummary && records.rxSummary.length > 0) {
      const updatedRecords = {};
      updatedRecords['rxSummary'] = records.rxSummary.map((record) => {
        return { ...record, MemberInfo: memberInfo, dependentId: dependantId };
      });
      return updatedRecords;
    }

    if (records && records.length === undefined && Object.keys(records).length) {
      return { ...records, MemberInfo: memberInfo, dependentId: dependantId };
    }

    return records;
  }
}
