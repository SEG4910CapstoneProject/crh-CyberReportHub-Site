import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';
import { multipleFieldsSameStateValidator } from './crh-multi-field-validator';

describe('multipleFieldsSameStateValidator', () => {
  let validatorFunction: ValidatorFn;

  const FIELDS = ['field1', 'field2'];

  beforeEach(() => {
    validatorFunction = multipleFieldsSameStateValidator(FIELDS);
  });

  it('should create function', () => {
    expect(validatorFunction).toBeTruthy();
  });

  it('should create null function if no fields', () => {
    const fn = multipleFieldsSameStateValidator([]);

    expect(fn({} as AbstractControl)).toBeNull();
  });

  it('should be in field mismatch if fields do not match', () => {
    const formGroup = new FormGroup({
      field1: new FormControl(undefined),
      field2: new FormControl('someValue'),
    });

    const result = validatorFunction(formGroup);

    expect(result).toMatchObject({ fieldStateMismatch: true });
    expect(formGroup.controls['field1'].errors).not.toBeNull();
    expect(formGroup.controls['field2'].errors).toBeNull();

    expect(formGroup.controls['field1'].touched).toBe(true);
    expect(formGroup.controls['field2'].touched).toBe(false);
  });
});
