/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppointmentAddress } from "@/lib/businessModules/schoolEntry/api/models/SchoolEntryProcedure";

export function formatStreetAndHouseNumber(address: AppointmentAddress) {
  const { houseNumber, street } = address;
  return `${street} ${houseNumber}`;
}

export function formatPostalCodeAndCity(address: AppointmentAddress) {
  const { city, postalCode } = address;
  return `${postalCode} ${city}`;
}
