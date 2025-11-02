import { Component, OnInit, signal } from '@angular/core';
import { ArticleService, Article } from '../../shared/services/article.service';
import { TagService, Tag } from '../../shared/services/tag.service';
import { AuthService } from '../../shared/services/auth.service';
import { CreateTagDialogComponent } from '../../shared/dialogs/create-tag-dialog/create-tag-dialog.component';
import { CreateTagDialogData, CreateTagDialogResult } from '../../shared/dialogs/create-tag-dialog/create-tag-dialog.model';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'crh-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss'],
  standalone: false,
})
export class FavouritesComponent implements OnInit {
  favouriteArticles: Article[] = [];
  untaggedFavourites: Article[] = [];
  submittedArticles: Article[] = [];
  userTags: Tag[] = [];
  taggedArticles: Record<number, Article[]> = {};
  isLoading = true;
  collapsedSections: Record<string, boolean> = {}; // Tracks which sections are collapsed

  protected isLoggedIn = signal<boolean>(false);

  constructor(
    private articleService: ArticleService,
    private tagService: TagService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn.set(status);
      if (status) this.loadData();
      else this.isLoading = false;
    });
  }

  private loadData(): void {
    this.fetchFavourites();
    this.fetchSubmittedArticles();
    this.fetchTags();
  }

  fetchFavourites(): void {
    this.articleService.getMyFavourites().subscribe({
      next: (articles: Article[]) => {
        this.favouriteArticles = articles;
        this.untaggedFavourites = [...articles];
        this.isLoading = false;
      },
      error: err => console.error('Error fetching favourites:', err),
    });
  }

  fetchSubmittedArticles(): void {
    this.articleService.getMySubmittedArticles().subscribe({
      next: articles => (this.submittedArticles = articles),
      error: err => console.error('Error fetching submitted articles:', err),
    });
  }

  fetchTags(): void {
    this.tagService.getUserTags().subscribe({
      next: tags => {
        this.userTags = tags;
        tags.forEach(tag => this.loadArticlesByTag(tag.tagId));
      },
      error: err => console.error('Error loading tags:', err),
    });
  }

  loadArticlesByTag(tagId: number): void {
    this.tagService.getArticlesByTag(tagId).subscribe({
      next: (articles: Article[]) => {
        this.taggedArticles[tagId] = articles;

        // Compute all tagged IDs across all tags
        const allTaggedIds = new Set(
          Object.values(this.taggedArticles)
            .flat()
            .map((a: Article) => a.articleId)
        );

        // Remove all tagged articles from general favourites list
        this.untaggedFavourites = this.favouriteArticles.filter(
          (a: Article) => !allTaggedIds.has(a.articleId)
        );
      },
      error: (err: unknown) =>
        console.error('Error loading tagged articles:', err),
    });
  }

  isFavourite(article: Article): boolean {
    return this.favouriteArticles?.some(f => f.articleId === article.articleId);
  }

  toggleFavourite(article: Article): void {
    if (!this.isLoggedIn()) return;

    const isFav = this.favouriteArticles.some(f => f.articleId === article.articleId);

    if (isFav) {
      this.articleService.removeFavourite(article.articleId).subscribe({
        next: () => {
          // Remove from favourites
          this.favouriteArticles = this.favouriteArticles.filter(f => f.articleId !== article.articleId);
          this.untaggedFavourites = this.untaggedFavourites.filter(f => f.articleId !== article.articleId);

          // Remove from all tags
          Object.keys(this.taggedArticles).forEach(tagId => {
            const tagNum = +tagId;
            const wasTagged = this.taggedArticles[tagNum].some(a => a.articleId === article.articleId);
            if (wasTagged) {
              this.tagService.removeArticleFromTag(tagNum, article.articleId).subscribe(); // backend cleanup
            }
            this.taggedArticles[tagNum] = this.taggedArticles[tagNum].filter(
              a => a.articleId !== article.articleId
            );
          });
        },
      });
    } else {
      this.articleService.addFavourite(article.articleId).subscribe({
        next: () => this.favouriteArticles.push(article),
      });
    }
  }

  incrementViewCount(articleId: string): void {
    this.articleService.incrementViewCount(articleId).subscribe();
  }

  deleteArticle(articleId: string): void {
    if (!confirm('Are you sure you want to delete this article?')) return;
    this.articleService.deleteArticle(articleId).subscribe({
      next: () => {
        this.submittedArticles = this.submittedArticles.filter(a => a.articleId !== articleId);
      },
    });
  }

  // ---------- DIALOG LOGIC ----------
  openCreateTagDialog(): void {
    const data: CreateTagDialogData = {
      favouriteArticles: this.favouriteArticles
    };
    const dialogRef = this.dialog.open<CreateTagDialogComponent, CreateTagDialogData, CreateTagDialogResult>(
      CreateTagDialogComponent,
      { data }
    );

    dialogRef.afterClosed().subscribe((result: CreateTagDialogResult | undefined) => {
      if (result) {
        this.tagService.createTag(result.tagName).subscribe({
          next: newTag => {
            result.selectedArticleIds.forEach(articleId =>
              this.tagService.addArticleToTag(newTag.tagId, articleId).subscribe()
            );
            this.fetchTags();
            this.fetchFavourites();
          },
          error: err => {
            console.warn('Tag creation failed gracefully:', err);

            let msg = 'Failed to create tag.';
            if (err?.error?.message) msg = err.error.message;
            else if (err?.error?.error) msg = err.error.error;
            else if (err?.status === 400) msg = 'A tag with this name already exists.';

            // show error to the user
            alert(msg);
          }
        });
      }
    });
  }

  openEditTagDialog(tag: Tag): void {
    // Fetch the articles under this tag to preselect them in the dialog
    this.tagService.getArticlesByTag(tag.tagId).subscribe({
      next: (articles: Article[]) => {
        const data: CreateTagDialogData = {
          favouriteArticles: this.favouriteArticles,
          tag: { ...tag, articleIds: articles.map(a => a.articleId) }, // prefill with current article IDs
        };

        const dialogRef = this.dialog.open<CreateTagDialogComponent, CreateTagDialogData, CreateTagDialogResult>(
          CreateTagDialogComponent,
          { data }
        );

        dialogRef.afterClosed().subscribe((result: CreateTagDialogResult | undefined) => {
          if (result) {
            const tagId = tag.tagId;

            // Update tag name if changed
            if (result.tagName.trim() && result.tagName.trim() !== tag.tagName) {
              this.tagService.renameTag(tagId, result.tagName.trim()).subscribe({
                next: () => this.fetchTags(),
                error: err => console.error('Error renaming tag:', err),
              });
            }

            // Update new article selections
            const currentIds = new Set(articles.map(a => a.articleId));
            const selectedIds = new Set(result.selectedArticleIds);

            // Remove deselected
            currentIds.forEach(id => {
              if (!selectedIds.has(id)) {
                this.tagService.removeArticleFromTag(tagId, id).subscribe();
              }
            });

            // Add new selections
            selectedIds.forEach(id => {
              if (!currentIds.has(id)) {
                this.tagService.addArticleToTag(tagId, id).subscribe();
              }
            });

            this.fetchTags();
            this.fetchFavourites();
          }
        });
      },
      error: err => console.error('Error loading tag articles for edit:', err),
    });
  }

  deleteTag(tag: Tag): void {
    if (!confirm(`Are you sure you want to delete "${tag.tagName}"?`)) return;
    this.tagService.deleteTag(tag.tagId).subscribe({
      next: () => {
        delete this.taggedArticles[tag.tagId];
        this.userTags = this.userTags.filter(t => t.tagId !== tag.tagId);
        this.fetchFavourites();
      },
    });
  }

  toggleSection(sectionKey: string): void {
    this.collapsedSections[sectionKey] = !this.collapsedSections[sectionKey];
  }

}
