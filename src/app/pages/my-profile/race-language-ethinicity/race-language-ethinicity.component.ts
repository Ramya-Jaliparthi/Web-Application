import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment.qa';
import { AlertType } from '../../../shared/alerts/alertType.model';
import { ProfileService } from '../../../shared/services/myprofile/profile.service';
import { AlertService } from '../../../shared/shared.module';
import { UpdateDemographicInfoRequestModel } from '../models/update-demographic-info.model';
@Component({
  selector: 'app-race-language-ethinicity',
  templateUrl: './race-language-ethinicity.component.html',
  styleUrls: ['./race-language-ethinicity.component.scss']
})

export class RaceLanguageEthinicityComponent implements OnInit {
  raceForm: FormGroup;
  isFormSubmitted: boolean = false;
  showRaceForm: boolean = false;
  fpoTargetUrl = environment.drupalTestUrl + '/page/myprofile';

  raceList: { code: string; description: string }[];
  ethnicityList: { code: string; description: string }[];
  latinoOriginList: { code: string; description: string }[];
  languageList: { code: string; description: string }[];
  showEthenicity2Flag: boolean = false;
  showRace2Flag: boolean = false;

  constructor(private alertService: AlertService,
    private fb: FormBuilder,
    private router: Router,
    private profileService: ProfileService) {

    this.raceForm = this.fb.group({
      race1: ['', this.raceForm && this.raceForm.value.agree ? [Validators.required] : []],
      race2: ['', []],
      ethnicity1: ['', this.raceForm && this.raceForm.value.agree ? [Validators.required] : []],
      ethnicity2: ['', []],
      latinoOrigin: ['', this.raceForm && this.raceForm.value.agree ? [Validators.required] : []],
      primaryLang: ['', this.raceForm && this.raceForm.value.agree ? [Validators.required] : []],
      memberDOB: ['', []],
      agree: [false, []]
    });
    this.alertService.clearError();
  }

  ngOnInit() {
    this.profileService.getDemoGraphicInfo().subscribe(demoGraphicResponse => {

      const raceFormData: any = Object.create({
        race1: demoGraphicResponse.race1,
        race2: demoGraphicResponse.race2,
        ethnicity1: demoGraphicResponse.ethnicity1,
        ethnicity2: demoGraphicResponse.ethnicity2,
        latinoOrigin: demoGraphicResponse.latinoOrigin,
        primaryLang: demoGraphicResponse.primaryLang,
        memberDOB: demoGraphicResponse.memberDOB,
        agree: demoGraphicResponse.agree
      });

      this.showRaceForm = demoGraphicResponse.agree;
      this.raceList = demoGraphicResponse.raceList;
      this.ethnicityList = demoGraphicResponse.ethnicityList;
      this.latinoOriginList = demoGraphicResponse.latinoOriginList;
      this.languageList = demoGraphicResponse.languageList;
      console.log('raceFormData = ' + raceFormData.__proto__, JSON.stringify(raceFormData.__proto__));
      this.raceForm.setValue(raceFormData.__proto__);
      if (this.raceForm.get('race2').value !== '') {
        this.showRace2Flag = true;
      }
      if (this.raceForm.get('ethnicity2').value !== '') {
        this.showEthenicity2Flag = true;
      }
    }, error => {
      throw error;
    });
  }

  provideInfo() {
    this.showRaceForm = !this.showRaceForm;
    this.showRace2Flag = false;
    this.showEthenicity2Flag = false;
    this.raceForm = this.fb.group({
      race1: ['', this.showRaceForm ? [Validators.required] : []],
      race2: ['', []],
      ethnicity1: ['', this.showRaceForm ? [Validators.required] : []],
      ethnicity2: ['', []],
      latinoOrigin: ['', this.showRaceForm ? [Validators.required] : []],
      primaryLang: ['', this.showRaceForm ? [Validators.required] : []],
      memberDOB: ['', []],
      agree: [this.showRaceForm, []]
    });
  }

  onSubmit() {
    const updateDemographicInfoReq: UpdateDemographicInfoRequestModel = new UpdateDemographicInfoRequestModel();
    updateDemographicInfoReq.useridin = this.profileService.getProfile().useridin;
    updateDemographicInfoReq.agree = this.raceForm.value.agree;
    updateDemographicInfoReq.race1 = this.raceForm.value.race1;
    updateDemographicInfoReq.race2 = this.raceForm.value.race2;
    updateDemographicInfoReq.ethnicity1 = this.raceForm.value.ethnicity1;
    updateDemographicInfoReq.ethnicity2 = this.raceForm.value.ethnicity2;
    updateDemographicInfoReq.latinoOrigin = this.raceForm.value.latinoOrigin;
    updateDemographicInfoReq.primaryLang = this.raceForm.value.primaryLang;
    updateDemographicInfoReq.memberDOB = this.raceForm.value.memberDOB;
    this.profileService.updateDemographicInfo(updateDemographicInfoReq).subscribe(updateDemographicInfoResp => {
      this.alertService.setAlert('Success!', '', AlertType.Success);
      this.router.navigate(['/myprofile']);
    }, error => {
      throw error;
    });
  }

  cancel() {
    this.router.navigate(['../../myprofile']);
  }

  showEthenicity2() {
    this.showEthenicity2Flag = true;
  }

  showRace2() {
    this.showRace2Flag = true;
  }
}
