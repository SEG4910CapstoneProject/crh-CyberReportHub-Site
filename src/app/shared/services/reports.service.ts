import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchReportResponse } from '../sdk/rest-api/model/searchReportResponse';
import { JsonReportResponse } from '../sdk/rest-api/model/jsonReportResponse';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private apiUrl = 'http://localhost:8080/api/v1/reports';

  constructor(private http: HttpClient) {}

  // Fetch reports list for search (returns SearchReportResponse)
  searchReports(
    type?: 'DAILY' | 'WEEKLY',
    startDate?: string,
    endDate?: string,
    page: number = 0,
    limit: number = 10
  ): Observable<SearchReportResponse> {
    const params: any = {
      'date-start': startDate || undefined,
      'date-end': endDate || undefined,
      type,
      page,
      limit,
    };

    return this.http.get<SearchReportResponse>(`${this.apiUrl}/search`, {
      params,
    });
  }

  // Full details for a single report (returns JsonReportResponse)
  getReportByID(reportId: number): Observable<JsonReportResponse> {
    return this.http.get<JsonReportResponse>(
      `${this.apiUrl}/${reportId}?format=json`
    );
  }

  // Latest report (returns JsonReportResponse)
  getLatestReport(): Observable<JsonReportResponse> {
    return this.http.get<JsonReportResponse>(
      `${this.apiUrl}/latest?format=json`
    );
  }
}
