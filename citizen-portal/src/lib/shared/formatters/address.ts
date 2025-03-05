/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiGetDepartmentInfoResponse } from "@eshg/base-api";

import { AppointmentAddress } from "@/lib/businessModules/schoolEntry/api/models/SchoolEntryProcedure";

export function formatStreetAndHouseNumber(address: AppointmentAddress) {
  const { houseNumber, street } = address;
  return `${street} ${houseNumber}`;
}

export function formatPostalCodeAndCity(address: AppointmentAddress) {
  const { city, postalCode } = address;
  return `${postalCode} ${city}`;
}

export function formatDepartmentAddress(
  department: ApiGetDepartmentInfoResponse,
) {
  const { name, city, houseNumber, postalCode, street } = department;
  return `${name}, ${street} ${houseNumber}, ${postalCode} ${city}`;
}
