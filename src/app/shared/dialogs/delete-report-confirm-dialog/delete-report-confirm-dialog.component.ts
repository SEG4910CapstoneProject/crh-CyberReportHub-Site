import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, input } from '@angular/core';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Component({
  selector: 'crh-delete-report-confirm-dialog',
  standalone: false,
  templateUrl: './delete-report-confirm-dialog.component.html',
  styleUrl: './delete-report-confirm-dialog.component.scss'
})
export class DeleteReportConfirmDialogComponent {
  onConfirm!:()=>void;
  constructor(
    @Inject(DIALOG_DATA) public data: {
      onConfirm: () => void; message: string 
},
    private dialogRef: DialogRef<ErrorDialogComponent>
  ) {
    //console.log("the message in the dialog error is: ",data.message)
    this.onConfirm = data.onConfirm
  }

  protected error_message = input<string>(this.data.message);

  onCancel():void {
    this.dialogRef.close();
  }

  handleOnConfirm():void {
    this.onConfirm();
    this.dialogRef.close()
  }

}
