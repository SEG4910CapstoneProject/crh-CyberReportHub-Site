import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'crh-chip',
  template: '{{ formattedText() }}',
  styleUrl: './chip.component.scss',
  standalone: false,
})
export class ChipComponent {
  public maxIocChipCharacters = input<number>(50);
  public text = input<string>('');

  protected formattedText = computed(() => {
    const maxIocChipCharacters = this.maxIocChipCharacters();

    let value = this.text();
    if (value.length > maxIocChipCharacters) {
      value = value.slice(0, maxIocChipCharacters - 3) + '...';
    }

    return value;
  });
}
