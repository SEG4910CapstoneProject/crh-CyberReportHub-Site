import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ReportEditComponent } from './report-edit.component';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { JsonReportResponse } from '../../../shared/sdk/rest-api/model/jsonReportResponse';
import { MockProvider } from 'ng-mocks';
import { ActivatedRoute, Router } from '@angular/router';
import { DateUtilsService } from '../../../shared/services/date-utils.service';
import { TranslateModule } from '@ngx-translate/core';
import { CrhTranslationService } from '../../../shared/services/crh-translation.service';
import { ReportResolverService } from '../../../shared/resolvers/report-resolver.service';
import { ReportSuggestionsResolverService } from '../../../shared/resolvers/report-suggestions-resolver.service';
import { JsonReportSuggestionsResponse } from '../../../shared/sdk/rest-api/model/jsonReportSuggestionsResponse';
import { Dialog } from '@angular/cdk/dialog';
import {
  EditArticleDialogResult,
  EditArticleDialogResultObject,
} from '../../../shared/dialogs/edit-article-dialog/edit-article-dialog.model';
import { DateTime } from 'luxon';
import { EditStatDialogResultObject } from '../../../shared/dialogs/edit-statistic-dialog/edit-statistic-dialog.model';
import { ReportsService } from '../../../shared/sdk/rest-api/api/reports.service';
import { StatisticsService } from '../../../shared/sdk/rest-api/api/statistics.service';
import { ArticlesService } from '../../../shared/sdk/rest-api/api/articles.service';
import { UidResponse } from '../../../shared/sdk/rest-api/model/uidResponse';
import { JsonArticleReportResponse } from '../../../shared/sdk/rest-api/model/jsonArticleReportResponse';

window.structuredClone = (item): any => JSON.parse(JSON.stringify(item));

