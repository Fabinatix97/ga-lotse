/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryKeyFactory } from "@eshg/lib-portal";

import { officialMedicalServiceApiQueryKey } from "@/lib/businessModules/officialMedicalService/api/queries/apiQueryKeys";

export const measlesProtectionApiQueryKey = queryKeyFactory([
  "measlesProtection",
]);

export const appointmentBookingApiQueryKey = queryKeyFactory(
  measlesProtectionApiQueryKey(["appointmentBookingApi"]),
);

export const appointmentBlockApiQueryKey = queryKeyFactory(
  measlesProtectionApiQueryKey(["appointmentBlockApi"]),
);

export const appointmentStandardDurationApiQueryKey = queryKeyFactory(
  officialMedicalServiceApiQueryKey(["appointmentStandardDurationApi"]),
);
