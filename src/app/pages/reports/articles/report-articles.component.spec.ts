import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { ReportArticlesComponent } from './report-articles.component';
import { ArticleService } from '../../../shared/services/article.service';
import { DarkModeService } from '../../../shared/services/dark-mode.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ReportsService } from '../../../shared/sdk/rest-api/api/reports.service';
import { StatisticsService } from '../../../shared/sdk/rest-api/api/statistics.service';
import { Dialog } from '@angular/cdk/dialog';

describe('ReportArticlesComponent', () => {
  let fixture: ComponentFixture<ReportArticlesComponent>;
  let component: ReportArticlesComponent;
  let mockArticleService: any;
  let mockDarkMode: any;
  let mockAuth: any;
  let mockRouter: any;
  let mockDialog: any;
  let mockReports: any;
  let mockStats: any;

  beforeEach(async () => {
    mockArticleService = {
      getAllArticleTypesWithArticles: jest.fn(() =>
        of({ General: [{ title: 'T1', articleId: 'a1' }] })
      ),
    };
    mockDarkMode = { isDarkMode$: of(false) };
    mockAuth = { currentUser$: of({ role: 'ADMIN' }) };
    mockRouter = {
      navigate: jest.fn(),
      getCurrentNavigation: jest.fn(() => ({
        extras: { state: { reportId: 5, articles: [], stats: [] } },
      })),
    };
    mockDialog = {
      open: jest.fn(() => ({
        closed: of({ value: 5, title: 't', subtitle: 's' }),
      })),
    };
    mockReports = { addSingleStatToReport: jest.fn(() => of({})) };
    mockStats = { getStatistics: jest.fn(() => of([])) };

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      declarations: [ReportArticlesComponent],
      providers: [
        FormBuilder,
        { provide: ArticleService, useValue: mockArticleService },
        { provide: DarkModeService, useValue: mockDarkMode },
        { provide: AuthService, useValue: mockAuth },
        { provide: Router, useValue: mockRouter },
        { provide: Dialog, useValue: mockDialog },
        { provide: ReportsService, useValue: mockReports },
        { provide: StatisticsService, useValue: mockStats },
      ],
    })

      .overrideComponent(ReportArticlesComponent, {
        set: { template: '' },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ReportArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and form', () => {
    expect(component).toBeTruthy();
    expect((component as any).form).toBeDefined();
  });

});
