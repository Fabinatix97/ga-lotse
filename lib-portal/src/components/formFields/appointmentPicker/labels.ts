/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppointmentPickerFieldLabels } from "./AppointmentPickerField";

export const FIELD_LABELS_DE = {
  requiredAppointment: "Bitte einen Termin auswählen",
  requiredDay: "Bitte ein Tag auswählen",
  monthSelection: "Termin Kalendermonat",
  nextMonth: "zum nächsten Monat",
  prevMonth: "zum vorherigen Monat",
  listLabel: "Uhrzeit",
  listDescription: (date: string) => `Liste verfügbarer Termine für ${date}`,
} as const satisfies AppointmentPickerFieldLabels;
