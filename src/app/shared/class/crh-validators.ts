import { Validators } from '@angular/forms';

const NUMERIC_REGEX = '^[0-9]*$';
const NUMERIC_REGEX_OBJ = new RegExp(NUMERIC_REGEX);

/**
 * Custom validators and validator shorthands
 */
export class CrhValidators {
  public static readonly numeric = Validators.pattern(NUMERIC_REGEX);

  /**
   * Function that takes string | undefined for the numeric validator. Used for error hints
   * Returns true if provided value has an error
   */
  public static numericValueFn(value: string | undefined): boolean {
    return !NUMERIC_REGEX_OBJ.test(value ?? '');
  }
}
