import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'hammerjs';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import 'hammerjs';

console.clear();
console.log('%cBuild Id (or) web version:', 'background: #222; color: #bada55', environment.appversion);
// console.error('asdasd');
// console.warn(environment.appversion);
if (environment.production) {
  enableProdMode();
  if (!environment.enableconsolelog) {
    window.console.log = function () {
    };
  }
}

platformBrowserDynamic().bootstrapModule(AppModule);
