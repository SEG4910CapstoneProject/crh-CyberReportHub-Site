import { Pipe, PipeTransform } from '@angular/core';
import { DateFormat, dateFormatMap } from './luxon-date-formatter.models';
import { DateTime } from 'luxon';

@Pipe({
  name: 'luxonDateFormatter',
})
export class LuxonDateFormatterPipe implements PipeTransform {
  transform(
    value: DateTime | null | undefined,
    format: DateFormat
  ): string | null {
    if (value === null || value === undefined) {
      return null;
    }
    return dateFormatMap[format](value);
  }
}
