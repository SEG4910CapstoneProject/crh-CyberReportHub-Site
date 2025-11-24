import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CreateTagDialogData, CreateTagDialogResult } from './create-tag-dialog.model';

@Component({
  selector: 'crh-create-tag-dialog',
  templateUrl: './create-tag-dialog.component.html',
  styleUrls: ['./create-tag-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
})
export class CreateTagDialogComponent {
  tagName = '';
  selectedArticleIds: string[] = [];

  // search + pagination variables
  articleSearchTerm = '';
  filteredArticles: any[] = [];
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(
    private dialogRef: MatDialogRef<CreateTagDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateTagDialogData
  ) {
    if (data.tag) {
      this.tagName = data.tag.tagName;
      this.selectedArticleIds = data.tag.articleIds ?? [];
    }

    // Initialize list sorted by published date
    this.filteredArticles = [...(data.favouriteArticles ?? [])].sort(
      (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );

    this.updateTotalPages();
  }

  // Search logic
  filterArticles(): void {
    const term = this.articleSearchTerm.toLowerCase().trim();
    const allArticles = [...this.data.favouriteArticles].sort(
      (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );

    if (!term) {
      this.filteredArticles = allArticles;
    } else {
      this.filteredArticles = allArticles.filter(article =>
        article.title.toLowerCase().includes(term)
      );
    }

    this.currentPage = 1;
    this.updateTotalPages();
  }

  // Pagination logic
  get paginatedArticles(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredArticles.slice(start, end);
  }

  updateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredArticles.length / this.pageSize) || 1;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  toggleArticleSelection(articleId: string): void {
    if (this.selectedArticleIds.includes(articleId)) {
      this.selectedArticleIds = this.selectedArticleIds.filter(id => id !== articleId);
    } else {
      this.selectedArticleIds.push(articleId);
    }
  }

  isSelected(articleId: string): boolean {
    return this.selectedArticleIds.includes(articleId);
  }

  save(): void {
    const result: CreateTagDialogResult = {
      tagName: this.tagName,
      selectedArticleIds: this.selectedArticleIds,
    };
    this.dialogRef.close(result);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
