/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  BaseEntity,
  mapBaseEntity,
} from "@eshg/lib-employee-portal/api/models/BaseEntity";
import { assertNonEmptyArray } from "@eshg/lib-portal/helpers/assertions";
import {
  ApiAppointmentType,
  ApiGetAppointmentBlock,
  ApiGetAppointmentBlockGroup,
} from "@eshg/sti-protection-api";
import { first, last, sumBy } from "remeda";

export interface AppointmentBlockStiProtection extends BaseEntity {
  readonly start: Date;
  readonly end: Date;
  readonly numberOfFreeAppointments: number;
  readonly numberOfBookedAppointments: number;
}

export interface AppointmentBlockGroup extends AppointmentBlockStiProtection {
  readonly type: ApiAppointmentType;
  readonly appointmentBlocks: AppointmentBlockStiProtection[];
}

export type AppointmentDurationsStiProtection = Record<
  ApiAppointmentType,
  number
>;

export function mapAppointmentBlock(
  response: ApiGetAppointmentBlock,
): AppointmentBlockStiProtection {
  return {
    ...mapBaseEntity(response),
    start: response.start,
    end: response.end,
    numberOfFreeAppointments: response.numberOfFreeAppointments,
    numberOfBookedAppointments: response.numberOfBookedAppointments,
  };
}

export function mapAppointmentBlockGroup(
  response: ApiGetAppointmentBlockGroup,
): AppointmentBlockGroup {
  assertNonEmptyArray(response.appointmentBlocks);

  const firstAppointmentBlock = first(response.appointmentBlocks);
  const lastAppointmentBlock = last(response.appointmentBlocks);
  const aggregatedNumberOfFreeAppointments = sumBy(
    response.appointmentBlocks,
    (appointmentBlock) => appointmentBlock.numberOfFreeAppointments,
  );
  const aggregatedNumberOfBookedAppointments = sumBy(
    response.appointmentBlocks,
    (appointmentBlock) => appointmentBlock.numberOfBookedAppointments,
  );

  return {
    ...mapBaseEntity(response),
    type: response.type,
    start: firstAppointmentBlock.start,
    end: lastAppointmentBlock.end,
    numberOfFreeAppointments: aggregatedNumberOfFreeAppointments,
    numberOfBookedAppointments: aggregatedNumberOfBookedAppointments,
    appointmentBlocks: response.appointmentBlocks.map(mapAppointmentBlock),
  };
}
