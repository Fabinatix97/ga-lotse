/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { defineRoutes } from "@eshg/lib-portal/helpers/routes";

export const routes = defineRoutes("/official-medical-service", (omsPath) => ({
  procedures: defineRoutes(omsPath("/procedures"), (proceduresPath) => ({
    index: proceduresPath("/"),
    byId: (procedureId: string) =>
      defineRoutes(proceduresPath(`/${procedureId}`), (procedurePath) => ({
        details: procedurePath("/details"),
        progressEntries: defineRoutes(
          procedurePath("/progress-entries"),
          (progressEntriesPath) => ({
            index: progressEntriesPath("/"),
            byId: (progressEntryId: string) =>
              defineRoutes(
                progressEntriesPath(`/${progressEntryId}`),
                (entryPath) => ({
                  details: entryPath("/details"),
                }),
              ),
          }),
        ),
      })),
  })),
}));
