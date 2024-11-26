import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * A validator in which it is only valid if all fields are defined or undefined.
 * If 1 field is different from the rest, it is invalid.
 */
export function multipleFieldsSameStateValidator(
  fields: string[]
): ValidatorFn {
  if (fields.length === 0) {
    return () => null;
  }

  return (control: AbstractControl): ValidationErrors | null => {
    const checkDefined = !!control.get(fields[0])?.value;
    let foundError = null;
    for (const field of fields) {
      const childControl = control.get(field);
      if (!childControl) {
        continue;
      }

      const isFieldDefined = !!childControl.value;
      if (checkDefined !== isFieldDefined) {
        foundError = { fieldStateMismatch: true };
      }
    }

    if (foundError) {
      for (const field of fields) {
        const childControl = control.get(field);
        if (!childControl) {
          continue;
        }

        const isFieldDefined = !!childControl.value;
        if (!isFieldDefined) {
          childControl.setErrors({ fieldStateMismatch: true });
          childControl.markAsTouched();
        }
      }
    }

    return foundError;
  };
}
