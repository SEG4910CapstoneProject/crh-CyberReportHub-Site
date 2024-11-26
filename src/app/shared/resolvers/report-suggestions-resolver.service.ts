import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { catchError, EMPTY, map, Observable, of, switchMap, tap } from 'rxjs';
import { JsonReportSuggestionsResponse } from '../sdk/rest-api/model/jsonReportSuggestionsResponse';
import { ReportsService } from '../sdk/rest-api/api/reports.service';

@Injectable({
  providedIn: 'root',
})
export class ReportSuggestionsResolverService
  implements Resolve<JsonReportSuggestionsResponse>
{
  private reportsService = inject(ReportsService);
  private router = inject(Router);

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<JsonReportSuggestionsResponse> {
    const reportId = route.params['reportId'] as string;

    return of(reportId).pipe(
      switchMap(reportId => this.fetchReportIdIfRequired(reportId)),
      switchMap(reportId => this.fetchSuggestions(reportId)),
      catchError(err => {
        console.error(err);
        this.router.navigate(['/reports']);
        return EMPTY;
      })
    );
  }

  private fetchReportIdIfRequired(reportId: string): Observable<string> {
    if (reportId.toLowerCase() === 'latest') {
      return this.reportsService.getLatestId();
    } else {
      return of(reportId);
    }
  }

  private fetchSuggestions(
    reportId: string
  ): Observable<JsonReportSuggestionsResponse> {
    return of(reportId).pipe(
      map(reportId => parseInt(reportId)),
      tap(reportId => {
        if (Number.isNaN(reportId)) {
          throw new Error('Invalid Report Id');
        }
      }),
      switchMap(reportId => this.reportsService.getReportSuggestions(reportId))
    );
  }
}
