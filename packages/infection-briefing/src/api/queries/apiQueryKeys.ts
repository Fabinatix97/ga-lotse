/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryKeyFactory } from "@eshg/lib-portal";

export const infectionBriefingApiQueryKey = queryKeyFactory([
  "infectionBriefing",
]);

export const appointmentBlockApiQueryKey = queryKeyFactory(
  infectionBriefingApiQueryKey(["appointmentBlockApi"]),
);

export const appointmentStandardDurationApiQueryKey = queryKeyFactory(
  infectionBriefingApiQueryKey(["appointmentStandardDurationApi"]),
);

export const proceduresQueryKey = queryKeyFactory(
  infectionBriefingApiQueryKey(["procedures"]),
);
