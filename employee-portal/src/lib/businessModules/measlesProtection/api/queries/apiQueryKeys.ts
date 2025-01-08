/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryKeyFactory } from "@eshg/lib-portal/api/queryKeyFactory";

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

export const inboxProcedureApiQueryKey = queryKeyFactory(
  measlesProtectionApiQueryKey(["inboxProcedureApi"]),
);

export const progressEntryApiQueryKey = queryKeyFactory(
  measlesProtectionApiQueryKey(["progressEntryApi"]),
);

export const fileApiQueryKey = queryKeyFactory(
  measlesProtectionApiQueryKey(["fileApi"]),
);

export const archivingApiQueryKey = queryKeyFactory(
  measlesProtectionApiQueryKey(["archivingApi"]),
);
