import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { ArticleForCreateReport } from '../Types/types';

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
  articleId: string;
  viewCount: number;
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

  // Fetch all articles with types included (it is a list of all articles, with each article having its won characteristics)
  getAllArticlesTypesIncluded(
    days: number
  ): Observable<ArticleForCreateReport[]> {
    return this.http.get<ArticleForCreateReport[]>(
      `${this.apiUrl}/get-all-articles-with-types?days=${days}`
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
  getArticlesOfNote(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/articles-of-note`);
  }

  getArticleByLink(link: string): Observable<any> {
    return this.http.get<any>(`/api/articles?link=${link}`);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getMyFavourites(): Observable<Article[]> {
    return this.http.get<Article[]>(
      `http://localhost:8080/api/v1/favourites`,
      { headers: this.getAuthHeaders() }
    );
  }

  addFavourite(articleId: string): Observable<any> {
    return this.http.post(
      `http://localhost:8080/api/v1/favourites/${articleId}`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  removeFavourite(articleId: string): Observable<any> {
    return this.http.delete(
      `http://localhost:8080/api/v1/favourites/${articleId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  ingestArticle(article: any): Observable<any> {
    return this.http.post<any>(
      'http://localhost:8080/api/v1/articles/ingest',
      article,
      { headers: this.getAuthHeaders() }
    );
  }

  //For manually added articles
  getMySubmittedArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(
      `http://localhost:8080/api/v1/articles/my-submissions`,
      { headers: this.getAuthHeaders() }
    );
  }

  //For manually added articles
  deleteArticle(articleId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${articleId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  //For manually added articles
  updateArticle(articleId: string, article: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${articleId}`,
      article,
      { headers: this.getAuthHeaders() }
    );
  }




}
