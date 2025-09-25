/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { APPOINTMENT_TYPES } from "@eshg/lib-employee-portal";
import { EnumMap } from "@eshg/lib-portal";
import {
  ApiAppointmentType,
  ApiCreatedByUserType,
} from "@eshg/travel-medicine-api";

const CREATED_BY_USER_TYPES: EnumMap<ApiCreatedByUserType> = {
  [ApiCreatedByUserType.Employee]: "Mitarbeiter",
  [ApiCreatedByUserType.CitizenPortal]: "Bürger",
};

export function translateAppointmentType(type: ApiAppointmentType) {
  return APPOINTMENT_TYPES[type];
}

export function translateCreatedByUserType(type: ApiCreatedByUserType) {
  return CREATED_BY_USER_TYPES[type];
}
