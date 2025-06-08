import { Component, effect, inject, input, output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectConfig } from './select.model';
import { MatSelectChange } from '@angular/material/select';
import {
  MATERIAL_INPUT_DIRECTIVE_HOST,
  MaterialInputDirective,
} from '../../directives/material-input.directive';

@Component({
    selector: 'crh-select',
    templateUrl: './select.component.html',
    styleUrl: './select.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: SelectComponent,
        },
    ],
    hostDirectives: [MATERIAL_INPUT_DIRECTIVE_HOST],
    standalone: false
})
export class SelectComponent implements ControlValueAccessor {
  protected materialInputDirective = inject(MaterialInputDirective);

  public config = input<SelectConfig>();
  public value = input<string | undefined>(undefined);
  public onSelectChange = output<string | undefined>();

  constructor() {
    effect(() => {
      const value = this.value();
      this.materialInputDirective.childControl.setValue(value);
      this.onSelectChange.emit(value);
    });
  }

  writeValue(obj: string | undefined): void {
    this.materialInputDirective.writeValue(obj);
  }

  registerOnChange(fn: any): void {
    this.materialInputDirective.registerOnChange(fn);
  }

  registerOnTouched(fn: any): void {
    this.materialInputDirective.registerOnTouched(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.materialInputDirective.setDisabledState(isDisabled);
  }

  protected onSelectChangeEvent(selection: MatSelectChange): void {
    this.onSelectChange.emit(selection.value);
    this.materialInputDirective.fieldContent.set(selection.value);
  }
}
