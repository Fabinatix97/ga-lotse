/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { formatList } from "./list";

export function formatStreetAndHouseNumber(address?: {
  street?: string;
  houseNumber?: string;
}) {
  return formatList([address?.street, address?.houseNumber], " ");
}

export function formatPostalCodeAndCity(address?: {
  postalCode?: string;
  city?: string;
}) {
  return formatList([address?.postalCode, address?.city], " ");
}
