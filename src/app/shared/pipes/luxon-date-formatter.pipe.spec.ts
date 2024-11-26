import { DateTime } from 'luxon';
import { DateFormat } from './luxon-date-formatter.models';
import { LuxonDateFormatterPipe } from './luxon-date-formatter.pipe';

describe('LuxonDatePipe', () => {
  const dateToTest = DateTime.utc(2024, 7, 10);

  it('create an instance', () => {
    const pipe = new LuxonDateFormatterPipe();
    expect(pipe).toBeTruthy();
  });

  it.each([
    {
      format: 'short',
      expected: '2024/07/10',
    },
    {
      format: 'iso',
      expected: '2024-07-10T00:00:00.000Z',
    },
    {
      format: 'iso-short',
      expected: '2024-07-10',
    },
  ] satisfies { format: DateFormat; expected: string }[])(
    'should correctly format date type $format',
    ({ format, expected }) => {
      const pipe = new LuxonDateFormatterPipe();
      const actual = pipe.transform(dateToTest, format);
      expect(actual).toEqual(expected);
    }
  );

  it('should support null and undefined values', () => {
    const pipe = new LuxonDateFormatterPipe();
    expect(pipe.transform(null, 'iso')).toBeNull();
    expect(pipe.transform(undefined, 'iso')).toBeNull();
  });
});
