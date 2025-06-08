import { Component, ElementRef, inject, input } from '@angular/core';
import { ColorsService } from '../../services/colors.service';

@Component({
    selector: 'crh-stats-card-diagram',
    templateUrl: './stats-card-diagram.component.html',
    styleUrl: './stats-card-diagram.component.scss',
    standalone: false
})
export class StatsCardDiagramComponent {
  private elementRef: ElementRef = inject(ElementRef);
  private colorService = inject(ColorsService);

  public title = input<string>('Title');

  protected get customCssStyleVars(): string {
    const computedColorStyle = this.colorService.getComputedStyle(
      '--crh-background-contrast-color',
      this.elementRef
    );
    if (!computedColorStyle) {
      return '';
    }
    return `--crh-stats-card-shadow-color: ${this.colorService.setAlpha(computedColorStyle, 0.25)}`;
  }
}
