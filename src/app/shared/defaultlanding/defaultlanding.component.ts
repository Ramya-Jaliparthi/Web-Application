import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-defaultlanding',
  templateUrl: './defaultlanding.component.html',
  styleUrls: ['./defaultlanding.component.scss']
})
export class DefaultlandingComponent implements OnInit {

  constructor(private authService: AuthService,
              private router: Router,
  ) {
  }

  ngOnInit() {
    if (!this.authService.authToken) {
      this.router.navigate(['./login']);
    } else {
      if (this.authService.authToken.scopename === null) {
        this.router.navigate(['./login']);
      } else if (this.authService.authToken.scopename === 'REGISTERED-NOT-VERIFIED') {
        this.router.navigate(['./home']);
      } else if (this.authService.authToken.scopename === 'AUTHENTICATED-AND-VERIFIED') {

        if (localStorage.getItem('targetRoute')) {
          console.log('from default landing component' + localStorage.getItem('targetRoute'));
          const targetRoute = localStorage.getItem('targetRoute');
          localStorage.removeItem('targetRoute');
          this.router.navigate(['./' + targetRoute]);
        } else {
          // TODO: create page - auth home page with claims page link and for all newly developed.
          this.router.navigate(['./home']);
        }
      } else if (this.authService.authToken.scopename === 'AUTHENTICATED-NOT-VERIFIED') {
        this.router.navigate(['./home']);
      }
    }
  }

}
