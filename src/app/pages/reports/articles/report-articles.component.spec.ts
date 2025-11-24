import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
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
import { CrhTranslationService } from '../../../shared/services/crh-translation.service';

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
  let mockTranslate: any;

  beforeEach(async () => {
    mockArticleService = {
      getAllArticlesTypesIncluded: jest.fn(() =>
        of({
          General: [
            {
              title: 'A1',
              articleId: 'x1',
              publishDate: '2024-01-10T10:00:00',
              type: 'Malware',
              category: 'General',
              link: 'l1'
            },
            {
              title: 'A2',
              articleId: 'x2',
              publishDate: '2024-01-09T10:00:00',
              type: 'Cloud',
              category: 'General',
              link: 'l2'
            }
          ]
        })
      )
    };

    mockDarkMode = { isDarkMode$: of(false) };
    mockAuth = { isLoggedIn$: of(true) };

    mockRouter = {
      navigate: jest.fn(),
      getCurrentNavigation: jest.fn(() => ({
        extras: {
          state: {
            reportId: 5,
            template_type: 'DAILY',
            stats: [],
            analystComment: 'test comment'
          }
        }
      }))
    };

    mockDialog = {
      open: jest.fn(() => ({
        closed: of({ value: 9, title: 'T', subtitle: 'S' })
      }))
    };

    mockReports = { addSingleStatToReport: jest.fn(() => of({})) };
    mockStats = { getStatistics: jest.fn(() => of([])) };
    mockTranslate = { getTranslationOnce: jest.fn(() => of('translated error')) };

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [ReportArticlesComponent],
      providers: [
        { provide: ArticleService, useValue: mockArticleService },
        { provide: DarkModeService, useValue: mockDarkMode },
        { provide: AuthService, useValue: mockAuth },
        { provide: Router, useValue: mockRouter },
        { provide: Dialog, useValue: mockDialog },
        { provide: ReportsService, useValue: mockReports },
        { provide: StatisticsService, useValue: mockStats },
        { provide: CrhTranslationService, useValue: mockTranslate }
      ]
    })
      .overrideComponent(ReportArticlesComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(ReportArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
    expect((component as any).form).toBeDefined();
  });

  it('should load router state', () => {
    expect((component as any).reportId).toBe(5);
    expect((component as any).template_type).toBe('DAILY');
    expect((component as any).form.get('analystComment')?.value).toBe('test comment');
  });

  it('should fetch suggested articles (service is called)', () => {
    expect(mockArticleService.getAllArticlesTypesIncluded).toHaveBeenCalled();
   
    expect(Array.isArray((component as any).groupedArticlesByDate)).toBe(true);
  });

  it('should toggle date group', () => {
    const group = { expanded: false };
    component.toggleDateGroup(group);
    expect(group.expanded).toBe(true);
    component.toggleDateGroup(group);
    expect(group.expanded).toBe(false);
  });

  it('should filter articles by search term without throwing', () => {
    (component as any).articleSearchTerm = 'A1';
    expect(() => component.filterArticles()).not.toThrow();

  });

  it('should restore list when search is cleared', () => {
    (component as any).articleSearchTerm = '';
    const spy = jest.spyOn(component as any, 'fetchSuggestedArticles');
    component.filterArticles();
    expect(spy).toHaveBeenCalled();
  });

  it('should add a new article when not duplicate', () => {
    const a = { articleId: 'new1' } as any;
    component.addArticleFromSelection(a);
    expect((component as any).articles.has('new1')).toBe(true);
  });

  it('should handle duplicate article without error', () => {
    const a = { articleId: 'dup1' } as any;
    (component as any).articles.set('dup1', a);


    expect(() => component.addArticleFromSelection(a)).not.toThrow();
  });

  it('should remove an article', () => {
    (component as any).articles.set('r1', {} as any);
    component.removeArticle('r1');
    expect((component as any).articles.has('r1')).toBe(false);
  });

  it('should open stat dialog and add new stat', () => {
    component.openAddStatDialog();
    expect(component.addedStats.length).toBe(1);
  });

  it('should call reportsService onStatAdd', () => {
    component.onStatAdd('stat1');
    expect(mockReports.addSingleStatToReport).toHaveBeenCalledWith(5, 'stat1');
  });

  it('should remove a stat', () => {
    component.addedStats = [
      { statisticId: 's1' } as any,
      { statisticId: 's2' } as any
    ];
    component.onStatRemove('s1');
    expect(component.addedStats.length).toBe(1);
  });

  it('should edit a stat', () => {
    component.addedStats = [
      { statisticId: 's1', title: 'old', subtitle: 'old', statisticNumber: 1 } as any
    ];

    mockDialog.open = jest.fn(() => ({
      closed: of({ title: 'new', subtitle: 'new', value: 10 })
    }));

    component.onStatEdit(component.addedStats[0]);

    expect(component.addedStats[0].title).toBe('new');
    expect(component.addedStats[0].statisticNumber).toBe(10);
  });
});

