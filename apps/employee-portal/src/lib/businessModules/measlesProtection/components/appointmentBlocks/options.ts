/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { APPOINTMENT_TYPES } from "@eshg/lib-employee-portal";
import { buildEnumOptions } from "@eshg/lib-portal";
import { ApiAppointmentType } from "@eshg/measles-protection-api";

export const SUPPORTED_APPOINTMENT_TYPES: ApiAppointmentType[] = [
  ApiAppointmentType.ProofSubmission,
];

export const APPOINTMENT_TYPE_OPTIONS = buildEnumOptions(
  APPOINTMENT_TYPES,
).filter((option) =>
  SUPPORTED_APPOINTMENT_TYPES.includes(option.value as ApiAppointmentType),
);
