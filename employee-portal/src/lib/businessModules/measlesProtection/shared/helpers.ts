/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentType,
  ApiDomesticAddress,
} from "@eshg/employee-portal-api/measlesProtection";
import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";
import { isEmptyString } from "@eshg/lib-portal/helpers/guards";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";

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

export function isAdult(dateOfBirth: Date) {
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  return dateOfBirth <= eighteenYearsAgo;
}

export function getAppointmentDurationInMinutes(
  type: OptionalFieldValue<ApiAppointmentType>,
  appointmentDurations: Record<string, number>,
) {
  return isEmptyString(type) ? 0 : (appointmentDurations[type] ?? 0);
}
