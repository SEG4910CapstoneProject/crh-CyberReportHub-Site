import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { ReportsService } from '../../shared/services/reports.service';
import { JsonReportResponse } from '../../shared/sdk/rest-api/model/jsonReportResponse';
import { ArticleService, Article, MostViewedArticle, ArticleOfNote } from '../../shared/services/article.service';


@Component({
  selector: 'crh-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
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

  ngOnInit() {
    // Fetch login status
    this.authService.isLoggedIn$.subscribe(status => {
      console.log('Is Logged In:', status); // Debugging login status
      this.isLoggedIn.set(status);
    });

    // Fetch the latest published report
    this.reportsService.getLatestReport().subscribe(
      (data: JsonReportResponse) => {
        console.log('Latest Published Report Data:', data); // Log the fetched data
        this.latestPublishedReport = data;
      },
      error => {
        console.error('Error fetching latest report:', error); // Debugging error
      }
    );

    // Fetch most viewed articles
    this.fetchMostViewedArticles();

    // Fetch Articles of Note
    this.fetchArticlesOfNote();
  }

  // Method to fetch most viewed articles
  fetchMostViewedArticles() {
    this.articleService.getTopMostViewedArticles().subscribe(
      (articles: MostViewedArticle[]) => {
        console.log('Most Viewed Articles:', articles);
        this.mostViewedArticles = articles.slice(0, 5);  // Limiting to top 5 articles
      },
      (error: any) => {
        console.error('Error fetching most viewed articles:', error);
      }
    );
  }

  // Fetch Articles of Note
  fetchArticlesOfNote() {
    this.articleService.getArticlesOfNote().subscribe(
      (articles: ArticleOfNote[]) => {
        console.log('Articles of Note:', articles);
        this.articlesOfNote = articles;
      },
      (error: any) => {
        console.error('Error fetching Articles of Note:', error);
      }
    );
  }
}
