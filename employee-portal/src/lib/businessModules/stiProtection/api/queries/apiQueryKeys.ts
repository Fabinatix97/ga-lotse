/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryKeyFactory } from "@eshg/lib-portal/api/queryKeyFactory";

export const stiProtectionApiQueryKey = queryKeyFactory(["stiProtection"]);

export const appointmentBlockApiQueryKey = queryKeyFactory(
  stiProtectionApiQueryKey(["appointmentBlockApi"]),
);

export const stiProtectionProceduresApiQueryKey = queryKeyFactory(
  stiProtectionApiQueryKey(["stiProcedures"]),
);

export const progressEntryApiQueryKey = queryKeyFactory(
  stiProtectionApiQueryKey(["progressEntryApi"]),
);

export const fileApiQueryKey = queryKeyFactory(
  stiProtectionApiQueryKey(["fileApi"]),
);
