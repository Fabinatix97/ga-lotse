/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentType,
  ApiAppointmentTypeConfig,
} from "@eshg/employee-portal-api/travelMedicine";
import {
  BaseEntity,
  mapBaseEntity,
} from "@eshg/lib-employee-portal/api/models/BaseEntity";

export interface AppointmentTypeConfig extends BaseEntity {
  readonly appointmentTypeDto: ApiAppointmentType;
  readonly standardDurationInMinutes: number;
}

export function mapAppointmentTypeConfig(
  response: ApiAppointmentTypeConfig,
): AppointmentTypeConfig {
  return {
    ...mapBaseEntity(response),
    appointmentTypeDto: response.appointmentTypeDto,
    standardDurationInMinutes: response.standardDurationInMinutes,
  };
}
