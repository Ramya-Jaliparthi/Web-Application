import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
    selector: 'app-mypreferences',
    templateUrl: './mypreferences.component.html',
    styleUrls: ['./mypreferences.component.scss']
  })

  export class MyPreferencesComponent  {
 constructor(
      private router: Router
    ) {}
}
