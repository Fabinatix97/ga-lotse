/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppointmentPickerFieldLabels } from "./AppointmentPickerField";

const dateFormatter = Intl.DateTimeFormat(undefined, {
  weekday: "short",
  day: "numeric",
  month: "long",
  year: "numeric",
});
export const FIELD_LABELS_DE = {
  requiredAppointment: "Bitte einen Termin auswählen",
  requiredDay: "Bitte ein Tag auswählen",
  monthSelection: "Termin Kalendermonat",
  nextMonth: "zum nächsten Monat",
  prevMonth: "zum vorherigen Monat",
  listLabel: (date: Date) =>
    `Verfügbare Termine: ${dateFormatter.format(date)}`,
} as const satisfies AppointmentPickerFieldLabels;
