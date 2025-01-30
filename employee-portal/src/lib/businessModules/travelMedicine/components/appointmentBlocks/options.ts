/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";
import { ApiAppointmentType } from "@eshg/travel-medicine-api";

import { appointmentTypes } from "@/lib/businessModules/travelMedicine/shared/appointmentTypes";

const SUPPORTED_APPOINTMENT_TYPES: string[] = [
  ApiAppointmentType.Consultation,
  ApiAppointmentType.Vaccination,
];

export const APPOINTMENT_TYPE_OPTIONS = buildEnumOptions<ApiAppointmentType>(
  appointmentTypes,
).filter((option) => SUPPORTED_APPOINTMENT_TYPES.includes(option.value));
