import { Component } from '@angular/core';
import { ArticleService } from '../../shared/services/article.service';

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

  constructor(private articleService: ArticleService) {}

  onSubmit(): void {
    if (
      !this.article.title.trim() ||
      !this.article.link.trim() ||
      !this.article.description.trim()
    ) {
      alert('Please fill in all fields before submitting.');
      return;
    }

    this.articleService.ingestArticle(this.article).subscribe({
      next: (response) => {
        console.log('Article submitted for ingestion:', response);
        if (response?.message?.includes('already exists')) {
          alert('This article already exists in the system.');
        } else {
          alert('Your article has been submitted and will be classified shortly.');
        }
        this.article = { title: '', link: '', description: '' }; // Reset form
      },
      error: (err) => {
        console.error('Error submitting article:', err);
        alert('There was an error submitting the article.');
      },
    });
  }
}
