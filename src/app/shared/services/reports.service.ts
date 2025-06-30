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
  basePath: any;
  httpClient: any;
  configuration: any;

  constructor(private http: HttpClient) {}

  // Fetch reports list for search (returns SearchReportResponse)
  searchReports(
    type: 'DAILY' | 'WEEKLY',
    startDate?: string,
    endDate?: string,
    reportNo?:string
    //page = 0,
    //limit = 10
  ): Observable<SearchReportResponse> {
    const params: any = {
      type,
      reportNo
      //page,
      //limit,
    };

    // Only add date parameters if they are defined
    if (startDate) {
      params['date-start'] = startDate;
    }
    if (endDate) {
      params['date-end'] = endDate;
    }

    console.log("trying to get the all reports");

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

  // Delete a report by its ID
  deleteReport(reportId: number): Observable<void> {
    console.log('DELETE call to:', `/api/v1/reports/delete/${reportId}`);
    return this.http.delete<void>(`/api/v1/reports/delete/${reportId}`);
  }

  //Create Report
  createBasicReport(reportType: string): Observable<{ reportId: number }> {
    const url = 'http://localhost:8080/api/v1/reports/create-basic-report';
    const options = {
      params: { reportType },
      headers: {
        'Content-Type': 'application/json'
      }
    };

    return this.http.post<{ reportId: number }>(url, {}, options);
  }


}
