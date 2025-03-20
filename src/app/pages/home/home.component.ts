import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { ReportsService } from '../../shared/services/reports.service';
import { JsonReportResponse } from '../../shared/sdk/rest-api/model/jsonReportResponse';
import { ArticleService, Article } from '../../shared/services/article.service'; // Correct import

@Component({
  selector: 'crh-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  private reportsService = inject(ReportsService);
  protected isLoggedIn = signal<boolean>(false);
  private articleService = inject(ArticleService); // Correct service to use

  latestPublishedReport: JsonReportResponse | null = null;
  mostViewedArticles: Article[] = []; // Array to store most viewed articles

  // Hardcoded Articles of Note
  articlesOfNote = [
    { title: 'Cyber Threats in 2024', link: 'https://example.com/article1' },
    { title: 'Understanding Ransomware', link: 'https://example.com/article2' },
    { title: 'Phishing Attacks are on the Rise', link: 'https://example.com/article3' },
  ];

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
    this.fetchMostViewedArticles(); // Fetch top 5 most viewed articles
  }

  // Method to fetch most viewed articles
  fetchMostViewedArticles() {
    this.articleService.getTopMostViewedArticles().subscribe(
      (articles: Article[]) => {
        console.log('Most Viewed Articles:', articles);
        this.mostViewedArticles = articles.slice(0, 5); // Limiting to top 5 articles
      },
      (error: any) => { // Explicitly typing error as any
        console.error('Error fetching most viewed articles:', error);
      }
    );
  }
}
