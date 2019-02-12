import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { DependantsService } from '../services/dependant.service';
import { MyCardsService } from '../services/mycards/mycards.service';
import { AuthService } from '../shared.module';

@Injectable()
export class MyCardsResolverService implements Resolve<Observable<any[]>>  {

  constructor(private dependantsService: DependantsService,
    private cardService: MyCardsService,
    public authService: AuthService) { }

  resolve() {
    const dependentList = this.authService.getDependentsList();
    return this.drawUserCard();
  }

  drawUserCard() {
    return forkJoin([
      this.cardService.getMemberFrontData$(),
      this.cardService.getMemberBackData$(),
      this.cardService.getMemBasicInfo()
    ]);
  }
}
