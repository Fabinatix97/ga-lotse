/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointment,
  ApiAppointmentHistoryEntry,
  ApiAppointmentStatus,
  ApiAppointmentType,
  ApiConcern,
} from "@eshg/sti-protection-api";

export enum OverviewAppointmentType {
  UPCOMING = "upcoming",
  PAST = "past",
}

export interface ApiAppointmentSummary extends Omit<ApiAppointment, "end"> {
  appointmentType: ApiAppointmentType;
  appointmentStatus?: ApiAppointmentStatus;
  end?: Date;
}

export function mapAppointmentToSummary(
  appointment: ApiAppointment,
  concern: ApiConcern,
): ApiAppointmentSummary {
  return {
    ...appointment,
    appointmentStatus: ApiAppointmentStatus.Open,
    appointmentType:
      concern === ApiConcern.HivStiConsultation
        ? ApiAppointmentType.HivStiConsultation
        : ApiAppointmentType.SexWork,
  };
}

export function mapAppointmentHistoryEntryToSummary({
  appointmentStart,
  ...apptHistory
}: ApiAppointmentHistoryEntry): ApiAppointmentSummary {
  return {
    ...apptHistory,
    start: appointmentStart,
  };
}
