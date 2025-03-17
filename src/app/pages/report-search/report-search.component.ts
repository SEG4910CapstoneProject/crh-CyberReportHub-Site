import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { Component, inject, signal, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { DateTime } from 'luxon';
import { ReportsService } from '../../shared/services/reports.service';
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
  shareReplay,
} from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { SearchReportResponse } from '../../shared/sdk/rest-api/model/searchReportResponse';
import { SearchReportDetailsResponse } from '../../shared/sdk/rest-api/model/searchReportDetailsResponse';
import { Router } from '@angular/router';
import { DarkModeService } from '../../shared/services/dark-mode.service';
import { ReportsService } from '../../shared/sdk/rest-api/api/reports.service';
=======
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { SearchReportResponse } from '../../shared/sdk/rest-api/model/searchReportResponse';
import { SearchReportDetailsResponse } from '../../shared/sdk/rest-api/model/searchReportDetailsResponse';
>>>>>>> 81aad849f8c70d189f10c8e25756dde7a06375ad

@Component({
  selector: 'crh-report-search',
  templateUrl: './report-search.component.html',
})
export class ReportSearchComponent implements OnInit {

  private reportsService = inject(ReportsService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private darkModeService = inject(DarkModeService);

  protected isLoggedIn = signal<boolean>(false);
  protected searchFormGroup = new FormGroup({
    reportNo: new FormControl(''),
    template: new FormControl(''),
    type: new FormControl(''),
    startDate: new FormControl<DateTime | undefined>(undefined),
    endDate: new FormControl<DateTime | undefined>(undefined),
  });
=======

  protected isLoggedIn = false;
>>>>>>> 81aad849f8c70d189f10c8e25756dde7a06375ad

  protected paginatorStatusSignal = signal<PaginatorStatus>({
  // Declare form controls and form group
  reportNo: string = '';
  type: 'DAILY' | 'WEEKLY' = 'DAILY'; // Default to 'DAILY'
  startDate: FormControl = new FormControl(null); // Default to null
  endDate: FormControl = new FormControl(null); // Default to null

  searchFormGroup!: FormGroup;

  protected paginatorStatus: PaginatorStatus = {
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
      template: searchValues?.template,
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
  };

  protected isLoading = false;

  // This will hold the fetched reports
  filteredReports: SearchReportDetailsResponse[] = [];

  ngOnInit() {
    // Log when ngOnInit is called
    console.log('ReportSearchComponent ngOnInit called.');

    // Subscribe to login status
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn.set(status);
      console.log('Is Logged In:', status); // Debugging login status
      this.isLoggedIn = status;
    });

    // Initialize form group with controls
    this.searchFormGroup = new FormGroup({
      reportNo: new FormControl(''),
      type: new FormControl(this.type),
      startDate: this.startDate,
      endDate: this.endDate,
    });

    // Hardcoded data to ensure the table appears for testing
    this.filteredReportsSignal.set([
      {
        reportId: 100234,
        reportType: 'Daily',
        type: 'Phishing',
        template: 'Daily Report',
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
        type: 'Malware',
        template: 'Weekly Report',
        generatedDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        emailStatus: false,
        articleTitles: ['APT Group Activity', 'Vulnerability Review'],
        iocs: [],
        stats: [],
      },
    ]);
    // Fetch reports initially (no filters applied)
    this.onSearch();
  }

  protected onSearch(): void {
    const { reportNo, template, type } = this.searchFormGroup.value;

    this.filteredReportsSignal.set(
      this.reportSearchResultsSignal()?.filter(
        report =>
          (!reportNo || report.reportId.toString().includes(reportNo)) &&
          (!template ||
            report.template?.toLowerCase().includes(template.toLowerCase())) &&
          (!type || report.type?.toLowerCase().includes(type.toLowerCase()))
      ) ?? []
    );
  // Handle search logic
  onSearch(): void {
    const { reportNo, type, startDate, endDate } = this.searchFormGroup.value;

    this.isLoading = true;

    console.log('Fetching reports with parameters:', {
      reportNo,
      type,
      startDate,
      endDate,
      page: this.paginatorStatus.page,
      limit: this.paginatorStatus.itemsPerPage,
    });

    // Fetch reports from the service
    this.reportsService
      .searchReports(
        type,
        startDate,
        endDate,
        this.paginatorStatus.page,
        this.paginatorStatus.itemsPerPage
      )
      .pipe(
        catchError(err => {
          console.error('Error fetching reports:', err); // Log any error
          return of({ total: 0, reports: [] } as SearchReportResponse);
        })
      )
      .subscribe((response: SearchReportResponse) => {
        console.log('Fetched Reports Response:', response); // Log the response

        this.isLoading = false;
        this.filteredReports = response.reports ?? [];
        // Ensure that reports have a valid type before displaying
        this.filteredReports = this.filteredReports.map(report => ({
          ...report,
          type:
            report.type === 'DAILY' || report.type === 'WEEKLY'
              ? report.type
              : 'Unknown', // Default to 'Unknown' for invalid types
        }));

        console.log('Filtered Reports:', this.filteredReports); // Log the filtered reports
      });
  }

  protected onLatestClick(): void {
    this.router.navigate(['/reports/create']);
  // Handle view report logic
  onViewReport(report: SearchReportDetailsResponse): void {
    this.router.navigate([`/reports/read/${report?.reportId}`]);
  }

  protected onViewReport(report: SearchReportDetailsResponse): void {
    console.log('Viewing report:', report.reportId);
    this.router.navigate([`/reports/read/${report.reportId}`]);
  // Handle deleting reports
  onDeleteReport(report: SearchReportDetailsResponse): void {
    console.log('Deleting report:', report.reportId); // Log report deletion
    // Logic to delete the report can be added here
  }

  protected onDeleteReport(report: SearchReportDetailsResponse): void {
    console.log('Deleting report:', report.reportId);
    // Add delete API
  // Navigate to the "create report" page or other relevant route
  onLatestClick(): void {
    this.router.navigate(['/reports/create']);
  }

  protected onLogout(): void {
  // Handle logout
  onLogout(): void {
    this.authService.logout();
  }
}
