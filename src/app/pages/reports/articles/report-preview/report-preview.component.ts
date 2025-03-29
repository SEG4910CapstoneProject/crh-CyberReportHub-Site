import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'crh-report-preview',
  templateUrl: './report-preview.component.html',
  styleUrls: ['./report-preview.component.scss'],
})
export class ReportPreviewComponent {
  articles: any[] = history.state?.articles || [];
  stats: any[] = history.state?.stats || [];

  // Group articles by category
  get articlesByCategory(): { [key: string]: any[] } {
    return this.articles.reduce((acc, article) => {
      if (!acc[article.category]) {
        acc[article.category] = [];
      }
      acc[article.category].push(article);
      return acc;
    }, {} as { [key: string]: any[] });
  }

  constructor(private location: Location) {}

  goBack(): void {
    history.state.articles = this.articles;
    history.state.stats = this.stats;
    this.location.back(); // Go back to the previous page
  }
}

