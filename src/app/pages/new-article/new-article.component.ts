import { Component, Inject, Optional } from '@angular/core';
import { ArticleService } from '../../shared/services/article.service';
import { Dialog } from '@angular/cdk/dialog';
import { ErrorDialogComponent } from '../../shared/dialogs/error-dialog/error-dialog.component';
import { AuthService } from '../../shared/services/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'crh-new-article',
  templateUrl: './new-article.component.html',
  styleUrls: ['./new-article.component.scss'],
  standalone: false,
})
export class NewArticleComponent {
  article = {
    title: '',
    link: '',
    description: '',
    publishDate: '',
  };

  constructor(
    private articleService: ArticleService,
    private dialog: Dialog,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any | null,  // receives article when we edit articles
    @Optional() private dialogRef?: MatDialogRef<NewArticleComponent>
  ) {
    if (data) {
      this.article = { ...data }; // prefill fields when editing
    }
  }

  private showError(message: string): void {
    this.dialog.open(ErrorDialogComponent, { data: { message } });
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  onSubmit(): void {
    // Auth check
    if (!this.authService.isLoggedIn()) {
      this.showError('You must be logged in to submit an article.');
      return;
    }

    // Input validation
    if (
      !this.article.title.trim() ||
      !this.article.link.trim() ||
      !this.article.description.trim() ||
      !this.article.publishDate ) {
      this.showError('Please fill in all fields before submitting.');
      return;
    }

    // URL validation before API call
    if (!this.isValidUrl(this.article.link)) {
      this.showError('Please provide a valid URL.');
      return;
    }

    // There is existing data, so we are in edit mode
    if (this.data && this.data.articleId) {
        this.articleService.updateArticle(this.data.articleId, this.article).subscribe({
          next: (response) => {
            this.dialogRef?.close(this.article);
            this.showError(response?.message || 'Article updated successfully!');
          },
          error: (err) => {
            console.error('Error updating article:', err);
            const message =
              err.error?.message ||
              (err.status === 409
                ? 'This article already exists in the system.'
                : 'There was an unexpected error updating the article.');
            this.showError(message);
          },
        });
      } else {
        // There is no existing data, so we are in add mode
        this.articleService.ingestArticle(this.article).subscribe({
          next: (response) => {
            const message = response?.message || 'Your article has been submitted successfully.';
            this.showError(message);
            this.article = { title: '', link: '', description: '', publishDate: '' };
          },
          error: (err) => {
            console.error('Error submitting article:', err);
            const message =
              err.error?.message ||
              (err.status === 409
                ? 'This article already exists in the system.'
                : 'There was an unexpected error submitting the article.');
            this.showError(message);
          },
        });
      }
  }
}
