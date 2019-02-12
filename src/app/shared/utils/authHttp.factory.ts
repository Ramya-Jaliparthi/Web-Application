import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AuthService } from '../services/auth.service';
import { AuthHttp } from '../services/authHttp.service';
import { ConstantsService } from '../services/constants.service';
import { SpinnerService } from '../services/spinner.service';

export function authHttpFactory(httpClient: HttpClient,
  authService: AuthService,
  constantsService: ConstantsService,
  spinner: SpinnerService
): HttpClientModule {
  return new AuthHttp(httpClient, authService, constantsService, spinner);
}
