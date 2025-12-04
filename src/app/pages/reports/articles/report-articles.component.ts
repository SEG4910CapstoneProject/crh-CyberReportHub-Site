import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  DestroyRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, EMPTY, Subject } from 'rxjs';
import { DarkModeService } from '../../../shared/services/dark-mode.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ArticleService } from '../../../shared/services/article.service';
import { Dialog } from '@angular/cdk/dialog';
import { EditStatisticDialogComponent } from '../../../shared/dialogs/edit-statistic-dialog/edit-statistic-dialog.component';
import { StatisticsService } from '../../../shared/sdk/rest-api/api/statistics.service';
import { ReportsService } from '../../../shared/sdk/rest-api/api/reports.service';
import { map, tap, catchError, filter } from 'rxjs/operators';
import { JsonStatsResponse } from '../../../shared/sdk/rest-api/model/jsonStatsResponse';
import {
  EditStatDialogData,
  EditStatDialogResult,
  EditStatDialogResultObject,
} from '../../../shared/dialogs/edit-statistic-dialog/edit-statistic-dialog.model';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ArticleForCreateReport } from '../../../shared/Types/types';
import { CrhTranslationService } from '../../../shared/services/crh-translation.service';
import { ErrorDialogComponent } from '../../../shared/dialogs/error-dialog/error-dialog.component';

@Component({
  selector: 'crh-report-articles',
  templateUrl: './report-articles.component.html',
  styleUrls: ['./report-articles.component.scss'],
  standalone: false,
})
export class ReportArticlesComponent implements OnInit, OnDestroy {
  protected form!: FormGroup;
  protected isDarkMode = false;
  protected articleSearchTerm = '';
  protected suggestedArticles: any[] = []; // Store articles
  protected allSuggestedArticles: any[] = []; // Store ALL articles (original list)
  protected selectedArticleIds: string[] = [];
  private subscriptions: Subscription[] = [];
  private articleService = inject(ArticleService);
  public isLoading = true; //spinner

  private destroyRef = inject(DestroyRef);

  protected reloadReportDataSubject$ = new Subject<void>();

