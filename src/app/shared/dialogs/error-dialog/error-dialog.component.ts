import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, input } from '@angular/core';


@Component({
  selector: 'crh-error-dialog',
  standalone: false,
  templateUrl: './error-dialog.component.html',
  styleUrl: './error-dialog.component.scss'
})
export class ErrorDialogComponent {
  constructor(
    @Inject(DIALOG_DATA) public data: { message: string },
    private dialogRef: DialogRef<ErrorDialogComponent>
  ) {
    console.log("the message in the dialog error is: ",data.message)
  }

  protected error_message = input<string>(this.data.message);

  onCancel():void {
    this.dialogRef.close();
  }

}
