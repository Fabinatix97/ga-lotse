/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { first, last, sumBy } from "remeda";

import { BaseEntity, mapBaseEntity } from "@eshg/lib-employee-portal";
import { assertNonEmptyArray } from "@eshg/lib-portal";
import {
  ApiAppointmentType,
  ApiGetAppointmentBlock,
  ApiGetAppointmentBlockGroup,
} from "@eshg/sti-protection-api";

import {
  durationToSecond,
  secondToISODuration,
} from "@/lib/shared/helpers/dateTime";

export interface AppointmentBlockStiProtection extends BaseEntity {
  readonly start: Date;
  readonly end: Date;
  readonly freeDuration?: string;
  readonly bookedDuration?: string;
}

export interface AppointmentBlockGroup extends AppointmentBlockStiProtection {
  readonly types: ApiAppointmentType[];
  readonly appointmentBlocks: AppointmentBlockStiProtection[];
}

function mapAppointmentBlock(
  response: ApiGetAppointmentBlock,
): AppointmentBlockStiProtection {
  return {
    ...mapBaseEntity(response),
    start: response.start,
    end: response.end,
    freeDuration: response.freeDuration,
    bookedDuration: response.bookedDuration,
  };
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
    start: firstAppointmentBlock.start,
    end: lastAppointmentBlock.end,
    freeDuration: aggregatedFreeDuration,
    bookedDuration: aggregatedBookedDuration,
    appointmentBlocks: response.appointmentBlocks.map(mapAppointmentBlock),
  };
}
