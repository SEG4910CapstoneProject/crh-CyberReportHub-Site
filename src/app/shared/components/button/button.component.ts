import { Component, input } from '@angular/core';
import { ButtonVariant } from './button.model';

@Component({
    selector: 'crh-button',
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss',
    standalone: false
})
export class ButtonComponent {
  public type = input<ButtonVariant>('raised');
  public disabled = input<boolean>(false);
  public ariaLabel = input<string>('button');
}
