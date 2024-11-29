/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentType,
  ApiAppointmentTypeConfig,
} from "@eshg/employee-portal-api/schoolEntry";

import { BaseEntity, mapBaseEntity } from "@/lib/shared/api/models/BaseEntity";

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
