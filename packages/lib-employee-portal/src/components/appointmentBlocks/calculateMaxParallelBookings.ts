/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { first, isEmpty, prop, sortBy } from "remeda";

import { Appointment } from "./AppointmentBlockGroup";

export function calculateMaxParallelBookings(
  appointments: Appointment[],
): number {
  if (isEmpty(appointments)) {
    return 0;
  }
  const appointmentsSortedByStart = sortBy(appointments, prop("start"));
  const appointmentsSortedByEnd = sortBy(appointments, prop("end"));
  let maxConcurrency = 0;
  let currentConcurrency = 0;
  for (const appointment of appointmentsSortedByStart) {
    currentConcurrency += 1;
    const now = appointment.start;
    while (
      !isEmpty(appointmentsSortedByEnd) &&
      first(appointmentsSortedByEnd)!.end <= now
    ) {
      appointmentsSortedByEnd.shift();
      currentConcurrency -= 1;
    }
    maxConcurrency = Math.max(maxConcurrency, currentConcurrency);
  }
  return maxConcurrency;
}
