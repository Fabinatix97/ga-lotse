/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { APPOINTMENT_TYPES } from "@eshg/lib-employee-portal";
import { buildEnumOptions } from "@eshg/lib-portal";
import { ApiAppointmentType } from "@eshg/official-medical-service-api";

import { WAITING_STATUS_VALUES } from "@/lib/businessModules/officialMedicalService/shared/translations";

export const SUPPORTED_APPOINTMENT_TYPES: ApiAppointmentType[] = [
  ApiAppointmentType.OfficialMedicalServiceShort,
  ApiAppointmentType.OfficialMedicalServiceLong,
];

export const APPOINTMENT_TYPE_OPTIONS = buildEnumOptions(
  APPOINTMENT_TYPES,
).filter((option) =>
  SUPPORTED_APPOINTMENT_TYPES.includes(option.value as ApiAppointmentType),
);

export const WAITING_STATUS_OPTIONS = buildEnumOptions(WAITING_STATUS_VALUES);
