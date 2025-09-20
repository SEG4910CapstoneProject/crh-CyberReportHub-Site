import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Article {
  articleId: string;
  title: string;
  description: string;
  category: string;
  link: string;
  publishDate: string;
  type: string;
  viewCount: number;
  isArticleOfNote: boolean;
  url?: string;
}

export interface MostViewedArticle {
  url: string;
  viewCount: number;
  title: string;
}

export interface ArticleOfNote {
  url: string;
  title: string;
}

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  getArticles(): void {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://localhost:8080/api/v1/articles';

  constructor(private http: HttpClient) {}

  // Calls API to add an article
  addArticle(article: Article): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, article);
  }

  // Fetch articles by type
  getArticlesByType(type: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/type/${type}`);
  }

  // Fetch all article types with articles (for the articles page)
  getAllArticleTypesWithArticles(
    days: number
  ): Observable<Record<string, Article[]>> {
    return this.http.get<Record<string, Article[]>>(
      `${this.apiUrl}/article-types-with-articles?days=${days}`
    );
  }

  // Fetch most viewed articles
  getTopMostViewedArticles(): Observable<MostViewedArticle[]> {
    return this.http.get<MostViewedArticle[]>(`${this.apiUrl}/top-10`);
  }

  //Update view count each time a link is clicked
  incrementViewCount(articleId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/increment-view/${articleId}`, {});
  }

  // Choose the "article of note" status
  chooseArticleOfNote(articleId: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/toggle-article-of-note/${articleId}`,
      {}
    );
  }

  // Fetch articles that are marked as "Articles of Note"
  getArticlesOfNote(): Observable<ArticleOfNote[]> {
    return this.http.get<ArticleOfNote[]>(`${this.apiUrl}/articles-of-note`);
  }

  getArticleByLink(link: string): Observable<any> {
    return this.http.get<any>(`/api/articles?link=${link}`);
  }
}
