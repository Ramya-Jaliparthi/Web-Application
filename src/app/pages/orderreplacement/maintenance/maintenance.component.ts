import { Component, OnInit, HostListener } from '@angular/core';
import { ConstantsService, AuthService } from '../../../shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {
  mobileViewPort = 992;
  ismobile: boolean;
  contactus = this.constants.contactus + this.authService.authToken.scopename;
  urlConfig = {
    myplans: '../myplans',
    myaccount: '../myaccount',
    fad: '../fad'
  };

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth <= this.mobileViewPort) {
      this.ismobile = true;
    } else {
      this.ismobile = false;
    }
  }
  constructor(public constants: ConstantsService,
    public authService: AuthService,
    private router: Router,
    private r: ActivatedRoute) { }

  ngOnInit() {
  }
  openContactUs() {
    window.open(this.contactus, '_self');
  }

  openUrl(url) {
    if (url) {
      window.open(url, '_self');
    }
  }

  openSsoUrl(url) {
    if (url) {
      window.open(url, '_blank');
    }
  }
  navigate(id, routeParams?) {
    const url = this.urlConfig[id];

    if (url) {
      if (!routeParams) {
        this.router.navigate([url], { relativeTo: this.r });
      } else {
        this.router.navigate([url], { relativeTo: this.r });

      }
    } else {
      return;
    }
  }
}
