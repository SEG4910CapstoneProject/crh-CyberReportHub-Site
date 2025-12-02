import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportViewComponent } from './report-view.component';
import { BehaviorSubject } from 'rxjs';
import { JsonReportResponse } from '../../../shared/sdk/rest-api/model/jsonReportResponse';
import { MockProvider } from 'ng-mocks';
import { ActivatedRoute } from '@angular/router';
import { DateUtilsService } from '../../../shared/services/date-utils.service';
import { TranslateModule } from '@ngx-translate/core';
import { CrhTranslationService } from '../../../shared/services/crh-translation.service';
import { ReportArticleAreaComponent } from '../layout/report-article-area/report-article-area.component';

window.structuredClone = (item): any => JSON.parse(JSON.stringify(item));

describe('ReportViewComponent Branch Coverage', () => {
  let component: ReportViewComponent;
  let fixture: ComponentFixture<ReportViewComponent>;
  let activatedRouteData$: BehaviorSubject<any>;

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

  beforeEach(async () => {
    activatedRouteData$ = new BehaviorSubject<any>({ reportData: MOCK_REPORT_DATA });

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ReportViewComponent],
      providers: [
        DateUtilsService,
        CrhTranslationService,
        MockProvider(ActivatedRoute, { data: activatedRouteData$ }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return undefined when reportData is missing', () => {
    activatedRouteData$.next({});
    fixture.detectChanges();
    expect(component['reportHeaderInfo']()).toBeUndefined();
  });

  it('should return undefined if date parsing fails or emailStatus undefined', () => {
    activatedRouteData$.next({
      reportData: {
        ...MOCK_REPORT_DATA,
        generatedDate: 'INVALID',
        lastModified: 'INVALID',
        emailStatus: undefined,
      },
    });
    fixture.detectChanges();
    expect(component['reportHeaderInfo']()).toBeUndefined();
  });

  it('should compute valid report header info', () => {
    expect(component['reportHeaderInfo']()).toBeDefined();
    expect(component['reportHeaderInfo']()!.isEmailSent).toBe(false);
  });

  it('should return empty array when reportArticles is undefined', () => {
    activatedRouteData$.next({
      reportData: { ...MOCK_REPORT_DATA, articles: undefined as any },
    });
    fixture.detectChanges();
    expect(component['reportArticles']()).toEqual([]);
  });

  it('should return report articles', () => {
    expect(component['reportArticles']().length).toBe(1);
  });

  it('should return report stats', () => {
    expect(component['reportStats']().length).toBe(1);
  });

  it('should do nothing when reportArticleArea is undefined', () => {
    component['reportArticleArea'] = undefined as any;
    expect(() => component['onTableContentsSelect']('cat1')).not.toThrow();
  });

  it('should call scrollToCategory when reportArticleArea exists', () => {
    const mockArea = { scrollToCategory: jest.fn() } as any;
    component['reportArticleArea'] = mockArea;
    component['onTableContentsSelect']('cat1');
    expect(mockArea.scrollToCategory).toHaveBeenCalledWith('cat1');
  });
});
