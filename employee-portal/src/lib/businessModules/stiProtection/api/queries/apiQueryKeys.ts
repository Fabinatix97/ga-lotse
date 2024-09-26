/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryKeyFactory } from "@eshg/lib-portal/api/queryKeyFactory";

export const stiProtectionApiQueryKey = queryKeyFactory(["stiProtection"]);

export const appointmentBlockApiQueryKey = queryKeyFactory(
  stiProtectionApiQueryKey(["appointmentBlockApi"]),
);

export const appointmentStaffApiQueryKey = queryKeyFactory(
  stiProtectionApiQueryKey(["appointmentStaffApi"]),
);

export const fileApiQueryKey = queryKeyFactory(
  stiProtectionApiQueryKey(["fileApi"]),
);

export const progressEntryApiQueryKey = queryKeyFactory(
  stiProtectionApiQueryKey(["progressEntryApi"]),
);

export const stiProtectionProceduresApiQueryKey = queryKeyFactory(
  stiProtectionApiQueryKey(["stiProcedures"]),
);

export const appointmentTypesApiQueryKey = queryKeyFactory(
  stiProtectionApiQueryKey(["appointmentTypes"]),
);

export const archivingApiQueryKey = queryKeyFactory(
  stiProtectionApiQueryKey(["archivingApi"]),
);
