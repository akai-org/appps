export const relativeTimeFormatter = new Intl.RelativeTimeFormat("pl", {
  numeric: "auto",
});

export function getRelativeTime(
  date: string | number | Date,
  smallestDuration: Duration = Duration.Second,
) {
  const timeDifferenceInMs = new Date().getTime() - new Date(date).getTime();
  const { unit, time } = getTimeUnit(timeDifferenceInMs, smallestDuration);
  const formatedTime = relativeTimeFormatter.format(-time, unit);
  return formatedTime;
}

/**
 * Duration in milliseconds
 */
export enum Duration {
  Second = 1000,
  Minute = 1000 * 60,
  Hour = 1000 * 60 * 60,
  Day = 1000 * 60 * 60 * 24,
  Month = (1000 * 60 * 60 * 24 * 365) / 12,
  Year = 1000 * 60 * 60 * 24 * 365,
}

/**
 * Converts milliseconds to the largest appropriate unit and rounds the value down
 *
 * @example getTimeUnit(1000 * 2.5) // { unit: "second", time: 2 } -> 2.5 seconds is rounded down to 2 seconds
 * @param time milliseconds
 * @param smallestDuration minimum duration to return
 * @returns time in the largest appropriate unit + the unit itself
 */
function getTimeUnit(
  time: number,
  smallestDuration: Duration = Duration.Second,
): { unit: Intl.RelativeTimeFormatUnit; time: number } {
  let unit: Intl.RelativeTimeFormatUnit = "year";
  if (time < Duration.Minute && smallestDuration <= Duration.Second) {
    unit = "second";
    time /= Duration.Second;
  } else if (time < Duration.Hour && smallestDuration <= Duration.Minute) {
    unit = "minute";
    time /= Duration.Minute;
  } else if (time < Duration.Day && smallestDuration <= Duration.Hour) {
    unit = "hour";
    time /= Duration.Hour;
  } else if (time < Duration.Month && smallestDuration <= Duration.Day) {
    unit = "day";
    time /= Duration.Day;
  } else if (time < Duration.Year && smallestDuration <= Duration.Month) {
    unit = "month";
    time /= Duration.Month;
  } else {
    time /= Duration.Year;
  }
  return { unit: unit, time: Math.floor(time) };
}
