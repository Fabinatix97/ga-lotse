/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentHistoryEntry,
  ApiAppointmentType,
  ApiConcern,
  ApiStiProtectionProcedure,
  ApiStiProtectionProcedureOverview,
} from "@eshg/employee-portal-api/stiProtection";

export function concernToAppointmentType(
  concern: ApiConcern | "RESULTS_REVIEW",
): ApiAppointmentType {
  switch (concern) {
    case ApiConcern.HivStiConsultation:
      return ApiAppointmentType.HivStiConsultation;
    case ApiConcern.SexWork:
      return ApiAppointmentType.SexWork;
    case "RESULTS_REVIEW":
      return ApiAppointmentType.ResultsReview;
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

export function isProcedureOpen(
  procedure: ApiStiProtectionProcedure | ApiStiProtectionProcedureOverview,
) {
  return procedure.status !== "CLOSED";
}

export function createOnlyIfProcedureOpen(
  procedure: ApiStiProtectionProcedure | ApiStiProtectionProcedureOverview,
) {
  const isOpen = isProcedureOpen(procedure);
  return function onlyIfOpen<T>(t: T) {
    if (!isOpen) {
      return;
    }
    return t;
  };
}

export function guardValue<T>(
  guard: boolean | null | undefined,
  value: T,
): T | undefined {
  return guard ? value : undefined;
}

export function getOpenAppointmentsFromProcedure(
  procedure: ApiStiProtectionProcedure,
): ApiAppointmentHistoryEntry[] {
  let openAppointments: ApiAppointmentHistoryEntry[] = [];

  if (procedure) {
    openAppointments = procedure.appointmentHistory.filter(
      ({ appointmentStatus }) => appointmentStatus === "OPEN",
    );
  }

  return openAppointments;
}
