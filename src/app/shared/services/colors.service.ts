import { ElementRef, Injectable } from '@angular/core';
import { colord } from 'colord';

@Injectable({
  providedIn: 'root',
})
export class ColorsService {
  /**
   * Gets new color with a given alpha value
   * @param color color string value
   * @param newAlpha alpha as a decimal between 0 and 1
   * @returns color value a hex
   */
  public setAlpha(color: string, newAlpha: number): string {
    return colord(color).alpha(newAlpha).toHex();
  }

  /**
   * Gets a color from a given css variable
   * @param cssVariable Css variable. Must be full css specified name. (e.g `--crh-primary-color`)
   * @param elementRef Element Reference to get color from
   * @returns Calculated result from css variable. If no result, empty string.
   */
  public getComputedStyle(cssVariable: string, elementRef: ElementRef): string {
    return window
      .getComputedStyle(elementRef.nativeElement)
      .getPropertyValue(cssVariable);
  }
}
