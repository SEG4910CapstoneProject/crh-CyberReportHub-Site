import { APP_INITIALIZER } from '@angular/core';
import { BrandingService } from './shared/services/branding.service';
import { NgModule } from '@angular/core';
import { routes } from './app.routes';
import { provideRouter, RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { CyberReportHubComponent } from './cyber-report-hub.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';


import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { TesterPageComponent } from './tester/tester-page/tester-page.component';
import { ReportHeaderComponent } from './shared/components/report-header/report-header.component';
import { AccordionComponent } from './shared/components/accordion/accordion.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialModule } from './material.module';
import { MatIconRegistry } from '@angular/material/icon';
import { LuxonDateFormatterPipe } from './shared/pipes/luxon-date-formatter.pipe';
import { ApiModule } from './shared/sdk/rest-api/api.module';
import { BASE_PATH } from './shared/sdk/rest-api/variables';
import { TextInputComponent } from './shared/components/text-input/text-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectComponent } from './shared/components/select/select.component';
import { DatePickerComponent } from './shared/components/date-picker/date-picker.component';
import { ButtonComponent } from './shared/components/button/button.component';
import { CrhTableModule } from './shared/components/table/crh-table.module';
import { NavBarComponent } from './shared/components/nav-bar/nav-bar.component';
import { CdkModule } from './cdk.module';
import { ResponsiveDirective } from './shared/directives/responsive.directive';
import { IconButtonComponent } from './shared/components/icon-button/icon-button.component';
import { ClickOutsideDirective } from './shared/directives/click-outside.directive';
import { PaginatorComponent } from './shared/components/paginator/paginator.component';
import { StatsCardComponent } from './shared/components/stats-card/stats-card.component';
import { StatsCardDiagramComponent } from './shared/components/stats-card-diagram/stats-card-diagram.component';
import { ReportSearchComponent } from './pages/report-search/report-search.component';
import { ReportResultComponent } from './pages/report-search/report-result/report-result.component';
import { ProgressSpinnerComponent } from './shared/components/progress-spinner/progress-spinner.component';
import { ReportLayoutComponent } from './pages/reports/layout/report-layout.component';
import { ReportViewComponent } from './pages/reports/view/report-view.component';
import { ReportEditComponent } from './pages/reports/edit/report-edit.component';
import { ReportStatsAreaComponent } from './pages/reports/layout/report-stats-area/report-stats-area.component';
import { ReportArticleAreaComponent } from './pages/reports/layout/report-article-area/report-article-area.component';
import { ReportSidebarAreaComponent } from './pages/reports/layout/report-sidebar-area/report-sidebar-area.component';
import { ArticleContentComponent } from './pages/reports/layout/report-article-area/article-content/article-content.component';
import { ChipComponent } from './shared/components/chip/chip.component';
import { ChipContainerComponent } from './shared/components/chip/chip-container.component';
import { DialogComponent } from './shared/components/dialog/dialog.component';
import { DialogHeadingComponent } from './shared/components/dialog/dialog-parts/dialog-heading.component';
import { DialogContentComponent } from './shared/components/dialog/dialog-parts/dialog-content.component';
import { DialogFooterComponent } from './shared/components/dialog/dialog-parts/dialog-footer.component';
import { LoginDialogComponent } from './shared/dialogs/login-dialog/login-dialog.component';
import { HomeComponent } from './pages/home/home.component';
import { EditArticleDialogComponent } from './shared/dialogs/edit-article-dialog/edit-article-dialog.component';
import { EditStatisticDialogComponent } from './shared/dialogs/edit-statistic-dialog/edit-statistic-dialog.component';
import { ConfirmCancelButtonsComponent } from './shared/components/confirm-cancel-buttons/confirm-cancel-buttons.component';
import { ArticleSuggestionComponent } from './pages/reports/edit/article-suggestion/article-suggestion.component';
import { NewArticleComponent } from './pages/new-article/new-article.component';
import { ChatbotComponent } from './pages/chatbot/chatbot.component';
import { ArticlesComponent } from './pages/articles/articles.component';
import { ReportPreviewComponent } from './pages/reports/articles/report-preview/report-preview.component';
import { SettingsComponent } from './pages/settings/settings.component';

import { ReportNewComponent } from './pages/reports/new/report-new.component';
import { ReportArticlesComponent } from './pages/reports/articles/report-articles.component';

const TRANSLATION_FILES_LOCATION = '/lang/';
const TRANSLATION_FILES_FILE_EXT = '.json';

export function initBrandingFactory(branding: BrandingService) {
  return () => branding.init();
}

@NgModule({
  declarations: [
    CyberReportHubComponent,
    TesterPageComponent,
    ReportHeaderComponent,
    AccordionComponent,
    LuxonDateFormatterPipe,
    TextInputComponent,
    SelectComponent,
    DatePickerComponent,
    ButtonComponent,
    NavBarComponent,
    ResponsiveDirective,
    IconButtonComponent,
    ClickOutsideDirective,
    PaginatorComponent,
    StatsCardComponent,
    StatsCardDiagramComponent,
    ReportSearchComponent,
    ReportResultComponent,
    ProgressSpinnerComponent,
    ReportLayoutComponent,
    ReportViewComponent,
    ReportEditComponent,
    ReportStatsAreaComponent,
    ReportArticleAreaComponent,
    ReportSidebarAreaComponent,
    ArticleContentComponent,
    ChipComponent,
    ChipContainerComponent,
    DialogComponent,
    DialogHeadingComponent,
    DialogContentComponent,
    DialogFooterComponent,
    LoginDialogComponent,
    HomeComponent,
    EditArticleDialogComponent,
    EditStatisticDialogComponent,
    ConfirmCancelButtonsComponent,
    ArticleSuggestionComponent,
    NewArticleComponent,
    ChatbotComponent,
    ArticlesComponent,
    ReportPreviewComponent,
    ReportNewComponent,
    ReportArticlesComponent,
    SettingsComponent,
  ],
  imports: [
    RouterModule,
    RouterModule.forRoot([]),
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    ApiModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatIconModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) =>
          new TranslateHttpLoader(
            http,
            TRANSLATION_FILES_LOCATION,
            TRANSLATION_FILES_FILE_EXT
          ),
        deps: [HttpClient],
      },
    }),
    MaterialModule,
    CdkModule,
    CrhTableModule,
  ],
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
    LuxonDateFormatterPipe,
    {
      provide: APP_INITIALIZER,
      useFactory: initBrandingFactory,
      deps: [BrandingService],
      multi: true,
    },
    { provide: BASE_PATH, useValue: 'http://localhost:8080' }, // TODO REPLACE ME WHEN SERVED INTO PRODUCTION
  ],
  bootstrap: [CyberReportHubComponent],
})
export class CyberReportHubModule {
  constructor(iconRegistry: MatIconRegistry) {
    iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
  }
}
