/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export const CalendarViewTypes = {
  DayGridMonth: "dayGridMonth",
  TimeGridWeek: "timeGridWeek",
  TimeGridDay: "timeGridDay",
  ListMonth: "listMonth",
} as const;

export type CalendarViewType =
  (typeof CalendarViewTypes)[keyof typeof CalendarViewTypes];
