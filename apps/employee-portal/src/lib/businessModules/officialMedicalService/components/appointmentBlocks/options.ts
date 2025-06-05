/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { buildEnumOptions } from "@eshg/lib-portal";
import { ApiAppointmentType } from "@eshg/official-medical-service-api";

import { APPOINTMENT_TYPES } from "@/lib/businessModules/officialMedicalService/components/appointmentBlocks/constants";
import { WAITING_STATUS_VALUES } from "@/lib/businessModules/officialMedicalService/shared/translations";

const SUPPORTED_APPOINTMENT_TYPES: string[] = [
  ApiAppointmentType.OfficialMedicalServiceShort,
  ApiAppointmentType.OfficialMedicalServiceLong,
];

export const APPOINTMENT_TYPE_OPTIONS = buildEnumOptions(
  APPOINTMENT_TYPES,
).filter((option) => SUPPORTED_APPOINTMENT_TYPES.includes(option.value));

export const WAITING_STATUS_OPTIONS = buildEnumOptions(WAITING_STATUS_VALUES);
