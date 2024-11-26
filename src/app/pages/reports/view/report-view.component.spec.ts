import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportViewComponent } from './report-view.component';
import { BehaviorSubject } from 'rxjs';
import { JsonReportResponse } from '../../../shared/sdk/rest-api/model/jsonReportResponse';
import { MockProvider } from 'ng-mocks';
import { ActivatedRoute } from '@angular/router';
import { DateUtilsService } from '../../../shared/services/date-utils.service';
import { TranslateModule } from '@ngx-translate/core';
import { CrhTranslationService } from '../../../shared/services/crh-translation.service';

window.structuredClone = (item): any => JSON.parse(JSON.stringify(item));

describe('ViewComponent', () => {
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

  const MOCK_ACTIVATED_ROUTE_DATA = {
    reportData: MOCK_REPORT_DATA,
  };

  beforeEach(async () => {
    activatedRouteData$ = new BehaviorSubject<any>(MOCK_ACTIVATED_ROUTE_DATA);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ReportViewComponent],
      providers: [
        DateUtilsService,
        CrhTranslationService,
        MockProvider(ActivatedRoute, {
          data: activatedRouteData$,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get report header info', () => {
    expect(component['reportHeaderInfo']()).toBeDefined();
  });

  it('should get report articles', () => {
    expect(component['reportArticles']()).toBeDefined();
    expect(component['reportArticles']().length).toBe(1);
  });

  it('should get report stats', () => {
    expect(component['reportStats']()).toBeDefined();
    expect(component['reportStats']().length).toBe(1);
  });
});
