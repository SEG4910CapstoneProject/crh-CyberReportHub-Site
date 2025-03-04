import { Component, OnInit } from '@angular/core';
import { ArticleService, Article } from '../../shared/services/article.service';

@Component({
  selector: 'crh-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
})
export class ArticlesComponent implements OnInit {
  // Define categories (article types)
  categories: string[] = [
    'Phishing',
    'Malware',
    'Vulnerability',
    'Data Leak',
    'Cyber Attack',
    'Cloud, AI & 5G',
    'Canada',
    'World',
  ];

  // Object to hold articles grouped by category
  articlesByCategory: { [key: string]: Article[] } = {};

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.articleService.articles$.subscribe((articles: Article[]) => {
      this.articlesByCategory = {};
      this.categories.forEach((cat: string) => {
        this.articlesByCategory[cat] = articles.filter(
          (article: Article) => article.type === cat
        );
      });
    });
  }
}
