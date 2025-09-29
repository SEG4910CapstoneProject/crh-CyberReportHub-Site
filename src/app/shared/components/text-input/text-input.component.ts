import {
  Component,
  computed,
  effect,
  inject,
  Input,
  input,
  output,
} from '@angular/core';
import { AffixConfig, TextInputConfig, VariantType } from './text-input.model';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  MATERIAL_INPUT_DIRECTIVE_HOST,
  MaterialInputDirective,
} from '../../directives/material-input.directive';

@Component({
  selector: 'crh-text-input',
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: TextInputComponent,
    },
  ],
  hostDirectives: [MATERIAL_INPUT_DIRECTIVE_HOST],
  standalone: false,
})
export class TextInputComponent implements ControlValueAccessor {
  protected materialInputDirective = inject(MaterialInputDirective);

  public config = input<TextInputConfig>();
  public _onValueChanged = output<string | undefined>();

  @Input() type:
    | 'text'
    | 'password'
    | 'email'
    | 'number'
    | 'search'
    | 'tel'
    | 'url' = 'text';

  @Input() autocomplete?: string;

  @Input()
  set value(value: string | undefined) {
    this.materialInputDirective.writeValue(value);
  }

  protected variantSignal = computed<VariantType>(() => {
    const variant = this.config()?.variant;
    return variant ?? 'input';
  });

  protected prefixConfig = computed<AffixConfig | undefined>(() => {
    const prefix = this.config()?.prefix;
    return this.setAffixDefaults(prefix);
  });

  protected suffixConfig = computed<AffixConfig | undefined>(() => {
    const suffix = this.config()?.suffix;
    return this.setAffixDefaults(suffix);
  });

  constructor() {
    effect(() => {
      const content = this.materialInputDirective.fieldContent();
      this._onValueChanged.emit(content);
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

  private setAffixDefaults(
    config: AffixConfig | undefined
  ): AffixConfig | undefined {
    if (!config) {
      return undefined;
    }

    return {
      value: config.value,
      affixType: config.affixType ?? 'clickable-icon',
      onClick: config.onClick ?? ((): void => undefined),
      ariaLabel: config.ariaLabel,
    };
  }
}
