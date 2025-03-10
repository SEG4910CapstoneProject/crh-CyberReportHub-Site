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
import { Router } from '@angular/router';
import { ReportsService } from '../../shared/sdk/rest-api/api/reports.service';

@Component({
  selector: 'crh-report-search',
  templateUrl: './report-search.component.html',
  styleUrl: './report-search.component.scss',
})
export class ReportSearchComponent implements OnInit {
  private readonly REPORT_TYPE = 'DAILY';

  private reportsService = inject(ReportsService);
  private router = inject(Router);
  private authService = inject(AuthService);

  protected isLoggedIn = signal<boolean>(false);

  protected searchFormGroup = new FormGroup({
    reportNo: new FormControl(''),
    type: new FormControl(''),
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
      type: searchValues?.type,
      startDate: searchValues?.startDate?.toISODate(),
      endDate: searchValues?.endDate?.toISODate(),
      page: paginatorStatus.page,
      limit: paginatorStatus.itemsPerPage,
    })),
    distinctUntilChanged(
      (prev, cur) => JSON.stringify(prev) === JSON.stringify(cur)
    ),
    tap(() => this.isLoadingSignal.set(true)),
    switchMap(({ startDate, endDate, page, limit }) =>
      this.reportsService
        .searchReports(
          this.REPORT_TYPE,
          startDate || undefined,
          endDate || undefined,
          page,
          limit
        )
        .pipe(
          catchError(err => {
            console.error(err);
            return of({ total: 0, reports: [] } as SearchReportResponse);
          })
        )
    ),
    tap(() => this.isLoadingSignal.set(false)),
    shareReplay()
  );

  private reports$ = this.reportSearchResults$.pipe(
    map(result => result.reports)
  );

  private reportTotalSignal = toSignal(
    this.reportSearchResults$.pipe(map(result => result.total))
  );

  protected reportSearchResultsSignal = toSignal(this.reports$);
  protected filteredReportsSignal = signal<SearchReportDetailsResponse[]>([]);

  protected reportSearchTotalSignal = computed(
    () => this.reportTotalSignal() || 0
  );

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn.set(status);
    });

    // Hardcoded data to ensure the table appears for testing
    this.filteredReportsSignal.set([
      {
        reportId: 100234,
        reportType: 'Daily',
        type: 'daily',
        template: '',
        generatedDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        emailStatus: true,
        articleTitles: ['Threat Analysis', 'Breach Overview'],
        iocs: [],
        stats: [],
      },
      {
        reportId: 100235,
        reportType: 'Weekly',
        type: 'weekly',
        template: '',
        generatedDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        emailStatus: false,
        articleTitles: ['APT Group Activity', 'Vulnerability Review'],
        iocs: [],
        stats: [],
      },
    ]);
  }

  protected onSearch(): void {
    const { reportNo, type } = this.searchFormGroup.value;

    this.filteredReportsSignal.set(
      this.reportSearchResultsSignal()?.filter(
        report =>
          (!reportNo || report.reportId.toString().includes(reportNo)) &&
          (!type || report.type?.toLowerCase() === type.toLowerCase()) // 🔹 Ensure type matches dropdown
      ) ?? []
    );
  }

  protected onLatestClick(): void {
    this.router.navigate(['/reports/create']);
  }

  protected onViewReport(report: SearchReportDetailsResponse): void {
    console.log('Viewing report:', report.reportId);
    this.router.navigate([`/reports/read/${report.reportId}`]);
  }

  protected onDeleteReport(report: SearchReportDetailsResponse): void {
    console.log('Deleting report:', report.reportId);
    // Add delete API
  }

  protected onLogout(): void {
    this.authService.logout();
  }
}
