/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { first, last, sumBy } from "remeda";

import {
  AppointmentBlock,
  AppointmentBlockGroup,
  mapBaseEntity,
  secondToISODuration,
} from "@eshg/lib-employee-portal";
import { assertNonEmptyArray, durationToSecond } from "@eshg/lib-portal";
import {
  ApiAppointmentBlock,
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

export function mapApiAppointmentBlock(
  response: ApiAppointmentBlock,
): AppointmentBlock {
  return {
    ...mapBaseEntity(response),
    start: response.start,
    end: response.end,
    parallelExaminations: response.parallelExaminations,
    bookedAppointments: response.bookedAppointments,
    mfas: response.mfas,
    physicians: response.physicians,
    consultants: response.consultants,
    room: response.room,
  };
}
