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
  merge,
  Observable,
  of,
  shareReplay,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { SearchReportResponse } from '../../shared/sdk/rest-api/model/searchReportResponse';
import { SearchReportDetailsResponse } from '../../shared/sdk/rest-api/model/searchReportDetailsResponse';
import { toSignal } from '@angular/core/rxjs-interop';
import { DateTime } from 'luxon';
import { CrhTranslationService } from '../../shared/services/crh-translation.service';
import { Dialog } from '@angular/cdk/dialog';
import { DeleteReportConfirmDialogComponent } from '../../shared/dialogs/delete-report-confirm-dialog/delete-report-confirm-dialog.component';

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
  protected canDelete = false;
  protected paginatorStatus: PaginatorStatus = {
    itemsPerPage: 10,
    page: 0,
  };
  protected isLoadingSignal = signal<boolean>(true);
  private readonly ERROR_MESSAGE:string = 'dialog.confirm_report_deletion';
  private translateService = inject(CrhTranslationService);
  private dialog = inject(Dialog);


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

    if (this.authService.getRole()?.toLowerCase() == "admin" || this.authService.getRole()?.toLowerCase() == "analyst")
    {
      this.canDelete = true;
    }

  }

  searchPressedEvent$ = new BehaviorSubject<boolean>(true);
  private refreshEvent$ = new Subject<void>();


  public onSearchClick = (): void => {
    console.log('onSearch click clicked');
    this.searchPressedEvent$.next(!this.searchPressedEvent$);
  };

  private reportSearchResults$ = merge(
    this.searchPressedEvent$, // user pressed search
    this.refreshEvent$         // user triggered refresh
  ).pipe(
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
        refreshToken: Date.now()
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
          prev.type == cur.type &&
          prev.refreshToken === cur.refreshToken
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

  private confirmDeletion(reportId:number):void
  {
    this.reportsService.deleteReport(reportId).subscribe({
      next:(res) => {
        console.log("Report was successfully deleted",res)
        this.refreshEvent$.next(); // force refresh
      },
      error:(err) =>console.error(`Error occured while deleting the report ${reportId}:`,err)

    })
  }

  // Handle deleting reports
  onDeleteReport(reportId: number): void {
    this.translateService.getTranslationOnce(this.ERROR_MESSAGE).subscribe((data)=>{
      const error_message = data +reportId+ " ?";
      setTimeout(()=> {
        this.dialog.open(DeleteReportConfirmDialogComponent, {
          data:{
            message:error_message,
            onConfirm: () => this.confirmDeletion(reportId)
          }
        })
      })

    })

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
