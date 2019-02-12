import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-unauthenticated-home',
  templateUrl: './UnauthenticatedLayout.component.html',
  styleUrls: ['./UnauthenticatedLayout.component.scss']
})
export class UnauthenticatedLayoutComponent implements OnInit {
  isLoginPage = true;
  isRegisterPage = false;
  isRegisterSuccess = false;
  isLogin = false;
  currentYear: any = '';
  isCenterLayoutScreen = true;
  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService) {

  }
  ngOnInit() {

    this.authService.getScopeName() === 'AUTHENTICATED-AND-VERIFIED' ? this.isLogin = true : this.isLogin = false;
    this.currentYear = (new Date()).getFullYear();


    if (this.router.url !== '/login') {
      this.isLoginPage = false;
    }

    if (this.router.url === '/register') {
      this.isRegisterPage = true;
    }

    if (this.router.url === '/register/success') {
      this.isRegisterSuccess = true;
    }

    if (this.router.url === '/registrationPromo') {
      this.isCenterLayoutScreen = false;
    }


    this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .map((route) => {
        while (route.firstChild) route = route.firstChild;
        return route;
      })
      .filter((route) => route.outlet === 'primary')
      .subscribe((event) => {
        if (event.component['name'] !== 'LoginComponent') {
          this.isLoginPage = false;
        } else {
          this.isLoginPage = true;
        }

        if (event.component['name'] === 'RegisterComponent') {
          this.isRegisterPage = true;
        } else {
          this.isRegisterPage = false;
        }

        if (event.component['name'] === 'SuccessInfoComponent') {
          this.isRegisterSuccess = true;
        } else {
          this.isRegisterSuccess = false;
        }
      });
  }

  register() {
    this.router.navigate(['../register']);
  }

  signIn() {
    this.router.navigate(['../login']);
  }
}
