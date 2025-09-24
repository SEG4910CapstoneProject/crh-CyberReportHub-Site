import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { ReportsService } from '../../shared/services/reports.service';
import { JsonReportResponse } from '../../shared/sdk/rest-api/model/jsonReportResponse';
import {
  ArticleService,
  Article,
  MostViewedArticle,
  ArticleOfNote,
} from '../../shared/services/article.service';

@Component({
  selector: 'crh-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false,
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  private reportsService = inject(ReportsService);
  protected isLoggedIn = signal<boolean>(false);
  private articleService = inject(ArticleService);

  latestPublishedReport: JsonReportResponse | null = null;

  mostViewedArticles: MostViewedArticle[] = [];

  articlesOfNote: ArticleOfNote[] = [];

  // Hardcoded Current Items of Interest
  currentItemsOfInterest = [
    'HP Printers',
    'Cisco Routers',
    'Microsoft',
    'Zero-Day Vulnerabilities',
    'Cloud Security Trends',
  ];

  ngOnInit(): void {
    // Fetch login status
    this.authService.isLoggedIn$.subscribe(status => {
      console.log('Is Logged In:', status); // Debugging login status
      this.isLoggedIn.set(status);
    });

    // Fetch the latest published report
    this.reportsService.getLatestReport().subscribe({
      next: (data: JsonReportResponse) => {
        console.log('Latest Published Report Data:', data); // Log the fetched data
        this.latestPublishedReport = data;
      },
      error: error => {
        console.error('Error fetching latest report:', error); // Debugging error
      },
    });

    // Fetch most viewed articles
    this.fetchMostViewedArticles();

    // Fetch Articles of Note
    this.fetchArticlesOfNote();
  }

  // Method to fetch most viewed articles
  fetchMostViewedArticles(): void {
    this.articleService.getTopMostViewedArticles().subscribe({
      next: (articles: MostViewedArticle[]) => {
        this.mostViewedArticles = articles
          ?.filter(article => article.viewCount > 0) //Only articles with view count >= 1 show up
          .slice(0, 5);
      },
      error: (error: any) => {
        console.error('Error fetching most viewed articles:', error);
      },
    });
  }

  // Fetch Articles of Note
  fetchArticlesOfNote(): void {
    this.articleService.getArticlesOfNote().subscribe({
      next: (articles: ArticleOfNote[]) => {
        console.log('Articles of Note:', articles);
        this.articlesOfNote = articles;
      },
      error: (error: any) => {
        console.error('Error fetching Articles of Note:', error);
      },
    });
  }

  // Increment view count by articleId
  incrementViewCount(articleId: string): void {
    this.articleService.incrementViewCount(articleId).subscribe({
      next: (response) => {
        console.log('View count incremented', response);
      },
      error: (error) => {
        console.error('Error incrementing view count', error);
      }
    });
  }

}
