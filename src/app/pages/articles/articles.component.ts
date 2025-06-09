import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService, Article, ArticleOfNote } from '../../shared/services/article.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
    selector: 'crh-articles',
    templateUrl: './articles.component.html',
    styleUrls: ['./articles.component.scss'],
    standalone: false
})
export class ArticlesComponent implements OnInit {
  articlesByCategory: Record<string,Article[]>= {};
  articlesToShow: Record<string,number> = {}; // To track how many articles to display per category
  favouriteArticles: Article[] = []; // To store favourite articles
  articlesOfNote: ArticleOfNote[] = []; // To store articles of note
  isLoading = true;
  objectKeys = Object.keys;

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

    this.articleService.getAllArticleTypesWithArticles(30).subscribe( {
      next: (response) => {
        this.articlesByCategory = response;
        //this.categories = Object.keys(response);
        this.isLoading = false;

        // Initialize articlesToShow to show 3 articles initially for each category
        Object.keys(response).forEach(category => {
          this.articlesToShow[category] = 3;
        }); 
        console.log("the article to show are: ",this.articlesToShow);
        console.log("the articles per category are: ",this.articlesByCategory);
      },
      error: (e) => {
        console.error('Error fetching articles:', e);
        this.isLoading = false;
      },
      complete: () => console.info("30 Articles are fetched successfully",this.articlesByCategory) 
    }
    );


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
    return this.articlesOfNote?.some(
      (note: ArticleOfNote) => note.url === article.link
    );
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
    if (!this.isLoggedIn()) return; // Prevent non-logged-in users from adding to favourites

    const index = this.favouriteArticles.findIndex(
      fav => fav.articleId === article.articleId
    );
    if (index !== -1) {
      // If the article is already a favourite, remove it
      this.favouriteArticles.splice(index, 1);
    } else {
      // Otherwise, add it to favourites
      this.favouriteArticles?.push(article);
    }
  }

  // Add or remove article from Articles of Note
  toggleArticleOfNote(article: Article, event: any): void {
    if (!this.isLoggedIn()) return; // Prevent non-logged-in users from adding to Articles of Note

    const isChecked = event.target.checked;
    this.articleService.chooseArticleOfNote(article.articleId).subscribe({
      next: (response)=> {
        console.log('Article of Note status toggled', response);
        article.isArticleOfNote = isChecked;  // Update the status locally

        if (isChecked) {
          // If checked, add to Articles of Note
          const articleOfNote: ArticleOfNote = { title: article.title, url: article.link };
          this.articlesOfNote?.push(articleOfNote);
        } else {
          // If unchecked, remove from Articles of Note
          const index = this.articlesOfNote.findIndex(
            (note: ArticleOfNote) => note.url === article.link
          );
          if (index !== -1) {
            this.articlesOfNote.splice(index, 1);
          }
        }
      },
      error: (error) => {
        console.error('Error toggling article of note:', error);
      }
    }
    );
  }

  // Fetch articles that are marked as "Articles of Note"
  fetchArticlesOfNote():void {
    this.articleService.getArticlesOfNote().subscribe({
      next: (articles: ArticleOfNote[]) => {
        console.log('Articles of Note:', articles);
        this.articlesOfNote = articles;
      },
      error: (error:any) => {
        console.error('Error fetching Articles of Note:',error);
      }
    }
    )
  }

  // Increment view count on article click
  incrementViewCount(articleId: string): void {
    this.articleService.incrementViewCount(articleId).subscribe({
      next: (response) => {
        console.log('View count incremented', response);
      },
      error: (error) => {
        console.error('Error incrementing view count',error);
      }
    }
    )
  }

  //Necessary to increment view count from articles of note (since backend only sends URLs)
  //This will be deleted later
  incrementViewCountFromUrl(url: string): void {
    this.articleService.getArticleByLink(url).subscribe({
      next:(article) => {
        if (article?.articleId) {
          this.incrementViewCount(article.articleId);
        } else {
          console.warn('No articleId found for URL:', url);
        }
      },
      error:(error) => {
          console.error('Error fetching article by URL:', error);
      }
    }
    )
  }

}
