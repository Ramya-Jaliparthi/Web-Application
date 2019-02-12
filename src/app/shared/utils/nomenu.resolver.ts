import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Resolve } from '@angular/router';

@Injectable()
export class NoMenuResolver implements Resolve<any> {
    constructor(private router: Router) {
    }

    resolve(route: ActivatedRouteSnapshot): any {
        return  false; // dont show menu when applied
    }
}


