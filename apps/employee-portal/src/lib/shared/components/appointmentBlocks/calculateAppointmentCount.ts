/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { intervalToDuration } from "date-fns";

import { OptionalFieldValue, isEmptyString } from "@eshg/lib-portal";
import { ApiAppointmentType } from "@eshg/measles-protection-api";

import { AppointmentBlockGroupValuesWithDays } from "@/lib/shared/components/appointmentBlocks/AppointmentBlockFormWithDays";

export interface AppointmentBlockGroupValues {
  types: ApiAppointmentType[];
  appointmentBlocks: AppointmentBlockGroupValuesWithDays[];
}

function getBlockDurationInMinutes(start: Date, end: Date) {
  const { hours = 0, minutes = 0 } = intervalToDuration({
    start,
    end,
  });

  return hours * 60 + minutes;
}

export function calculateAppointmentsPerBlock(
  type: OptionalFieldValue<ApiAppointmentType>,
  start: Date,
  end: Date,
  appointmentDurations: Record<string, number>,
) {
  const blockDurationInMinutes = getBlockDurationInMinutes(start, end);
  const appointmentDurationInMinutes = getAppointmentDurationInMinutes(
    type,
    appointmentDurations,
  );
  const appointmentCount =
    blockDurationInMinutes / appointmentDurationInMinutes;

  return Number.isInteger(appointmentCount) && appointmentCount > 0
    ? appointmentCount
    : 0;
}

export function getAppointmentDurationInMinutes<A extends string>(
  type: OptionalFieldValue<A>,
  appointmentDurations: Record<string, number>,
) {
  return isEmptyString(type) ? 0 : (appointmentDurations[type] ?? 0);
}
