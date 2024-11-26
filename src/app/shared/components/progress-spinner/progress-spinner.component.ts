import { Component, input } from '@angular/core';

@Component({
  selector: 'crh-progress-spinner',
  template: '<mat-spinner [diameter]="diameter()"></mat-spinner>',
  styleUrl: './progress-spinner.component.scss',
})
export class ProgressSpinnerComponent {
  public diameter = input<number>(100);
}
