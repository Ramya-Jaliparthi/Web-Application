import { NgModule } from '@angular/core';
import { VdkComponent } from './vdk.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { vdkRouter } from './vdk.routing';
import { VdkService } from './vdk.service';
import { AuthHttp } from '../../shared/services/authHttp.service';
import { authHttpFactory } from '../../shared/utils/authHttp.factory';
import { AuthService } from '../../shared/services/auth.service';
import {ConstantsService} from '../../shared/services/constants.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { LoginService } from '../login/login.service';
import { LoginRouter } from '../login/login.routing';

@NgModule({
  declarations: [
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    LoginRouter,
    HttpClientModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    LoginService,
    {
      'provide': AuthHttp,
      'useFactory': authHttpFactory,
      'deps': [HttpClient, AuthService, ConstantsService],
    }
  ]
})
export class LoginModule { }
