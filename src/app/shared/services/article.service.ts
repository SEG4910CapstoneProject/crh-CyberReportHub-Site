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
}

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private apiUrl = 'http://localhost:8080/api/v1/articles';

  constructor(private http: HttpClient) {}

  //Calls API
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
  ): Observable<{ [key: string]: Article[] }> {
    return this.http.get<{ [key: string]: Article[] }>(
      `${this.apiUrl}/article-types-with-articles?days=${days}`
    );
  }
}
