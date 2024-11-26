import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { JsonReportResponse } from '../sdk/rest-api/model/jsonReportResponse';
import { catchError, EMPTY, map, Observable, of, switchMap, tap } from 'rxjs';
import { ReportsService } from '../sdk/rest-api/api/reports.service';

@Injectable({
  providedIn: 'root',
})
export class ReportResolverService implements Resolve<JsonReportResponse> {
  private reportsService = inject(ReportsService);
  private router = inject(Router);

  resolve(route: ActivatedRouteSnapshot): Observable<JsonReportResponse> {
    const reportId = route.params['reportId'] as string;

    return of(reportId).pipe(
      switchMap(reportId => this.fetchReports(reportId)),
      catchError(err => {
        console.error(err);
        this.router.navigate(['/reports']);
        return EMPTY;
      })
    );
  }

  private fetchReports(reportId: string): Observable<JsonReportResponse> {
    if (reportId.toLowerCase() === 'latest') {
      return this.reportsService.getLatestReport('json');
    } else {
      return of(reportId).pipe(
        map(reportId => parseInt(reportId)),
        tap(reportId => {
          if (Number.isNaN(reportId)) {
            throw new Error('Invalid Report Id');
          }
        }),
        switchMap(reportId =>
          this.reportsService.getReportByID(reportId, 'json')
        )
      );
    }
  }
}
