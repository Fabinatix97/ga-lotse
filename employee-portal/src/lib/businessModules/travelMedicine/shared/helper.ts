/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiPersonAddress } from "@eshg/employee-portal-api/travelMedicine";
import { differenceInYears } from "date-fns";

import { LegacyBaseAddress } from "@/lib/shared/components/form/address/LegacyAddressForm";

export function mapToApiPersonAddress(
  baseAddress: LegacyBaseAddress,
): ApiPersonAddress {
  return {
    addressAddition:
      baseAddress.addressAddition !== ""
        ? baseAddress.addressAddition
        : undefined,
    city: baseAddress.city,
    country: baseAddress.country,
    houseNumber: baseAddress.houseNumber,
    postalCode: baseAddress.postalCode,
    street: baseAddress.street,
  };
}

export function calculateAge(dateOfBirth: Date): number {
  return differenceInYears(new Date(), dateOfBirth);
}
