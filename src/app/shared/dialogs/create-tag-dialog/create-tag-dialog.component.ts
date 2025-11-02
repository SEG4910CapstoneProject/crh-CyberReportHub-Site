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

  constructor(
    private dialogRef: MatDialogRef<CreateTagDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateTagDialogData
  ) {
    if (data.tag) {
      this.tagName = data.tag.tagName;
      this.selectedArticleIds = data.tag.articleIds ?? [];
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
