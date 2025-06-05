/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { buildEnumOptions } from "@eshg/lib-portal";
import { ApiAppointmentType } from "@eshg/measles-protection-api";

import { APPOINTMENT_TYPES } from "@/lib/businessModules/measlesProtection/shared/constants";

const SUPPORTED_APPOINTMENT_TYPES: string[] = [
  ApiAppointmentType.ProofSubmission,
];

export const APPOINTMENT_TYPE_OPTIONS = buildEnumOptions(
  APPOINTMENT_TYPES,
).filter((option) => SUPPORTED_APPOINTMENT_TYPES.includes(option.value));
