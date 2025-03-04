import { Component } from '@angular/core';

@Component({
  selector: 'crh-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
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

  // Hardcoded Previous Published Reports
  previousPublishedReports = [
    {
      reportNumber: 100234,
      type: 'Phishing',
      template: 'Daily',
      generatedDate: 'Feb 20th',
    },
    {
      reportNumber: 100235,
      type: 'Malware',
      template: 'Weekly',
      generatedDate: 'Feb 19th',
    },
  ];
}
