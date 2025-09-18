/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { first, isEmpty, last, prop, sortBy, sumBy } from "remeda";

import {
  AppointmentBlock,
  AppointmentBlockGroup,
  mapBaseEntity,
  secondToISODuration,
} from "@eshg/lib-employee-portal";
import { assertNonEmptyArray, durationToSecond } from "@eshg/lib-portal";
import {
  ApiAppointment,
  ApiGetAppointmentBlock,
  ApiGetAppointmentBlockGroup,
} from "@eshg/school-entry-api";

export function mapAppointmentBlockGroup(
  response: ApiGetAppointmentBlockGroup,
): AppointmentBlockGroup {
  assertNonEmptyArray(response.appointmentBlocks);

  const firstAppointmentBlock = first(response.appointmentBlocks);
  const lastAppointmentBlock = last(response.appointmentBlocks);
  const aggregatedFreeDuration = secondToISODuration(
    sumBy(response.appointmentBlocks, (appointmentBlock) =>
      durationToSecond(appointmentBlock.freeDuration ?? ""),
    ),
  );
  const aggregatedBookedDuration = secondToISODuration(
    sumBy(response.appointmentBlocks, (appointmentBlock) =>
      durationToSecond(appointmentBlock.bookedDuration ?? ""),
    ),
  );

  return {
    ...mapBaseEntity(response),
    types: response.types,
    location: response.location,
    start: firstAppointmentBlock.start,
    end: lastAppointmentBlock.end,
    freeDuration: aggregatedFreeDuration,
    bookedDuration: aggregatedBookedDuration,
    appointmentBlocks: response.appointmentBlocks.map(mapAppointmentBlock),
  };
}

function mapAppointmentBlock(
  response: ApiGetAppointmentBlock,
): AppointmentBlock {
  return {
    ...mapBaseEntity(response),
    start: response.start,
    end: response.end,
    parallelExaminations: response.parallelExaminations,
    freeDuration: response.freeDuration,
    bookedDuration: response.bookedDuration,
  };
}

export function calculateMaxParallelBookings(
  appointments: ApiAppointment[],
): number {
  if (isEmpty(appointments)) {
    return 0;
  }
  const appointmentsSortedByStart = sortBy(appointments, prop("start"));
  const appointmentsSortedByEnd = sortBy(appointments, prop("end"));
  let max_concurrency = 0;
  let current_concurrency = 0;
  for (const appointment of appointmentsSortedByStart) {
    current_concurrency += 1;
    const now = appointment.start;
    while (
      !isEmpty(appointmentsSortedByEnd) &&
      first(appointmentsSortedByEnd)!.end <= now
    ) {
      appointmentsSortedByEnd.shift();
      current_concurrency -= 1;
    }
    max_concurrency = Math.max(max_concurrency, current_concurrency);
  }
  return max_concurrency;
}
