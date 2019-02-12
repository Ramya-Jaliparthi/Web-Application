import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {LandingService} from '../../pages/landing/landing.service';
import {HomePageInfoModel} from '../../pages/landing/landing.model';
import {AuthService} from '../shared.module';


@Injectable()
export class HomepageResolver implements Resolve<Observable<HomePageInfoModel>> {
  isRegisteredUser: boolean;

  constructor(private landingService: LandingService,
              private authService: AuthService) {
  }

  resolve() {
    return this.fetchHomePageInfo();
  }

  fetchHomePageInfo() {
    this.isRegisteredUser = this.authService.getScopeName().includes('REGISTERED');
    if (!this.isRegisteredUser) {
      return this.landingService.getHomepageinfo();
    }
  }

}
