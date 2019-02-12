import {Component, OnInit, Input, OnChanges, OnDestroy} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {BreadCrumb} from './breadcrumbs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit, OnChanges, OnDestroy  {
  breadcrumbs$: Array<BreadCrumb>;
  routerEvents: any;
  @Input('breadCrumbs') breadCrumbs: BreadCrumb[];

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {

  }
  ngOnChanges() {
    this.breadcrumbs$ = this.breadCrumbs;
  }
  ngOnDestroy() {
    if (this.routerEvents) {
      this.routerEvents.unsubscribe();
    }
  }
  ngOnInit() {
    this.breadcrumbs$ = this.breadCrumbs;
    if (!(this.breadCrumbs && this.breadCrumbs.length)) {
      this.breadcrumbs$ = this.buildBreadCrumb(this.activatedRoute.root);
      this.routerEvents = this.router.events.subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
          this.breadcrumbs$ = this.buildBreadCrumb(this.activatedRoute.root);
        }
      });
    }
  }

  getLabel(param: string) {
    let Label = param;
    switch (param) {
      case 'claimdetails':
        Label = 'Claim Details';
        break;
      case 'claimstatusdetails':
        Label = 'Claim Status Details';
        break;
      case 'race':
        Label = 'Race Ethnicity Language';
        break;
      case 'updatePassword':
        Label = 'Update Password';
        break;

    }
    return Label;

  }

  buildBreadCrumb(
    route: ActivatedRoute,
    urlArray: Array<any> = [],
    breadcrumbs: Array<any> = []
  ): Array<BreadCrumb> {
    let newBreadCrumbs = JSON.parse(JSON.stringify(breadcrumbs));
    let newUrlArray = JSON.parse(JSON.stringify(urlArray));
    // skip the bread crumb if empty and home
    if (
      route.routeConfig &&
      (route.routeConfig.path)
    ) {
      const label =
        route.routeConfig.data && route.routeConfig.data['breadcrumb'];
      const keys = Object.keys(route.snapshot.params);
      if (!urlArray.length) {
        newBreadCrumbs.push({
          label: 'Home',
          url: '/home',
          isActive: true
        });
      }
      if (!keys.length) {
        const routePaths = route.routeConfig.path;
        const path = !urlArray.length ? `/${routePaths}` : `${routePaths}`;
        newUrlArray.push(path);
        newBreadCrumbs.push({
          label: label,
          url: newUrlArray,
          isActive: true // !route.snapshot.component ? false : true
        });
      }
      Object.keys(route.snapshot.params).forEach((param, sIndex) => {
        const breadCrumbLabel = this.getLabel(route.snapshot.params[param]);
        newUrlArray = [...newUrlArray, route.snapshot.params[param]];
        newBreadCrumbs = [
          ...newBreadCrumbs,
          {
            label: breadCrumbLabel,
            url: newUrlArray,
            isActive: true
          }
        ];
      });
    }
    if (route.firstChild) {
      return this.buildBreadCrumb(
        route.firstChild,
        newUrlArray,
        newBreadCrumbs
      );
    }
    let finalbreadcrumb;
    const benefitsArray = [{label: 'Home', url: '/home', isActive: true},
      {label: 'My Plans', url: ['/myplans'], isActive: true},
      {label: 'Plan Details', url: ['/myplans', 'plandetails'], isActive: true},
      {label: 'Plan Benefits', url: ['/myplans', 'benefits'], isActive: true}];
    newBreadCrumbs.forEach((res) => {
      if (res.label === 'Plan Benefits') {
        finalbreadcrumb = benefitsArray;
      } else if (res.label === 'Benefit Details') {
        benefitsArray.push({label: 'Benefit Details', url: ['/myplans', 'benefitdetails'], isActive: true});
        finalbreadcrumb = benefitsArray;
      } else {
        finalbreadcrumb = newBreadCrumbs;
      }
    });
    return finalbreadcrumb;
  }

}
