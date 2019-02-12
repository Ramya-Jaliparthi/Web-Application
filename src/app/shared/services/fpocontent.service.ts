import { Injectable } from '@angular/core';
import { AuthHttp } from './authHttp.service';

@Injectable()
export class FpocontentService {

  constructor(private authHttp: AuthHttp) { }

  fetchContent(url: string) {
    return this.authHttp.get(url);
  }
}
