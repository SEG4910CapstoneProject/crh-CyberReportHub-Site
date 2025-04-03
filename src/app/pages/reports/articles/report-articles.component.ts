import { Component, OnInit, OnDestroy, inject, DestroyRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, EMPTY, Observable, Subject, of } from 'rxjs';
import { DarkModeService } from '../../../shared/services/dark-mode.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ArticleService, Article } from '../../../shared/services/article.service';
import { Dialog } from '@angular/cdk/dialog';
import { EditStatisticDialogComponent } from '../../../shared/dialogs/edit-statistic-dialog/edit-statistic-dialog.component';
import { StatisticsService } from '../../../shared/sdk/rest-api/api/statistics.service';
import { ReportsService } from '../../../shared/services/reports.service';
import { map, switchMap, tap, catchError, filter } from 'rxjs/operators';
import { JsonStatsResponse } from '../../../shared/sdk/rest-api/model/jsonStatsResponse';
import {
  EditStatDialogData,
  EditStatDialogResult,
  EditStatDialogResultObject,
} from '../../../shared/dialogs/edit-statistic-dialog/edit-statistic-dialog.model';

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
  protected isLoading = true; //spinner

  private destroyRef = inject(DestroyRef);
  protected newArticleForm = new FormControl<string | null>(null, [
    Validators.required,
    Validators.pattern('https?://.+'),
  ]);

  protected reloadReportDataSubject$ = new Subject<void>();

  private darkModeService = inject(DarkModeService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  private dialog = inject(Dialog);
  private statisticsService = inject(StatisticsService);
  private reportsService = inject(ReportsService);

  protected maxCommentLength = 1000;
  get currentCommentLength(): number {
    return this.form?.get('analystComment')?.value?.length || 0;
  }

  // Mock data for now - This will be replaced with an API call
  protected reportId = 1;

  // Store the added statistics
  protected addedStats: JsonStatsResponse[] = [];

  // Store the form values for the new article
  newArticle = {
    title: '',
    type: '',
    category: '',
    link: ''
  };

  protected articleTypes: string[] = [
    'Phishing',
    'Malware',
    'Vulnerability',
    'Data Leak',
    'Cyber Attack',
    'Cloud',
    'AI & 5G',
    'Canada',
    'World'
  ];

  // Flag to control visibility of the article form
  isArticleFormVisible = false;

  // Method for handling opening the statistics dialog
  openAddStatDialog(): void {
    this.dialog
      .open(EditStatisticDialogComponent)
      .closed.pipe(
        map((data) => data as EditStatDialogResultObject),
        filter((data) => !!data),
      )
      .subscribe((data) => {
        const newStat: JsonStatsResponse = {
          statisticNumber: data.value,
          title: data.title,
          subtitle: data.subtitle,
          statisticId: 'stat-' + Math.random().toString(36).substr(2, 9),
        };
        this.addedStats.push(newStat);
      });
  }


  // Add a statistic to the report
  onStatAdd(statId: string): void {
    const reportId = this.reportId;
    if (!reportId) {
      return;
    }

    this.reportsService
      .addSingleStatToReport(reportId, statId)
      .pipe(
        catchError((err) => {
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

  // Remove a statistic from the report
  //Add API Call
  onStatRemove(statId: string): void {
    this.addedStats = this.addedStats.filter(stat => stat.statisticId !== statId);
  }


  // Edit an existing statistic
  onStatEdit(stat: JsonStatsResponse): void {
    this.dialog
      .open(EditStatisticDialogComponent, {
        data: {
          stat,
        } satisfies EditStatDialogData,
      })
      .closed.pipe(
        map(data => data as EditStatDialogResult),
        filter((data): data is EditStatDialogResultObject => !!data),
      )
      .subscribe((data) => {
        const index = this.addedStats.findIndex(s => s.statisticId === stat.statisticId);
        if (index !== -1) {
          this.addedStats[index] = {
            ...this.addedStats[index],
            title: data.title,
            subtitle: data.subtitle,
            statisticNumber: data.value,
          };
        }
      });
  }


  // Toggle visibility of the article form (We will remove the form after)
  toggleArticleForm(): void {
    this.isArticleFormVisible = !this.isArticleFormVisible;
  }

  //Method for user to manually add a link to the report
  //Future implementation: ML language will be able to classify the category just from the link
  addNewArticle(): void {
    const link = this.newArticleForm.value?.trim();
    const { title, type, category } = this.newArticle;

    if (link && link !== '') {
      const newArticle = {
        articleId: this.generateArticleId(),
        title,
        type,
        category,
        link,
      };

      this.addArticleFromSelection(newArticle);

      // Clear form values
      this.newArticleForm.reset();
      this.newArticle = { title: '', type: '', category: '', link: '' };
      this.isArticleFormVisible = false;
    } else {
      console.log('Invalid link or empty input');
    }
  }


  // Generate a unique article ID
  generateArticleId(): string {
    return 'article-' + Math.random().toString(36).substr(2, 9);  // Random ID
  }


  // Method to view the report preview
  viewReport(): void {
    this.router.navigate(['/report-preview'], {
      state: {
        articles: this.articles.value,
        stats: this.addedStats,
        analystComment: this.form.get('analystComment')?.value,
      },
    });
  }

  constructor() {
    this.form = this.fb.group({
      analystComment: ['', [Validators.maxLength(1000)]],
      articles: this.fb.array([] as FormGroup[]),
    });
  }

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state ?? window.history.state;

    if (state?.reportId != null) {
      this.reportId = state.reportId;
      console.log('Received report ID from previous page:', this.reportId);
    } else {
      console.warn('No report ID received. Redirecting...');
      this.router.navigate(['/reports/create']);
      return;
    }

    // Restore previously selected articles (if any)
    if (state?.articles?.length) {
      state.articles.forEach((article: any) => {
        const articleForm = this.fb.group({
          id: [article.articleId, Validators.required],
          title: [article.title, Validators.required],
          type: [article.type || '', Validators.required],
          category: [article.category || ''],
          link: [article.link || ''],
        });
        this.articles.push(articleForm);
      });
    }

    // Restore stats (if any)
    if (state?.stats?.length) {
      this.addedStats = state.stats;
    }

    // Restore analyst comment (if any)
    if (state?.analystComment) {
      this.form.get('analystComment')?.setValue(state.analystComment);
    }

    // Load article suggestions
    this.fetchSuggestedArticles();

    // Setup dark mode handling
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
        this.allSuggestedArticles = Object.values(response).flat();
        this.suggestedArticles = [...this.allSuggestedArticles];
        this.isLoading = false;
      },
      (error) => console.error('Error fetching suggested articles:', error)
    );
  }

  filterArticles(): void {
    const term = this.articleSearchTerm.toLowerCase().trim();
    this.suggestedArticles = this.allSuggestedArticles.filter(article =>
      article.title.toLowerCase().includes(term)
    );
  }

  get articles(): FormArray<FormGroup> {
    return this.form.get('articles') as FormArray<FormGroup>;
  }

  // Add new article to the report
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

  generateReport(): void {
    const payload = {
      reportID: this.reportId,
      analystComments: this.form.get('analystComment')?.value || '',
      articles: this.articles.value.map(article => ({
        articleId: article.id,
        title: article.title,
        category: article.category,
        link: article.link,
        type: article.type,
      })),
      statistics: this.addedStats.map(stat => ({
        title: stat.title,
        subtitle: stat.subtitle,
      }))
    };

    this.reportsService.generatePdf(payload).subscribe({
      next: (response: any) => {
        console.log('PDF generated response:', response);

        alert('Report PDF generated successfully!');
      },
      error: (err: any) => {
        console.error('Error generating report:', err);
        alert('Failed to generate report PDF.');
      }
    });
  }



  back(): void {
    this.router.navigate(['/reports/create']);
  }
}
