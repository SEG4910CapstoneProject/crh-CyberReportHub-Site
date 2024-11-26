import { DateTime } from 'luxon';

export type DateFormat = 'short' | 'iso-short' | 'iso';

export const dateFormatMap: Record<
  DateFormat,
  (datetime: DateTime) => string | null
> = {
  'short': dateTime => dateTime.toFormat('yyyy/LL/dd'),
  'iso-short': dateTime => dateTime.toISODate(),
  'iso': dateTime => dateTime.toISO(),
};
