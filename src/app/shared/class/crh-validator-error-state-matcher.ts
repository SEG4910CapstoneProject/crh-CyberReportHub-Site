import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class CrhValidatorErrorStateMatcher implements ErrorStateMatcher {
  constructor(
    private childControl: FormControl,
    private validator: Validator
  ) {}

  isErrorState(control: AbstractControl | null): boolean {
    return (
      this.childControl.touched &&
      !!control &&
      this.containsError(this.validator.validate(control))
    );
  }

  private containsError(validationErrors: ValidationErrors | null): boolean {
    if (!validationErrors) {
      return false;
    }

    for (const key in validationErrors) {
      const item = validationErrors[key];
      if (item) {
        return true;
      }
    }
    return false;
  }
}
