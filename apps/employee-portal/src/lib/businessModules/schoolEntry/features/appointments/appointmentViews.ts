/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export const AppointmentViewTypes = {
  TimeGridDay: "timeGridDay",
  TimeGridWeek: "timeGridWeek",
  ListMonth: "listMonth",
} as const;

export type AppointmentViewType =
  (typeof AppointmentViewTypes)[keyof typeof AppointmentViewTypes];
