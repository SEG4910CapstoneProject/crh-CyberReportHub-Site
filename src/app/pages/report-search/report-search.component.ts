import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { FormControl, FormGroup } from '@angular/forms';
import { DateTime } from 'luxon';
import { PaginatorStatus } from '../../shared/components/paginator/paginator.models';
import {
  catchError,
  combineLatest,
  distinctUntilChanged,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { SearchReportResponse } from '../../shared/sdk/rest-api/model/searchReportResponse';
import { SearchReportDetailsResponse } from '../../shared/sdk/rest-api/model/searchReportDetailsResponse';
import { ReportsService } from '../../shared/services/reports.service';
import { Router } from '@angular/router';

@Component({
  selector: 'crh-report-search',
  templateUrl: './report-search.component.html',
  styleUrl: './report-search.component.scss',
})
export class ReportSearchComponent implements OnInit {
  private reportsService = inject(ReportsService);
  private router = inject(Router);
  private authService = inject(AuthService);

  protected isLoggedIn = signal<boolean>(false);

  protected searchFormGroup = new FormGroup({
    reportNo: new FormControl(''),
    type: new FormControl<'DAILY' | 'WEEKLY'>('DAILY'),
    startDate: new FormControl<DateTime | null>(null),
    endDate: new FormControl<DateTime | null>(null),
  });

  protected paginatorStatusSignal = signal<PaginatorStatus>({
    itemsPerPage: 10,
    page: 0,
  });

  protected isLoadingSignal = signal<boolean>(true);

  private paginatorStatus$ = toObservable(this.paginatorStatusSignal);

  protected DateTime = DateTime;

  private searchFormValue$ = this.searchFormGroup.valueChanges.pipe(
    map(value => (this.searchFormGroup.valid ? value : undefined)),
    startWith(undefined)
  );

  protected reportSearchResults$ = combineLatest([
    this.searchFormValue$,
    this.paginatorStatus$,
  ]).pipe(
    map(([searchValues, paginatorStatus]) => ({
      reportNo: searchValues?.reportNo,
      type: searchValues?.type as 'DAILY' | 'WEEKLY',
      startDate: searchValues?.startDate
        ? searchValues.startDate.toISODate() ?? undefined
        : undefined,
      endDate: searchValues?.endDate
        ? searchValues.endDate.toISODate() ?? undefined
        : undefined,
      page: paginatorStatus.page,
      limit: paginatorStatus.itemsPerPage,
    })),
    distinctUntilChanged(
      (prev, cur) => JSON.stringify(prev) === JSON.stringify(cur)
    ),
    tap(() => this.isLoadingSignal.set(true)),
    switchMap(({ type, startDate, endDate, page, limit }) =>
      this.reportsService
        .searchReports(type, startDate, endDate, page, limit)
        .pipe(
          catchError(err => {
            console.error('Error fetching reports:', err);
            return of({ total: 0, reports: [] } as SearchReportResponse);
          })
        )
    ),
    tap(() => this.isLoadingSignal.set(false)),
    shareReplay()
  );

  protected reportSearchResultsSignal = toSignal(this.reportSearchResults$);
  protected filteredReportsSignal = signal<SearchReportDetailsResponse[]>([]);

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn.set(status);
    });

    // Fetch initial data
    this.reportSearchResults$.subscribe(results => {
      this.filteredReportsSignal.set(results.reports ?? []);
    });

    // Auto-trigger search when search form changes
    this.searchFormGroup.valueChanges.subscribe(() => {
      this.onSearch();
    });
  }

  protected onSearch(): void {
    const { reportNo, type, startDate, endDate } = this.searchFormGroup.value;

    this.filteredReportsSignal.set(
      this.reportSearchResultsSignal()?.reports?.filter(
        report =>
          (!reportNo || report.reportId.toString().includes(reportNo)) &&
          (!type || report.type?.toUpperCase() === type.toUpperCase()) &&
          (!startDate ||
            DateTime.fromISO(report.generatedDate).hasSame(startDate, 'day')) &&
          (!endDate ||
            DateTime.fromISO(report.lastModified).hasSame(endDate, 'day'))
      ) ?? []
    );
  }

  protected onViewReport(report: SearchReportDetailsResponse): void {
    this.router.navigate([`/reports/read/${report?.reportId}`]);
  }

  protected onDeleteReport(report: SearchReportDetailsResponse): void {
    console.log('Deleting report:', report?.reportId);
  }

  protected onLatestClick(): void {
    this.router.navigate(['/reports/create']);
  }

  protected onLogout(): void {
    this.authService.logout();
  }
}
