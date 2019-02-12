import { Component, HostListener, OnInit } from '@angular/core';
import { ConstantsService, AuthService } from '../../../shared/shared.module';

@Component({
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})

export class MaintenanceComponent implements OnInit {
  mobileViewPort = 992;
  ismobile: boolean;
  contactus = this.constants.contactus + this.authService.authToken.scopename;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth <= this.mobileViewPort) {
      this.ismobile = true;
    } else {
      this.ismobile = false;
    }
  }

  constructor(public constants: ConstantsService,
    public authService: AuthService) {

  }

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

}
