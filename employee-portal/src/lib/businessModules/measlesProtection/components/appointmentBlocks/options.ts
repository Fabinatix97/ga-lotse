/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAppointmentType } from "@eshg/employee-portal-api/measlesProtection";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";

import { APPOINTMENT_TYPES } from "@/lib/businessModules/measlesProtection/shared/constants";

const SUPPORTED_APPOINTMENT_TYPES: string[] = [
  ApiAppointmentType.ProofSubmission,
];

export const APPOINTMENT_TYPE_OPTIONS = buildEnumOptions(
  APPOINTMENT_TYPES,
).filter((option) => SUPPORTED_APPOINTMENT_TYPES.includes(option.value));
