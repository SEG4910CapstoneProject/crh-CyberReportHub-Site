import { Component, ComponentRef, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MATERIAL_INPUT_DIRECTIVE_HOST_FULL,
  MaterialInputDirective,
} from './material-input.directive';
import { ErrorHintConfig } from '../models/input.model';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, NgControl } from '@angular/forms';
import { CrhErrorStateMatcher } from '../class/crh-error-state-matcher';
import { Subject } from 'rxjs';

@Component({
  hostDirectives: [MATERIAL_INPUT_DIRECTIVE_HOST_FULL],
})
class HostComponent {
  public directive = inject(MaterialInputDirective);
}

describe('MaterialInputDirective', () => {
  let directive: MaterialInputDirective;
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let componentRef: ComponentRef<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialInputDirective, HostComponent],
      providers: [ErrorStateMatcher],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    directive = component.directive;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
    expect(directive).toBeTruthy();
  });

  describe('activeError', () => {
    it('should return undefined if errorHints empty', () => {
      expect(directive.activeError()).toBeUndefined();
    });

    it('should return hint when hasError returns true', () => {
      const hint = 'Error A';
      componentRef.setInput('errorHints', [
        { hint, hasError: () => true } as ErrorHintConfig,
      ]);
      fixture.detectChanges();
      expect(directive.activeError()).toBe(hint);
    });

    it('should return hint when hasError undefined', () => {
      const hint = 'Error B';
      componentRef.setInput('errorHints', [
        { hint, hasError: undefined } as ErrorHintConfig,
      ]);
      fixture.detectChanges();
      expect(directive.activeError()).toBe(hint);
    });

    it('should return undefined when hasError returns false', () => {
      const hint = 'Error C';
      componentRef.setInput('errorHints', [
        { hint, hasError: () => false } as ErrorHintConfig,
      ]);
      fixture.detectChanges();
      expect(directive.activeError()).toBeUndefined();
    });
  });

  describe('onHasError', () => {
    it('should return true if hasError is undefined', () => {
      const config = { hint: 'Hint', hasError: undefined } as ErrorHintConfig;
      expect(directive.onHasError(config)).toBe(true);
    });

    it('should return true if hasError returns true', () => {
      directive.fieldContent.set('SomeValue');
      const config = { hint: 'Hint', hasError: () => true } as ErrorHintConfig;
      expect(directive.onHasError(config)).toBe(true);
    });

    it('should return false if hasError returns false', () => {
      directive.fieldContent.set('OtherValue');
      const config = { hint: 'Hint', hasError: () => false } as ErrorHintConfig;
      expect(directive.onHasError(config)).toBe(false);
    });
  });

  describe('ControlValueAccessor methods', () => {
    it('should write value to form and fieldContent', () => {
      const val = 'MyValue';
      directive.writeValue(val);
      expect(directive.childControl.value).toBe(val);
      expect(directive.fieldContent()).toBe(val);
    });

    it('should call registered onChange function when value changes', () => {
      const spy = jest.fn();
      directive.registerOnChange(spy);
      directive.childControl.setValue('new');
      expect(spy).toHaveBeenCalledWith('new');
    });

    it('should call registered onTouched function and mark as touched', () => {
      const spy = jest.fn();
      directive.registerOnTouched(spy);
      directive.onTouched();
      expect(spy).toHaveBeenCalled();
      expect(directive.childControl.touched).toBe(true);
    });
  });

  describe('setDisabledState', () => {
    it('should disable and enable control', () => {
      directive.setDisabledState(true);
      expect(directive.isFieldDisabled).toBe(true);
      expect(directive.childControl.disabled).toBe(true);

      directive.setDisabledState(false);
      expect(directive.isFieldDisabled).toBe(false);
      expect(directive.childControl.enabled).toBe(true);
    });
  });

  describe('getErrorMatcher', () => {
    it('should return defined errorStateMatcher if provided', () => {
      const mockMatcher = new ErrorStateMatcher();
      componentRef.setInput('errorStateMatcher', mockMatcher);
      fixture.detectChanges();
      expect(directive.getErrorMatcher()).toBe(mockMatcher);
    });

    it('should return CrhErrorStateMatcher if ngControl exists', () => {
      directive.ngControl = { control: new FormControl() } as unknown as NgControl;
      const result = directive.getErrorMatcher();
      expect(result).toBeInstanceOf(CrhErrorStateMatcher);
    });

    it('should return defaultErrorStateMatcher otherwise', () => {
      const result = directive.getErrorMatcher();
      expect(result).toBeInstanceOf(ErrorStateMatcher);
    });
  });

  describe('ngAfterViewInit', () => {
    it('should handle missing NgControl gracefully', () => {
      expect(() => directive.ngAfterViewInit()).not.toThrow();
    });

    it('should attach listener when NgControl is available', () => {
      const mockNgControl = { control: new FormControl() } as unknown as NgControl;
      const getSpy = jest.spyOn(directive['injector'], 'get').mockReturnValue(mockNgControl);
      directive.ngAfterViewInit();
      getSpy.mockRestore();
    });
  });

  it('should emit value when onValueWrite called', () => {
    const outputSpy = jest.spyOn(directive._onValueChanged, 'emit');
    const val = 'NewVal';
    directive.onValueWrite(val);
    expect(directive.fieldContent()).toBe(val);
    expect(outputSpy).toHaveBeenCalledWith(val);
  });

  it('should return defaultErrorStateMatcher when no ngControl and no custom matcher', () => {
    componentRef.setInput('errorStateMatcher', undefined);
    fixture.detectChanges();
    const matcher = directive.getErrorMatcher();
    expect(matcher).toBeInstanceOf(ErrorStateMatcher);
  });

  describe('ngAfterViewInit full state sync', () => {
    let control: FormControl;
    let mockNgControl: any;
    let events$: Subject<any>;

    beforeEach(() => {
      control = new FormControl();

      events$ = new Subject();

      const controlWithEvents: any = control;
      controlWithEvents.events = events$;

      mockNgControl = {
        control: controlWithEvents
      } as NgControl;

      jest.spyOn(directive['injector'], 'get').mockReturnValue(mockNgControl);

      jest.useFakeTimers();        
      directive.ngAfterViewInit();
      jest.runAllTimers();
    });

    it('should sync touched → markAsTouched', () => {
      jest.spyOn(directive.childControl, 'markAsTouched');
      control.markAsTouched();
      events$.next(null);
      expect(directive.childControl.markAsTouched).toHaveBeenCalled();
    });

    it('should sync untouched → markAsUntouched', () => {
      directive.childControl.markAsTouched();
      jest.spyOn(directive.childControl, 'markAsUntouched');
      control.markAsUntouched();
      events$.next(null);
      expect(directive.childControl.markAsUntouched).toHaveBeenCalled();
    });

    it('should sync dirty → markAsDirty', () => {
      jest.spyOn(directive.childControl, 'markAsDirty');
      control.markAsDirty();
      events$.next(null);
      expect(directive.childControl.markAsDirty).toHaveBeenCalled();
    });

    it('should sync pristine → markAsPristine', () => {
      directive.childControl.markAsDirty();
      jest.spyOn(directive.childControl, 'markAsPristine');
      control.markAsPristine();
      events$.next(null);
      expect(directive.childControl.markAsPristine).toHaveBeenCalled();
    });
  });

});
