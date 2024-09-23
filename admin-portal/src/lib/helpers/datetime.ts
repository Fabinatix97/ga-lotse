/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export function days(n: number) {
  return 1000 * 60 * 60 * 24 * n;
}

export function hours(n: number) {
  return 1000 * 60 * 60 * n;
}

export function minutes(n: number) {
  return 1000 * 60 * n;
}

export function DateAdjustedForLocalTimeZoneIfNoTime(date: string): Date {
  if (date.length > 10) {
    // time already specified
    return new Date(date);
  }
  // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format
  // > When the time zone offset is absent, date-only forms are interpreted
  // > as a UTC time and date-time forms are interpreted as local time.
  // So the following effectively makes the date local.
  //
  // Example:
  // - The user enters "2024-08-12".
  // - On that day the user's timezone is UTC+02:00.
  //
  // Then this date is short for "2024-08-12T00:00:00.000+02:00", which in
  // UTC is "2024-08-11T22:00:00.000Z".
  return new Date(date + "T00:00:00");
}
