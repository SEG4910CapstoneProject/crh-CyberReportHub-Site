import { CrhValidators } from './crh-validators';
import { AbstractControl } from '@angular/forms';

describe('CrhValidators', () => {
  describe('numeric validator', () => {
    it('should pass for numeric values', () => {
      const control = { value: '12345' } as AbstractControl;
      const result = CrhValidators.numeric(control);
      expect(result).toBeNull();
    });

    it('should fail for non-numeric values', () => {
      const control = { value: '12a' } as AbstractControl;
      const result = CrhValidators.numeric(control);
      expect(result).toEqual({ pattern: expect.any(Object) });
    });
  });

  describe('numericValueFn', () => {
    it('should return false for valid numeric string', () => {
      expect(CrhValidators.numericValueFn('123')).toBe(false);
    });

    it('should return true for invalid numeric string', () => {
      expect(CrhValidators.numericValueFn('12x')).toBe(true);
    });

    it('should return false when value is undefined', () => {
      expect(CrhValidators.numericValueFn(undefined)).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(CrhValidators.numericValueFn('')).toBe(false);
    });
  });
});

