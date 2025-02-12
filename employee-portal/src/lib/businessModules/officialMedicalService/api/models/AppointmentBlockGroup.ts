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
} from "@eshg/official-medical-service-api";
import { first, last, sumBy } from "remeda";

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

export function mapAppointmentBlock(
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
