/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiInspectionAppointment } from "@eshg/employee-portal-api/inspection";
import { formatDate, formatTime } from "@eshg/lib-portal/formatters/dateTime";
import { isNonNullish } from "remeda";

export function getFormattedAppointmentParts(
  appointment: ApiInspectionAppointment | undefined,
) {
  const date = isNonNullish(appointment?.start)
    ? formatDate(appointment.start)
    : undefined;
  const from = isNonNullish(appointment?.start)
    ? formatTime(appointment.start)
    : undefined;
  const to = isNonNullish(appointment?.end)
    ? formatTime(appointment.end)
    : undefined;
  const fromTo =
    isNonNullish(from) && isNonNullish(to)
      ? `${from} Uhr bis ${to} Uhr`
      : undefined;
  const dateAndTime = date && fromTo ? `${date}, ${fromTo}` : undefined;
  return { date, from, to, fromTo, dateAndTime };
}
