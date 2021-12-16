import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

class DayJSProvider {
  addSeconds(date: Date, seconds: number): Date {
    return dayjs(date).add(seconds, 'seconds').toDate();
  }

  addHours(date: Date, hours: number): Date {
    return dayjs(date).add(hours, 'hours').toDate();
  }

  addDay(date: Date, days: number): Date {
    return dayjs(date).add(days, 'days').toDate();
  }

  addTime(date: Date, value: number, type: dayjs.ManipulateType): Date {
    return dayjs(date).add(value, type).toDate();
  }

  compareIfBefore(start_date: Date, end_date: Date): boolean {
    return dayjs(start_date).isBefore(end_date);
  }

  compareTime(
    start_date: Date,
    end_date: Date,
    compareIn: ManipulateType,
  ): number {
    const endDateFormat = this.convertToUTC(end_date);
    const startDateFormat = this.convertToUTC(start_date);
    return dayjs(endDateFormat).diff(startDateFormat, compareIn);
  }

  convertToUTC(date: Date | string | number): string {
    return dayjs(date).utc().format();
  }

  dateNow(date?: Date | number | string): Date {
    return dayjs(date).utc().toDate();
  }

  dateMidnight(date?: Date | number) {
    return this.dateNow(dayjs(date).toDate().setHours(0, 0, 0, 0));
  }
}

export { DayJSProvider };

type UnitTypeShort = 'd' | 'M' | 'y' | 'h' | 'm' | 's' | 'ms' | 'w';

type UnitTypeLong =
  | 'millisecond'
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'month'
  | 'year'
  | 'week';

type UnitTypeLongPlural =
  | 'milliseconds'
  | 'seconds'
  | 'minutes'
  | 'hours'
  | 'days'
  | 'months'
  | 'years'
  | 'weeks';

type ManipulateType = UnitTypeLong | UnitTypeLongPlural | UnitTypeShort;
