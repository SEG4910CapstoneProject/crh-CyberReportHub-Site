import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'crh-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  protected isLoggedIn = signal<boolean>(false);

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn.set(status);
    });
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

  // Hardcoded Latest Published Report (Only One Entry)
  latestPublishedReport = {
    reportNumber: 100234,
    reportType: 'Daily',
    generatedDate: 'Feb 20th',
    lastModified: 'Feb 22nd',
    emailStatus: true,
  };
}
