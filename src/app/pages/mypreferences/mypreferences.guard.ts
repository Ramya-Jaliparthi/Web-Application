import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Resolve } from '@angular/router';
// Non-angular modules
import { Observable } from 'rxjs/Observable';
import { MessageCategory } from './mypreferences.model';
import { MyPrefService } from './mypreferences.service';
import { MyPrefConst } from './mypreferences.constants';
// Custom modules
import { AuthService } from '../../shared/services/auth.service';
import { GlobalService } from '../../shared/services/global.service';
import { ConstantsService } from '../../shared/services/constants.service';
import { GetMemberProfileResponseModel } from '../my-profile/models/get-member-profile-request.model';
// import { Profile } from '../my-profile/profile.model';

@Injectable()
export class MyPrefALGGuard implements CanActivate {
    hasAlegeusAccount: boolean = false;

    constructor(private router: Router,
        private authService: AuthService,
        private constants: ConstantsService,
        private globalService: GlobalService) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        const desiredURL = state.url;
        const sourceURL = this.router.url;
        let scopename: string;
        scopename = this.authService.authToken ? this.authService.authToken.scopename : '';
        // TODO - move all these methods based on scopes to central if needed.
        switch (scopename) {
            case 'REGISTERED-NOT-VERIFIED':
            case 'REGISTERED-AND-VERIFIED':
                // dont allow but navigate them to notifications
                this.router.navigate(['/mypreferences/notifications']);
                return false;
            case 'ACTIVE-AUTHENTICATED-NOT-VERIFIED':
            case 'ACTIVE-AUTHENTICATED-AND-VERIFIED': {
                this.globalService.memberData$.subscribe(data => {
                    if (data !== null && data !== undefined) {
                        if (data.hasALG !== null && data.hasALG !== undefined) {
                            this.hasAlegeusAccount = Boolean(data.hasALG);
                        }
                    }
                });
                if (this.hasAlegeusAccount) {
                    return true;
                } else {
                    // dont allow but navigate them to notifications
                    this.router.navigate(['/mypreferences/notifications']);
                    return false;
                }
            }
            default: {
                return false;
            }
        }
    }
}


@Injectable()
export class MyPrefAVScopeGuard implements CanActivate {
    constructor(private router: Router,
        private authService: AuthService,
        private constants: ConstantsService,
        private globalService: GlobalService) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        const desiredURL = state.url;
        const sourceURL = this.router.url;
        let scopename: string;
        scopename = this.authService.authToken ? this.authService.authToken.scopename : '';
        switch (scopename) {
            case 'REGISTERED-NOT-VERIFIED':
            case 'REGISTERED-AND-VERIFIED':
            case 'ACTIVE-AUTHENTICATED-NOT-VERIFIED': {
                return false;
            }
            case 'ACTIVE-AUTHENTICATED-AND-VERIFIED': {
                return true;
            }
            default: {
                return false;
            }
        }
    }
}

@Injectable()
export class MyPrefAPIResolver implements Resolve<MessageCategory[]> {
    constructor(private router: Router,
        private authService: AuthService,
        private constants: ConstantsService,
        private globalService: GlobalService,
        private myprefservice: MyPrefService) {
    }

    resolve(route: ActivatedRouteSnapshot) {
        let HealthPromoRows: MessageCategory[] = [];
        this.myprefservice.fetchMyPref().subscribe(resp => {
            switch (route.url.toString()) { // TODO change to params
                case 'mandatory':
                    HealthPromoRows = this.myprefservice.getMyPrefNotifcationMandates(resp);
                    break;
                case 'accountActivity':
                    break;
                case 'smartshopper':
                    break;
                case 'financials':
                    break;
                case 'healthyUpdates':
                    break;
                case 'myinbox':
                    break;
                default:
                    break;
            }
        });
        return HealthPromoRows;
    }
}

@Injectable()
export class MyProfileAPIResolver implements Resolve<GetMemberProfileResponseModel> {
    constructor(private router: Router,
        private authService: AuthService,
        private constants: ConstantsService,
        private globalService: GlobalService,
        private myprefservice: MyPrefService,
        private myPrefConstants: MyPrefConst) {
    }

    resolve(route: ActivatedRouteSnapshot): GetMemberProfileResponseModel {
        // get profile details
        let myprofile: GetMemberProfileResponseModel;
        this.myprefservice.fetchProfileInfo().subscribe(profile => {
            if (profile) {
                this.myPrefConstants.commChannels[1].isVerified = profile.isVerifiedEmail; // emailAddressConfirmed;
                this.myPrefConstants.commChannels[0].isVerified = profile.isVerifiedMobile; // mobileNumberConfirmed;
                this.myPrefConstants.commChannels[1].onFile = profile.emailAddress ? true : false;
                this.myPrefConstants.commChannels[0].onFile = profile.phoneNumber ? true : false; // mobileNumber ? true : false;
                // this.myPrefConstants.commChannels[4].isVerified = profile.address;
                myprofile = profile;
            }
        });
        return myprofile;
    }
}
