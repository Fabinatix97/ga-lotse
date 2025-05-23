/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { first, last, sumBy } from "remeda";

import { BaseEntity, mapBaseEntity } from "@eshg/lib-employee-portal";
import { assertNonEmptyArray } from "@eshg/lib-portal";
import {
  ApiAppointmentType,
  ApiGetAppointmentBlock,
  ApiGetAppointmentBlockGroup,
} from "@eshg/travel-medicine-api";

export interface AppointmentBlockGroup extends AppointmentBlock {
  readonly type: ApiAppointmentType;
  readonly parallelExaminations: number;
  readonly appointmentBlocks: AppointmentBlock[];
}

export interface AppointmentBlock extends BaseEntity {
  readonly start: Date;
  readonly end: Date;
  readonly numberOfFreeAppointments: number;
  readonly numberOfBookedAppointments: number;
}

function mapAppointmentBlock(
  response: ApiGetAppointmentBlock,
): AppointmentBlock {
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
    parallelExaminations: response.parallelExaminations,
    start: firstAppointmentBlock.start,
    end: lastAppointmentBlock.end,
    numberOfFreeAppointments: aggregatedNumberOfFreeAppointments,
    numberOfBookedAppointments: aggregatedNumberOfBookedAppointments,
    appointmentBlocks: response.appointmentBlocks.map(mapAppointmentBlock),
  };
}
