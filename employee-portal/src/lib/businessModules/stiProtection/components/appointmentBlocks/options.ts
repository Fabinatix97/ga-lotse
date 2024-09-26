/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAppointmentType } from "@eshg/employee-portal-api/stiProtection";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";

import { APPOINTMENT_TYPES } from "@/lib/businessModules/stiProtection/shared/constants";

const SUPPORTED_APPOINTMENT_TYPES = [
  ApiAppointmentType.HivStiConsultation,
  ApiAppointmentType.ResultsReview,
  ApiAppointmentType.SexWork,
] as string[];

export const APPOINTMENT_TYPE_OPTIONS = buildEnumOptions(
  APPOINTMENT_TYPES,
).filter((option) => SUPPORTED_APPOINTMENT_TYPES.includes(option.value));
