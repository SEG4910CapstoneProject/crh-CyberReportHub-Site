import { Component } from '@angular/core';
import { ArticleService } from '../../shared/services/article.service';
import { Dialog } from '@angular/cdk/dialog';
import { ErrorDialogComponent } from '../../shared/dialogs/error-dialog/error-dialog.component';
import { AuthService } from '../../shared/services/auth.service';

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
  };

  constructor(
      private articleService: ArticleService,
      private dialog: Dialog,
      private authService: AuthService
    ) {}

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
    if (!this.article.title.trim() || !this.article.link.trim() || !this.article.description.trim()) {
      this.showError('Please fill in all fields before submitting.');
      return;
    }

    // URL validation before API call
    if (!this.isValidUrl(this.article.link)) {
      this.showError('Please provide a valid URL.');
      return;
    }

    // Submit to backend
    this.articleService.ingestArticle(this.article).subscribe({
      next: (response) => {
        const message = response?.message || 'Your article has been submitted successfully.';
        this.showError(message);
        this.article = { title: '', link: '', description: '' };
      },
      error: (err) => {
        console.error('Error submitting article:', err);
        const message =
          err.error?.message ||
          (err.status === 409
            ? 'This article already exists in the system.'
            : err.status === 400
            ? 'Please provide a valid URL or complete all required fields.'
            : err.status === 401
            ? 'You must be logged in to submit an article.'
            : 'There was an unexpected error submitting the article.');
        this.showError(message);
      },
    });
  }
}
