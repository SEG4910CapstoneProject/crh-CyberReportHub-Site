import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReportsService } from '../../shared/services/reports.service';
import { PaginatorStatus } from '../../shared/components/paginator/paginator.models';
import {
  BehaviorSubject,
  catchError,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { SearchReportResponse } from '../../shared/sdk/rest-api/model/searchReportResponse';
import { SearchReportDetailsResponse } from '../../shared/sdk/rest-api/model/searchReportDetailsResponse';
import { toSignal } from '@angular/core/rxjs-interop';
import { DateTime } from 'luxon';

@Component({
  selector: 'crh-report-search',
  templateUrl: './report-search.component.html',
  styleUrls: ['./report-search.component.scss'],
  standalone: false,
})
export class ReportSearchComponent implements OnInit {
  private reportsService = inject(ReportsService);
  private router = inject(Router);
  public authService = inject(AuthService);

  private type: 'DAILY' | 'WEEKLY' | 'notSpecified' = 'notSpecified';
  private startDate: FormControl = new FormControl<DateTime | null>(null);
  private endDate: FormControl = new FormControl<DateTime | null>(null);

  protected isLoggedIn = false;
  protected paginatorStatus: PaginatorStatus = {
    itemsPerPage: 10,
    page: 0,
  };
  protected isLoadingSignal = signal<boolean>(true);

  // This will hold the fetched reports
  filteredReports: SearchReportDetailsResponse[] = [];

  protected searchFormGroup = new FormGroup({
    reportNo: new FormControl('', [Validators.pattern(/^[1-9][0-9]*$/)]), // only strictly positive values are accepted
    type: new FormControl(this.type),
    startDate: this.startDate,
    endDate: this.endDate,
  });

  ngOnInit(): void {
    console.log('ReportSearchComponent ngOnInit called.');

    // Subscribe to login status
    this.authService.isLoggedIn$.subscribe(status => {
      console.log('Is Logged In:', status); // Debugging login status
      this.isLoggedIn = status;
    });
  }

  searchPressedEvent$ = new BehaviorSubject<boolean>(true);

  public onSearchClick = (): void => {
    console.log('onSearch click clicked');
    this.searchPressedEvent$.next(!this.searchPressedEvent$);
  };

  private reportSearchResults$: Observable<SearchReportResponse> =
    this.searchPressedEvent$.pipe(
      map(() => this.searchFormGroup.value),
      map(dateValues => ({
        // STEP 2: data assembly
        startDate: dateValues?.startDate,
        endDate: dateValues?.endDate,
        reportNo: dateValues?.reportNo,
        type: dateValues.type,
      })),
      map(({ startDate, endDate, reportNo, type }) => ({
        // STEP 3: data formatting
        startDate: startDate?.toISODate() ?? null,
        endDate: endDate?.toISODate() ?? null,
        reportNo,
        type,
      })),
      tap(v => console.log('🔍 Emitted before distinct:', v)),
      distinctUntilChanged(
        // STEP 4: a small performance gain by preventing repetitive api calls
        // distinctUntilChanged() is an RxJS operator used to prevent emitting the same value twice in a row,
        // here we compare the previous value emission to this one, if it's the same no need to make a new api request
        (prev, cur) =>
          prev.startDate === cur.startDate &&
          prev.endDate === cur.endDate &&
          prev.reportNo === cur.reportNo &&
          prev.type == cur.type
      ),
      filter(() => this.searchFormGroup.valid),
      tap(() => this.isLoadingSignal.set(true)), // STEP 5: setting the loading signal. tap is a side effect operator, it does not change the value of the stream
      // STEP 6: make the api call. switchMap cancels any ongoing API call if a new set
      // of search params is emitted
      switchMap(({ startDate, endDate, reportNo, type }) =>
        this.reportsService.searchReports(type!, reportNo!, startDate, endDate)
      ),
      catchError(err => {
        console.error('Error fetching reports:', err); // Log any error
        return of({ total: 0, reports: [] } as SearchReportResponse);
      }),
      tap(() => this.isLoadingSignal.set(false)),
      // STEP 7:  It shares the latest emitted result with all subscribers, that way not everyone would go through the same process of making an api request
      shareReplay()
    ) as Observable<SearchReportResponse>;

  private reports$ = this.reportSearchResults$.pipe(
    tap(result => console.log('result is: ', result)),
    map(result => result.reports)
  );

  protected reportSearchResultsSignal = toSignal(this.reports$); // Step 1: Getting the current value of reportSearchResultsSignal as a reactive signal

  private reportTotalSignal = toSignal(
    this.reportSearchResults$.pipe(map(result => result.total))
  );

  protected reportSearchTotalSignal = computed(() => {
    const reportTotal = this.reportTotalSignal();
    if (!reportTotal) {
      return 0;
    }

    return reportTotal;
  });

  // Handle deleting reports
  onDeleteReport(reportId: number): void {
    const confirmed = confirm(
      `Are you sure you want to delete report #${reportId}?`
    );
    if (!confirmed) return;

    // this.reportsService.deleteReport(report.reportId).subscribe(
    //   () => {
    //     console.log('Report deleted successfully');
    //     // After successful deletion, remove it from the filteredReports array
    //     this.filteredReports = this.filteredReports.filter(r => r.reportId !== report.reportId);
    //   },
    //   error => {
    //     console.error('Error deleting report:', error);
    //   }
    // );
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
