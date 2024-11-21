/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { defineRoutes } from "@eshg/lib-portal/helpers/routes";

export const routes = defineRoutes("/dental", (dentalPath) => ({
  procedures: defineRoutes(dentalPath("/procedures"), (proceduresPath) => ({
    overview: proceduresPath("/"),
    byId: (procedureId: string) =>
      defineRoutes(proceduresPath(`/${procedureId}`), (procedurePath) => ({
        details: procedurePath("/details"),
      })),
  })),
}));
