/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAppointmentType } from "@eshg/employee-portal-api/schoolEntry";
import { isEmptyString } from "@eshg/lib-portal/helpers/guards";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { isBefore, isEqual, isPast } from "date-fns";
import { FormikErrors } from "formik";
import { isEmpty } from "remeda";

import {
  ExaminationDurations,
  calculateAppointmentsPerBlock,
  getAppointmentDurationInMinutes,
} from "@/lib/businessModules/schoolEntry/features/appointmentBlocks/appointmentBlocksGroupForm/calculateAppointmentCount";
import { AppointmentBlockValues } from "@/lib/shared/components/appointmentBlocks/AppointmentBlockForm";
import { toLocalDateTime } from "@/lib/shared/helpers/dateTime";

export function validateAppointmentBlock(
  type: OptionalFieldValue<ApiAppointmentType>,
  appointmentBlock: AppointmentBlockValues,
  examinationDurations: ExaminationDurations,
) {
  const errors: FormikErrors<AppointmentBlockValues> = {};
  if (isEmpty(appointmentBlock.date) || isEmpty(appointmentBlock.startTime)) {
    return errors;
  }

  const start = toLocalDateTime(
    appointmentBlock.date,
    appointmentBlock.startTime,
  );

  if (isPast(start)) {
    errors.startTime = "Die Startzeit liegt in der Vergangenheit.";
  }

  if (isEmpty(appointmentBlock.endTime)) {
    return errors;
  }

  const end = toLocalDateTime(appointmentBlock.date, appointmentBlock.endTime);

  if (isEqual(start, end)) {
    errors.endTime = "Die Endzeit ist identisch zur Startzeit.";
  } else if (isBefore(end, start)) {
    errors.endTime = "Die Endzeit liegt vor der Startzeit.";
  } else if (
    !isEmptyString(type) &&
    calculateAppointmentsPerBlock(
      getAppointmentDurationInMinutes(type, examinationDurations),
      start,
      end,
    ) === 0
  ) {
    const appointmentDurationInMinutes = getAppointmentDurationInMinutes(
      type,
      examinationDurations,
    );
    errors.endTime = `Die Dauer ist nicht teilbar durch die Terminlänge von ${appointmentDurationInMinutes} Minuten.`;
  }

  return errors;
}
