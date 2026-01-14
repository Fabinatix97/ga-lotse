/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiInstitutionWithAddress } from "@eshg/dental-api";

export interface InstitutionWithAddress {
  readonly id: string;
  readonly name: string;
  readonly city: string;
  readonly street: string;
  readonly houseNumber?: string;
}

export function mapInstitutionWithAddress(
  response: ApiInstitutionWithAddress,
): InstitutionWithAddress {
  return {
    id: response.id,
    name: response.name,
    city: response.city,
    street: response.street,
    houseNumber: response.houseNumber,
  };
}
