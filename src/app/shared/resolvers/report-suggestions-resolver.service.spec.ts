import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReportSuggestionsResolverService } from './report-suggestions-resolver.service';
import { MockProvider } from 'ng-mocks';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { JsonReportSuggestionsResponse } from '../sdk/rest-api/model/jsonReportSuggestionsResponse';
import { ReportsService } from '../sdk/rest-api/api/reports.service';

describe('ReportSuggestionsResolverService', () => {
  let service: ReportSuggestionsResolverService;

  let getLatestId$: BehaviorSubject<string>;
  let getReportSuggestions$: BehaviorSubject<JsonReportSuggestionsResponse>;

  const SAMPLE_SUGGESTION_RESPONSE: JsonReportSuggestionsResponse = {
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

  beforeEach(() => {
    getLatestId$ = new BehaviorSubject<string>({} as any);
    getReportSuggestions$ = new BehaviorSubject<JsonReportSuggestionsResponse>(
      {} as any
    );

    TestBed.configureTestingModule({
      providers: [
        ReportSuggestionsResolverService,
        MockProvider(ReportsService, {
          getLatestId: () => getLatestId$,
          getReportSuggestions: jest.fn(() => getReportSuggestions$),
        } as unknown as ReportsService),
        MockProvider(Router, {
          navigate: jest.fn(),
        }),
      ],
    });
    service = TestBed.inject(ReportSuggestionsResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch suggestions by report id', fakeAsync(() => {
    getReportSuggestions$.next(SAMPLE_SUGGESTION_RESPONSE);

    const callbackListener = jest.fn();
    service
      .resolve({
        params: {
          reportId: '123',
        },
      } as any)
      .subscribe(value => callbackListener(value));
    tick();

    expect(callbackListener).toHaveBeenCalledWith(SAMPLE_SUGGESTION_RESPONSE);
  }));

  it('should fetch suggestions of latest using latest id api', fakeAsync(() => {
    const reportsService: ReportsService = TestBed.inject(ReportsService);
    getReportSuggestions$.next(SAMPLE_SUGGESTION_RESPONSE);
    getLatestId$.next('123');

    const callbackListener = jest.fn();
    service
      .resolve({
        params: {
          reportId: 'latest',
        },
      } as any)
      .subscribe(value => callbackListener(value));
    tick();

    expect(callbackListener).toHaveBeenCalledWith(SAMPLE_SUGGESTION_RESPONSE);
    expect(reportsService.getReportSuggestions).toHaveBeenCalledWith(123);
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