  private darkModeService = inject(DarkModeService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  private dialog = inject(Dialog);
  private statisticsService = inject(StatisticsService);
  private translateService = inject(CrhTranslationService);

  private reportsService = inject(ReportsService);

  protected maxCommentLength = 1000;
  private readonly ERROR_MESSAGE:string = 'dialog.error_message_duplicate_fields';

  get currentCommentLength(): number {
    return this.form?.get('analystComment')?.value?.length || 0;
  }

  // Mock data for now - This will be replaced with an API call
  public reportId = 1;
  protected template_type = '';

  // Store the added statistics
  public addedStats: JsonStatsResponse[] = [];

  // Store the form values for the new article
  newArticle = {
    title: '',
    type: '',
    category: '',
    link: '',
  };

  protected articleTypes: string[] = [
    'article.type.phishing',
    'article.type.malware',
    'article.type.vulnerability',
    'article.type.dataleak',
    'article.type.cyberattack',
    'article.type.cloud',
    'article.type.ai5g',
    'article.type.canada',
    'article.type.world',
  ];

  protected groupedArticlesByDate: {
    date: string;
    formattedDate: string;
    articles: any[];
    expanded: boolean;
  }[] = [];

  articles:Map<string,ArticleForCreateReport> = new Map<string,ArticleForCreateReport>();



  // Flag to control visibility of the article form
  isArticleFormVisible = false;

  constructor() {
    this.form = this.fb.group({
      analystComment: ['', [Validators.maxLength(1000)]],
    });
  }

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state ?? window.history.state;

    // console.log("this state is: ",state)

    if (state?.reportId != null && state?.template_type != '') {
      this.reportId = state.reportId;
      this.template_type = state.template_type
      console.log('Received report ID from previous page:', this.reportId);
    } else {
      console.warn('No report ID received or no template type received. Redirecting...');
      this.router.navigate(['/reports/create']);
      return;
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


  // Method for handling opening the statistics dialog
  openAddStatDialog(): void {
    this.dialog
      .open(EditStatisticDialogComponent)
      .closed.pipe(
        map(data => data as EditStatDialogResultObject),
        filter(data => !!data)
      )
      .subscribe(data => {
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

  // Remove a statistic from the report
  //Add API Call
  onStatRemove(statId: string): void {
    this.addedStats = this.addedStats.filter(
      stat => stat.statisticId !== statId
    );
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
        filter((data): data is EditStatDialogResultObject => !!data)
      )
      .subscribe(data => {
        const index = this.addedStats.findIndex(
          s => s.statisticId === stat.statisticId
        );
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

  keepOriginalOrder = ():number=>0;// tells angular to not sort the map that has articles

  // Toggle visibility of the article form (We will remove the form after)
  toggleArticleForm(): void {
    this.isArticleFormVisible = !this.isArticleFormVisible;
  }

  // Generate a unique article ID
  generateArticleId(): string {
    return 'article-' + Math.random().toString(36).substr(2, 9); // Random ID
  }

  private fetchSuggestedArticles(): void {
    this.isLoading = true;
    console.log('Fetching suggested articles...');

    const days = 60; // Fetch articles from last 30 days
    this.articleService.getAllArticlesTypesIncluded(days).subscribe({
      next: response => {
        // Flatten all categories into one list
        const allArticles = Object.values(response);
        console.log("the all articles are: ",response)

        // Sort by publish date (newest first)
        const sorted = allArticles.sort(
          (a: any, b: any) =>
            new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        );

        // Group by date (YYYY-MM-DD)
        const grouped: Record<string, any[]> = {};
        sorted.forEach(article => {
          const dateKey = article.publishDate?.split('T')[0];
          if (!dateKey) return;
          if (!grouped[dateKey]) grouped[dateKey] = [];
          grouped[dateKey].push(article);
        });

        // show each day as a filter (within the last 30 days)
        const entries = Object.entries(grouped);

        this.groupedArticlesByDate = entries.map(([date, articles], index) => ({
          date,
          formattedDate: new Date(date).toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          articles,
          expanded: index === 0, // expand most recent by default
        }));

        this.isLoading = false;
        //console.log("grouped articles by dates: ",this.groupedArticlesByDate, this.isLoading)
      },
      error: err => {
        console.error('Error fetching suggested articles:', err);
        this.isLoading = false;
      },
    });
  }

  toggleDateGroup(group: any): void {
    group.expanded = !group.expanded;
  }

  filterArticles(): void {
    const term = this.articleSearchTerm.toLowerCase().trim();

    if (!term) {
      // Reset to all articles if search is cleared
      this.fetchSuggestedArticles();
      return;
    }

    // Filter each date group individually
    this.groupedArticlesByDate.forEach(group => {
      group.articles = group.articles.filter(article =>
        article.title.toLowerCase().includes(term)
      );
    });

    // Collapse empty groups
    this.groupedArticlesByDate = this.groupedArticlesByDate.filter(
      g => g.articles.length > 0
    );
  }

  // Add new article to the report
  addArticleFromSelection(article: ArticleForCreateReport): void {
    console.log("the article here is: ",article)
    if (this.articles.has(article.articleId))
    {
      // make the pop us saying you cant add
      this.translateService.getTranslationOnce(this.ERROR_MESSAGE).subscribe((data)=>{
        const error_message = data;
        setTimeout(()=> { // this prevents an aria hidden warning, it's for accessibility purposes
          this.dialog.open(ErrorDialogComponent, {
            data:{
            message:error_message
            }
          })
        })})
    }
    else
    {
      // add
      this.articles.set(article.articleId,article)
    }
  }

  removeArticle(id: string): void {
    this.articles.delete(id);
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
    console.log(`Adding articles to the report id ${this.reportId}`)
    this.selectedArticleIds = Array.from(this.articles.keys());
    // console.log('Selected Articles:', this.selectedArticleIds);

    this.articleService.addArticlesToReport(this.reportId,this.selectedArticleIds)
    .subscribe({
      next:(res) => {
        console.log("Articles were added successfully",res)
        this.router.navigate(['/reports/emailReport'],{
          state: { 
            role: this.authService.getRole()?.toLowerCase(), 
            reportId: this.reportId,
            template: this.template_type
          }
        });
      },
      error:(err) =>console.error(`Error occured while adding articles to the report ${this.reportId}:`,err)
    })
  }

  back(): void {
    this.router.navigate(['/reports/create']);
  }

  canAccessReports(): boolean {
    const user = this.authService.getCurrentUser();
    if (!user) return false; // guest

    return ['admin', 'analyst', 'restricted_analyst'].includes(user.role);
  }

}
