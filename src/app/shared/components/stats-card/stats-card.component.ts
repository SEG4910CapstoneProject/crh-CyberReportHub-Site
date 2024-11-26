import { Component, input, output } from '@angular/core';
import { ContentMode, InteractMode } from './stats-card.models';

@Component({
  selector: 'crh-stats-card',
  templateUrl: './stats-card.component.html',
  styleUrl: './stats-card.component.scss',
})
export class StatsCardComponent {
  public contentMode = input<ContentMode>('text');

  public title = input<string>('Title');
  public subtitle = input<string>('');
  public interactMode = input<InteractMode>('none');

  public onDeleteClick = output<void>();
  public onAddClick = output<void>();
  public onEditClick = output<void>();
}
