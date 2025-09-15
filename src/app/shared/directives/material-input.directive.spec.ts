import { Component, ComponentRef, inject } from '@angular/core';
import {
  MATERIAL_INPUT_DIRECTIVE_HOST_FULL,
  MaterialInputDirective,
} from './material-input.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorHintConfig } from '../models/input.model';

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
    it('should return no hints if error hints are not defined', () => {
      expect(directive.activeError()).toBeUndefined();
    });

    it('should return error if a error hint is showing errors', () => {
      const expectedHint = 'SomeHint';
      componentRef.setInput('errorHints', [
        {
          hint: expectedHint,
          hasError: (): boolean => true,
        } satisfies ErrorHintConfig,
      ]);

      fixture.detectChanges();

      expect(directive.activeError()).toEqual(expectedHint);
    });

    it('should return error if a error hint is defined but error check undefined', () => {
      const expectedHint = 'SomeHint';
      componentRef.setInput('errorHints', [
        {
          hint: expectedHint,
          hasError: undefined,
        } satisfies ErrorHintConfig,
      ]);

      fixture.detectChanges();

      expect(directive.activeError()).toEqual(expectedHint);
    });

    it('should return undefined if a error hint is not showing errors', () => {
      const expectedHint = 'SomeHint';
      componentRef.setInput('errorHints', [
        {
          hint: expectedHint,
          hasError: (): boolean => false,
        } satisfies ErrorHintConfig,
      ]);

      fixture.detectChanges();

      expect(directive.activeError()).toBeUndefined();
    });
  });

  it('should emit value when value is written', () => {
    const outputSpy = jest.spyOn(directive.onValueChanged, 'emit');

    const expectedValue = 'SomeValue';
    directive.onValueWrite(expectedValue);

    fixture.detectChanges();

    expect(directive.fieldContent()).toEqual(expectedValue);
    expect(outputSpy).toHaveBeenCalledWith(expectedValue);
  });
});
