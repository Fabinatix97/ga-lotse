/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAppointmentType } from "@eshg/infection-briefing-api";
import { APPOINTMENT_TYPES } from "@eshg/lib-employee-portal";
import { buildEnumOptions } from "@eshg/lib-portal";

export const SUPPORTED_APPOINTMENT_TYPES = [
  ApiAppointmentType.InfectionBriefingNew,
  ApiAppointmentType.InfectionBriefingReplacement,
] as string[];

export const APPOINTMENT_TYPE_OPTIONS = buildEnumOptions(
  APPOINTMENT_TYPES,
).filter((option) => SUPPORTED_APPOINTMENT_TYPES.includes(option.value));
