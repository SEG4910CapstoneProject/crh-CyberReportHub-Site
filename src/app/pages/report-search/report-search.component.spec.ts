import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReportSearchComponent } from './report-search.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReportsService } from '../../shared/services/reports.service';
import { AuthService } from '../../shared/services/auth.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { PaginatorStatus } from '../../shared/components/paginator/paginator.models';
import { SearchReportResponse } from '../../shared/sdk/rest-api/model/searchReportResponse';
import { SearchReportDetailsResponse } from '../../shared/sdk/rest-api/model/searchReportDetailsResponse';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ReportSearchComponent', () => {
  let component: ReportSearchComponent;
  let fixture: ComponentFixture<ReportSearchComponent>;
  let reportsServiceMock: any;
  let authServiceMock: any;

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
        template: '',
        type: 'DAILY',
      },
    ],
  };

  beforeEach(async () => {
    reportsServiceMock = {
      searchReports: jest.fn(() => of(REPORT_RESPONSE)),
      deleteReport: jest.fn(() => of({})),
    };

    authServiceMock = {
      isLoggedIn$: new BehaviorSubject(true),
      logout: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      declarations: [ReportSearchComponent],
      providers: [
        { provide: ReportsService, useValue: reportsServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call api and set filteredReports', fakeAsync(() => {
    component.onSearch();
    tick(); // wait for observable
    fixture.detectChanges();

    expect(component.filteredReports).toBeTruthy();
    expect(component.filteredReports.length).toBe(REPORT_RESPONSE.reports.length);
    expect(component.isLoading).toBe(false);
    expect(reportsServiceMock.searchReports).toHaveBeenCalled();
  }));

  it('should call api with paginator params', fakeAsync(() => {
    const expectedPaginatorStat: PaginatorStatus = { itemsPerPage: 20, page: 2 };
    component.paginatorStatus = expectedPaginatorStat;
    component.onSearch();
    tick();
    fixture.detectChanges();

    expect(reportsServiceMock.searchReports).toHaveBeenCalledWith(
      component.searchFormGroup.value.type,
      component.searchFormGroup.value.startDate,
      component.searchFormGroup.value.endDate,
      expectedPaginatorStat.page,
      expectedPaginatorStat.itemsPerPage
    );
  }));

  it('should call api with dates', fakeAsync(() => {
    const expectedStart = new Date('2023-02-23');
    const expectedEnd = new Date('2024-02-23');

    component.searchFormGroup = new FormGroup({
      reportNo: new FormControl(''),
      type: new FormControl('DAILY'),
      startDate: new FormControl(expectedStart),
      endDate: new FormControl(expectedEnd),
    });

    component.onSearch();
    tick();
    fixture.detectChanges();

    expect(reportsServiceMock.searchReports).toHaveBeenCalledWith(
      'DAILY',
      expectedStart,
      expectedEnd,
      component.paginatorStatus.page,
      component.paginatorStatus.itemsPerPage
    );
  }));

  it('should handle errors gracefully', fakeAsync(() => {
    reportsServiceMock.searchReports.mockImplementationOnce(() =>
      throwError(() => new Error('test error'))
    );

    component.onSearch();
    tick();
    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
  }));
});
