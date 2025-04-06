import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { JsonReportResponse } from '../sdk/rest-api/model/jsonReportResponse';
import { catchError, EMPTY, Observable, switchMap, of } from 'rxjs';
import { ReportsService } from '../services/reports.service';

@Injectable({
  providedIn: 'root',
})
export class ReportResolverService implements Resolve<JsonReportResponse> {
  private reportsService = inject(ReportsService);
  private router = inject(Router);

  resolve(route: ActivatedRouteSnapshot): Observable<JsonReportResponse> {
    const reportId = route.params['reportId'] as string;

    return of(reportId).pipe(
      switchMap(id =>
        id.toLowerCase() === 'latest'
          ? this.reportsService.getLatestReport()
          : this.reportsService.getReportByID(parseInt(id, 10))
      ),
      catchError(err => {
        console.error(err);
        this.router.navigate(['/reports']);
        return EMPTY;
      })
    );
  }
}
