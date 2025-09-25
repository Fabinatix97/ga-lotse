/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { APPOINTMENT_TYPES } from "@eshg/lib-employee-portal";
import { buildEnumOptions } from "@eshg/lib-portal";
import { ApiAppointmentType } from "@eshg/travel-medicine-api";

export const SUPPORTED_APPOINTMENT_TYPES: ApiAppointmentType[] = [
  ApiAppointmentType.Consultation,
  ApiAppointmentType.Vaccination,
];

export const APPOINTMENT_TYPE_OPTIONS = buildEnumOptions<ApiAppointmentType>(
  APPOINTMENT_TYPES,
).filter((option) =>
  SUPPORTED_APPOINTMENT_TYPES.includes(option.value as ApiAppointmentType),
);
