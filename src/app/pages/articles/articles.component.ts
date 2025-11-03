import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ArticleService,
  Article,
} from '../../shared/services/article.service';
import { AuthService } from '../../shared/services/auth.service';
import { DarkModeService } from '../../shared/services/dark-mode.service';

@Component({
  selector: 'crh-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
  standalone: false,
})
export class ArticlesComponent implements OnInit {
  articlesByCategory: Record<string, Article[]> = {};
  articlesToShow: Record<string, number> = {}; // To track how many articles to display per category
  favouriteArticles: Article[] = []; // To store favourite articles
  articlesOfNote: Article[] = []; // To store articles of note
  isLoading = true;
  objectKeys = Object.keys;
  collapsedSections: Record<string, boolean> = {};

  // Use signal to track logged-in status
  protected isLoggedIn = signal<boolean>(false);
  protected isDarkMode = signal<boolean>(false);
  private darkModeService = inject(DarkModeService);

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    // Track login status
    this.authService.isLoggedIn$.subscribe(status => {
      console.log('Is Logged In:', status);
      this.isLoggedIn.set(status);
      if (status) {
        this.fetchFavourites();
      } else {
        this.favouriteArticles = [];
      }
    });

    this.darkModeService.isDarkMode$.subscribe(mode => {
      this.isDarkMode.set(mode);
    });

    // Load all articles
    this.articleService.getAllArticleTypesWithArticles(30).subscribe({
      next: response => {
        this.articlesByCategory = response;
        this.isLoading = false;

        // Initialize articlesToShow to show 3 articles initially for each category
        Object.keys(response).forEach(category => {
          this.articlesToShow[category] = 3;
        });
        console.log('the article to show are: ', this.articlesToShow);
        console.log('the articles per category are: ', this.articlesByCategory);
      },
      error: e => {
        console.error('Error fetching articles:', e);
        this.isLoading = false;
      },
      complete: () =>
        console.info(
          '30 Articles are fetched successfully',
          this.articlesByCategory
        ),
    });

    // Fetch Articles of Note
    this.fetchArticlesOfNote();
  }

  // Check if the article is in the favourites list
  isFavourite(article: Article): boolean {
    return this.favouriteArticles?.some(
      fav => fav.articleId === article.articleId
    );
  }

  // Check if the article is in the articles of note list
  isArticleOfNote(article: Article): boolean {
    return this.articlesOfNote?.some(note => note.link === article.link);
  }

  // Toggle functionality for See More / See Less
  toggleArticles(category: string): void {
    if (this.articlesToShow[category] === 3) {
      // Show all articles
      this.articlesToShow[category] = this.articlesByCategory[category].length;
    } else {
      // Show only 3 articles
      this.articlesToShow[category] = 3;
    }
  }

  // Add or remove article from favourites
  toggleFavourite(article: Article): void {
    if (!this.isLoggedIn()) return;

    const isFav = this.isFavourite(article);

    if (isFav) {
      this.articleService.removeFavourite(article.articleId).subscribe({
        next: () => {
          this.favouriteArticles = this.favouriteArticles.filter(
            fav => fav.articleId !== article.articleId
          );
          console.log('Removed from favourites:', article.title);
        },
        error: err => console.error('Error removing favourite:', err),
      });
    } else {
      this.articleService.addFavourite(article.articleId).subscribe({
        next: () => {
          this.favouriteArticles.push(article);
          console.log('Added to favourites:', article.title);
        },
        error: err => console.error('Error adding favourite:', err),
      });
    }
  }

  // Add or remove article from Articles of Note
  toggleArticleOfNote(article: Article, event: any): void {
    if (!this.isLoggedIn()) return; // Prevent non-logged-in users from changing it

    const isChecked = event.target.checked;
    this.articleService.chooseArticleOfNote(article.articleId).subscribe({
      next: response => {
        console.log('Article of Note status toggled', response);
        article.isArticleOfNote = isChecked;

        if (isChecked) {
          // Add to Articles of Note
          const articleOfNote: Article = {
            articleId: article.articleId,
            title: article.title,
            description: article.description,
            category: article.category,
            link: article.link,
            publishDate: article.publishDate,
            type: article.type,
            viewCount: article.viewCount,
            isArticleOfNote: true,
          };
          this.articlesOfNote?.push(articleOfNote);
        } else {
          // Remove from Articles of Note
          const index = this.articlesOfNote.findIndex(
            note => note.url === article.link
          );
          if (index !== -1) this.articlesOfNote.splice(index, 1);
        }
      },
      error: error => {
        console.error('Error toggling article of note:', error);
      },
    });
  }

  // Fetch favourites for the current user
  fetchFavourites(): void {
    this.articleService.getMyFavourites().subscribe({
      next: (articles: Article[]) => {
        console.log('Fetched favourites:', articles);
        this.favouriteArticles = articles;
      },
      error: error => {
        console.error('Error toggling article of note:', error);
      },
    });
  }

  // Fetch articles that are marked as "Articles of Note"
  fetchArticlesOfNote(): void {
    this.articleService.getArticlesOfNote().subscribe({
      next: (articles: Article[]) => {
        console.log('Articles of Note:', articles);
        this.articlesOfNote = articles;
      },
      error: (error: any) => {
        console.error('Error fetching Articles of Note:', error);
      },
    });
  }

  // Increment view count on article click
  incrementViewCount(articleId: string): void {
    this.articleService.incrementViewCount(articleId).subscribe({
      next: response => {
        console.log('View count incremented', response);
      },
      error: error => {
        console.error('Error incrementing view count', error);
      },
    });
  }

  toggleCategory(category: string): void {
    this.collapsedSections[category] = !this.collapsedSections[category];
  }
}
