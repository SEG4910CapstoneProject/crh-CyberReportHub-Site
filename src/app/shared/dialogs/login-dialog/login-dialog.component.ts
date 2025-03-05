import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'crh-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.scss',
})
export class LoginDialogComponent {
  private dialogRef = inject(DialogRef);

  protected onCancel(): void {
    this.dialogRef.close();
  }
}
