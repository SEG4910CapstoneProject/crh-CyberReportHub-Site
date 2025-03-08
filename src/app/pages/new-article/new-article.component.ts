import { Component } from '@angular/core';
import { ArticleService, Article } from '../../shared/services/article.service';

@Component({
  selector: 'crh-new-article',
  templateUrl: './new-article.component.html',
  styleUrls: ['./new-article.component.scss'],
})
export class NewArticleComponent {
  article: Partial<Article> = {
    articleId: '',
    title: '',
    description: '',
    category: '',
    link: '',
    publishDate: '',
    type: '',
  };

  constructor(private articleService: ArticleService) {}

  onSubmit(): void {
    if (!this.article.title || !this.article.link || !this.article.type) {
      console.error('All fields are required');
      return;
    }

    const newArticle: Article = {
      articleId: this.article.articleId || this.generateUUID(),
      title: this.article.title,
      description: this.article.description || 'No description available.',
      category: this.article.category || 'General',
      link: this.article.link,
      publishDate:
        this.article.publishDate || new Date().toISOString().split('T')[0],
      type: this.article.type,
    };

    this.articleService.addArticle(newArticle).subscribe(response => {
      console.log('Article added:', response);
    });
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
}
