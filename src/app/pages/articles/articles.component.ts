import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Article } from '../../shared/services/article.service';

@Component({
  selector: 'crh-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
})
export class ArticlesComponent implements OnInit {
  categories: string[] = [];
  articlesByCategory: { [key: string]: Article[] } = {};

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      console.log('Resolved data:', data);
      if (data['articlesData']) {
        this.articlesByCategory = data['articlesData'];
        this.categories = Object.keys(data['articlesData']);
      }
    });
  }
}
