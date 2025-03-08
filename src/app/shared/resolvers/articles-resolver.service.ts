import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { catchError, EMPTY, map, Observable, of, switchMap, tap } from 'rxjs';
import { ArticlesService } from '../sdk/rest-api/api/articles.service';
import { JsonArticleReportResponse } from '../sdk/rest-api/model/jsonArticleReportResponse';

@Injectable({
  providedIn: 'root',
})
export class ArticlesResolverService
  implements Resolve<{ [key: string]: JsonArticleReportResponse[] }>
{
  private articlesService = inject(ArticlesService);
  private router = inject(Router);

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<{ [key: string]: JsonArticleReportResponse[] }> {
    const days = 30; // Default time range

    return this.articlesService.getArticle(days.toString()).pipe(
      tap(response => console.log('Articles API Response:', response)), // Debugging Log
      map(response => {
        if (!response || !Array.isArray(response)) {
          throw new Error(
            'Invalid API response format: Expected an array of articles.'
          );
        }

        // Organize articles into categories
        const categorizedArticles: {
          [key: string]: JsonArticleReportResponse[];
        } = {};

        response.forEach(article => {
          const category = article.category || 'Uncategorized';
          if (!categorizedArticles[category]) {
            categorizedArticles[category] = [];
          }
          categorizedArticles[category].push(article);
        });

        return categorizedArticles;
      }),
      catchError(err => {
        console.error('Error fetching articles:', err);
        this.router.navigate(['/']);
        return EMPTY;
      })
    );
  }
}
