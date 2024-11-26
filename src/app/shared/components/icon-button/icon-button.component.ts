import { Component, ElementRef, inject, input } from '@angular/core';
import { ColorsService } from '../../services/colors.service';

@Component({
  selector: 'crh-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss',
})
export class IconButtonComponent {
  private colorService = inject(ColorsService);
  private elementRef = inject(ElementRef);

  public disabled = input<boolean>(false);
  public cssColorVariable = input<string>('--crh-base-text-color');
  public cssHoverColorVariable = input<string>('--crh-base-text-color');
  public ariaLabel = input<string>('button');
  public size = input<number>(24);

  protected get computedCssStyles(): string {
    const computedColorStyle = this.colorService.getComputedStyle(
      this.cssColorVariable(),
      this.elementRef
    );
    const computedHoverColorStyle = this.colorService.getComputedStyle(
      this.cssHoverColorVariable(),
      this.elementRef
    );
    if (!computedColorStyle || !computedHoverColorStyle) {
      console.error(`[Icon Button] Error when computing colors!`);
      return `--crh-icon-button-size: ${this.size()};`;
    }
    return `
      --crh-icon-button-size: ${this.size()};
      --crh-icon-button-color: ${computedColorStyle};
      --crh-icon-button-background-hover-color: ${this.colorService.setAlpha(computedHoverColorStyle, 0.15)};
    `;
  }
}
