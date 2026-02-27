/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export const AppointmentViewTypes = {
  TimeGridDay: "timeGridDay",
  TimeGridWeek: "timeGridWeek",
  ListMonth: "listMonth",
} as const;

export type AppointmentViewType =
  (typeof AppointmentViewTypes)[keyof typeof AppointmentViewTypes];
