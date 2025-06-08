import { Component, input, output } from '@angular/core';

@Component({
    selector: 'crh-confirm-cancel-buttons',
    templateUrl: './confirm-cancel-buttons.component.html',
    styleUrl: './confirm-cancel-buttons.component.scss',
    host: {
        '[class.confirm-buttons-right]': 'justifyText() === "right"',
    },
    standalone: false
})
export class ConfirmCancelButtonsComponent {
  public confirmButtonText = input<string>();
  public cancelButtonText = input<string>();
  public justifyText = input<'right' | 'left'>('right');

  public onConfirmPressed = output();
  public onCancelPressed = output();
}
