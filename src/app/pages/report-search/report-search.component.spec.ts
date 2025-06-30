import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSearchComponent } from './report-search.component';
import { MockProvider } from 'ng-mocks';
import { TranslateModule } from '@ngx-translate/core';
import { SearchReportResponse } from '../../shared/sdk/rest-api/model/searchReportResponse';
import { BehaviorSubject } from 'rxjs';
import { PaginatorStatus } from '../../shared/components/paginator/paginator.models';
import { DateTime } from 'luxon';
import { ReportsService } from '../../shared/sdk/rest-api/api/reports.service';

describe('ReportSearchComponent', () => {
  let component: ReportSearchComponent;
  let fixture: ComponentFixture<ReportSearchComponent>;
  let reportsService: ReportsService;
  let searchReport$: BehaviorSubject<SearchReportResponse>;

  const REPORT_RESPONSE: SearchReportResponse = {
    total: 2,
    reports: [
      {
        reportId: 1,
        reportType: 'daily',
        articleTitles: ['t1', 't2'],
        generatedDate: '2024-05-05',
        iocs: [
          {
            iocId: 1,
            iocTypeId: 1,
            iocTypeName: 'url',
            value: 'ioc',
          },
        ],
        lastModified: '2024-05-05',
        stats: [
          {
            statisticId: 'id1',
            statisticNumber: 10,
            title: 'statTitle',
            subtitle: 'statSubtitle',
          },
        ],
        emailStatus: false,
        template:"report_template",
        type:"report_type"
      },
    ],
  };

  beforeEach(async () => {
    searchReport$ = new BehaviorSubject<SearchReportResponse>(REPORT_RESPONSE);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ReportSearchComponent],
      providers: [
        MockProvider(ReportsService, {
          searchReports: jest.fn(() => searchReport$),
        } as unknown as ReportsService),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    reportsService = TestBed.inject(ReportsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call api', () => {
    expect(component['reportSearchResultsSignal']()).toBeTruthy();
    expect(component['reportSearchResultsSignal']()?.total).toBe(1);
    expect(component['reportSearchTotalSignal']()).toBe(REPORT_RESPONSE.total);
    expect(component['isLoadingSignal']()).toBe(false);
  });

  it('should call api with params', () => {
    const expectedPaginatorStat: PaginatorStatus = {
      itemsPerPage: 20,
      page: 2,
    };
    component['paginatorStatusSignal'].set(expectedPaginatorStat);
    fixture.detectChanges();

    expect(reportsService.searchReports).toHaveBeenCalledWith(
      'DAILY',
      undefined,
      undefined,
      expectedPaginatorStat.page,
      expectedPaginatorStat.itemsPerPage
    );
  });

  it('should call api with dates', () => {
    const expectedStart = '2023-02-23';
    const expectedEnd = '2024-02-23';
    component['dateFormGroup'].controls.startDate.setValue(
      DateTime.fromISO(expectedStart)
    );
    component['dateFormGroup'].controls.endDate.setValue(
      DateTime.fromISO(expectedEnd)
    );

    expect(reportsService.searchReports).toHaveBeenCalledWith(
      'DAILY',
      expectedStart,
      expectedEnd,
      0,
      10
    );
  });

  it('should default to no response when error', () => {
    searchReport$.error('test error');
    fixture.detectChanges();

    expect(component['reportSearchResultsSignal']()).toBeTruthy();
    expect(component['reportSearchResultsSignal']()?.length).toBe(0);
    expect(component['reportSearchTotalSignal']()).toBe(0);
    expect(component['isLoadingSignal']()).toBe(false);
  });
});
