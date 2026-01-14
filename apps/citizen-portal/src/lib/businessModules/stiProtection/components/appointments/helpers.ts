/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isSameSecond } from "date-fns";

import {
  ApiAppointment,
  ApiAppointmentHistoryEntry,
} from "@eshg/sti-protection-api";

export const OverviewAppointmentType = {
  UPCOMING: "upcoming",
  PAST: "past",
} as const;
export type OverviewAppointmentType =
  (typeof OverviewAppointmentType)[keyof typeof OverviewAppointmentType];

export interface ApiAppointmentSummary extends ApiAppointmentHistoryEntry {
  appointmentEnd?: Date;
}

export function mapAppointmentHistoryEntryToSummary(
  currentAppointment: ApiAppointment | undefined,
  entry: ApiAppointmentHistoryEntry,
): ApiAppointmentSummary {
  if (
    currentAppointment &&
    isSameSecond(currentAppointment.start, entry.appointmentStart)
  ) {
    return {
      ...entry,
      appointmentEnd: currentAppointment.end,
    };
  }
  return entry;
}
