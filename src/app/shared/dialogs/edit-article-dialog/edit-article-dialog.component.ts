import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { TextInputConfig } from '../../components/text-input/text-input.model';
import {
  EditArticleDialogData,
  EditArticleDialogResultObject,
} from './edit-article-dialog.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateTime } from 'luxon';
import { DateUtilsService } from '../../services/date-utils.service';

@Component({
  selector: 'crh-edit-article-dialog',
  templateUrl: './edit-article-dialog.component.html',
  styleUrl: './edit-article-dialog.component.scss',
  standalone: false,
})
export class EditArticleDialogComponent {
  private dialogRef = inject(DialogRef);
  private dialogData = inject<EditArticleDialogData | undefined>(DIALOG_DATA);
  private dateUtils = inject(DateUtilsService);

  protected formControl = new FormGroup({
    link: new FormControl<string>(this.dialogData?.article.link ?? '', [
      Validators.required,
    ]),
    title: new FormControl<string>(this.dialogData?.article.title ?? '', [
      Validators.required,
    ]),
    publishDate: new FormControl<DateTime | undefined>(
      this.dialogData
        ? this.dateUtils.getDateFromString(this.dialogData.article.publishDate)
        : undefined,
      [Validators.required]
    ),
    description: new FormControl<string>(
      this.dialogData?.article.description ?? '',
      [Validators.required]
    ),
  });

  protected readonly descriptionTextInputConfig: TextInputConfig = {
    variant: 'textarea',
  };

  constructor() {
    this.dialogRef.disableClose = true;
    if (this.dialogData) {
      this.formControl.controls.link.disable();
    }
  }

  protected onCancel(): void {
    this.dialogRef.close();
  }

  protected onConfirm(): void {
    if (!this.formControl.valid) {
      this.formControl.markAllAsTouched();
      return;
    }

    this.dialogRef.close({
      articleId: this.dialogData?.article.articleId,
      title: this.formControl.controls.title.value ?? '',
      description: this.formControl.controls.description.value ?? '',
      link: this.formControl.controls.link.value ?? '',
      publishDate:
        this.formControl.controls.publishDate.value ?? DateTime.invalid(''),
    } satisfies EditArticleDialogResultObject);
  }
}
