import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from './article.service';

export interface Tag {
  tagId: number;
  tagName: string;
  articleIds?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private apiUrl = 'http://localhost:8080/api/v1/tags';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    let headers = new HttpHeaders();
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }

  /** Get all tags for the logged-in user */
  getUserTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.apiUrl}`, {
      headers: this.getAuthHeaders(),
    });
  }

  /** Create a new tag */
  createTag(tagName: string): Observable<Tag> {
    return this.http.post<Tag>(
      `${this.apiUrl}`,
      { tagName },
      { headers: this.getAuthHeaders() }
    );
  }

  /** Delete a tag by ID */
  deleteTag(tagId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${tagId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  /** Get all articles under a specific tag */
  getArticlesByTag(tagId: number): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/${tagId}/articles`, {
      headers: this.getAuthHeaders(),
    });
  }

  /** Add an article to a tag */
  addArticleToTag(tagId: number, articleId: string): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${tagId}/articles/${articleId}`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  /** Remove an article from a tag */
  removeArticleFromTag(tagId: number, articleId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${tagId}/articles/${articleId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  renameTag(tagId: number, newName: string): Observable<Tag> {
    return this.http.put<Tag>(
      `${this.apiUrl}/${tagId}`,
      { tagName: newName },
      { headers: this.getAuthHeaders() }
    );
  }

}
