import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Article } from '../../shared/services/article.service';

@Component({
  selector: 'crh-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
})
export class ArticlesComponent implements OnInit {
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

  articlesByCategory: { [key: string]: Article[] } = {};

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      console.log('Resolved articles:', data['articlesData']);

      this.categories.forEach(cat => {
        this.articlesByCategory[cat] = data['articlesData'][cat] || [];
      });
    });
  }
}
