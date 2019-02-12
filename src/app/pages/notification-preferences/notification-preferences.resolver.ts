import {Injectable} from '@angular/core';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {NotificationPreferencesService} from './notification-preferences.service';

@Injectable()
export class NotificationPreferencesResolver {

  constructor(private notifyService: NotificationPreferencesService) {
  }

  resolve() {
    return this.getCommStatus().map((result) => ({
      commstatus: result[0]
    }));
  }

  getCommStatus() {
    return forkJoin(this.notifyService.getcommStatus());
  }
}
