import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';

@Injectable()
export class LayoutService {
  title: string;
  breadcrumbTitle: string;
  breadcrumbLink: string;

  constructor() {

  }

  setLayout(title, breadcumbTitle, breadcrumbLink)  {
    this.breadcrumbTitle = breadcumbTitle;
    this.breadcrumbLink = breadcrumbLink;
    this.title = title;
  }

  setPageMeta(routeSnapshot: ActivatedRouteSnapshot) {
    if (routeSnapshot.firstChild) {
      this.setPageMeta(routeSnapshot.firstChild);
    } else {
      this.title = (routeSnapshot.data) ? routeSnapshot.data['pageTitle'] : '';
      this.breadcrumbLink = (routeSnapshot.data) ? routeSnapshot.data['breadcrumbLink'] : '';
      this.breadcrumbTitle = (routeSnapshot.data) ? routeSnapshot.data['breadcrumbTitle'] : '';
    }

  }
}
