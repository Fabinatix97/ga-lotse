/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { differenceInCalendarDays, isBefore, isEqual, isPast } from "date-fns";
import { FormikErrors } from "formik";
import { isDefined, isEmpty, unique } from "remeda";

import { OptionalFieldValue } from "@eshg/lib-portal";

import {
  formatTimeInput,
  isAfterTime,
  isBeforeTime,
  parseTime,
  toLocalDateTime,
} from "../../utils/dateTime";

import { AppointmentBlockGroupValuesWithDays } from "./AppointmentBlockFormWithDays";
import { AppointmentBlock } from "./AppointmentBlockGroup";
import {
  calculateAppointmentsPerBlock,
  getAppointmentDurationInMinutes,
} from "./calculateAppointmentCount";
import { calculateMaxParallelBookings } from "./calculateMaxParallelBookings";
import { ApiAppointmentType } from "./types";

const MAX_DAYS_IN_APPOINTMENT_BLOCK = 31;
export type ExaminationDurations = Partial<Record<ApiAppointmentType, number>>;

export function validateAppointmentBlock(
  types: ApiAppointmentType[],
  appointmentBlock: AppointmentBlockGroupValuesWithDays,
  examinationDurations: ExaminationDurations,
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
    types.every(
      (type) =>
        calculateAppointmentsPerBlock(
          type,
          start,
          end,
          examinationDurations,
        ) === 0,
    )
  ) {
    const appointmentDurationInMinutes =
      unique(
        types.map((type) =>
          getAppointmentDurationInMinutes(type, examinationDurations),
        ),
      ).join(", ") + " Minuten";
    errors.endTime = `Die Dauer ist nicht teilbar durch die Terminlängen: ${appointmentDurationInMinutes}.`;
  }

  return errors;
}

export function validateAppointmentStartTime(
  value: string,
  appointmentBlock: AppointmentBlock,
) {
  if (isBeforeTime(value, formatTimeInput(appointmentBlock.start))) {
    return "Die Startzeit muss im Terminblock liegen.";
  }
  const bookedAppointments = appointmentBlock.bookedAppointments;
  if (isDefined(bookedAppointments) && bookedAppointments.length > 0) {
    const earliestBookedAppointment = bookedAppointments.toSorted(
      (a, b) => a.start.getTime() - b.start.getTime(),
    )[0];

    if (isAfterTime(value, formatTimeInput(earliestBookedAppointment!.start))) {
      return "Es sind bereits Termine vor dieser Zeit gebucht.";
    }
  }
  return undefined;
}

export function validateAppointmentEndTime(
  value: string,
  startTime: string,
  appointmentBlock: AppointmentBlock,
  types: ApiAppointmentType[],
  standardDurations: Partial<Record<ApiAppointmentType, number>>,
) {
  if (!isAfterTime(value, startTime)) {
    return "Die Endzeit muss nach der Startzeit liegen.";
  }

  if (isAfterTime(value, formatTimeInput(appointmentBlock.end))) {
    return "Die Endzeit muss im Terminblock liegen.";
  }

  const bookedAppointments = appointmentBlock.bookedAppointments;
  if (isDefined(bookedAppointments) && bookedAppointments.length > 0) {
    const latestBookedAppointment = bookedAppointments.toSorted(
      (a, b) => b.end.getTime() - a.end.getTime(),
    )[0];

    if (isBeforeTime(value, formatTimeInput(latestBookedAppointment!.end))) {
      return "Es sind bereits Termine nach dieser Zeit gebucht.";
    }
  }

  if (
    types.every(
      (type) =>
        calculateAppointmentsPerBlock(
          type,
          parseTime(startTime, appointmentBlock.start),
          parseTime(value, appointmentBlock.end),
          standardDurations,
        ) === 0,
    )
  ) {
    const appointmentDurationInMinutes =
      unique(
        types.map((type) =>
          getAppointmentDurationInMinutes(type, standardDurations),
        ),
      ).join(", ") + " Minuten";
    return `Die Dauer ist nicht teilbar durch die Terminlängen: ${appointmentDurationInMinutes}.`;
  }
  return undefined;
}

export function validateParallelExaminations(
  value: OptionalFieldValue<number>,
  appointmentBlock: AppointmentBlock,
) {
  if (typeof value !== "number") {
    return "Bitte die Anzahl paralleler Untersuchungen angeben.";
  }
  if (value < 1) {
    return "Die Anzahl der parallelen Untersuchungen muss mindestens 1 betragen.";
  }
  if (value > 10) {
    return "Die Anzahl der parallelen Untersuchungen darf höchstens 10 betragen.";
  }
  if (value > appointmentBlock.parallelExaminations!) {
    return "Die Anzahl der parallelen Untersuchungen kann nicht erhöht werden.";
  }

  if (isDefined(appointmentBlock.bookedAppointments)) {
    const maxParallelBookings = calculateMaxParallelBookings(
      appointmentBlock.bookedAppointments,
    );
    if (value < maxParallelBookings) {
      return `Die Anzahl der parallelen Untersuchungen muss mindestens gleich der maximalen Anzahl der gleichzeitig gebuchten Termine (${maxParallelBookings}) sein.`;
    }
  }
  return undefined;
}
