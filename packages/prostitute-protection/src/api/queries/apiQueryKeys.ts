/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryKeyFactory } from "@eshg/lib-portal";

export const prostituteProtectionApiQueryKey = queryKeyFactory([
  "prostituteProtection",
]);

export const proceduresQueryKey = queryKeyFactory(
  prostituteProtectionApiQueryKey(["procedures"]),
);

export const personQueryKey = queryKeyFactory(
  prostituteProtectionApiQueryKey(["person"]),
);

export const appointmentBlockApiQueryKey = queryKeyFactory(
  prostituteProtectionApiQueryKey(["appointmentBlockApi"]),
);

export const appointmentStandardDurationApiQueryKey = queryKeyFactory(
  prostituteProtectionApiQueryKey(["appointmentStandardDurationApi"]),
);
