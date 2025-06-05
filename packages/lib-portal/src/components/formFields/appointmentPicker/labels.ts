/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppointmentPickerFieldLabels } from "./AppointmentPickerField";

function dateFormatter(locale: string) {
  return Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export const APPOINTMENT_PICKER_FIELD_LABELS_DE = {
  requiredAppointment: "Bitte einen Termin auswählen",
  requiredDay: "Bitte einen Tag auswählen",
  monthSelection: "Termin Kalendermonat",
  nextMonth: "zum nächsten Monat",
  prevMonth: "zum vorherigen Monat",
  listLabel: (date: Date, locale: string) =>
    `Verfügbare Termine: ${dateFormatter(locale).format(date)}`,
} as const satisfies AppointmentPickerFieldLabels;
