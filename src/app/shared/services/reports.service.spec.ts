import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ReportsService } from './reports.service';
import { SearchReportResponse } from '../sdk/rest-api/model/searchReportResponse';
import { JsonReportResponse } from '../sdk/rest-api/model/jsonReportResponse';

describe('ReportsService', () => {
  let service: ReportsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReportsService],
    });
    service = TestBed.inject(ReportsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('searchReports', () => {
    it('should call correct URL with expected params', () => {
      const mockResponse: SearchReportResponse = {} as any;

      service
        .searchReports('DAILY', '123', '2025-01-01', '2025-01-02')
        .subscribe((res) => {
          expect(res).toEqual(mockResponse);
        });

      const req = httpMock.expectOne(
        (r) =>
          r.url === 'http://localhost:8080/api/v1/reports/search' &&
          r.params.get('reportNo') === '123' &&
          r.params.get('type') === 'DAILY' &&
          r.params.get('date-start') === '2025-01-01' &&
          r.params.get('date-end') === '2025-01-02'
      );

      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should include empty strings for undefined date params', () => {
      service.searchReports('WEEKLY', '555').subscribe();

      const req = httpMock.expectOne((r) => r.url.includes('/search'));

      // The service initializes date-start and date-end as empty strings
      expect(req.request.params.get('date-start')).toBe('');
      expect(req.request.params.get('date-end')).toBe('');
      expect(req.request.params.get('reportNo')).toBe('555');
      expect(req.request.params.get('type')).toBe('WEEKLY');

      req.flush({});
    });
  });

  describe('getReportByID', () => {
    it('should call correct URL with reportId', () => {
      const mockResponse: JsonReportResponse = {} as any;

      service.getReportByID(42).subscribe((res) => {
        expect(res).toBe(mockResponse);
      });

      const req = httpMock.expectOne(
        'http://localhost:8080/api/v1/reports/42?format=json'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getLatestReport', () => {
    it('should call /latest endpoint', () => {
      const mockResponse: JsonReportResponse = {} as any;

      service.getLatestReport().subscribe((res) => {
        expect(res).toBe(mockResponse);
      });

      const req = httpMock.expectOne(
        'http://localhost:8080/api/v1/reports/latest?format=json'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('deleteReport', () => {
    it('should call DELETE on correct endpoint', () => {
      service.deleteReport(101).subscribe((res) => {
        expect(res).toBeUndefined();
      });

      const req = httpMock.expectOne('/api/v1/reports/delete/101');
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('createBasicReport', () => {
    it('should POST to create-basic-report with correct params', () => {
      const mockResponse = { reportId: 999 };

      service.createBasicReport('DAILY').subscribe((res) => {
        expect(res.reportId).toBe(999);
      });

      const req = httpMock.expectOne(
        'http://localhost:8080/api/v1/reports/create-basic-report?reportType=DAILY'
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(mockResponse);
    });
  });

  describe('createReport', () => {
    it('should POST to reports endpoint with payload', () => {
      const payload = { key: 'value' };
      const mockResponse: JsonReportResponse = {} as any;

      service.createReport(payload).subscribe((res) => {
        expect(res).toBe(mockResponse);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/v1/reports');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(mockResponse);
    });
  });
});
