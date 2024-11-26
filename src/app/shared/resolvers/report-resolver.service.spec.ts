import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReportResolverService } from './report-resolver.service';
import { MockProvider } from 'ng-mocks';
import { BehaviorSubject } from 'rxjs';
import { JsonReportResponse } from '../sdk/rest-api/model/jsonReportResponse';
import { Router } from '@angular/router';
import { ReportsService } from '../sdk/rest-api/api/reports.service';

describe('ReportResolverService', () => {
  let service: ReportResolverService;

  let getLatestReport$: BehaviorSubject<JsonReportResponse>;
  let getReportByID$: BehaviorSubject<JsonReportResponse>;

  beforeEach(() => {
    getLatestReport$ = new BehaviorSubject<JsonReportResponse>({} as any);
    getReportByID$ = new BehaviorSubject<JsonReportResponse>({} as any);

    TestBed.configureTestingModule({
      providers: [
        ReportResolverService,
        MockProvider(ReportsService, {
          getLatestReport: () => getLatestReport$,
          getReportByID: () => getReportByID$,
        } as unknown as ReportsService),
        MockProvider(Router, {
          navigate: jest.fn(),
        }),
      ],
    });
    service = TestBed.inject(ReportResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch reports by id', fakeAsync(() => {
    const expectedReport: JsonReportResponse = {
      reportId: 123,
    } as JsonReportResponse;
    getReportByID$.next(expectedReport);

    const callbackListener = jest.fn();
    service
      .resolve({
        params: {
          reportId: '123',
        },
      } as any)
      .subscribe(value => callbackListener(value));
    tick();

    expect(callbackListener).toHaveBeenCalledWith(expectedReport);
  }));

  it('should fetch latest reports', fakeAsync(() => {
    const expectedReport: JsonReportResponse = {
      reportId: 123,
    } as JsonReportResponse;
    getLatestReport$.next(expectedReport);

    const callbackListener = jest.fn();
    service
      .resolve({
        params: {
          reportId: 'latest',
        },
      } as any)
      .subscribe(value => callbackListener(value));
    tick();

    expect(callbackListener).toHaveBeenCalledWith(expectedReport);
  }));

  it('should immediately complete when report id is not a valid number', fakeAsync(() => {
    const callbackListener = jest.fn();
    service
      .resolve({
        params: {
          reportId: 'a bad number',
        },
      } as any)
      .subscribe(value => callbackListener(value));
    tick();

    expect(callbackListener).not.toHaveBeenCalled();
  }));
});
