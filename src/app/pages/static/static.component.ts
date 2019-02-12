import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './static.component.html',
  styleUrls: ['./static.component.scss']
})

export class StaticComponent implements OnDestroy {
  private sub;
  public displayClose: boolean = false;
  constructor(private location: Location, private route: ActivatedRoute) {

    this.sub = this.route.params.subscribe(params => {
      this.displayClose = params['type'] === 'notification' ? true : false;
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  closeScreen(): void {
    this.location.back();
  }
}
