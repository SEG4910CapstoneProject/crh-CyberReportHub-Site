import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportSearchComponent } from './report-search.component';
import { TranslateModule } from '@ngx-translate/core';
import { SearchReportResponse } from '../../shared/sdk/rest-api/model/searchReportResponse';
import { BehaviorSubject } from 'rxjs';
import { DateTime } from 'luxon';
import { provideHttpClient } from '@angular/common/http';
import { ReportsService } from '../../shared/services/reports.service';

describe('ReportSearchComponent', () => {
  let component: ReportSearchComponent;
  let fixture: ComponentFixture<ReportSearchComponent>;
  let searchReport$: BehaviorSubject<SearchReportResponse>;

  const REPORT_RESPONSE: SearchReportResponse = {
    total: 1,
    reports: [
      {
        reportId: 1,
        reportType: 'daily',
        articleTitles: ['t1', 't2'],
        generatedDate: '2024-05-05',
        iocs: [],
        lastModified: '2024-05-05',
        stats: [],
        emailStatus: false,
        template: 'report_template',
        type: 'report_type',
      },
    ],
  };

  const mockReportsService = {
    searchReports: jest.fn(() => searchReport$),
  };

  beforeEach(async () => {
    searchReport$ = new BehaviorSubject<SearchReportResponse>(REPORT_RESPONSE);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ReportSearchComponent],
      providers: [
        { provide: ReportsService, useValue: mockReportsService },
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call api', () => {
    // on page load an api request should be triggered to get all reports
    expect(component['reportSearchResultsSignal']()).toBeTruthy(); //returns all reports (the array)
    expect(component['reportSearchResultsSignal']()).toBe(
      REPORT_RESPONSE.reports
    );
    expect(component['reportTotalSignal']()).toBe(1); // returns the total of reports
    expect(component['isLoadingSignal']()).toBe(false);
  });

  it('should call api with params', () => {
    // const expectedPaginatorStat: PaginatorStatus = {
    //   itemsPerPage: 20,
    //   page: 2,
    // };
    //component['paginatorStatusSignal'].set(expectedPaginatorStat); CAP331: no pagination as for now
    //fixture.detectChanges();

    expect(mockReportsService.searchReports).toHaveBeenCalledWith(
      'notSpecified',
      '',
      null,
      null
      //expectedPaginatorStat.page, CAP331: keep the two lines commented out
      //expectedPaginatorStat.itemsPerPage
    );
  });

  it('should call api with dates', () => {
    const expectedStart = '2023-02-23';
    const expectedEnd = '2024-02-23';
    component['searchFormGroup'].controls.startDate.setValue(
      DateTime.fromISO(expectedStart)
    );
    component['searchFormGroup'].controls.endDate.setValue(
      DateTime.fromISO(expectedEnd)
    );

    component['searchFormGroup'].controls['type'].setValue('DAILY');
    component.onSearchClick();

    expect(mockReportsService.searchReports).toHaveBeenCalledWith(
      'DAILY',
      '',
      expectedStart,
      expectedEnd
      // 0,
      // 10
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
