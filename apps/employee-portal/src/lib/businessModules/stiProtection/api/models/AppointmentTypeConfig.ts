/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { BaseEntity, mapBaseEntity } from "@eshg/lib-employee-portal";
import {
  ApiAppointmentType,
  ApiAppointmentTypeConfig,
} from "@eshg/sti-protection-api";

export interface AppointmentTypeConfig extends BaseEntity {
  appointmentTypeDto: ApiAppointmentType;
  standardDurationInMinutes: number;
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
