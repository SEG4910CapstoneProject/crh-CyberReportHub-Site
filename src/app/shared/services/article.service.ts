import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Article {
  link: string;
  type: string;
}

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private articles: Article[] = [];
  private articlesSubject = new BehaviorSubject<Article[]>([]);

  // Observable for components to subscribe to article changes
  articles$ = this.articlesSubject.asObservable();

  addArticle(article: Article): void {
    this.articles.push(article);
    this.articlesSubject.next(this.articles);
  }
}
