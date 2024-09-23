/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isDateString } from "@eshg/lib-portal/helpers/dateTime";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { subYears } from "date-fns";
import { isDefined } from "remeda";

export function createFieldNameMapper<T = Record<string, unknown>>(
  rootPath?: string,
) {
  return (fieldName: string & keyof T) =>
    isDefined(rootPath) ? `${rootPath}.${fieldName}` : fieldName;
}

export function mapOptionalValue<T>(
  value: OptionalFieldValue<T>,
): T | undefined {
  return value === "" ? undefined : value;
}

export function isAdult(dateOfBirth: Date) {
  const eighteenYearsAgo = subYears(new Date(), 18);
  return dateOfBirth <= eighteenYearsAgo;
}

export function toUtcDate(date: string) {
  if (!isDateString(date)) {
    throw new Error(`Invalid date string '${date}'`);
  }
  const utcDate = new Date(`${date}T00:00:00Z`);
  return utcDate;
}
