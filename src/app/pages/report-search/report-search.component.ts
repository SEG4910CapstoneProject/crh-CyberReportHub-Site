import { Component, OnInit, inject, signal } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { ReportsService } from '../../shared/services/reports.service';
import { PaginatorStatus } from '../../shared/components/paginator/paginator.models';
import { catchError, combineLatest, distinctUntilChanged, map, of, pipe, shareReplay, startWith, switchMap, tap } from 'rxjs';
import { SearchReportResponse } from '../../shared/sdk/rest-api/model/searchReportResponse';
import { SearchReportDetailsResponse } from '../../shared/sdk/rest-api/model/searchReportDetailsResponse';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'crh-report-search',
    templateUrl: './report-search.component.html',
    styleUrls: ['./report-search.component.scss'],
    standalone: false
})
export class ReportSearchComponent implements OnInit {
  private reportsService = inject(ReportsService);
  private router = inject(Router);
  private authService = inject(AuthService);

  protected isLoggedIn = false;

  // Declare form controls and form group
  reportNo = '';
  type: 'DAILY' | 'WEEKLY' = 'DAILY'; // Default to 'DAILY'
  startDate: FormControl = new FormControl(null); // Default to null
  endDate: FormControl = new FormControl(null); // Default to null

  //searchFormGroup!: FormGroup;

  protected paginatorStatus: PaginatorStatus = {
    itemsPerPage: 10,
    page: 0,
  };

  protected isLoadingSignal = signal<boolean>(true);

  // This will hold the fetched reports
  filteredReports: SearchReportDetailsResponse[] = [];

  protected searchFormGroup = new FormGroup({ // Initialize form group with controls
      reportNo: new FormControl(''),
      type: new FormControl(this.type),
      startDate: this.startDate,
      endDate: this.endDate,
    });

  ngOnInit():void {
    // Log when ngOnInit is called
    console.log('ReportSearchComponent ngOnInit called.');

    // Subscribe to login status
    this.authService.isLoggedIn$.subscribe(status => {
      console.log('Is Logged In:', status); // Debugging login status
      this.isLoggedIn = status;
    });

 

    // Fetch reports initially (no filters applied)
    //this.onSearch();
  }

  // Handle search logic
  // onSearch(): void {
  //   const { reportNo, type, startDate, endDate } = this.searchFormGroup.value;

  //   this.isLoading = true;

  //   console.log('Fetching reports with parameters:', {
  //     reportNo,
  //     type,
  //     startDate,
  //     endDate,
  //     page: this.paginatorStatus.page,
  //     limit: this.paginatorStatus.itemsPerPage,
  //   });

  //   // Fetch reports from the service
  //   this.reportsService
  //     .searchReports(
  //       type,
  //       startDate,
  //       endDate,
  //       this.paginatorStatus.page,
  //       this.paginatorStatus.itemsPerPage
  //     )
  //     .pipe(
  //       catchError(err => {
  //         console.error('Error fetching reports:', err); // Log any error
  //         return of({ total: 0, reports: [] } as SearchReportResponse);
  //       })
  //     )
  //     .subscribe((response: SearchReportResponse) => {
  //       console.log('Fetched Reports Response:', response); // Log the response

  //       this.isLoading = false;
  //       this.filteredReports = response.reports ?? [];
  //       // Ensure that reports have a valid type before displaying
  //       this.filteredReports = this.filteredReports.map(report => ({
  //         ...report,
  //         type:
  //           report.type === 'DAILY' || report.type === 'WEEKLY'
  //             ? report.type
  //             : 'Unknown', // Default to 'Unknown' for invalid types
  //       }));

  //       console.log('Filtered Reports:', this.filteredReports); // Log the filtered reports
  //     });
  // }

  private dateFormValue$ = this.searchFormGroup.valueChanges.pipe(
    startWith(this.searchFormGroup.value),
    map(value => {
      return value;// not being strict about validation, if any field isn't present,just get the whole list. i.e: if start date isnt present, 
      // get all the reports whose piblication date is before the end date.
    })
  )

  private reportSearchResults$ = combineLatest([
    this.dateFormValue$ ,// TODO, MIGHT add paginator status??
  ]).pipe(
    // The pipe(...) allows to chain RxJS operators to transform the data.
    // map(...) takes the [dateValues] array (and possibly other stuff if we decide to add them in the future) and transforms it 
    // into a single object with selected properties.
    map(([dateValues]) => ({ // data assembly
      startDate:dateValues?.startDate,
      endDate:dateValues?.endDate,
      reportNo:dateValues?.reportNo,
      type:dateValues?.type
    })),
    map(({startDate,endDate,reportNo,type}) => ({
      // data formatting
      startDate: startDate?.toISODate() ?? undefined,
      endDate: endDate?.toISODate() ?? undefined,
      reportNo,
      type
    })),
    distinctUntilChanged(
      // distinctUntilChanged() is an RxJS operator used to prevent emitting the same value twice in a row, 
      // here we compare the previous value emission to this one, if it's the same no need to make an api request
      (prev,cur) => 
        prev.startDate === cur.startDate &&
        prev.endDate === cur.endDate &&
        prev.reportNo === cur.reportNo &&
        prev.type == cur.type
    ),
    tap(() => this.isLoadingSignal.set(true)),
    // tap is a side effect operator, it does not change the value of the stream

    // switchMap cancels any ongoing API call if a new set 
    // of search params is emitted 
    switchMap(({startDate,endDate,reportNo,type}) => 
      this.reportsService.searchReports(
        type!,
        startDate,
        endDate,
        reportNo ?? undefined
      )
    ),
    catchError(err => {
      console.error('Error fetching reports:', err); // Log any error
      return of({ total: 0, reports: [] } as SearchReportResponse);
    }),
    tap(()=> this.isLoadingSignal.set(false)),
    tap((respnse)=> {
      console.log("the response is: ",respnse)
    }),
    // pipe(map(response => {
    //   console.log("the result is: ",response);
    // })),
    // It shares the latest emitted result with all subscribers, that way not everyone would go through the same process
    shareReplay()

  )

  // private reports$ = this.reportSearchResults$.pipe(
  //   map(result => result.reports)
  // );

  protected reportSearchResultsSignal = toSignal(this.reportSearchResults$);// Step 1: Getting the current value of reportSearchResultsSignal as a reactive signal

  // protected resportSearchTotalSignal = computed(()=> {
  //   const reportTotal = this.reportTotalSignal();
  //   if (!report)
  // })
  // Handle view report logic
  onViewReport(report: SearchReportDetailsResponse): void {
    this.router.navigate([`/reports/read/${report?.reportId}`]);
  }

  // Handle deleting reports
  onDeleteReport(report: SearchReportDetailsResponse): void {
    const confirmed = confirm(`Are you sure you want to delete report #${report.reportId}?`);
    if (!confirmed) return;

    this.reportsService.deleteReport(report.reportId).subscribe(
      () => {
        console.log('Report deleted successfully');
        // After successful deletion, remove it from the filteredReports array
        this.filteredReports = this.filteredReports.filter(r => r.reportId !== report.reportId);
      },
      error => {
        console.error('Error deleting report:', error);
      }
    );
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
