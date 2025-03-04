import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleService } from '../../shared/services/article.service';

@Component({
  selector: 'crh-new-article',
  templateUrl: './new-article.component.html',
  styleUrls: ['./new-article.component.scss'],
})
export class NewArticleComponent {
  // Object to hold the form data
  article = {
    link: '',
    type: '',
  };

  constructor(
    private articleService: ArticleService,
    private router: Router
  ) {}

  onSubmit(): void {
    // Add the article to the shared service
    this.articleService.addArticle(this.article);
    // Navigate back to the Articles page
    this.router.navigate(['/articles']);
  }
}
