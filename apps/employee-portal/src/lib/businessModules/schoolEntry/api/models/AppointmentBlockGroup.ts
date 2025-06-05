/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { first, last, sumBy } from "remeda";

import { BaseEntity, mapBaseEntity } from "@eshg/lib-employee-portal";
import { assertNonEmptyArray } from "@eshg/lib-portal";
import {
  ApiAppointmentLocation,
  ApiAppointmentType,
  ApiGetAppointmentBlock,
  ApiGetAppointmentBlockGroup,
} from "@eshg/school-entry-api";

import {
  durationToSecond,
  secondToISODuration,
} from "@/lib/shared/helpers/dateTime";

export interface AppointmentBlockGroup extends AppointmentBlock {
  readonly types: ApiAppointmentType[];
  readonly parallelExaminations: number;
  readonly location?: ApiAppointmentLocation;
  readonly appointmentBlocks: AppointmentBlock[];
}

export interface AppointmentBlock extends BaseEntity {
  readonly start: Date;
  readonly end: Date;
  readonly freeDuration?: string;
  readonly bookedDuration?: string;
}

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
    parallelExaminations: response.parallelExaminations,
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
    freeDuration: response.freeDuration,
    bookedDuration: response.bookedDuration,
  };
}
