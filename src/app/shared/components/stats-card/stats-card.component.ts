import { Component, input, output } from '@angular/core';
import { ContentMode, InteractMode } from './stats-card.models';

@Component({
    selector: 'crh-stats-card',
    templateUrl: './stats-card.component.html',
    styleUrl: './stats-card.component.scss',
    standalone: false
})
export class StatsCardComponent {
  public contentMode = input<ContentMode>('text');

  public title = input<string>('Title');
  public subtitle = input<string>('');
  public interactMode = input<InteractMode>('none');

  public _onDeleteClick = output<void>();
  public _onAddClick = output<void>();
  public _onEditClick = output<void>();
}
