import { FormControl, NgControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class CrhErrorStateMatcher implements ErrorStateMatcher {
  constructor(
    private childControl: FormControl,
    private parentControl: NgControl
  ) {}

  isErrorState(): boolean {
    return this.childControl.touched && (this.parentControl.invalid ?? false);
  }
}
