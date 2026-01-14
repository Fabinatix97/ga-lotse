/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { type Locale, formatDistanceStrict } from "date-fns";
import { isNullish } from "remeda";

import { Nullable } from "@eshg/lib-portal";

import { getDateFnsLocale } from "./dateTime";

export function formatSchoolYear(schoolYear: Nullable<number>): string {
  if (isNullish(schoolYear)) {
    return "";
  }

  const nextYear = schoolYear + 1;
  return `${yearShort(schoolYear)}/${yearShort(nextYear)}`;
}

function yearShort(year: number) {
  return year.toString().slice(-2);
}

export function formatBoolean(value: boolean | undefined) {
  if (value === undefined) {
    return "";
  }

  return value ? "Ja" : "Nein";
}

type CountFormatter = (count: number) => string;

export function createCountFormatter(
  singular: string,
  plural: string,
): CountFormatter {
  return function formatCount(count: number): string {
    if (count === 1) {
      return `${count} ${singular}`;
    }

    return `${count} ${plural}`;
  };
}

export function formatDurationFromNowUntil(
  date: Date,
  options?: { locale: Locale },
) {
  const now = new Date();
  return date > now
    ? formatDistanceStrict(date, now, {
        locale: options?.locale ?? getDateFnsLocale(),
      })
    : undefined;
}
