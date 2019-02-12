import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import {ErrorHandler, Injectable, NgModule} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule, MatTooltipModule } from '@angular/material';
import { MAT_LABEL_GLOBAL_OPTIONS } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { StorageServiceModule } from 'angular-webstorage-service';
import { MaterializeModule } from 'angular2-materialize';
import { MomentModule } from 'angular2-moment';
import { TextMaskModule } from 'angular2-text-mask';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { DialogModule } from 'primeng/primeng';
import { AppComponent } from './app.component';
import { appRouter } from './app.router';
import { MaterialModule } from './material.module';
import { LandingService } from './pages/landing/landing.service';
import { LoginModule } from './pages/login/login.module';
import { MyMedicationDetailsService } from './pages/medications/myMedicationDetails/my-medication-details.service';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { NotificationPreferencesService } from './pages/notification-preferences/notification-preferences.service';
import { AuthenticatedLayoutComponent } from './shared/layouts/AuthenticatedLayoutComponent/AuthenticatedLayout.component';
import { LogoDialogComponent } from './shared/logo-dialog/logo-dialog.component';
import { MenuDialogComponent } from './shared/menu-dialog/menu-dialog.component';
import { AppmodalsComponent } from './shared/modals/appmodals.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { HomepageResolver } from './shared/routeresolvers/homepage-resolver';
import { MyCardsResolverService } from './shared/routeresolvers/my-cards-resolver.service';
import { MyPlansResolverService } from './shared/routeresolvers/my-plans-resolver.service';
import { MyclaimsResolverService } from './shared/routeresolvers/myclaims-resolver.service';
import { MymedsResolverService } from './shared/routeresolvers/mymeds-resolver.service';
import { MyprofileResolverService } from './shared/routeresolvers/myprofile-resolver.service';
import { AuthService } from './shared/services/auth.service';
import { AuthHttp } from './shared/services/authHttp.service';
import { DependantsService } from './shared/services/dependant.service';
import { FilterService } from './shared/services/filter.service';
import { GlobalService } from './shared/services/global.service';
import { LayoutService } from './shared/services/layout.service';
import { MedicationsService } from './shared/services/medications/medications.service';
import { MyCardsService } from './shared/services/mycards/mycards.service';
import { ClaimsService } from './shared/services/myclaims/claims.service';
import { ProfileService } from './shared/services/myprofile/profile.service';
import { OrderreplacementService } from './shared/services/orderreplacement/orderreplacement.service';
import { OrderreplacementResolverService } from './shared/routeresolvers/orderreplacement-resolver';
import { SpinnerService } from './shared/services/spinner.service';
import { AlertService, ConstantsService, SharedModule } from './shared/shared.module';
import { SpinnertimeoutComponent } from './shared/spinnertimeout/spinnertimeout.component';
import { NoMenuResolver } from './shared/utils/nomenu.resolver';
import { MyplansService } from './pages/myplans/myplans.service';
import { NotificationPreferencesResolver } from './pages/notification-preferences/notification-preferences.resolver';
import { SsoResolver } from './pages/sso/sso.resolver';
import { SsoService } from './pages/sso/sso.service';
import { MyDedCoResolver } from './pages/myded-co/myded-co.resolver';
import { MyDedCoService } from './pages/myded-co/myded-co.service';
import { VdkComponent } from './pages/vdk/vdk.component';
import { HeaderService } from './shared/layouts/header/header.service';
import { FadResolverService } from './shared/routeresolvers/FadResolverService';
import {MyaccountResolver} from './pages/myaccount/myaccount.resolver';
import {MyAccountService} from './pages/myaccount/myaccount.service';
import {FinancialsLandingResolver} from './pages/financials/landing/financials-landing.resolver';
import {MakePaymentResolver} from './pages/financials/make-payment/make-payment.resolver';
import {SchedulePaymentResolver} from './pages/financials/schedule-payment/schedule-payment.resolver';
import {FinancialsLandingPageService} from './pages/financials/landing/financials-landing.service';
import {MakePaymentService} from './pages/financials/make-payment/make-payment.service';
import {SchedulePaymentService} from './pages/financials/schedule-payment/schedule-payment.service';
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: 'https://c2dbc6cd26174b9cba2f7fe66dbb2c09@sentry.io/1355335'
});

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() {}
  handleError(error) {
    Sentry.captureException(error.originalError || error);
    throw error;
  }
}


@NgModule({
  declarations: [
    AppComponent,
    NotfoundComponent,
    AppmodalsComponent,
    SpinnertimeoutComponent,
    VdkComponent,
    /* AuthCentralLayoutComponent,
     UnauthenticatedLayoutComponent,
     AuthenticatedLayoutComponent,
     SessionComponent,
     HeaderComponent,
     FooterComponent,
     VerifyaccesscodeComponent, */
    NavbarComponent
  ],
  exports: [
    AuthenticatedLayoutComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    MaterializeModule,
    LoginModule,
    appRouter,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    TextMaskModule,
    MomentModule,
    DialogModule,
    MaterialModule,
    MatCardModule,
    MatTooltipModule,
    MatTooltipModule,
    Ng4LoadingSpinnerModule,
    StorageServiceModule,
    NgIdleKeepaliveModule.forRoot()
  ],
  entryComponents: [
    MenuDialogComponent,
    LogoDialogComponent
  ],
  providers: [
    AlertService,
    AuthService, NoMenuResolver,
    ConstantsService,
    DependantsService,
    LayoutService,
    GlobalService,
    FilterService,
    AuthHttp,
    DatePipe,
    TitleCasePipe,
    SpinnerService,
    OrderreplacementResolverService, OrderreplacementService,
    MyprofileResolverService, ProfileService,
    MyCardsResolverService, MyCardsService,
    MymedsResolverService, MedicationsService,
    MyDedCoResolver,
    MyDedCoService,
    MyaccountResolver,
    MyAccountService,
    ClaimsService, MyclaimsResolverService,
    FadResolverService,
    SsoResolver,
    SsoService,
    LandingService,
    HomepageResolver,
    MyMedicationDetailsService,
    NotificationPreferencesService,
    NotificationPreferencesResolver,
    MyPlansResolverService,
    MyplansService,
    HeaderService,
    FinancialsLandingResolver,
    FinancialsLandingPageService,
    MakePaymentResolver,
    MakePaymentService,
    SchedulePaymentResolver,
    SchedulePaymentService,
    { provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'always' } },
    { provide: ErrorHandler, useClass: SentryErrorHandler }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