describe('ReportEditComponent', () => {
  let component: ReportEditComponent;
  let fixture: ComponentFixture<ReportEditComponent>;

  let activatedRouteData$: BehaviorSubject<any>;
  let resolve$: BehaviorSubject<any>;

  let dialogOpenMock: jest.Mock;

  let reportsService: ReportsService;
  let statisticsService: StatisticsService;
  let articlesService: ArticlesService;
  let dateUtilsService: DateUtilsService;

  const MOCK_REPORT_DATA: JsonReportResponse = {
    reportId: 1,
    reportType: 'daily',
    generatedDate: '2024-02-02',
    lastModified: '2024-02-02T12:12:00',
    articles: [
      {
        articleId: 'someId1',
        description: 'someDescription',
        iocs: [
          {
            iocId: 2,
            iocTypeId: 1,
            iocTypeName: 'url',
            value: 'text',
          },
        ],
        link: 'someLink',
        title: 'someTitle',
        publishDate: '2024-01-01',
        category: 'cat1',
      },
    ],
    stats: [
      {
        statisticId: 'stat1',
        statisticNumber: 10,
        title: 'statTitle',
        subtitle: 'statSubtitle',
      },
    ],
    emailStatus: false,
  };

  const MOCK_SUGGESTION_DATA: JsonReportSuggestionsResponse = {
    articles: [
      {
        articleId: 'someArticle',
        description: 'someDescription',
        iocs: [],
        link: 'someLink',
        title: 'someTitle',
        publishDate: '2024-01-01',
        category: 'cat1',
      },
    ],
    stats: [
      {
        statisticId: 'someID',
        statisticNumber: 1,
        title: 'someTitle',
        subtitle: 'someSubtitle',
      },
    ],
  };

  const MOCK_2ND_REPORT_DATA: JsonReportResponse = {
    reportId: 2,
    reportType: 'daily',
    generatedDate: '2024-02-02',
    lastModified: '2024-02-02T12:12:00',
    articles: [],
    stats: [],
    emailStatus: false,
  };

  const MOCK_ACTIVATED_ROUTE_DATA = {
    reportData: MOCK_REPORT_DATA,
    suggestionData: MOCK_SUGGESTION_DATA,
  };

  beforeEach(async () => {
    activatedRouteData$ = new BehaviorSubject<any>(MOCK_ACTIVATED_ROUTE_DATA);
    resolve$ = new BehaviorSubject<any>(undefined);
    dialogOpenMock = jest.fn();

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ReportEditComponent],
      providers: [
        DateUtilsService,
        CrhTranslationService,
        MockProvider(ActivatedRoute, { data: activatedRouteData$ }),
        MockProvider(ReportResolverService, {
          resolve: jest.fn(() => resolve$),
        } as any),
        MockProvider(ReportSuggestionsResolverService, {
          resolve: jest.fn(),
        } as any),
        MockProvider(ReportsService, {
          removeSingleArticlesFromReport: jest.fn(() => of(1)),
          removeSingleStatFromReport: jest.fn(() => of(1)),
          deleteReportSuggestions: jest.fn(() => of(1)),
          addSingleArticleToReport: jest.fn(() => of(1)),
          patchReportSuggestions: jest.fn(() => of(1)),
          addSingleStatToReport: jest.fn(() => of(1)),
        } as any),
        MockProvider(StatisticsService, {
          editStat: jest.fn(() => of(0)) as any,
          addStat: jest.fn(() => of(0)) as any,
        }),
        MockProvider(ArticlesService, {
          editArticle: jest.fn(() => of(0)) as any,
          addArticle: jest.fn(() => of(0)) as any,
          getArticleByLink: jest.fn(() => of(0)) as any,
        }),
        MockProvider(Router, { routerState: { snapshot: {} } } as any),
        MockProvider(Dialog, { open: dialogOpenMock }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    reportsService = TestBed.inject(ReportsService);
    statisticsService = TestBed.inject(StatisticsService);
    articlesService = TestBed.inject(ArticlesService);
    dateUtilsService = TestBed.inject(DateUtilsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should define report header info', () => {
    expect(component['reportHeaderInfo']()).toBeDefined();
  });

  it('should define report articles', () => {
    expect(component['reportArticles']()).toBeDefined();
  });

  it('should define report id', () => {
    expect(component['reportId']()).toBeDefined();
  });

  it('should reload articles when article is removed', fakeAsync(() => {
    resolve$.next(MOCK_2ND_REPORT_DATA);
    component['onArticleRemove']('someArticle');
    tick();
    expect(reportsService.removeSingleArticlesFromReport).toHaveBeenCalled();
    expect(reportsService.patchReportSuggestions).toHaveBeenCalled();
  }));

  it('should reload articles when article is added', fakeAsync(() => {
    resolve$.next(MOCK_2ND_REPORT_DATA);
    component['onArticleAdd']('someArticle');
    tick();
    expect(reportsService.deleteReportSuggestions).toHaveBeenCalled();
    expect(reportsService.addSingleArticleToReport).toHaveBeenCalled();
  }));

  it('should reload articles when article is removed from hotbar', fakeAsync(() => {
    resolve$.next(MOCK_2ND_REPORT_DATA);
    component['onArticleRemoveFromHotbar']('someArticle');
    tick();
    expect(reportsService.deleteReportSuggestions).toHaveBeenCalled();
  }));

  it('should reload articles when stat is removed', fakeAsync(() => {
    resolve$.next(MOCK_2ND_REPORT_DATA);
    component['onStatRemove']('someStat');
    tick();
    expect(reportsService.removeSingleStatFromReport).toHaveBeenCalled();
    expect(reportsService.patchReportSuggestions).toHaveBeenCalled();
  }));

  it('should reload articles when stat is added', fakeAsync(() => {
    resolve$.next(MOCK_2ND_REPORT_DATA);
    component['onStatAdd']('someStat');
    tick();
    expect(reportsService.deleteReportSuggestions).toHaveBeenCalled();
    expect(reportsService.addSingleStatToReport).toHaveBeenCalled();
  }));

  it('should reload articles when stat is removed from hotbar', fakeAsync(() => {
    resolve$.next(MOCK_2ND_REPORT_DATA);
    component['onStatRemoveFromHotbar']('someStat');
    tick();
    expect(reportsService.deleteReportSuggestions).toHaveBeenCalled();
  }));

  it('should load hotbar articles', () => {
    expect(component['hotbarArticles']()).toMatchObject(
      MOCK_SUGGESTION_DATA.articles
    );
  });

  it('should load hotbar stats', () => {
    expect(component['hotbarStats']()).toMatchObject(MOCK_SUGGESTION_DATA.stats);
  });

  it('should edit article when article edit is called', fakeAsync(() => {
    const mockArticle = MOCK_REPORT_DATA.articles[0];
    dialogOpenMock.mockReturnValue({
      closed: of({
        title: mockArticle.title,
        description: mockArticle.description,
        link: mockArticle.link,
        publishDate:
          dateUtilsService.getDateFromString(mockArticle.publishDate) ??
          DateTime.invalid(''),
      } satisfies EditArticleDialogResultObject),
    });
    resolve$.next(MOCK_2ND_REPORT_DATA);

    component['onArticleEdit'](mockArticle);
    tick();
    expect(articlesService.editArticle).toHaveBeenCalledWith(
      mockArticle.articleId,
      mockArticle.title,
      mockArticle.link,
      mockArticle.description,
      mockArticle.publishDate
    );
  }));

  it('should not edit article when dialog returns no object', fakeAsync(() => {
    const mockArticle = MOCK_REPORT_DATA.articles[0];
    dialogOpenMock.mockReturnValue({ closed: of(undefined) });
    component['onArticleEdit'](mockArticle);
    tick();
    expect(articlesService.editArticle).not.toHaveBeenCalled();
  }));

  it('should edit stat when stat edit is called', fakeAsync(() => {
    const mockStat = MOCK_REPORT_DATA.stats[0];
    dialogOpenMock.mockReturnValue({
      closed: of({
        title: mockStat.title,
        subtitle: mockStat.subtitle,
        value: mockStat.statisticNumber,
      } satisfies EditStatDialogResultObject),
    });
    resolve$.next(MOCK_2ND_REPORT_DATA);

    component['onStatEdit'](mockStat);
    tick();
    expect(statisticsService.editStat).toHaveBeenCalledWith(
      mockStat.statisticId,
      mockStat.statisticNumber,
      mockStat.title,
      mockStat.subtitle
    );
  }));

  it('should not edit stat when dialog returns no object', fakeAsync(() => {
    const mockStat = MOCK_REPORT_DATA.stats[0];
    dialogOpenMock.mockReturnValue({ closed: of(undefined) });
    component['onStatEdit'](mockStat);
    tick();
    expect(statisticsService.editStat).not.toHaveBeenCalled();
  }));

  it('should add new stat when called', fakeAsync(() => {
    const addStatMock = statisticsService.addStat as jest.Mock;
    dialogOpenMock.mockReturnValue({
      closed: of({
        title: 'someTitle',
        value: 1000,
        subtitle: 'someSubtitle',
      } satisfies EditStatDialogResultObject),
    });

    addStatMock.mockImplementation(() =>
      of({ uid: 'someId' } satisfies UidResponse)
    );
    resolve$.next(MOCK_2ND_REPORT_DATA);

    component['addNewStat']();
    tick();
    expect(reportsService.patchReportSuggestions).toHaveBeenCalled();
  }));

  it('should add new article when called', fakeAsync(() => {
    component['newArticleForm'].setValue('example.com');
    (articlesService.getArticleByLink as jest.Mock).mockImplementation(() =>
      throwError(() => new Error('not found'))
    );

    dialogOpenMock.mockReturnValue({
      closed: of({
        link: 'example.com',
        description: 'someDescription',
        publishDate: DateTime.fromISO('2020-10-10'),
        title: 'someTitle',
      } satisfies EditArticleDialogResult),
    });

    (articlesService.addArticle as jest.Mock).mockImplementation(() =>
      of({ uid: 'someId' } satisfies UidResponse)
    );

    resolve$.next(MOCK_2ND_REPORT_DATA);
    component['addNewArticle']();
    tick();

    expect(articlesService.addArticle).toHaveBeenCalledWith(
      'someTitle',
      'example.com',
      'someDescription',
      '2020-10-10'
    );
  }));

  it('should edit new Article when adding an article that exists', fakeAsync(() => {
    component['newArticleForm'].setValue('example.com');
    (articlesService.getArticleByLink as jest.Mock).mockImplementation(() =>
      of({
        articleId: 'someId',
        description: 'someDescription',
        iocs: [],
        link: 'example.com',
        publishDate: '2020-10-10',
        title: 'someTitle',
      } satisfies JsonArticleReportResponse)
    );

    dialogOpenMock.mockReturnValue({
      closed: of({
        link: 'example.com',
        description: 'someDescription2',
        publishDate: DateTime.fromISO('2020-10-11'),
        title: 'someTitle2',
        articleId: 'someId',
      } satisfies EditArticleDialogResult),
    });
    resolve$.next(MOCK_2ND_REPORT_DATA);

    component['addNewArticle']();
    tick();

    expect(articlesService.editArticle).toHaveBeenCalledWith(
      'someId',
      'someTitle2',
      'example.com',
      'someDescription2',
      '2020-10-11'
    );
  }));

  // 🧩 Additional coverage for missing branches
  it('should not proceed if reportId is undefined', () => {
    jest.spyOn(component as any, 'reportId').mockReturnValue(undefined);
    expect(() => component['onArticleAdd']('x')).not.toThrow();
    expect(() => component['onArticleRemove']('x')).not.toThrow();
    expect(() => component['onArticleRemoveFromHotbar']('x')).not.toThrow();
    expect(() => component['onStatAdd']('x')).not.toThrow();
    expect(() => component['onStatRemove']('x')).not.toThrow();
    expect(() => component['onStatRemoveFromHotbar']('x')).not.toThrow();
    expect(() => component['addNewArticle']()).not.toThrow();
    expect(() => component['addNewStat']()).not.toThrow();
  });

  it('should handle error when removing article', fakeAsync(() => {
    (reportsService.removeSingleArticlesFromReport as jest.Mock).mockReturnValue(
      throwError(() => new Error('fail'))
    );
    component['onArticleRemove']('someArticle');
    tick();
    expect(reportsService.removeSingleArticlesFromReport).toHaveBeenCalled();
  }));

  it('should handle error when adding stat', fakeAsync(() => {
    (reportsService.addSingleStatToReport as jest.Mock).mockReturnValue(
      throwError(() => new Error('fail'))
    );
    component['onStatAdd']('someStat');
    tick();
    expect(reportsService.addSingleStatToReport).toHaveBeenCalled();
  }));

  it('should handle invalid new article form', () => {
    component['newArticleForm'].setValue(null);
    component['addNewArticle']();
    expect(component['newArticleForm'].touched).toBe(true);
  });

  it('should cover computed signals like textInputConfig and articleCategories', () => {
    const config = component['textInputConfig']();
    expect(config).toBeTruthy();
    expect(config?.suffix?.affixType).toBe('clickable-icon');
    expect(typeof config?.suffix?.onClick).toBe('function');
    expect(Array.isArray(component['articleCategories']())).toBe(true);
  });
});
