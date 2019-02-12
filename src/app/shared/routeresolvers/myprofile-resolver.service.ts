import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
// import { Profile } from '../models/myprofile/profile.model';
import { ProfileService } from '../services/myprofile/profile.service';
import { GetMemberProfileResponseModel } from '../../pages/my-profile/models/get-member-profile-request.model';


@Injectable()
export class MyprofileResolverService implements Resolve<Observable<GetMemberProfileResponseModel>>{ // Profile>> {

  constructor(private profileService: ProfileService) { }

  resolve() {
    // this.getMemberInfo();
    return this.fetchProfileInfo();
  }

  // getMemberInfo() {
  //   this.profileService.getMemberInfo();
  // }

  fetchProfileInfo() {
    return this.profileService.fetchProfileInfo();
    /*subscribe(profile => {
      const profileReturn: Profile = profile;
      this.profileService.setProfile(profileReturn);
      return profileReturn;
    });*/
  }

}