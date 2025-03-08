import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Article {
  articleId: string;
  title: string;
  description: string;
  category: string;
  link: string;
  publishDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private articles: Article[] = [];
  private articlesSubject = new BehaviorSubject<Article[]>([]);

  // Observable for components to subscribe to article changes
  articles$ = this.articlesSubject.asObservable();

  constructor() {}

  /**
   * Adds an article to the local state.
   * @param article Partial article data to be added.
   */
  addArticle(article: Partial<Article>): void {
    const newArticle: Article = {
      articleId: article.articleId || this.generateUUID(),
      title: article.title || 'Untitled Article',
      description: article.description || 'No description available.',
      category: article.category || 'Uncategorized',
      link: article.link || '#',
      publishDate:
        article.publishDate || new Date().toISOString().split('T')[0], // Defaults to today's date
    };

    this.articles.push(newArticle);
    this.articlesSubject.next(this.articles);
  }

  /**
   * Clears all stored articles.
   */
  clearArticles(): void {
    this.articles = [];
    this.articlesSubject.next(this.articles);
  }

  /**
   * Fetches all stored articles as an Observable.
   */
  getArticles(): Observable<Article[]> {
    return this.articles$;
  }

  /**
   * Generates a unique ID for articles.
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
}
