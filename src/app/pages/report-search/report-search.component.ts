import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DateTime } from 'luxon';
import { PaginatorStatus } from '../../shared/components/paginator/paginator.models';
import { multipleFieldsSameStateValidator } from '../../shared/class/crh-multi-field-validator';
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
import { Router } from '@angular/router';
import { ReportsService } from '../../shared/sdk/rest-api/api/reports.service';

@Component({
  selector: 'crh-report-search',
  templateUrl: './report-search.component.html',
  styleUrl: './report-search.component.scss',
})
export class ReportSearchComponent {
  private readonly REPORT_TYPE = 'DAILY';

  private reportsService = inject(ReportsService);
  private router = inject(Router);

  protected dateFormGroup = new FormGroup(
    {
      startDate: new FormControl<DateTime | undefined>(undefined),
      endDate: new FormControl<DateTime | undefined>(undefined),
    },
    { validators: multipleFieldsSameStateValidator(['startDate', 'endDate']) }
  );
  protected paginatorStatusSignal = signal<PaginatorStatus>({
    itemsPerPage: 10,
    page: 0,
  });
  protected isLoadingSignal = signal<boolean>(true);

  private paginatorStatus$ = toObservable(this.paginatorStatusSignal);

  private dateFormValue$ = this.dateFormGroup.valueChanges.pipe(
    // mark all as touched on the gruop does not work
    map(value => {
      if (!this.dateFormGroup.valid || !value.endDate || !value.startDate) {
        return undefined;
      }
      return value;
    }),
    startWith(undefined)
  );

  private reportSearchResults$ = combineLatest([
    this.dateFormValue$,
    this.paginatorStatus$,
  ]).pipe(
    map(([dateValues, paginatorStatus]) => ({
      startDate: dateValues?.startDate,
      endDate: dateValues?.endDate,
      page: paginatorStatus.page,
      limit: paginatorStatus.itemsPerPage,
    })),
    map(({ startDate, endDate, page, limit }) => ({
      startDate: startDate?.toISODate() ?? undefined,
      endDate: endDate?.toISODate() ?? undefined,
      page,
      limit,
    })),
    distinctUntilChanged(
      (prev, cur) =>
        prev.startDate === cur.startDate &&
        prev.endDate === cur.endDate &&
        prev.page === cur.page &&
        prev.limit === cur.limit
    ),
    tap(() => this.isLoadingSignal.set(true)),
    switchMap(({ startDate, endDate, page, limit }) =>
      this.reportsService.searchReports(
        this.REPORT_TYPE,
        startDate,
        endDate,
        page,
        limit
      )
    ),
    catchError(err => {
      console.error(err);
      return of({
        total: 0,
        reports: [],
      } satisfies SearchReportResponse);
    }),
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

  protected reportSearchTotalSignal = computed(() => {
    const reportTotal = this.reportTotalSignal();
    if (!reportTotal) {
      return 0;
    }

    return reportTotal;
  });

  protected onLatestClick(): void {
    this.router.navigate(['/reports/read/latest']);
  }
}
