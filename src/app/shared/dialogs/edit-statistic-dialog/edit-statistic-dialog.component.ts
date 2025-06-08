import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, computed, inject } from '@angular/core';
import {
  EditStatDialogData,
  EditStatDialogResultObject,
} from './edit-statistic-dialog.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CrhValidators } from '../../class/crh-validators';
import { ErrorHintConfig } from '../../models/input.model';
import { CrhTranslationService } from '../../services/crh-translation.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'crh-edit-statistic-dialog',
    templateUrl: './edit-statistic-dialog.component.html',
    styleUrl: './edit-statistic-dialog.component.scss',
    standalone: false
})
export class EditStatisticDialogComponent {
  private dialogRef = inject(DialogRef);
  private dialogData = inject<EditStatDialogData | undefined>(DIALOG_DATA);
  private crhTranslationService = inject(CrhTranslationService);

  protected formControl = new FormGroup({
    statistic: new FormControl(
      this.dialogData?.stat.statisticNumber.toString(),
      [Validators.required, CrhValidators.numeric]
    ),
    title: new FormControl(this.dialogData?.stat.title, [Validators.required]),
    subtitle: new FormControl(this.dialogData?.stat.subtitle),
  });

  private statisticFieldNumericHint = toSignal(
    this.crhTranslationService.getTranslationFromKeyAsStream(
      'dialog.editStat.field.statistic.numericHint'
    )
  );

  protected statisticFieldConfig = computed<ErrorHintConfig[]>(() => [
    {
      hint: this.statisticFieldNumericHint() ?? '',
      hasError: CrhValidators.numericValueFn,
    },
  ]);

  constructor() {
    this.dialogRef.disableClose = true;
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
      title: this.formControl.controls.title.value ?? '',
      subtitle: this.formControl.controls.subtitle.value ?? undefined,
      value: parseInt(this.formControl.controls.statistic.value ?? ''),
    } satisfies EditStatDialogResultObject);
  }
}
