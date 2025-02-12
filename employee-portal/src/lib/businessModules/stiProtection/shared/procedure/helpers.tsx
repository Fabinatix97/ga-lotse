/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiConcern } from "@eshg/sti-protection-api";

import { CONCERN_VALUES } from "@/lib/businessModules/stiProtection/shared/constants";

export const CONCERN_OPTIONS = Object.entries(CONCERN_VALUES).map(
  ([value, label]) => ({
    content: <b>{label}</b>,
    value: value as ApiConcern,
  }),
);
