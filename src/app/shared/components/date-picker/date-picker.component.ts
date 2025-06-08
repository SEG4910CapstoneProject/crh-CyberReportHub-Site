import {
  Component,
  computed,
  effect,
  inject,
  Input,
  output,
} from '@angular/core';
import { DateTime } from 'luxon';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import {
  MATERIAL_INPUT_DIRECTIVE_HOST,
  MaterialInputDirective,
} from '../../directives/material-input.directive';
import { CrhTranslationService } from '../../services/crh-translation.service';
import { DateUtilsService } from '../../services/date-utils.service';

@Component({
    selector: 'crh-date-picker',
    templateUrl: './date-picker.component.html',
    styleUrl: './date-picker.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: DatePickerComponent,
        },
        provideLuxonDateAdapter({
            parse: {
                dateInput: 'yyyy-MM-dd',
            },
            display: {
                dateInput: 'yyyy-MM-dd',
                monthYearLabel: 'yyyy',
                dateA11yLabel: 'MM',
                monthYearA11yLabel: 'yyyy',
            },
        }),
    ],
    hostDirectives: [MATERIAL_INPUT_DIRECTIVE_HOST],
    standalone: false
})
export class DatePickerComponent implements ControlValueAccessor {
  private readonly DATE_ICON_ARIA_KEY = 'datePicker.iconAria';
  protected readonly DATE_FORMAT_HINT = 'YYYY-MM-DD';

  protected materialInputDirective = inject(MaterialInputDirective);
  private translateService = inject(CrhTranslationService);
  private dateUtilsService = inject(DateUtilsService);
  public onDateChange = output<DateTime>();

  @Input()
  set value(value: DateTime | undefined) {
    this.materialInputDirective.writeValue(value);
  }

  constructor() {
    effect(() => {
      const content = this.materialInputDirective.fieldContent();
      this.onDateChange.emit(content);
    });
  }

  protected dateIconAriaTranslation$ =
    this.translateService.getTranslationFromKeyAsStream(
      this.DATE_ICON_ARIA_KEY
    );

  protected activeError = computed<string | undefined>(() => {
    const content = this.materialInputDirective.fieldContent();
    if (this.dateUtilsService.getDateFromString(content) === undefined) {
      return this.DATE_FORMAT_HINT;
    }

    return this.materialInputDirective.activeError();
  });

  writeValue(obj: DateTime | undefined): void {
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
}
