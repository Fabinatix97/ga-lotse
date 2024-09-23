/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export const ApiFacilityAddressType = {
  Postal: "POSTAL",
  Billing: "BILLING",
} as const;

export type ApiFacilityAddressType =
  (typeof ApiFacilityAddressType)[keyof typeof ApiFacilityAddressType];
