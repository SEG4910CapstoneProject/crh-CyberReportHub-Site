import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReportResolverService } from './report-resolver.service';
import { Router } from '@angular/router';
import { ReportsService } from '../services/reports.service';
import { of } from 'rxjs';
import { JsonReportResponse } from '../sdk/rest-api/model/jsonReportResponse';

describe('ReportResolverService', () => {
  let service: ReportResolverService;
  let reportsServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    reportsServiceMock = {
      getLatestReport: jest.fn(() => of({ reportId: 123 } as JsonReportResponse)),
      getReportByID: jest.fn((id: number) => of({ reportId: id } as JsonReportResponse)),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ReportResolverService,
        { provide: ReportsService, useValue: reportsServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    service = TestBed.inject(ReportResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch reports by id', fakeAsync(() => {
    const callbackListener = jest.fn();

    service
      .resolve({ params: { reportId: '123' } } as any)
      .subscribe(value => callbackListener(value));

    tick();

    expect(callbackListener).toHaveBeenCalledWith({ reportId: 123 });
    expect(reportsServiceMock.getReportByID).toHaveBeenCalledWith(123);
  }));

  it('should fetch latest reports', fakeAsync(() => {
    const callbackListener = jest.fn();

    service
      .resolve({ params: { reportId: 'latest' } } as any)
      .subscribe(value => callbackListener(value));

    tick();

    expect(callbackListener).toHaveBeenCalledWith({ reportId: 123 });
    expect(reportsServiceMock.getLatestReport).toHaveBeenCalled();
  }));

  it('should navigate away on error', fakeAsync(() => {
    reportsServiceMock.getReportByID.mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const callbackListener = jest.fn();

    service
      .resolve({ params: { reportId: '123' } } as any)
      .subscribe(callbackListener);

    tick();

    expect(callbackListener).not.toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/reports']);
  }));
});
