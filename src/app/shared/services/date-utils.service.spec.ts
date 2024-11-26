import { TestBed } from '@angular/core/testing';

import { DateUtilsService } from './date-utils.service';
import { DateTime } from 'luxon';

describe('DateUtilsService', () => {
  let service: DateUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should convert date string to luxon date', () => {
    const dateString = '2024-02-02';
    const expectedDateObj = DateTime.local(2024, 2, 2);

    const actual = service.getDateFromString(dateString);

    expect(actual).toEqual(expectedDateObj);
  });

  it('should be undefined if value is undefined', () => {
    const actual = service.getDateFromString(undefined);

    expect(actual).toBeUndefined();
  });

  it('should be undefined if date is not valid', () => {
    const actual = service.getDateFromString('bad date string');

    expect(actual).toBeUndefined();
  });
});
