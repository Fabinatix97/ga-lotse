/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAppointmentType } from "@eshg/employee-portal-api/schoolEntry";
import { isEmptyString } from "@eshg/lib-portal/helpers/guards";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { intervalToDuration } from "date-fns";

export function calculateAppointmentsPerBlock(
  appointmentDurationInMinutes: number,
  start: Date,
  end: Date,
) {
  const blockDurationInMinutes = getBlockDurationInMinutes(start, end);
  const appointmentCount =
    blockDurationInMinutes / appointmentDurationInMinutes;
  return Number.isInteger(appointmentCount) ? appointmentCount : 0;
}

function getBlockDurationInMinutes(start: Date, end: Date) {
  const { hours = 0, minutes = 0 } = intervalToDuration({
    start,
    end,
  });
  return hours * 60 + minutes;
}

export type ExaminationDurations = Partial<Record<ApiAppointmentType, number>>;

export function getAppointmentDurationInMinutes(
  type: OptionalFieldValue<ApiAppointmentType>,
  examinationDurations: ExaminationDurations,
) {
  return isEmptyString(type) ? 0 : (examinationDurations[type] ?? 0);
}
