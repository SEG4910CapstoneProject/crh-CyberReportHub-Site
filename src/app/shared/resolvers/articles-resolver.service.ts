import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { ArticleService, Article } from '../services/article.service';

@Injectable({
  providedIn: 'root',
})
export class ArticlesResolverService
  implements Resolve<Record<string, Article[]>>
{
  constructor(
    private articleService: ArticleService,
    private router: Router
  ) {}

  resolve(): Observable<Record<string, Article[]>> {
    const days = 30; // Fetch articles from the last 30 days

    return this.articleService.getAllArticleTypesWithArticles(days).pipe(
      tap(response => console.log('Resolved articles:', response)),
      map(response => response || {}), // Ensure it returns an object
      catchError(error => {
        console.error('Error fetching articles:', error);
        this.router.navigate(['/']); // Redirect to home page if an error occurs
        return EMPTY; // Prevents the route from breaking
      })
    );
  }
}
