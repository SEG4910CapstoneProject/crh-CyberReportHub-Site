import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root',
})
export class DateUtilsService {
  public getDateFromString(value: string | undefined): DateTime | undefined {
    if (!value) {
      return undefined;
    }

    const date = DateTime.fromISO(value);
    return date.isValid ? date : undefined;
  }
}
