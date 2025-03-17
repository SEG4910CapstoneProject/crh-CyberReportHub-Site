import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { FormControl, FormGroup } from '@angular/forms';
import { PaginatorStatus } from '../../shared/components/paginator/paginator.models';

import {
  catchError,
  combineLatest,
  distinctUntilChanged,
  map,
  of,
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
import { DateTime } from 'luxon';




@Component({
  selector: 'crh-report-search',
  templateUrl: './report-search.component.html',
  styleUrls: ['./report-search.component.scss'],
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



  // Declare form controls and form group
  reportNo: string = '';
  type: 'DAILY' | 'WEEKLY' = 'DAILY'; // Default to 'DAILY'
  startDate: FormControl = new FormControl(null); // Default to null
  endDate: FormControl = new FormControl(null); // Default to null



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
      this.isLoggedIn.set(status);
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

    const startDateStr = startDate ? startDate.toString() : '';
    const endDateStr = endDate ? endDate.toString() : '';
    const typeStr = type ?? 'DAILY';

    // Fetch reports from the service
    this.reportsService
      .searchReports(
        typeStr,
        startDateStr,
        endDateStr,
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
