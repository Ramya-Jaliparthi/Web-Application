import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterializeModule } from 'angular2-materialize';
import { MaterialModule } from '../material.module';
import { VerifyaccesscodeComponent } from '../pages/registration/verifyaccesscode/verifyaccesscode.component';
import { AlertsComponent } from './alerts/alerts.component';
import { ControlMessagesComponent } from './app-control-messages/app-control-messages.component';
import { DynamicPromotionalContentComponent } from './components/dynamic-promotional-content/dynamic-promotional-content.component';
import { FilterComponent } from './components/filter/filter.component';
import {AlegeusLineChartComponent} from './components/alegeus-line-chart/line-chart.component';
import { PromoBlocksComponent } from './components/promo/promo-blocks/promo-blocks.component';
import { PromoCarouselComponent } from './components/promo/promo-carousel/promo-carousel.component';
import { PromoImagesComponent } from './components/promo/promo-images/promo-images.component';
import { PromosService } from './components/promo/promos.service';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { DefaultlandingComponent } from './defaultlanding/defaultlanding.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { NumberOnlyDirective } from './directives/number-only.directive';
import { NoFirstPoundDirective } from './directives/no-first-pound.directive';
import { DateFormatValidation } from './directives/dateformatvalidation.directive';
import { FocusDirective } from './directives/focus.directive';
import { drupalDirective } from './directives/drupal.directive';
import { AppMatSelectChangeDirective } from './directives/mat-select-change.directive';
import { AuthCentralLayoutComponent } from './layouts/AuthCentralLayoutComponent/AuthCenralLayout.component';
import { AuthenticatedLayoutComponent } from './layouts/AuthenticatedLayoutComponent/AuthenticatedLayout.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { FooterService } from './layouts/footer/footer.service';
import { FpoLayoutComponent } from './layouts/FpoLayoutComponent/fpo-layout.component';
import { HeaderComponent } from './layouts/header/header.component';
// import { HeaderService } from './layouts/header/header.service';
import { UnauthenticatedLayoutComponent } from './layouts/UnauthenticatedLayoutComponent/UnauthenticatedLayout.component';
import { LogoDialogComponent } from './logo-dialog/logo-dialog.component';
import { MenuDialogComponent } from './menu-dialog/menu-dialog.component';
import { PasswordControlMessagesComponent } from './password-control-messages/password-control-messages.component';
import { CamelcasePipe } from './pipes/camelcase/camelcase.pipe';
import { CasingForFilterPipe } from './pipes/casingForFilter/casingForFilter.pipe';
import {CustomdatePipe, HomedatePipe} from './pipes/date/date.pipe';
import { FilterByCallbackPipe } from './pipes/filter/filterByCallback.pipe';
import { OrderPipe } from './pipes/order/order.pipe';
import { PhonePipe } from './pipes/phone/phone.pipe';
import { PhoneNumberPipe } from './pipes/phone/phoneNumber.pipe';
import { AuthService } from './services/auth.service';
import { AuthHttp } from './services/authHttp.service';
import { BcbsmaHttpService } from './services/bcbsma-http.service';
import { BcbsmaerrorHandlerService } from './services/bcbsmaerror-handler.service';
import { ConstantsService } from './services/constants.service';
import { FpocontentService } from './services/fpocontent.service';
import { ValidationService } from './services/validation.service';
import { SessionComponent } from './session/session.component';
import { AuthGuard } from './utils/auth.guard';
import { authHttpFactory } from './utils/authHttp.factory';
import { ScopeGuard } from './utils/scope.guard';
const CORE_ROUTER: Routes = [];
export { AlertService } from './services/alert.service';
export { ConstantsService, ValidationService, AuthService };
import { ClaimidPipe } from './pipes/claimid/claimid.pipe';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { YyyymmddTommddyyyyPipe } from './pipes/date/yyyymmdd-to-mmddyyyy.pipe';
import { MatchTextHighlightPipe } from './pipes/match-text-highlight/match-text-highlight.pipe';
import { StorageService } from './services/storage.service';
import { JoinPipe } from './pipes/stringUtilityPipes/join-pipe';
import { SplitPipe } from './pipes/stringUtilityPipes/split-pipe';
import { TrimPipe } from './pipes/stringUtilityPipes/trim-pipe';
import { DoctorNameFormatter } from './pipes/stringUtilityPipes/doctor-name-formatter';
import { BreadcrumbsComponent } from '../shared/components/breadcrumbs/breadcrumbs.component';
import {DedcoFilterComponent} from './components/dedcofilter/filter.component';
import {OrderIdCardLayoutComponent} from './layouts/OrderIdCardLayoutComponent/OrderIdCardLayout.component';
import { InactiveHomePageFpoLayoutComponent } from './layouts/InactiveHomePageFpoLayoutComponent/inactive-homepage-fpo-layout.component';
import {FinancialChartComponent} from './components/financial-chart/line-chart.component';
import {FinancialFilterComponent} from './components/financialsfilter/filter.component';
import {LineChartComponent} from './components/line-chart/line-chart.component';
import {CostBreakdownFilterComponent} from './components/cost-breakdown-financialsfilter/filter.component';
import {TextMaskModule} from 'angular2-text-mask';
export function init_app(authService: AuthService) {
  return () => {
  };
}
@NgModule({
  declarations: [
    YyyymmddTommddyyyyPipe,
    ControlMessagesComponent,
    PasswordControlMessagesComponent,
    AlertsComponent,
    FocusDirective,
    AutofocusDirective,
    NumberOnlyDirective,
    NoFirstPoundDirective,
    DateFormatValidation,
    drupalDirective,
    AppMatSelectChangeDirective,
    DefaultlandingComponent,
    MenuDialogComponent,
    LogoDialogComponent,
    FinancialChartComponent,
    CostBreakdownFilterComponent,
    AlegeusLineChartComponent,
    LineChartComponent,
    PhonePipe,
    PhoneNumberPipe,
    CamelcasePipe,
    ClaimidPipe,
    DynamicPromotionalContentComponent,
    PromoCarouselComponent,
    PromoBlocksComponent,
    PromoImagesComponent,
    CustomdatePipe,
    HomedatePipe,
    CasingForFilterPipe,
    TrimPipe,
    SplitPipe,
    JoinPipe,
    DoctorNameFormatter,
    OrderPipe,
    FilterByCallbackPipe,
    StarRatingComponent,
    FilterComponent,
    DedcoFilterComponent,
    FinancialFilterComponent,
    AuthCentralLayoutComponent,
    OrderIdCardLayoutComponent,
    UnauthenticatedLayoutComponent,
    AuthenticatedLayoutComponent,
    SessionComponent,
    HeaderComponent,
    FooterComponent,
    VerifyaccesscodeComponent,
    FpoLayoutComponent,
    InactiveHomePageFpoLayoutComponent,
    SpinnerComponent,
    MatchTextHighlightPipe,
    BreadcrumbsComponent
  ],
  exports: [
    YyyymmddTommddyyyyPipe,
    ControlMessagesComponent,
    PasswordControlMessagesComponent,
    AlertsComponent,
    DynamicPromotionalContentComponent,
    PromoCarouselComponent,
    PromoBlocksComponent,
    PromoImagesComponent,
    FinancialChartComponent,
    AlegeusLineChartComponent,
    LineChartComponent,
    FocusDirective,
    AutofocusDirective,
    NumberOnlyDirective,
    NoFirstPoundDirective,
    DateFormatValidation,
    AppMatSelectChangeDirective,
    DefaultlandingComponent,
    PhonePipe,
    PhoneNumberPipe,
    CamelcasePipe,
    ClaimidPipe,
    FormsModule,
    CustomdatePipe,
    HomedatePipe,
    CasingForFilterPipe,
    TrimPipe,
    SplitPipe,
    JoinPipe,
    DoctorNameFormatter,
    OrderPipe,
    FilterByCallbackPipe,
    StarRatingComponent,
    FilterComponent,
    DedcoFilterComponent,
    FinancialFilterComponent,
    CostBreakdownFilterComponent,
    AuthCentralLayoutComponent,
    UnauthenticatedLayoutComponent,
    AuthenticatedLayoutComponent,
    SessionComponent,
    HeaderComponent,
    FooterComponent,
    VerifyaccesscodeComponent,
    FpoLayoutComponent,
    InactiveHomePageFpoLayoutComponent,
    SpinnerComponent,
    ReactiveFormsModule,
    MaterialModule,
    MatchTextHighlightPipe,
    BreadcrumbsComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forChild(CORE_ROUTER),
    ReactiveFormsModule,
    MaterialModule,
    MaterializeModule,
    TextMaskModule
  ],
  providers: [
    AuthGuard,
    ScopeGuard,
    {
      'provide': AuthHttp,
      'useFactory': authHttpFactory,
      'deps': [HttpClient, AuthService, ConstantsService, AuthHttp],
    },
    ValidationService,
    ConstantsService,
    AuthHttp,
    StorageService,
    PromosService,
    BcbsmaerrorHandlerService,
    BcbsmaHttpService,
    // HeaderService,
    FooterService,
    FpocontentService
  ]
})
export class SharedModule {
}
