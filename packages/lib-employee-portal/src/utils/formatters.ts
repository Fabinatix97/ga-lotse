/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Nullable } from "@eshg/lib-portal/types/utility";
import { isNullish } from "remeda";

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

/**
 * Like `String.join(sep)` or remeda's join, but ignore `null` and `undefined`
 * array entries, and return `undefined` if _all_ entries are `null` or
 * `undefined`.
 */
export function formatList(
  values: (string | null | undefined)[],
  separator = ",",
): string | undefined {
  return values.filter(Boolean).join(separator) || undefined;
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
