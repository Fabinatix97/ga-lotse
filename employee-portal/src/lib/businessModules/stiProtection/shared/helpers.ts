/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentType,
  ApiConcern,
} from "@eshg/employee-portal-api/stiProtection";

export function concernToAppointmentType(
  concern: ApiConcern,
): ApiAppointmentType {
  switch (concern) {
    case ApiConcern.HivStiConsultation:
      return ApiAppointmentType.HivStiConsultation;
    case ApiConcern.SexWork:
      return ApiAppointmentType.SexWork;
  }
}

export function mapOptional<T, K>(
  val: T | undefined | null,
  predicate: (t: T) => K,
): K | undefined {
  if (val == null) {
    return;
  }
  return predicate(val);
}

export function optionalInt(num: string | undefined): number | undefined {
  if (num == null) {
    return;
  }
  const parsed = parseInt(num, 10);
  return !isNaN(parsed) ? parsed : undefined;
}

export type NoUndefined<T> = T extends object
  ? {
      [K in keyof T]: Exclude<T[K], undefined>;
    }
  : never;
export function deleteUndefined<T extends object>(obj: T): NoUndefined<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_key, value]) => value !== undefined),
  ) as NoUndefined<T>;
}
