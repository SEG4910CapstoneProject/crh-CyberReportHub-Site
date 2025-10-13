import { FormControl, NgControl } from '@angular/forms';
import { CrhErrorStateMatcher } from './crh-error-state-matcher';

describe('CrhErrorStateMatcher', () => {
  let childControl: FormControl;
  let parentControl: Partial<NgControl>;
  let matcher: CrhErrorStateMatcher;

  beforeEach(() => {
    childControl = new FormControl('');
    parentControl = { invalid: false } as NgControl;
    matcher = new CrhErrorStateMatcher(childControl, parentControl as NgControl);
  });

  it('should create an instance', () => {
    expect(matcher).toBeTruthy();
  });

  it('should return false when child control is untouched', () => {
    childControl.markAsUntouched();
    (parentControl as any).invalid = true;
    expect(matcher.isErrorState()).toBeFalsy();
  });

  it('should return false when parent control is valid', () => {
    childControl.markAsTouched();
    (parentControl as any).invalid = false;
    expect(matcher.isErrorState()).toBeFalsy();
  });

  it('should return true when child is touched and parent is invalid', () => {
    childControl.markAsTouched();
    (parentControl as any).invalid = true;
    expect(matcher.isErrorState()).toBeTruthy();
  });

  it('should return false when parentControl.invalid is undefined', () => {
    childControl.markAsTouched();
    delete (parentControl as any).invalid;
    expect(matcher.isErrorState()).toBeFalsy();
  });
});
