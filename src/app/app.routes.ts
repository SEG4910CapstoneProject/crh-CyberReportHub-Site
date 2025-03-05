import { Routes } from '@angular/router';
import { TesterPageComponent } from './tester/tester-page/tester-page.component';
import { NavBarSelectedLinkOptions } from './shared/components/nav-bar/nav-bar.model';
import { ReportSearchComponent } from './pages/report-search/report-search.component';
import { ReportViewComponent } from './pages/reports/view/report-view.component';
import { ReportEditComponent } from './pages/reports/edit/report-edit.component';
import { ReportResolverService } from './shared/resolvers/report-resolver.service';
import { HomeComponent } from './pages/home/home.component';
import { ReportSuggestionsResolverService } from './shared/resolvers/report-suggestions-resolver.service';
import { ReportNewComponent } from './pages/reports/new/report-new.component';

export const routes: Routes = [
  {
    path: 'test',
    component: TesterPageComponent,
    data: { selectedNav: 'none' satisfies NavBarSelectedLinkOptions },
  },
  {
    path: 'reports',
    data: { selectedNav: 'reportSearch' satisfies NavBarSelectedLinkOptions },
    children: [
      { path: '', component: ReportSearchComponent },
      {
        path: 'read/:reportId',
        component: ReportViewComponent,
        data: { selectedNav: 'none' satisfies NavBarSelectedLinkOptions },
        resolve: { reportData: ReportResolverService },
      },
      {
        path: 'edit/:reportId',
        component: ReportEditComponent,
        data: { selectedNav: 'none' satisfies NavBarSelectedLinkOptions },
        resolve: {
          reportData: ReportResolverService,
          suggestionData: ReportSuggestionsResolverService,
        },
      },
      {
        path: 'create',
        component: ReportNewComponent,
        data: { selectedNav: 'none' satisfies NavBarSelectedLinkOptions },
      },
      {
        path: 'statistics',
        component: TesterPageComponent,
        data: {
          selectedNav: 'reportStats' satisfies NavBarSelectedLinkOptions,
        },
      },
    ],
  },
  {
    path: '',
    component: HomeComponent,
    data: { selectedNav: 'home' satisfies NavBarSelectedLinkOptions },
  },
  { path: '**', redirectTo: '/' },
];
