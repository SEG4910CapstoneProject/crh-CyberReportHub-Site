import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { ReportsService } from '../../shared/services/reports.service';
import { JsonReportResponse } from '../../shared/sdk/rest-api/model/jsonReportResponse';

@Component({
  selector: 'crh-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  private reportsService = inject(ReportsService);
  protected isLoggedIn = signal<boolean>(false);

  // This property will hold the latest published report data
  latestPublishedReport: JsonReportResponse | null = null;

  ngOnInit() {
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
  }

  // Hardcoded Articles of Note
  articlesOfNote = [
    { title: 'Cyber Threats in 2024', link: 'https://example.com/article1' },
    { title: 'Understanding Ransomware', link: 'https://example.com/article2' },
    {
      title: 'Phishing Attacks are on the Rise',
      link: 'https://example.com/article3',
    },
  ];

  // Hardcoded Current Items of Interest
  currentItemsOfInterest = [
    'HP Printers',
    'Cisco Routers',
    'Microsoft',
    'Zero-Day Vulnerabilities',
    'Cloud Security Trends',
  ];

  // Hardcoded Most Viewed Articles
  mostViewedArticles = [
    { title: 'The Evolution of Malware', link: 'https://example.com/article4' },
    {
      title: 'How to Secure Your Network',
      link: 'https://example.com/article5',
    },
    { title: 'AI in Cybersecurity', link: 'https://example.com/article6' },
  ];
}
