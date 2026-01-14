/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { differenceInMinutes, isPast } from "date-fns";

import { formatDate, formatTime, isNonEmptyString } from "@eshg/lib-portal";
import {
  ApiAppointmentBookingType,
  ApiPersonLanguage,
  ApiProcedureDetails,
  ApiProcedureStatus,
} from "@eshg/prostitute-protection-api";

import { AddNewProcedureForm } from "../components/procedures/addNewProcedure/useAddNewProcedureSidebar";
import { EditProcedureDetailsDataForm } from "../components/procedures/details/sidebar/EditAdditionalDataSidebar";

import { LANGUAGE_VALUE } from "./constants";

export function validateDateTimeIsTodayOrFuture(value?: string) {
  if (value && isPast(value)) {
    return "Das Datum liegt in der Vergangenheit.";
  }

  return undefined;
}

export function isProcedureOpen(procedure: ApiProcedureDetails) {
  return procedure.procedureStatus !== ApiProcedureStatus.Closed;
}

export function isProcedureClosed(procedure: ApiProcedureDetails) {
  return !isProcedureOpen(procedure);
}

export function isProcedureAborted(procedure: ApiProcedureDetails) {
  return procedure.procedureStatus === ApiProcedureStatus.Aborted;
}

export function isProcedureFinalized(procedure: ApiProcedureDetails) {
  return (
    procedure.procedureStatus === ApiProcedureStatus.Closed ||
    procedure.procedureStatus === ApiProcedureStatus.Aborted
  );
}

export function formatLanguages(languages: ApiPersonLanguage[]) {
  const languagesArray = languages
    ? [...languages]
        .filter((lang) => lang !== ApiPersonLanguage.German)
        .map((lang) => LANGUAGE_VALUE[lang])
    : [];

  return languagesArray.length > 0 ? languagesArray.join(", ") : "-";
}

export function formatAppointmentWithDuration(start?: Date, end?: Date) {
  if (!start) {
    return "-";
  }

  const dateTime = `${formatDate(start, "de")}, ${formatTime(start, "de")} Uhr`;
  const durationMinutes = getDurationMinutes(start, end);

  return `${dateTime}, Dauer ${durationMinutes} Min.`;
}

export function getDurationMinutes(start?: Date, end?: Date): number {
  if (!start || !end) {
    return 0;
  }
  return differenceInMinutes(end, start);
}

export function hasSufficientGermanLanguageSkills(
  languages?: ApiPersonLanguage[],
): string {
  if (!languages || languages.length === 0) {
    return "-";
  }
  return languages.includes(ApiPersonLanguage.German) ? "Ja" : "Nein";
}

export function getAppointmentDate(
  form: AddNewProcedureForm | EditProcedureDetailsDataForm,
) {
  const customAppointmentDate = isNonEmptyString(form.customAppointmentDate)
    ? new Date(form.customAppointmentDate)
    : undefined;
  const date =
    form.appointmentBookingType === ApiAppointmentBookingType.AppointmentBlock
      ? form.blockAppointment?.start
      : customAppointmentDate;
  return date ?? undefined;
}

export function getDuration(
  form: AddNewProcedureForm | EditProcedureDetailsDataForm,
) {
  if (
    form.appointmentBookingType === ApiAppointmentBookingType.AppointmentBlock
  ) {
    return form.blockAppointment?.end && form.blockAppointment?.start
      ? differenceInMinutes(
          form.blockAppointment.end,
          form.blockAppointment.start,
        )
      : undefined;
  }
  return form.duration;
}
