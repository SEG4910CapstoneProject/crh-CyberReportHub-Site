import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DarkModeService } from '../../../shared/services/dark-mode.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ArticleService, Article } from '../../../shared/services/article.service';

@Component({
  selector: 'crh-report-articles',
  templateUrl: './report-articles.component.html',
  styleUrl: './report-articles.component.scss',
})
export class ReportArticlesComponent implements OnInit, OnDestroy {
  protected form!: FormGroup;
  protected isDarkMode: boolean = false;
  protected articleSearchTerm: string = '';
  protected suggestedArticles: any[] = []; // Store suggested articles
  protected selectedArticleIds: any[] = [];
  private subscriptions: Subscription[] = [];
  private articleService = inject(ArticleService);

  private darkModeService = inject(DarkModeService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

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
    console.log('Fetching suggested articles...');

    const days = 30; // Fetch articles from the last 30 days (modify if needed)
    this.articleService.getAllArticleTypesWithArticles(days).subscribe(
      (response) => {
        console.log('Suggested articles response:', response);
        this.suggestedArticles = Object.values(response).flat(); // Flatten response into a single array
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
