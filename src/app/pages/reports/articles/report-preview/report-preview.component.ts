import { Router } from '@angular/router';
import { Component } from '@angular/core';

// Types
interface Article {
  category: string;
  id: string;
  link: string;
  title: string;
  type: string;
}

@Component({
  selector: 'crh-report-preview',
  templateUrl: './report-preview.component.html',
  styleUrls: ['./report-preview.component.scss'],
  standalone: false,
})
export class ReportPreviewComponent {
  articles: Article[] = history.state?.articles || [];
  stats: any[] = history.state?.stats || [];
  analystComment: string = history.state?.analystComment || '';

  // Group articles by category
  get articlesByCategory(): Record<string, Article[]> {
    const categories = this.articles.reduce(
      (acc, article) => {
        if (!acc[article.category]) {
          acc[article.category] = [];
        }
        acc[article.category].push(article);
        return acc;
      },
      {} as Record<string, Article[]>
    );

    console.log('the articles are: ', this.articles);
    console.log('the categories are: ', categories);

    // Sort categories by category name
    const sortedCategories = Object.keys(categories).sort();

    // Return the sorted object
    return sortedCategories.reduce(
      (acc, category) => {
        acc[category] = categories[category];
        console.log('the acc is: ', acc);

        return acc;
      },
      {} as Record<string, Article[]>
    );
  }

  // Get all categories from articles
  get articleCategories(): string[] {
    return Object.keys(this.articlesByCategory);
  }

  // Check if there are articles
  hasArticles(): boolean {
    return this.articleCategories.length > 0;
  }

  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/reports-articles'], {
      state: {
        articles: this.articles,
        stats: this.stats,
        analystComment: this.analystComment,
        reportId: history.state?.reportId,
      },
    });
  }
}
