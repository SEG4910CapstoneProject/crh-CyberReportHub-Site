import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'crh-chip-container',
  template:
    '<crh-chip *ngFor="let text of availableTexts()" [maxIocChipCharacters]="maxIocChipCharacters()" [text]="text"></crh-chip>',
  styleUrl: './chip-container.component.scss',
  standalone: false,
})
export class ChipContainerComponent {
  public maxIocChipCharacters = input<number>(50);
  public maxChips = input<number>(5);
  public chipTexts = input<string[]>([]);

  protected availableTexts = computed(() => {
    const chipTexts = window.structuredClone(this.chipTexts());
    chipTexts.length = Math.min(chipTexts.length, this.maxChips());
    return chipTexts;
  });
}
