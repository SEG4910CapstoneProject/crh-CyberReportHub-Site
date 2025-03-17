<<<<<<< HEAD
import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { Component, inject, signal, OnInit } from '@angular/core';
=======
import { Component, OnInit, inject } from '@angular/core';
>>>>>>> 81aad849f8c70d189f10c8e25756dde7a06375ad
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { ReportsService } from '../../shared/services/reports.service';
import { PaginatorStatus } from '../../shared/components/paginator/paginator.models';
<<<<<<< HEAD
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
  styleUrls: ['./report-search.component.scss'],
})
export class ReportSearchComponent implements OnInit {
<<<<<<< HEAD

=======
>>>>>>> 81aad849f8c70d189f10c8e25756dde7a06375ad
  private reportsService = inject(ReportsService);
  private router = inject(Router);
  private authService = inject(AuthService);
<<<<<<< HEAD
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

  // Declare form controls and form group
  reportNo: string = '';
  type: 'DAILY' | 'WEEKLY' = 'DAILY'; // Default to 'DAILY'
  startDate: FormControl = new FormControl(null); // Default to null
  endDate: FormControl = new FormControl(null); // Default to null

  searchFormGroup!: FormGroup;

  protected paginatorStatus: PaginatorStatus = {
    itemsPerPage: 10,
    page: 0,
  };

  protected isLoading = false;

  // This will hold the fetched reports
  filteredReports: SearchReportDetailsResponse[] = [];

  ngOnInit() {
    // Log when ngOnInit is called
    console.log('ReportSearchComponent ngOnInit called.');

    // Subscribe to login status
    this.authService.isLoggedIn$.subscribe(status => {
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

    // Fetch reports initially (no filters applied)
    this.onSearch();
  }

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

  // Handle view report logic
  onViewReport(report: SearchReportDetailsResponse): void {
    this.router.navigate([`/reports/read/${report?.reportId}`]);
  }

  // Handle deleting reports
  onDeleteReport(report: SearchReportDetailsResponse): void {
    console.log('Deleting report:', report.reportId); // Log report deletion
    // Logic to delete the report can be added here
  }

  // Navigate to the "create report" page or other relevant route
  onLatestClick(): void {
    this.router.navigate(['/reports/create']);
  }

  // Handle logout
  onLogout(): void {
    this.authService.logout();
  }
}
