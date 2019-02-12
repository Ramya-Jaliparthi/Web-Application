import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../shared/services/auth.service';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.scss']
})

export class NotfoundComponent implements OnInit {

  // redirectionMethodMapping = {
  //   'REGISTERED-NOT-VERIFIED': 'redirectToLandingPage',
  //   'AUTHENTICATED-AND-VERIFIED': 'handleAuthenticateAndVerifiedCase',
  //   'AUTHENTICATED-NOT-VERIFIED': 'redirectToLandingPage'
  // };

  constructor(private router: Router,
    private authService: AuthService) {
  }

  ngOnInit() {
    if (!this.authService.authToken) {
      this.redirectToLoginPage();
    } else {
      const scopeName = this.authService.authToken.scopename;
      if (scopeName === null) {
        this.redirectToLoginPage();
      } else if (scopeName === 'REGISTERED-NOT-VERIFIED' || scopeName === 'REGISTERED-AND-VERIFIED'
        || scopeName === 'AUTHENTICATED-NOT-VERIFIED') {
        this.redirectToHomePage();
      } else if (scopeName === 'AUTHENTICATED-AND-VERIFIED') {
        this.handleAuthenticateAndVerifiedCase();
      }
    }
  }



  handleAuthenticateAndVerifiedCase() {
    if (localStorage.getItem('targetRoute')) {
      console.log('from default landing component' + localStorage.getItem('targetRoute'));
      const targetRoute = localStorage.getItem('targetRoute');
      localStorage.removeItem('targetRoute');
      this.router.navigate(['./' + targetRoute]);
    } else {
      this.redirectToHomePage();
    }
  }

  redirectToLoginPage() {
    this.router.navigate(['./login']);
  }

  redirectToHomePage() {
    this.router.navigate(['./home']);
  }

}
