import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ReportsService } from '../../../shared/sdk/rest-api/api/reports.service';
import { ArticlesService } from '../../../shared/sdk/rest-api/api/articles.service';
import { DarkModeService } from '../../../shared/services/dark-mode.service';

@Component({
  selector: 'crh-report-articles',
  templateUrl: './report-articles.component.html',
  styleUrl: './report-articles.component.scss',
})
export class ReportArticlesComponent implements OnInit, OnDestroy {
  protected form!: FormGroup;
  protected isDarkMode: boolean = false;
  protected articleSearchTerm: string = '';
  protected articlesFromOpenCTI: any[] = [];
  protected filteredArticles: any[] = [];
  protected selectedArticleIds: any[] = [];
  private subscriptions: Subscription[] = [];

  private reportsService = inject(ReportsService);
  private articlesService = inject(ArticlesService);
  private darkModeService = inject(DarkModeService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  constructor() {
    this.form = this.fb.group({
      articles: this.fb.array([] as FormGroup[]),
    });
  }

  ngOnInit(): void {
    this.loadBrandingSettings();
    this.fetchArticlesFromOpenCTI();
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

  private loadBrandingSettings(): void {
    const savedSettings = localStorage.getItem('brandingSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      this.form.patchValue({
        primaryColor: settings.primaryColor || '#002D72',
        accentColor: settings.accentColor || '#FF5733',
        logo: settings.logo || null,
      });
    }
  }

  private fetchArticlesFromOpenCTI(): void {
    this.articlesService.getArticle('some-id').subscribe(
      articles => {
        this.articlesFromOpenCTI = [articles];
        this.filteredArticles = [...this.articlesFromOpenCTI];
      },
      error => console.error('Error fetching articles:', error)
    );
  }

  filterArticles(): void {
    const term = this.articleSearchTerm.toLowerCase().trim();
    this.filteredArticles = this.articlesFromOpenCTI.filter(article =>
      article.title.toLowerCase().includes(term)
    );
  }

  get articles(): FormArray<FormGroup> {
    return this.form.get('articles') as FormArray<FormGroup>;
  }

  addArticleFromSelection(article: any): void {
    const articleForm = this.fb.group({
      id: [article.id, Validators.required],
      title: [article.title, Validators.required],
      type: [article.type, Validators.required],
      category: [''],
      link: [article.link],
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

    // Get selected articles
    this.selectedArticleIds = this.articles.value.map(article => article.id);

    console.log('Selected Articles:', this.selectedArticleIds);}



  back(): void {
    this.router.navigate(['/reports/create']);
  }
}
