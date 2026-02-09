/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { defineRoutes } from "@eshg/lib-portal/universal";

const basePath = "/infection-briefing";
const proceduresRoute = "/procedures";

export const routes = defineRoutes(basePath, (infectionBriefingPath) => ({
  procedures: defineRoutes(
    infectionBriefingPath(proceduresRoute),
    (proceduresPath) => ({
      index: proceduresPath("/"),
    }),
  ),
}));
