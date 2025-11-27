/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { differenceInMinutes, format, isPast } from "date-fns";
import { de } from "date-fns/locale";

import {
  ApiPersonLanguage,
  ApiProcedureDetails,
  ApiProcedureStatus,
} from "@eshg/prostitute-protection-api";

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
        .sort((a, b) =>
          a === ApiPersonLanguage.German
            ? -1
            : b === ApiPersonLanguage.German
              ? 1
              : 0,
        )
        .map((lang) => LANGUAGE_VALUE[lang])
    : [];

  return languagesArray.join(", ");
}

export function formatAppointmentTime(date?: Date) {
  if (!date) {
    return "-";
  }
  return `${format(date, "dd.MM.yyyy", { locale: de })}, ${format(date, "HH:mm", { locale: de })} Uhr`;
}

export function getDurationMinutes(start?: Date, end?: Date): number {
  if (!start || !end) {
    return 0;
  }
  return differenceInMinutes(end, start);
}

export function formatDuration(start?: Date, end?: Date) {
  const durationMinutes = getDurationMinutes(start, end);
  if (durationMinutes === 0) {
    return "-";
  }
  return `${durationMinutes} min`;
}
