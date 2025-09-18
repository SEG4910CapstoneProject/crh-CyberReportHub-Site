import {
  AfterViewInit,
  computed,
  DestroyRef,
  Directive,
  inject,
  Injector,
  input,
  Input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ErrorHintConfig } from '../models/input.model';
import { CrhErrorStateMatcher } from '../class/crh-error-state-matcher';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  selector: '[crhMaterialInput]',
  standalone: true,
})
export class MaterialInputDirective
  implements ControlValueAccessor, AfterViewInit
{
  private injector = inject(Injector);
  private defaultErrorStateMatcher = inject(ErrorStateMatcher);
  private destroyRef = inject(DestroyRef);

  public label = input<string | undefined>(undefined);
  public placeholderText = input<string>('');
  public hint = input<string | undefined>(undefined);
  public errorHints = input<ErrorHintConfig[]>([]);
  public errorStateMatcher = input<ErrorStateMatcher | undefined>(undefined);
  public dynamicHintSection = input<boolean>(false);

  @Input()
  public set disabled(value: boolean) {
    this.setDisabledState(value);
  }

  public _onValueChanged = output<any>();

  public fieldContent = signal<any>(undefined);

  public activeError = computed<string | undefined>(() => {
    const errorHints = this.errorHints();
    for (const errHint of errorHints) {
      if (this.onHasError(errHint)) {
        return errHint.hint;
      }
    }
    return undefined;
  });

  public isFieldDisabled = false;
  private onTouchedFn?: () => void;
  public ngControl!: NgControl;
  public childControl = new FormControl<any>(undefined);

  public onHasError(errorConfig: ErrorHintConfig): boolean {
    // If errors are configuration is not defined, by default we show that error or allow other validator to execute
    const hasError = errorConfig.hasError;
    if (hasError === undefined) {
      return true;
    }
    const content = this.fieldContent();
    return hasError(content);
  }

  public ngAfterViewInit(): void {
    const ngControl = this.injector.get(NgControl, null);
    if (ngControl) {
      setTimeout(() => {
        this.ngControl = ngControl;
        ngControl.control?.events
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            if (ngControl.control?.touched && !this.childControl.touched) {
              this.childControl.markAsTouched();
            }
            if (ngControl.control?.untouched && this.childControl.touched) {
              this.childControl.markAsUntouched();
            }
            if (ngControl.control?.dirty && !this.childControl.dirty) {
              this.childControl.markAsDirty();
            }
            if (ngControl.control?.pristine && this.childControl.dirty) {
              this.childControl.markAsPristine();
            }
          });
      });
    }
  }

  public onValueWrite(value: any): void {
    this.fieldContent.set(value);
    this._onValueChanged.emit(value);
  }

  public onTouched(): void {
    if (this.onTouchedFn) {
      this.onTouchedFn();
      this.childControl.markAsTouched();
    }
  }

  public writeValue(obj: any): void {
    this.childControl.setValue(obj);
    this.fieldContent.set(obj);
  }

  public registerOnChange(fn: (value: any) => void): void {
    this.childControl.valueChanges.subscribe(fn);
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isFieldDisabled = isDisabled;
    if (isDisabled) {
      this.childControl.disable();
    } else {
      this.childControl.enable();
    }
  }

  public getErrorMatcher(): ErrorStateMatcher {
    const definedStateMatcher = this.errorStateMatcher();
    if (definedStateMatcher) {
      return definedStateMatcher;
    }
    if (this.ngControl) {
      return new CrhErrorStateMatcher(this.childControl, this.ngControl);
    }
    return this.defaultErrorStateMatcher;
  }
}

export const MATERIAL_INPUT_DIRECTIVE_HOST = {
  directive: MaterialInputDirective,
  inputs: [
    'label',
    'placeholderText',
    'hint',
    'errorHints',
    'errorStateMatcher',
    'disabled',
    'dynamicHintSection',
  ],
};

export const MATERIAL_INPUT_DIRECTIVE_HOST_FULL = {
  directive: MaterialInputDirective,
  inputs: [...MATERIAL_INPUT_DIRECTIVE_HOST.inputs],
  outputs: ['_onValueChanged'],
};
