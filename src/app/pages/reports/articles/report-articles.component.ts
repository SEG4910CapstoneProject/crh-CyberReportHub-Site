import { Component, OnInit, OnDestroy, inject, DestroyRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, EMPTY, Observable, Subject, of } from 'rxjs';
import { DarkModeService } from '../../../shared/services/dark-mode.service';
import { AuthService } from '../../../shared/services/auth.service';
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import { ArticleService, Article } from '../../../shared/services/article.service';
import { CrhTranslationService } from '../../../shared/services/crh-translation.service';
=======
import { ArticleService } from '../../../shared/services/article.service';
>>>>>>> Stashed changes
=======
import { ArticleService } from '../../../shared/services/article.service';
>>>>>>> Stashed changes
import { Dialog } from '@angular/cdk/dialog';
import { EditStatisticDialogComponent } from '../../../shared/dialogs/edit-statistic-dialog/edit-statistic-dialog.component';
import { StatisticsService } from '../../../shared/sdk/rest-api/api/statistics.service';
import { ReportsService } from '../../../shared/sdk/rest-api/api/reports.service';
import { map, switchMap, tap, catchError, filter } from 'rxjs/operators';
import { EditStatDialogResultObject } from '../../../shared/dialogs/edit-statistic-dialog/edit-statistic-dialog.model';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'crh-report-articles',
  templateUrl: './report-articles.component.html',
  styleUrls: ['./report-articles.component.scss'],
})
export class ReportArticlesComponent implements OnInit, OnDestroy {
  protected form!: FormGroup;
  protected isDarkMode: boolean = false;
  protected articleSearchTerm: string = '';
  protected suggestedArticles: any[] = []; // Store articles
  protected allSuggestedArticles: any[] = []; // Store ALL articles (original list)
  protected selectedArticleIds: any[] = [];
  private subscriptions: Subscription[] = [];
  private articleService = inject(ArticleService);
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  protected isLoading = true; //spinner
=======
=======
>>>>>>> Stashed changes
  private destroyRef = inject(DestroyRef);
  protected newArticleForm = new FormControl<string | null>(null, [
    Validators.required,
    Validators.pattern('https?://.+'),
  ]);

  protected reloadReportDataSubject$ = new Subject<void>();
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

  private darkModeService = inject(DarkModeService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  private dialog = inject(Dialog);
  private statisticsService = inject(StatisticsService);
  private reportsService = inject(ReportsService);

<<<<<<< Updated upstream
<<<<<<< Updated upstream
  protected maxCommentLength = 1000;
  get currentCommentLength(): number {
    return this.form?.get('analystComment')?.value?.length || 0;
  }


  //Mock data for now - This will be replaced with an API call
=======
  // Mock data for now - This will be replaced with an API call
>>>>>>> Stashed changes
=======
  // Mock data for now - This will be replaced with an API call
>>>>>>> Stashed changes
  protected reportId = 1;

  // Manage added statistics here
  protected addedStats: { title: string, statId: string }[] = [];

  // Method for handling opening the statistics dialog
  openAddStatDialog(): void {
    this.dialog
      .open(EditStatisticDialogComponent)
      .closed.pipe(
        map((data) => data as EditStatDialogResultObject),
        filter((data) => !!data),
        switchMap((data) =>
          this.statisticsService.addStat(data.value, data.title, data.subtitle)
        ),
        map((response) => response.uid),
        switchMap((statId) =>
          this.reportsService.patchReportSuggestions(this.reportId, undefined, statId.toString())
        )
      )
      .subscribe((statId) => {
        // Add the new stat to the addedStats array
        this.addedStats.push({
          title: statId.toString(),
          statId: statId.toString(),
        });
        console.log('Stat added successfully');
      });
  }

  fetchArticlesByLinkOrUndefined(link: string): Observable<any> {
    return this.articleService.getArticleByLink(link).pipe(
      catchError((err) => {
        console.error(err);
        return EMPTY;
      })
    );
  }

  // Method to remove the statistic from addedStats
  removeStat(stat: { title: string, statId: string }): void {
    this.addedStats = this.addedStats.filter(s => s.statId !== stat.statId);
    console.log('Stat removed successfully');
  }

  // Method to view the report preview
  viewReport(): void {
    this.router.navigate(['/report-preview'], {
      state: {
        articles: this.articles.value,
        stats: this.addedStats,
      },
    });
  }

  // Method to add a new article
  protected addNewArticle(): void {
    const reportId = this.reportId;
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
        switchMap(articleResult => {
          this.addArticleFromSelection(articleResult);
          const articleId = articleResult?.articleId; // Ensure we get the articleId
          if (!articleId) {
            console.error('No articleId found for this article');
            return EMPTY; // Prevent proceeding if no articleId exists
          }
          return of(articleId); // Return the valid articleId
        }),
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



  constructor() {
    this.form = this.fb.group({
      analystComment: ['', [Validators.maxLength(1000)]],
      articles: this.fb.array([] as FormGroup[]),
    });
  }

  ngOnInit(): void {
    this.fetchSuggestedArticles();
    this.subscriptions.push(
      this.darkModeService.isDarkMode$.subscribe(mode => {
        this.isDarkMode = mode;
        this.applyDarkModeClass();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }


  private fetchSuggestedArticles(): void {
    this.isLoading = true;
    console.log('Fetching suggested articles...');

    const days = 30; // Fetch articles from the last 30 days
    this.articleService.getAllArticleTypesWithArticles(days).subscribe(
      (response) => {
        console.log('Suggested articles response:', response);
        this.suggestedArticles = Object.values(response).flat();
        this.isLoading = false;
      },
      (error) => console.error('Error fetching suggested articles:', error)
    );
  }

  filterArticles(): void {
    const term = this.articleSearchTerm.toLowerCase().trim();
    this.suggestedArticles = this.suggestedArticles.filter(article =>
      article.title.toLowerCase().includes(term)
    );
  }

  get articles(): FormArray<FormGroup> {
    return this.form.get('articles') as FormArray<FormGroup>;
  }

  addArticleFromSelection(article: any): void {
    const articleForm = this.fb.group({
      id: [article.articleId, Validators.required],
      title: [article.title, Validators.required],
      type: [article.type || '', Validators.required],
      category: [article.category || ''],
      link: [article.link || ''],
    });
    this.articles.push(articleForm);
  }

  removeArticle(index: number): void {
    this.articles.removeAt(index);
  }

  private applyDarkModeClass(): void {
    const reportNewElement = document.querySelector('.report-new');
    if (this.isDarkMode) {
      reportNewElement?.classList.add('dark');
    } else {
      reportNewElement?.classList.remove('dark');
    }
  }

  submit(): void {
    if (this.form.invalid) {
      alert('Please complete the required fields.');
      return;
    }

    this.selectedArticleIds = this.articles.value.map(article => article.id);
    console.log('Selected Articles:', this.selectedArticleIds);
  }

  back(): void {
    this.router.navigate(['/reports/create']);
  }
}
