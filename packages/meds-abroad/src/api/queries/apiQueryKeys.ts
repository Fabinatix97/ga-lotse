/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryKeyFactory } from "@eshg/lib-portal";

export const medsAbroadApiQueryKey = queryKeyFactory(["medsAbroad"]);

export const proceduresQueryKey = queryKeyFactory(
  medsAbroadApiQueryKey(["procedures"]),
);
