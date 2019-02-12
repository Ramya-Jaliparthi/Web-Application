import {Component, OnInit} from '@angular/core';

import {GlobalService} from '../../../shared/services/global.service';
import {StaticInfo} from '../../../shared/models/staticInfo.model';

@Component({
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})

export class TermsComponent implements OnInit {
  termsOfServiceText: StaticInfo;

  constructor(private globalService: GlobalService) {
  }

  ngOnInit() {
    this.getTermsandConditions();
  }

  getTermsandConditions() {
    const termsAndConditionsIdentifier = 'termsAndConditions';
    const detailsFromStorage = this.getStaticdetailsFromStorage(termsAndConditionsIdentifier);
    let termsAndConditions;
    if (detailsFromStorage) {
      this.termsOfServiceText = this.transformTermsAndConditionsResponse(JSON.parse(detailsFromStorage));
    } else {
      this.globalService.getTermsAndConditions().subscribe(response => {
        if (response) {
          termsAndConditions = this.transformTermsAndConditionsResponse(response);
          this.termsOfServiceText = termsAndConditions;
          this.setStaticTextInStorage(termsAndConditionsIdentifier, JSON.stringify(termsAndConditions));
        }
      });
    }
  }

  getStaticdetailsFromStorage(identifier: string): string {
    const text = sessionStorage.getItem(identifier);
    return text ? text : '';
  }

  setStaticTextInStorage(identifier: string, text: string) {
    sessionStorage.setItem(identifier, text);
  }

  transformTermsAndConditionsResponse(response): StaticInfo {
    const termsAndConditions: StaticInfo = {
      title: response[0] ? response[0]['Title'] : response.title,
      body: response[0] ? response[0]['Body'] : response.body
    };
    return termsAndConditions;
  }

}
