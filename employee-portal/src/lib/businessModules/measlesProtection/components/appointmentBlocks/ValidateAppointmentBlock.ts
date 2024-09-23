/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAppointmentType } from "@eshg/employee-portal-api/schoolEntry";
import { isEmptyString } from "@eshg/lib-portal/helpers/guards";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { differenceInCalendarDays, isBefore, isEqual, isPast } from "date-fns";
import { FormikErrors } from "formik";
import { isEmpty } from "remeda";

import { AppointmentDurationsMeasles } from "@/lib/businessModules/measlesProtection/api/models/AppointmentBlockGroup";
import { getAppointmentDurationInMinutes } from "@/lib/businessModules/measlesProtection/shared/helper";
import { AppointmentBlockGroupValuesWithDays } from "@/lib/shared/components/appointmentBlocks/AppointmentBlockFormWithDays";
import { calculateAppointmentsPerBlock } from "@/lib/shared/components/appointmentBlocks/AppointmentCountWithDays";
import { toLocalDateTime } from "@/lib/shared/helpers/dateTime";

const MAX_DAYS_IN_APPOINTMENT_BLOCK = 31;

export function validateAppointmentBlock(
  type: OptionalFieldValue<ApiAppointmentType>,
  appointmentBlock: AppointmentBlockGroupValuesWithDays,
  appointmentDurationsMeasles: AppointmentDurationsMeasles,
) {
  const { startDate, endDate, startTime, endTime, daysOfWeek } =
    appointmentBlock;
  const errors: FormikErrors<AppointmentBlockGroupValuesWithDays> = {};
  if (
    isEmpty(startDate) ||
    isEmpty(endDate) ||
    isEmpty(startTime) ||
    isEmpty(endTime) ||
    !daysOfWeek.length
  ) {
    return errors;
  }

  const start = toLocalDateTime(startDate, startTime);

  if (isPast(start)) {
    errors.startTime = "Die Startzeit liegt in der Vergangenheit.";
  }

  const end = toLocalDateTime(endDate, endTime);
  const dailyStartTime = toLocalDateTime(startDate, startTime);
  const dailyEndTime = toLocalDateTime(startDate, endTime);

  if (isEqual(dailyStartTime, dailyEndTime)) {
    errors.endTime = "Die Endzeit ist identisch zur Startzeit.";
  } else if (isBefore(dailyEndTime, dailyStartTime)) {
    errors.endTime = "Die Endzeit liegt vor der Startzeit.";
  } else if (isBefore(end, start)) {
    errors.endDate = "Das Enddatum liegt vor dem Startdatum.";
  } else if (
    differenceInCalendarDays(endDate, startDate) > MAX_DAYS_IN_APPOINTMENT_BLOCK
  ) {
    errors.endDate = `Der Datumsbereich für einen Terminblock ist auf ${MAX_DAYS_IN_APPOINTMENT_BLOCK} Tage begrenzt.`;
  } else if (
    !isEmptyString(type) &&
    calculateAppointmentsPerBlock(
      ApiAppointmentType.ProofSubmission,
      start,
      end,
      appointmentDurationsMeasles,
    ) === 0
  ) {
    const appointmentDurationInMinutes = getAppointmentDurationInMinutes(
      type,
      appointmentDurationsMeasles,
    );
    errors.endTime = `Die Dauer ist nicht teilbar durch die Terminlänge von ${appointmentDurationInMinutes} Minuten.`;
  }

  return errors;
}
