import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';
import {Router} from '@angular/router';
import {RegistrationService} from '../registration.service';
import {AlertService} from '../../../shared/shared.module';
import {ValidationService} from '../../../shared/services/validation.service';
import {GlobalService} from '../../../shared/services/global.service';
import {ConstantsService} from '../../../shared/services/constants.service';
import { SecurityQuestion } from '../../../shared/models/securityQuestion.model';
import {AuthService} from '../../../shared/services/auth.service';
import {AlertType} from '../../../shared/alerts/alertType.model';

@Component({
  selector: 'app-security',
  templateUrl: './security-answers.component.html',
  styleUrls: ['./security-answers.component.scss']
})
export class SecurityComponent implements OnInit, OnDestroy {

  securityQuestionsForm: FormGroup;
  questions: SecurityQuestion[];
  lnqns: any;
  lnResponse: any;
  isUserMedicare: boolean;

  constructor(private alertService: AlertService,
              private fb: FormBuilder,
              private registrationService: RegistrationService,
              private router: Router,
              private validationService: ValidationService,
              private globalService: GlobalService,
              private constants: ConstantsService,
              private authService: AuthService) {
              setTimeout(() => {
                localStorage.setItem('submitExpiredStatus', '1');
                this.router.navigate(['/register/updatessn']).then(() => {
                  this.alertService.setAlert('Timeout error', '', AlertType.Failure);
                });
              }, 240000); // 1000 * 60 * 4
  }

  ngOnInit() {
    this.questions = this.getQuestions();
    this.securityQuestionsForm = this.fb.group({
      securityQuestions: this.fb.array([...this.getQuestionsControls()])
    });
    const storedResponse: any = sessionStorage.getItem('BBS_REG_QUESTIONS');
    if (storedResponse) {
      const storedJsonResponse = JSON.parse(storedResponse);
      this.lnqns = storedJsonResponse.Products[0].QuestionSet.Questions;
      this.lnResponse = storedJsonResponse;
    } else {
      this.router.navigate(['/register/updatessn']);
    }
    this.isUserMedicare = sessionStorage.getItem('userType') && sessionStorage.getItem('userType').toLowerCase() === 'medicare';
  }

  ngOnDestroy() {
    this.alertService.clearError();
  }
  getQuestionsControls(): Array<FormGroup> {
    return this.questions.map(question => this.fb.group({
      securityQuestion: ['', Validators.required]
    }));
  }

  get securityQuestions(): FormArray {
    return this.securityQuestionsForm.get('securityQuestions') as FormArray;
  }

  getQuestions(): SecurityQuestion[] {
    // TODO : get questions from the service
    const questions: SecurityQuestion[] = [{
      text: 'this is the first question',
      id: '1',
      options: [{
        label: 'label 1',
        value: 'value 1'
      },
        {
          label: 'label 2',
          value: 'value 2'
        }
      ]
    },
      {
        text: 'this is the second question',
        id: '1',
        options: [{
          label: 'label 1',
          value: 'value 1'
        },
          {
            label: 'label 2',
            value: 'value 2'
          }
        ]
      },
      {
        text: 'this is the third question',
        id: '1',
        options: [{
          label: 'label 1',
          value: 'value 1'
        },
          {
            label: 'label 2',
            value: 'value 2'
          }
        ]
      }
    ];
    return questions;
  }

  onSubmit() {

    const questions = [];
    for (let i = 0; i < this.lnqns.length; i++) {
      const quesId = this.lnqns[i].QuestionId;

      const choice_id = this.securityQuestionsForm.controls.securityQuestions['controls'][i].value.securityQuestion;

      const choices = [];
      const choice_obj = {
        'Choice': choice_id
      };

      choices.push(choice_obj);

      const questions_obj = {
        'QuestionId': quesId,
        'Choices': choices
      };

      questions.push(questions_obj);

    }

    const questionSetId = this.lnResponse.Products[0].QuestionSet.QuestionSetId;

    const postJson = {

      'Answers': {
        'QuestionSetId': questionSetId,
        'Questions': questions
      }
    };


    const generatedRequest = {
      useridin: this.authService.useridin,
      'convid': this.lnResponse.Status.ConversationId,
      'answerobject': postJson
    };
    this.registrationService.postLnAnswers(generatedRequest).subscribe(res1 => {
      console.log('Submitted response 2', res1);
      const result = isNaN(res1['result']) ? isNaN(res1['result']) : res1['result'].toString();
      if (result === '0' || result === 0) {
        this.handleSuccessScenario();
      } else  {
        this.router.navigate(['/register/updatessn']).then(() => {
          this.alertService.setAlert(res1['displaymessage'], '', AlertType.Failure);
        });
      }
    });
  }


  handleSuccessScenario() {
    this.registrationService.sendaccesscode().subscribe(res => {
    });
    this.router.navigate(['../register/verifyaccesscode']).then(res => {
      sessionStorage.removeItem('updatessn');
      sessionStorage.setItem('accesscode', 'true');
      this.alertService.setAlert('Verification code sent!', '', AlertType.Success);
    });
    sessionStorage.removeItem('userType');
  }

  navigateToAuthpage() {
    this.router.navigate(['/register/updatessn']);
  }
}
