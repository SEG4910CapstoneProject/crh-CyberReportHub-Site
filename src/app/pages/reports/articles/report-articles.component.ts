import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DarkModeService } from '../../../shared/services/dark-mode.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ArticleService, Article } from '../../../shared/services/article.service';
import { CrhTranslationService } from '../../../shared/services/crh-translation.service';
import { Dialog } from '@angular/cdk/dialog';
import { EditStatisticDialogComponent } from '../../../shared/dialogs/edit-statistic-dialog/edit-statistic-dialog.component';
import { StatisticsService } from '../../../shared/sdk/rest-api/api/statistics.service';
import { ReportsService } from '../../../shared/sdk/rest-api/api/reports.service';
import { map, filter, switchMap } from 'rxjs/operators';
import { EditStatDialogResult, EditStatDialogResultObject } from '../../../shared/dialogs/edit-statistic-dialog/edit-statistic-dialog.model';

@Component({
  selector: 'crh-report-articles',
  templateUrl: './report-articles.component.html',
  styleUrl: './report-articles.component.scss',
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

  private darkModeService = inject(DarkModeService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  private dialog = inject(Dialog);
  private statisticsService = inject(StatisticsService);
  private reportsService = inject(ReportsService);

  //Mock data for now - This will be replaced with an API call
  protected reportId = 1;

  // Method for handling opening the statistics dialog
  openAddStatDialog(): void {
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
            this.reportId,
            undefined,
            statId
          )
        )
      )
      .subscribe(() => {
        console.log("Stat added successfully");
      });
  }

  constructor() {
    this.form = this.fb.group({
      articles: this.fb.array([] as FormGroup[]),
    });
  }

  ngOnInit(): void {
    this.fetchSuggestedArticles(); // Fetch suggested articles
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

    const days = 30; // Fetch articles from the last 30 days (modify if needed)
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
