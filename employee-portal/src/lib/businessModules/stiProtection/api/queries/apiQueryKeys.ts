/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryKeyFactory } from "@eshg/lib-portal";

export const stiProtectionApiQueryKey = queryKeyFactory(["stiProtection"]);

export const appointmentBlockApiQueryKey = queryKeyFactory(
  stiProtectionApiQueryKey(["appointmentBlockApi"]),
);

export const appointmentStaffApiQueryKey = queryKeyFactory(
  stiProtectionApiQueryKey(["appointmentStaffApi"]),
);

export const proceduresQueryKey = queryKeyFactory(
  stiProtectionApiQueryKey(["procedures"]),
);

export const appointmentTypesApiQueryKey = queryKeyFactory(
  stiProtectionApiQueryKey(["appointmentTypes"]),
);

export const textTemplateApiQueryKey = queryKeyFactory(
  stiProtectionApiQueryKey(["textTemplateApi"]),
);
