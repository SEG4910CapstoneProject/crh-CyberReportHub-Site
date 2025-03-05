import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { JsonArticleReportResponse } from '../../../shared/sdk/rest-api/model/jsonArticleReportResponse';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { DateUtilsService } from '../../../shared/services/date-utils.service';
import { JsonReportResponse } from '../../../shared/sdk/rest-api/model/jsonReportResponse';
import {
  catchError,
  defaultIfEmpty,
  EMPTY,
  filter,
  map,
  merge,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { ReportHeaderInfo } from '../../../shared/components/report-header/report-header.models';
import { JsonStatsResponse } from '../../../shared/sdk/rest-api/model/jsonStatsResponse';
import { TextInputConfig } from '../../../shared/components/text-input/text-input.model';
import { CrhTranslationService } from '../../../shared/services/crh-translation.service';
import { ReportResolverService } from '../../../shared/resolvers/report-resolver.service';
import { ReportSuggestionsResolverService } from '../../../shared/resolvers/report-suggestions-resolver.service';
import { JsonReportSuggestionsResponse } from '../../../shared/sdk/rest-api/model/jsonReportSuggestionsResponse';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { EditArticleDialogComponent } from '../../../shared/dialogs/edit-article-dialog/edit-article-dialog.component';
import { EditStatisticDialogComponent } from '../../../shared/dialogs/edit-statistic-dialog/edit-statistic-dialog.component';
import {
  EditArticleDialogData,
  EditArticleDialogResult,
  EditArticleDialogResultObject,
} from '../../../shared/dialogs/edit-article-dialog/edit-article-dialog.model';
import {
  EditStatDialogData,
  EditStatDialogResult,
  EditStatDialogResultObject,
} from '../../../shared/dialogs/edit-statistic-dialog/edit-statistic-dialog.model';
import { ReportsService } from '../../../shared/sdk/rest-api/api/reports.service';
import { StatisticsService } from '../../../shared/sdk/rest-api/api/statistics.service';
import { ArticlesService } from '../../../shared/sdk/rest-api/api/articles.service';
import { FormControl, Validators } from '@angular/forms';
import { ErrorHintConfig } from '../../../shared/models/input.model';
import { ArticleCategoryGroup } from '../layout/report-article-area/report-article-area.models';
import { CategoriesService } from '../services/categories.service';

@Component({
  selector: 'crh-report-edit',
  templateUrl: './report-edit.component.html',
  styleUrl: './report-edit.component.scss',
})
export class ReportEditComponent {
  private activatedRoute = inject(ActivatedRoute);
  private dateUtilsService = inject(DateUtilsService);
  private crhTranslationService = inject(CrhTranslationService);
  private reportResolver = inject(ReportResolverService);
  private reportSuggestionResolver = inject(ReportSuggestionsResolverService);
  private reportsService = inject(ReportsService);
  private statisticsService = inject(StatisticsService);
  private articlesService = inject(ArticlesService);
  private categoriesService = inject(CategoriesService);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(Dialog);

  protected categories = signal<string[]>(['cat1']);
  protected rawHotbarStats = signal<JsonStatsResponse[]>([]);

  private reloadReportDataSubject$ = new Subject<void>();

  protected newArticleForm = new FormControl<string | null>(null, [
    Validators.required,
  ]);
  protected newArticleErrorHint: ErrorHintConfig[] = [
    {
      hint: 'Must be a valid link',
    },
  ];

  private rawHotbarSuggestions = toSignal(
    merge(
      this.activatedRoute.data.pipe(
        filter(obj => !!obj),
        map(
          ({ suggestionData }) =>
            suggestionData as JsonReportSuggestionsResponse
        )
      ),
      this.reloadReportDataSubject$.pipe(
        switchMap(() =>
          this.reportSuggestionResolver.resolve(this.activatedRoute.snapshot)
        ),
        defaultIfEmpty(undefined)
      )
    )
  );

  private reportData = toSignal(
    merge(
      this.activatedRoute.data.pipe(
        filter(obj => !!obj),
        map(({ reportData }) => reportData as JsonReportResponse)
      ),
      this.reloadReportDataSubject$.pipe(
        switchMap(() =>
          this.reportResolver.resolve(this.activatedRoute.snapshot)
        ),
        defaultIfEmpty(undefined)
      )
    )
  );

  private addArticleTranslation = toSignal(
    this.crhTranslationService.getTranslationFromKeyAsStream(
      'report.edit.addArticle'
    ),
    {
      initialValue: '',
    }
  );

  protected reportHeaderInfo = computed<ReportHeaderInfo | undefined>(() => {
    const reportData = this.reportData();
    if (!reportData) {
      return undefined;
    }

    const generatedDate = this.dateUtilsService.getDateFromString(
      reportData.generatedDate
    );
    const lastModifiedDate = this.dateUtilsService.getDateFromString(
      reportData.lastModified
    );
    const isEmailSent: boolean | undefined = reportData.emailStatus;

    if (!generatedDate || !lastModifiedDate || isEmailSent === undefined) {
      return undefined;
    }

    return {
      reportDate: generatedDate,
      generatedDate: generatedDate,
      isEmailSent: isEmailSent,
      lastModifiedDate: lastModifiedDate,
    };
  });

  protected reportArticles = computed<JsonArticleReportResponse[]>(() => {
    const reportArticles = this.reportData()?.articles;
    if (!reportArticles) {
      return [];
    }

    return reportArticles;
  });

  protected hotbarArticles = computed<JsonArticleReportResponse[]>(
    () => this.rawHotbarSuggestions()?.articles ?? []
  );

  protected hotbarStats = computed<JsonStatsResponse[]>(
    () => this.rawHotbarSuggestions()?.stats ?? []
  );

  protected reportStats = computed<JsonStatsResponse[]>(
    () => this.reportData()?.stats ?? []
  );

  protected textInputConfig = computed<TextInputConfig>(() => ({
    suffix: {
      affixType: 'clickable-icon',
      value: 'add',
      ariaLabel: this.addArticleTranslation() ?? 'default label',
      onClick: (): void => this.addNewArticle(),
    },
  }));

  protected reportId = computed<number | undefined>(
    () => this.reportData()?.reportId
  );

  protected articleCategories = computed<ArticleCategoryGroup[]>(() =>
    this.categoriesService.getCategoriesFromArticles(this.reportArticles())
  );

  protected onArticleAdd(articleId: string): void {
    const reportId = this.reportId();
    if (!reportId) {
      return;
    }

    this.reportsService
      .deleteReportSuggestions(reportId, articleId)
      .pipe(
        switchMap(() =>
          this.reportsService.addSingleArticleToReport(reportId, articleId)
        ),
        catchError(err => {
          console.error(err);
          return EMPTY;
        }),
        tap({
          complete: () => this.reloadReportDataSubject$.next(),
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected onArticleRemove(articleId: string): void {
    const reportId = this.reportId();
    if (!reportId) {
      return;
    }

    this.reportsService
      .removeSingleArticlesFromReport(reportId, articleId)
      .pipe(
        switchMap(() =>
          this.reportsService.patchReportSuggestions(reportId, articleId)
        ),
        catchError(err => {
          console.error(err);
          return EMPTY;
        }),
        tap({
          complete: () => this.reloadReportDataSubject$.next(),
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected onArticleRemoveFromHotbar(articleId: string): void {
    const reportId = this.reportId();
    if (!reportId) {
      return;
    }

    this.reportsService
      .deleteReportSuggestions(reportId, articleId)
      .pipe(
        catchError(err => {
          console.error(err);
          return EMPTY;
        }),
        tap({
          complete: () => this.reloadReportDataSubject$.next(),
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected onStatAdd(statId: string): void {
    const reportId = this.reportId();
    if (!reportId) {
      return;
    }

    this.reportsService
      .deleteReportSuggestions(reportId, undefined, statId)
      .pipe(
        switchMap(() =>
          this.reportsService.addSingleStatToReport(reportId, statId)
        ),
        catchError(err => {
          console.error(err);
          return EMPTY;
        }),
        tap({
          next: () => this.reloadReportDataSubject$.next(),
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected onStatRemove(statId: string): void {
    const reportId = this.reportId();
    if (!reportId) {
      return;
    }

    this.reportsService
      .removeSingleStatFromReport(reportId, statId)
      .pipe(
        switchMap(() =>
          this.reportsService.patchReportSuggestions(
            reportId,
            undefined,
            statId
          )
        ),
        catchError(err => {
          console.error(err);
          return EMPTY;
        }),
        tap({
          complete: () => this.reloadReportDataSubject$.next(),
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected onStatRemoveFromHotbar(statId: string): void {
    const reportId = this.reportId();
    if (!reportId) {
      return;
    }

    this.reportsService
      .deleteReportSuggestions(reportId, undefined, statId)
      .pipe(
        catchError(err => {
          console.error(err);
          return EMPTY;
        }),
        tap({
          next: () => this.reloadReportDataSubject$.next(),
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected addNewArticle(): void {
    const reportId = this.reportId();
    if (!reportId) {
      return;
    }

    if (!this.newArticleForm.valid) {
      this.newArticleForm.markAllAsTouched();
      return;
    }

    const providedLink = this.newArticleForm.value;
    this.newArticleForm.setValue('');
    this.newArticleForm.markAsUntouched();

    if (!providedLink) {
      this.newArticleForm.markAllAsTouched();
      return;
    }

    of(providedLink)
      .pipe(
        switchMap(link => this.fetchArticlesByLinkOrUndefined(link)),
        switchMap(
          articleResult =>
            this.openEditArticleDialog(articleResult, providedLink).closed
        ),
        map(data => data as EditArticleDialogResult),
        filter((data): data is EditArticleDialogResultObject => !!data),
        switchMap(data => this.editOrAddArticleFromDialogResult(data)),
        switchMap(articleId =>
          this.reportsService.patchReportSuggestions(reportId, articleId)
        ),
        catchError(err => {
          console.error(err);
          return EMPTY;
        }),
        tap({
          next: () => this.reloadReportDataSubject$.next(),
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private fetchArticlesByLinkOrUndefined(
    link: string
  ): Observable<JsonArticleReportResponse | undefined> {
    return this.articlesService
      .getArticleByLink({
        link: link,
      })
      .pipe(
        catchError(() => {
          return of(undefined);
        })
      );
  }

  private openEditArticleDialog(
    articleResult: JsonArticleReportResponse | undefined,
    link: string
  ): DialogRef<EditArticleDialogComponent, EditArticleDialogComponent> {
    const dialogData = articleResult
      ? ({ article: articleResult } satisfies EditArticleDialogData)
      : ({
          article: {
            link: link,
          },
        } satisfies EditArticleDialogData);

    return this.dialog.open(EditArticleDialogComponent, {
      data: dialogData,
    });
  }

  private editOrAddArticleFromDialogResult(
    data: EditArticleDialogResultObject
  ): Observable<string> {
    if (data.articleId) {
      return this.articlesService
        .editArticle(
          data.articleId,
          data.title,
          data.link,
          data.description,
          data.publishDate.toISODate() ?? ''
        )
        .pipe(switchMap(() => of(data.articleId!)));
    } else {
      return this.articlesService
        .addArticle(
          data.title,
          data.link,
          data.description,
          data.publishDate.toISODate() ?? ''
        )
        .pipe(map(uidResponse => uidResponse.uid));
    }
  }

  protected addNewStat(): void {
    const reportId = this.reportId();
    if (!reportId) {
      return;
    }

    this.dialog
      .open(EditStatisticDialogComponent)
      .closed.pipe(
        map(data => data as EditStatDialogResult),
        filter((data): data is EditStatDialogResultObject => !!data),
        switchMap(data =>
          this.statisticsService.addStat(data.value, data.title, data.subtitle)
        ),
        map(response => response.uid),
        switchMap(statId =>
          this.reportsService.patchReportSuggestions(
            reportId,
            undefined,
            statId
          )
        ),
        catchError(err => {
          console.error(err);
          return EMPTY;
        }),
        tap({
          next: () => this.reloadReportDataSubject$.next(),
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected onArticleEdit(article: JsonArticleReportResponse): void {
    this.dialog
      .open(EditArticleDialogComponent, {
        data: {
          article: article,
        } satisfies EditArticleDialogData,
      })
      .closed.pipe(
        map(data => data as EditArticleDialogResult),
        filter((data): data is EditArticleDialogResultObject => !!data),
        switchMap(data =>
          this.articlesService.editArticle(
            article.articleId,
            data.title,
            data.link,
            data.description,
            data.publishDate.toISODate() ?? ''
          )
        ),
        catchError(err => {
          console.error(err);
          return EMPTY;
        }),
        tap({
          next: () => this.reloadReportDataSubject$.next(),
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected onStatEdit(stat: JsonStatsResponse): void {
    this.dialog
      .open(EditStatisticDialogComponent, {
        data: {
          stat,
        } satisfies EditStatDialogData,
      })
      .closed.pipe(
        map(data => data as EditStatDialogResult),
        filter((data): data is EditStatDialogResultObject => !!data),
        switchMap(data =>
          this.statisticsService.editStat(
            stat.statisticId,
            data.value,
            data.title,
            data.subtitle
          )
        ),
        catchError(err => {
          console.error(err);
          return EMPTY;
        }),
        tap({
          next: () => this.reloadReportDataSubject$.next(),
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
