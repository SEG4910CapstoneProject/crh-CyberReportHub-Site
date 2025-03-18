import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService, Article } from '../../shared/services/article.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'crh-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
})
export class ArticlesComponent implements OnInit {
  categories: string[] = [];
  articlesByCategory: { [key: string]: Article[] } = {};
  articlesToShow: { [key: string]: number } = {}; // To track how many articles to display per category
  favouriteArticles: Article[] = []; // To store favourite articles
  articlesOfNote: Article[] = []; // To store articles of note
  isLoading: boolean = true;

  // Use signal to track logged-in status
  protected isLoggedIn = signal<boolean>(false);

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Track logged-in status using signal
    this.authService.isLoggedIn$.subscribe(status => {
      console.log('Is Logged In:', status); // Debugging login status
      this.isLoggedIn.set(status);  // Update the signal with the current login status
    });

    this.route.data.subscribe(data => {
      console.log('Resolved data:', data);
      if (data['articlesData']) {
        this.articlesByCategory = data['articlesData'];
        this.categories = Object.keys(data['articlesData']);
        this.isLoading = false;

        // Initialize articlesToShow to show 5 articles initially for each category
        this.categories.forEach(category => {
          this.articlesToShow[category] = 5;
        });
      }
    });
  }

  // Check if the article is in the favourites list
  isFavourite(article: Article): boolean {
    return this.favouriteArticles.some(
      fav => fav.articleId === article.articleId
    );
  }

  // Check if the article is in the articles of note list
  isArticleOfNote(article: Article): boolean {
    return this.articlesOfNote.some(
      note => note.articleId === article.articleId
    );
  }

  // Toggle functionality for See More / See Less
  toggleArticles(category: string): void {
    if (this.articlesToShow[category] === 5) {
      // Show all articles
      this.articlesToShow[category] = this.articlesByCategory[category].length;
    } else {
      // Show only 5 articles
      this.articlesToShow[category] = 5;
    }
  }

  // Add or remove article from favourites
  toggleFavourite(article: Article): void {
    if (!this.isLoggedIn()) return; // Prevent non-logged-in users from adding to favourites

    const index = this.favouriteArticles.findIndex(
      fav => fav.articleId === article.articleId
    );
    if (index !== -1) {
      // If the article is already a favourite, remove it
      this.favouriteArticles.splice(index, 1);
    } else {
      // Otherwise, add it to favourites
      this.favouriteArticles.push(article);
    }
  }

  // Add or remove article from Articles of Note
  toggleArticleOfNote(article: Article, event: any): void {
    if (!this.isLoggedIn()) return; // Prevent non-logged-in users from adding to Articles of Note

    if (event.target.checked) {
      // If checked, add to Articles of Note
      this.articlesOfNote.push(article);
    } else {
      // If unchecked, remove from Articles of Note
      const index = this.articlesOfNote.findIndex(
        note => note.articleId === article.articleId
      );
      if (index !== -1) {
        this.articlesOfNote.splice(index, 1);
      }
    }
  }
}
