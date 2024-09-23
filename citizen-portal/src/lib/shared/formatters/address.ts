/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiGetDepartmentInfoResponse } from "@eshg/citizen-portal-api/base";

export function formatStreetAndHouseNumber(
  address: ApiGetDepartmentInfoResponse,
) {
  const { houseNumber, street } = address;
  return `${street} ${houseNumber}`;
}

export function formatPostalCodeAndCity(address: ApiGetDepartmentInfoResponse) {
  const { city, postalCode } = address;
  return `${postalCode} ${city}`;
}
