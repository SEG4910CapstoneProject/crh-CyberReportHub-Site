import { Component, OnInit, inject, signal } from '@angular/core';
import { ArticleService, Article } from '../../shared/services/article.service';
import { AuthService } from '../../shared/services/auth.service';
import { DarkModeService } from '../../shared/services/dark-mode.service';

@Component({
  selector: 'crh-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss'],
  standalone: false,
})
export class FavouritesComponent implements OnInit {
  private darkModeService = inject(DarkModeService);

  favouriteArticles: Article[] = [];
  submittedArticles: Article[] = [];
  isLoading = true;

  protected isLoggedIn = signal<boolean>(false);
  protected isDarkMode = signal<boolean>(false);

  constructor(
    private articleService: ArticleService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn.set(status);
      if (status) {
        this.fetchFavourites();
        this.fetchSubmittedArticles();
      } else {
        this.isLoading = false;
      }
    });

    this.darkModeService.isDarkMode$.subscribe(mode => {
      this.isDarkMode.set(mode);
    });
  }

  fetchFavourites(): void {
    this.articleService.getMyFavourites().subscribe({
      next: (articles: Article[]) => {
        this.favouriteArticles = articles;
        this.isLoading = false;
      },
      error: error => {
        console.error('Error fetching favourites:', error);
        this.isLoading = false;
      },
    });
  }

  fetchSubmittedArticles(): void {
    this.articleService.getMySubmittedArticles().subscribe({
      next: (articles: Article[]) => {
        this.submittedArticles = articles;
      },
      error: err => console.error('Error fetching submitted articles:', err),
    });
  }

  toggleFavourite(article: Article): void {
    if (!this.isLoggedIn()) return;

    const isFav = this.favouriteArticles.some(
      f => f.articleId === article.articleId
    );

    if (isFav) {
      this.articleService.removeFavourite(article.articleId).subscribe({
        next: () => {
          this.favouriteArticles = this.favouriteArticles.filter(
            fav => fav.articleId !== article.articleId
          );
        },
        error: err => console.error('Error removing favourite:', err),
      });
    } else {
      this.articleService.addFavourite(article.articleId).subscribe({
        next: () => this.favouriteArticles.push(article),
        error: err => console.error('Error adding favourite:', err),
      });
    }
  }

  incrementViewCount(articleId: string): void {
    this.articleService.incrementViewCount(articleId).subscribe({
      next: res => console.log('View count incremented:', res),
      error: err => console.error('Error incrementing view count:', err),
    });
  }

  deleteArticle(articleId: string): void {
    if (!confirm('Are you sure you want to delete this article?')) return;
    this.articleService.deleteArticle(articleId).subscribe({
      next: () => {
        this.submittedArticles = this.submittedArticles.filter(
          a => a.articleId !== articleId
        );
        console.log('Article deleted successfully');
      },
      error: err => console.error('Error deleting article:', err),
    });
  }
}
