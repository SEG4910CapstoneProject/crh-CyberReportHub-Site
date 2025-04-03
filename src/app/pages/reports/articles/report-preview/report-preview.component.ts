import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'crh-report-preview',
  templateUrl: './report-preview.component.html',
  styleUrls: ['./report-preview.component.scss'],
})
export class ReportPreviewComponent {
  articles: any[] = history.state?.articles || [];
  stats: any[] = history.state?.stats || [];
  analystComment: string = history.state?.analystComment || '';

  // Group articles by category
  get articlesByCategory(): { [key: string]: any[] } {
    const categories = this.articles.reduce((acc, article) => {
      if (!acc[article.category]) {
        acc[article.category] = [];
      }
      acc[article.category].push(article);
      return acc;
    }, {} as { [key: string]: any[] });

    // Sort categories by category name
    const sortedCategories = Object.keys(categories).sort();

    // Return the sorted object
    return sortedCategories.reduce((acc, category) => {
      acc[category] = categories[category];
      return acc;
    }, {} as { [key: string]: any[] });
  }

  // Get all categories from articles
  get articleCategories(): string[] {
    return Object.keys(this.articlesByCategory);
  }

  // Check if there are articles
  hasArticles(): boolean {
    return this.articleCategories.length > 0;
  }

  constructor(private location: Location) {}

  goBack(): void {
    history.state.articles = this.articles;
    history.state.stats = this.stats;
    this.location.back();
  }
}

