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
    type: new FormControl<'ALL' | 'DAILY' | 'WEEKLY'>('ALL'), // Default to ALL
    startDate: new FormControl<DateTime | undefined>(undefined),
    endDate: new FormControl<DateTime | undefined>(undefined),
  });

  protected paginatorStatusSignal = signal<PaginatorStatus>({
    itemsPerPage: 10,
    page: 0,
  });

  protected isLoadingSignal = signal<boolean>(true);

  private paginatorStatus$ = toObservable(this.paginatorStatusSignal);

  private searchFormValue$ = this.searchFormGroup.valueChanges.pipe(
    map(value => (this.searchFormGroup.valid ? value : undefined)),
    startWith(undefined)
  );

  private reportSearchResults$ = combineLatest([
    this.searchFormValue$,
    this.paginatorStatus$,
  ]).pipe(
    map(([searchValues, paginatorStatus]) => ({
      reportNo: searchValues?.reportNo,
      type:
        searchValues?.type === 'ALL'
          ? undefined
          : searchValues?.type?.toUpperCase(), // Handle "ALL" case
      startDate: searchValues?.startDate?.toISODate() || undefined,
      endDate: searchValues?.endDate?.toISODate() || undefined,
      page: paginatorStatus.page,
      limit: paginatorStatus.itemsPerPage,
    })),
    distinctUntilChanged(
      (prev, cur) => JSON.stringify(prev) === JSON.stringify(cur)
    ),
    tap(() => this.isLoadingSignal.set(true)),
    switchMap(({ type, startDate, endDate, page, limit }) =>
      this.reportsService
        .searchReports(
          type ? (type as 'DAILY' | 'WEEKLY') : undefined,
          startDate,
          endDate,
          page,
          limit
        )
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
    const { reportNo, type } = this.searchFormGroup.value;

    if (!this.reportSearchResultsSignal()?.reports) return;

    this.filteredReportsSignal.set(
      this.reportSearchResultsSignal()?.reports?.filter(
        report =>
          (!reportNo || report.reportId.toString().includes(reportNo)) &&
          (type === 'ALL' || report.type?.toUpperCase() === type?.toUpperCase())
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
