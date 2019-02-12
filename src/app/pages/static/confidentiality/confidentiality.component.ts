import {Component, OnDestroy, OnInit} from '@angular/core';
import {GlobalService} from '../../../shared/services/global.service';
import {StaticInfo} from '../../../shared/models/staticInfo.model';
import {AlertService} from '../../../shared/services/alert.service';

@Component({
  templateUrl: './confidentiality.component.html',
  styleUrls: ['./confidentiality.component.scss']
})

export class ConfidentialityComponent implements OnInit, OnDestroy {
  confidentialityText: StaticInfo;

  constructor(private globalService: GlobalService,
              private alertService: AlertService) {

  }

  ngOnInit() {
    this.getConfidentialityText();
  }

  ngOnDestroy() {
    this.alertService.clearError();
  }

  getConfidentialityText() {
    const confidentialityIdentifier = 'confidentialityText';
    const detailsFromStorage = this.getStaticdetailsFromStorage(confidentialityIdentifier);
    let confidentiality;
    if (detailsFromStorage) {
      this.confidentialityText = this.transformTermsAndConditionsResponse(JSON.parse(detailsFromStorage));
    } else {
      this.globalService.getConfidentiality().subscribe(response => {
        if (response) {
          confidentiality = this.transformTermsAndConditionsResponse(response);
          this.confidentialityText = confidentiality;
          this.setStaticTextInStorage(confidentialityIdentifier, JSON.stringify(confidentiality));
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
