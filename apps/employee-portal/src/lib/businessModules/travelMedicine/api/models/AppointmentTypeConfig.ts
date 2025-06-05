/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { BaseEntity, mapBaseEntity } from "@eshg/lib-employee-portal";
import {
  ApiAppointmentType,
  ApiAppointmentTypeConfig,
} from "@eshg/travel-medicine-api";

interface AppointmentTypeConfig extends BaseEntity {
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
