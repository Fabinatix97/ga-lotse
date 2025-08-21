/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryKeyFactory } from "@eshg/lib-portal";

export const measlesProtectionApiQueryKey = queryKeyFactory([
  "measlesProtection",
]);

export const appointmentBookingApiQueryKey = queryKeyFactory(
  measlesProtectionApiQueryKey(["appointmentBookingApi"]),
);

export const appointmentBlockApiQueryKey = queryKeyFactory(
  measlesProtectionApiQueryKey(["appointmentBlockApi"]),
);

export const appointmentTypeApiQueryKey = queryKeyFactory(
  measlesProtectionApiQueryKey(["appointmentTypeApi"]),
);
