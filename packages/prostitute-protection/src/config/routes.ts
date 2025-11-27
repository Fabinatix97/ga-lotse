/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { defineRoutes } from "@eshg/lib-portal/universal";

const basePath = "/prostitute-protection";
const proceduresRoute = "/procedures";

export const routes = defineRoutes(basePath, (prostituteProtectionPath) => ({
  procedures: defineRoutes(
    prostituteProtectionPath(proceduresRoute),
    (proceduresPath) => ({
      index: proceduresPath("/"),
      byId: (procedureId: string) =>
        defineRoutes(proceduresPath(`/${procedureId}`), (procedurePath) => ({
          details: procedurePath("/details"),
          progressEntries: procedurePath("/progress-entries"),
          consultation: procedurePath("/consultation"),
        })),
    }),
  ),
}));
