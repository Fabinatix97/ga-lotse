/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiDomesticAddress } from "@eshg/employee-portal-api/measlesProtection";
import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";

import { LegacyBaseAddress } from "@/lib/shared/components/form/address/LegacyAddressForm";

export function mapToApiPersonAddress(
  baseAddress: LegacyBaseAddress,
): { type: "DomesticAddress" } & ApiDomesticAddress {
  return {
    type: "DomesticAddress",
    addressAddition: mapOptionalValue(baseAddress.addressAddition?.trim()),
    city: baseAddress.city,
    country: baseAddress.country,
    houseNumber: mapOptionalValue(baseAddress.houseNumber?.trim()),
    postalCode: baseAddress.postalCode,
    street: baseAddress.street,
  };
}
